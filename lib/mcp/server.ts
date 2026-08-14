import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getPost, getPosts } from '@/lib/wp';
import { getRevision } from '@/lib/ai-revisions';
import { auditRepository, revisionRepository } from '@/lib/repositories';

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

          const post = await getPost(String(id));
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

        default:
          throw new Error("MCP_TOOL_NOT_ALLOWED");
      }
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true
      };
    }
  });

  return mcpServer;
}
