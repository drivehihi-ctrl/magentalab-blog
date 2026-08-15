import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getPost, getPosts } from '@/lib/wp';
import { getRevision } from '@/lib/ai-revisions';
import { auditRepository, revisionRepository } from '@/lib/repositories';
import { createPendingRevision, RevisionError } from '@/lib/services/revision-service';
import { reviewRevision } from '@/lib/services/review-service';
import { rebaseRolledBackRevision } from '@/lib/services/rebase-service';
import { applyRevision } from '@/lib/services/apply-service';
import { rollbackRevision } from '@/lib/services/rollback-service';
import { controlledApply } from '@/lib/controlled-apply';
import { 
  createImagePlan, 
  registerGeneratedImage, 
  submitImageForReview, 
  reviewImageAsset 
} from '@/lib/image-pipeline';
import { imageAssetRepository } from '@/lib/repositories/image-asset-repository';

export function createMCPServer(): Server {
  const mcpServer = new Server({
    name: "Magentalab MCP",
    version: "1.0.0"
  }, {
    capabilities: {
      tools: {}
    }
  });

  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "magentalab_list_posts",
          description: "Searches and lists WordPress published posts. Read-only.",
          inputSchema: {
            type: "object",
            properties: {
              language: { type: "string", enum: ["ko", "en", "ja"] },
              search: { type: "string" },
              page: { type: "number" },
              limit: { type: "number", maximum: 50 }
            }
          }
        },
        {
          name: "magentalab_get_post",
          description: "Reads a Magentalab WordPress post and its current metadata. This tool never modifies WordPress.",
          inputSchema: {
            type: "object",
            properties: {
              wordpress_id: { type: "number" }
            },
            required: ["wordpress_id"]
          }
        },
        {
          name: "magentalab_get_audit",
          description: "Retrieves the latest audit results for a post. Read-only.",
          inputSchema: {
            type: "object",
            properties: {
              wordpress_id: { type: "number" }
            },
            required: ["wordpress_id"]
          }
        },
        {
          name: "magentalab_get_revision",
          description: "Reads a specific revision's data. Read-only.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" }
            },
            required: ["revision_id"]
          }
        },
        {
          name: "magentalab_get_revision_diff",
          description: "Gets the diff for a specific revision compared to the live post. Read-only.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" }
            },
            required: ["revision_id"]
          }
        },
        {
          name: "magentalab_get_revision_preview",
          description: "Gets a preview link or safe preview data for a revision. Read-only.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" }
            },
            required: ["revision_id"]
          }
        },
        {
          name: "magentalab_get_review_queue",
          description: "Gets the list of pending human reviews. Read-only.",
          inputSchema: {
            type: "object",
            properties: {
              status: { type: "string", enum: ["pending_review", "approved", "rejected"] },
              limit: { type: "number", maximum: 100 }
            }
          }
        },
        {
          name: "magentalab_create_revision",
          description: "Creates a pending-review revision from content supplied by the caller. This tool does not modify the live WordPress post. The caller is responsible for supplying the completed rewritten content.",
          inputSchema: {
            type: "object",
            properties: {
              wordpress_id: { type: "number" },
              source_modified_at: { type: "string" },
              new_title: { type: "string" },
              new_content: { type: "string" },
              new_excerpt: { type: "string" },
              new_meta_description: { type: "string" },
              new_ansim_summary: { type: "string" },
              evidence: {
                type: "object",
                properties: {
                  keyInsight: { type: "string" },
                  cautionNote: { type: "string" },
                  references: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        org: { type: "string" },
                        type: { type: "string" },
                        url: { type: "string" }
                      },
                      required: ["title", "org", "type", "url"]
                    }
                  }
                },
                required: ["keyInsight", "cautionNote", "references"]
              },
              reason: { type: "string" }
            },
            required: ["wordpress_id", "source_modified_at", "new_title", "new_content", "new_excerpt", "reason"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_review_revision",
          description: "Changes the human-review status of a pending revision. This does not modify the live WordPress post. Only call after explicit user approval or rejection.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" },
              decision: { type: "string", enum: ["approve", "reject"] },
              confirm: { type: "boolean", enum: [true] },
              medical_review_confirm: { type: "boolean", enum: [true] },
              note: { type: "string" }
            },
            required: ["revision_id", "decision", "confirm"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_apply_revision_dry_run",
          description: "Dry runs applying a batch of revisions. Does not actually modify WordPress, but simulates the apply process to verify it would succeed.",
          inputSchema: {
            type: "object",
            properties: {
              revision_ids: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
                maxItems: 3
              },
              confirm: { type: "boolean", enum: [true] }
            },
            required: ["revision_ids", "confirm"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_rebase_rolled_back_revision",
          description: "Refreshes the optimistic-lock timestamp for a re-approved rolled-back revision only when the live WordPress post still exactly matches both the revision baseline and rollback backup. This does not modify WordPress.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" },
              confirm: { type: "boolean", enum: [true] }
            },
            required: ["revision_id", "confirm"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_apply_revision",
          description: "Applies an approved revision to the live WordPress post. This causes a real WordPress mutation. Only call after the user explicitly requests live apply. A successful dry-run validation is performed immediately before the live mutation.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" },
              confirm: { type: "boolean", enum: [true] },
              live_apply_confirm: { type: "boolean", enum: [true] }
            },
            required: ["revision_id", "confirm", "live_apply_confirm"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_rollback_revision",
          description: "Restores a previously applied revision using its recorded backup. This causes a real WordPress mutation. Only call after the user explicitly requests rollback.",
          inputSchema: {
            type: "object",
            properties: {
              revision_id: { type: "string" },
              confirm: { type: "boolean", enum: [true] },
              rollback_confirm: { type: "boolean", enum: [true] }
            },
            required: ["revision_id", "confirm", "rollback_confirm"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_list_image_assets",
          description: "List image assets for a given post.",
          inputSchema: {
            type: "object",
            properties: {
              wordpress_id: { type: "number" }
            },
            required: ["wordpress_id"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_get_image_asset",
          description: "Get a specific image asset by ID.",
          inputSchema: {
            type: "object",
            properties: {
              image_asset_id: { type: "string" }
            },
            required: ["image_asset_id"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_create_image_plan",
          description: "Create a new image plan. This does not modify WordPress.",
          inputSchema: {
            type: "object",
            properties: {
              wordpress_id: { type: "number" },
              content_id: { type: "string" },
              revision_id: { type: "string" },
              slot: { type: "string", enum: ["featured", "image_1", "image_2", "image_3", "image_4", "image_5", "image_6"] },
              role: { type: "string" },
              source_type: { type: "string", enum: ["generated", "existing", "external_reference"] },
              ansim_required: { type: "boolean" },
              prompt: { type: "string" },
              alt_text: { type: "string" }
            },
            required: ["wordpress_id", "slot", "role", "source_type", "ansim_required", "prompt", "alt_text"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_register_generated_image",
          description: "Register generation details for a planned image asset. This does not modify WordPress.",
          inputSchema: {
            type: "object",
            properties: {
              image_asset_id: { type: "string" },
              generator: { type: "string" },
              model: { type: "string" },
              width: { type: "number" },
              height: { type: "number" },
              mime_type: { type: "string" }
            },
            required: ["image_asset_id"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_submit_image_for_review",
          description: "Submit a generated image asset for review. This does not modify WordPress.",
          inputSchema: {
            type: "object",
            properties: {
              image_asset_id: { type: "string" }
            },
            required: ["image_asset_id"],
            additionalProperties: false
          }
        },
        {
          name: "magentalab_review_image_asset",
          description: "Approve or reject an image asset under review. This does not modify WordPress.",
          inputSchema: {
            type: "object",
            properties: {
              image_asset_id: { type: "string" },
              decision: { type: "string", enum: ["approve", "reject"] },
              confirm: { type: "boolean", enum: [true] },
              note: { type: "string" }
            },
            required: ["image_asset_id", "decision", "confirm"],
            additionalProperties: false
          }
        }
      ]
    };
  });

  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (!args) {
      throw new Error("Arguments required");
    }

    try {
      switch (name) {
        case "magentalab_list_posts": {
          const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 50);
          const page = Math.max(Number(args.page) || 1, 1);
          const search = typeof args.search === 'string' ? args.search : undefined;
          const language = typeof args.language === 'string' ? args.language : "ko";
          
          if (!["ko", "en", "ja"].includes(language)) {
            throw new Error("Invalid language");
          }

          const data = await getPosts(page, limit, search, undefined, language);
          return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        
        case "magentalab_get_post": {
          const id = Number(args.wordpress_id);
          if (isNaN(id) || id <= 0) throw new Error("Invalid wordpress_id");

          const post = await getPost(String(id), { noCache: true });
          if (!post) throw new Error("NOT_FOUND");
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "magentalab_get_audit": {
          const id = Number(args.wordpress_id);
          if (isNaN(id) || id <= 0) throw new Error("Invalid wordpress_id");

          const auditMap = await auditRepository.getLatestByPostIds([id]);
          const audit = auditMap.get(id);
          
          if (!audit) {
            return { content: [{ type: "text", text: "{}" }] };
          }
          
          const output = {
            quality_score: audit.quality_score,
            adsense_risk: audit.adsense_risk,
            evidence_score: audit.evidence_score,
            medical_risk: audit.medical_risk,
            medical_risk_level: audit.medical_risk_level,
            structure_score: audit.structure_score,
            media_score: audit.media_score,
            freshness_score: audit.freshness_score,
            status: audit.status,
            recommended_action: audit.recommended_action,
            reasons: (audit as any).reasons || (audit as any).reason
          };
          
          return { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
        }

        case "magentalab_get_revision": {
          const revId = String(args.revision_id || '');
          if (!revId) throw new Error("Invalid revision_id");

          const rev = await getRevision(revId);
          if (!rev) throw new Error("NOT_FOUND");
          return { content: [{ type: "text", text: JSON.stringify(rev, null, 2) }] };
        }

        case "magentalab_get_revision_diff": {
          const revId = String(args.revision_id || '');
          if (!revId) throw new Error("Invalid revision_id");

          const revision = await getRevision(revId);
          if (!revision) throw new Error("NOT_FOUND");

          const diff = {
            revision_id: revision.revision_id,
            wordpress_id: revision.wordpress_id,
            status: revision.status,
            diff: {
              title: {
                previous: revision.previous_title,
                new: revision.new_title,
                changed: revision.previous_title !== revision.new_title
              },
              excerpt: {
                previous: revision.previous_excerpt,
                new: revision.new_excerpt,
                changed: revision.previous_excerpt !== revision.new_excerpt
              },
              meta_description: {
                previous: revision.previous_meta_description,
                new: revision.new_meta_description,
                changed: revision.previous_meta_description !== revision.new_meta_description
              },
              content: {
                previous_length: revision.previous_content?.length || 0,
                new_length: revision.new_content?.length || 0,
                changed: revision.previous_content !== revision.new_content
              }
            },
            source: revision.source,
            reason: revision.reason,
            created_at: revision.created_at
          };

          return { content: [{ type: "text", text: JSON.stringify(diff, null, 2) }] };
        }

        case "magentalab_get_revision_preview": {
          const revId = String(args.revision_id || '');
          if (!revId) throw new Error("Invalid revision_id");

          const previewUrl = `https://www.magentalabblog.com/preview/${revId}`;
          return { content: [{ type: "text", text: JSON.stringify({ preview_url: previewUrl }, null, 2) }] };
        }

        case "magentalab_get_review_queue": {
          const status = typeof args.status === 'string' ? args.status : 'pending_review';
          const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 100);
          
          const allRevisions = await revisionRepository.list();
          const filtered = allRevisions
            .filter((r: any) => r.status === status)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit)
            .map((r: any) => ({
              revision_id: r.revision_id,
              wordpress_id: r.wordpress_id,
              status: r.status,
              created_at: r.created_at,
              source: r.source,
              reason: r.reason
            }));

          return { content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }] };
        }

        case "magentalab_create_revision": {
          const result = await createPendingRevision(args as any, 'mcp');
          const rev = result.revision;
          
          const output = {
            revision_id: rev.revision_id,
            wordpress_id: rev.wordpress_id,
            content_id: rev.content_id,
            language: rev.language,
            slug: rev.slug,
            status: rev.status,
            medical_risk: result.medical_risk,
            medical_risk_level: result.medical_risk_level,
            medical_reviewed: rev.medical_reviewed,
            evidence_persisted: result.evidence_persisted,
            source_modified_at: rev.source_modified_at,
            created_at: rev.created_at,
            preview_url: `https://www.magentalabblog.com/preview/${rev.revision_id}`,
            diff: {
              title_changed: rev.previous_title !== rev.new_title,
              excerpt_changed: rev.previous_excerpt !== rev.new_excerpt,
              meta_desc_changed: rev.previous_meta_description !== rev.new_meta_description,
              content_changed: rev.previous_content !== rev.new_content
            }
          };
          
          return { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
        }

        case "magentalab_review_revision": {
          const result = await reviewRevision({
            revision_id: String(args.revision_id || ''),
            decision: args.decision as 'approve' | 'reject',
            confirm: args.confirm === true,
            medical_review_confirm: args.medical_review_confirm === true ? true : undefined,
            note: args.note ? String(args.note) : undefined,
            source: 'mcp'
          });
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "magentalab_apply_revision_dry_run": {
          if (args.confirm !== true) {
            throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
          }

          const revisionIds = args.revision_ids as string[];
          if (!Array.isArray(revisionIds) || revisionIds.length === 0 || revisionIds.length > 3) {
            throw new RevisionError('INVALID_INPUT', 'Invalid revision_ids array. Must provide 1 to 3 revision IDs.');
          }
          if (new Set(revisionIds).size !== revisionIds.length) {
            throw new RevisionError('INVALID_INPUT', 'Duplicate revision ids are not allowed');
          }

          const result = await controlledApply(revisionIds, { dryRun: true, source: 'mcp' });
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "magentalab_rebase_rolled_back_revision": {
          const result = await rebaseRolledBackRevision({
            revision_id: String(args.revision_id || ''),
            confirm: args.confirm === true,
            source: 'mcp'
          });
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "magentalab_apply_revision": {
          const result = await applyRevision({
            revision_id: String(args.revision_id || ''),
            confirm: args.confirm === true,
            live_apply_confirm: args.live_apply_confirm === true,
            source: 'mcp'
          });
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "magentalab_rollback_revision": {
          if (args.confirm !== true || args.rollback_confirm !== true) {
            throw new Error("Both confirm and rollback_confirm must be explicitly true.");
          }
          const result = await rollbackRevision({
            revision_id: String(args.revision_id || ''),
            confirm: args.confirm === true,
            rollback_confirm: args.rollback_confirm === true,
            source: 'mcp'
          });
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        // --- Image Pipeline MCP Handlers ---
        case "magentalab_list_image_assets": {
          const id = Number(args.wordpress_id);
          if (isNaN(id) || id <= 0) throw new Error("Invalid wordpress_id");
          const data = await imageAssetRepository.listImageAssetsByPost(id);
          return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        case "magentalab_get_image_asset": {
          const data = await imageAssetRepository.getImageAsset(String(args.image_asset_id));
          if (!data) throw new Error("NOT_FOUND");
          return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        case "magentalab_create_image_plan": {
          const plan = await createImagePlan({
            wordpress_id: Number(args.wordpress_id),
            content_id: args.content_id ? String(args.content_id) : null,
            revision_id: args.revision_id ? String(args.revision_id) : null,
            slot: args.slot as any,
            role: String(args.role),
            source_type: args.source_type as any,
            ansim_required: Boolean(args.ansim_required),
            prompt: String(args.prompt),
            alt_text: String(args.alt_text),
          });
          return { content: [{ type: "text", text: JSON.stringify({ asset: plan, wordpress_mutation: false }, null, 2) }] };
        }
        case "magentalab_register_generated_image": {
          const res = await registerGeneratedImage(String(args.image_asset_id), {
            generator: args.generator ? String(args.generator) : undefined,
            model: args.model ? String(args.model) : undefined,
            width: args.width ? Number(args.width) : undefined,
            height: args.height ? Number(args.height) : undefined,
            mime_type: args.mime_type ? String(args.mime_type) : undefined,
          });
          return { content: [{ type: "text", text: JSON.stringify({ asset: res, wordpress_mutation: false }, null, 2) }] };
        }
        case "magentalab_submit_image_for_review": {
          const res = await submitImageForReview(String(args.image_asset_id));
          return { content: [{ type: "text", text: JSON.stringify({ asset: res, wordpress_mutation: false }, null, 2) }] };
        }
        case "magentalab_review_image_asset": {
          if (args.confirm !== true) {
            throw new Error("confirm must be true");
          }
          const res = await reviewImageAsset(String(args.image_asset_id), args.decision as any, args.note ? String(args.note) : undefined);
          return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
        }

        default:
          throw new Error("Unknown tool");
      }
    } catch (err: any) {
      if (err instanceof RevisionError) {
        return {
          content: [{ type: "text", text: `Error: ${err.code} - ${err.message}` }],
          isError: true
        };
      }
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true
      };
    }
  });

  return mcpServer;
}
