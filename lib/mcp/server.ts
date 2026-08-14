import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getPost } from '@/lib/wp';
import { getRevision } from '@/lib/ai-revisions';

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
              status: { type: "string" },
              search: { type: "string" },
              limit: { type: "number" },
              offset: { type: "number" }
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
              limit: { type: "number" }
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
          const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
          const limit = args.limit || 10;
          const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?_fields=id,title,slug,modified,status,excerpt,featured_media&per_page=${limit}`);
          const data = await res.json();
          return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        
        case "magentalab_get_post": {
          const post = await getPost(String(args.wordpress_id));
          if (!post) throw new Error("NOT_FOUND");
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "magentalab_get_audit": {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (supabaseUrl && supabaseKey) {
              const res = await fetch(`${supabaseUrl}/rest/v1/ai_audit_logs?wordpress_id=eq.${args.wordpress_id}&order=created_at.desc&limit=1`, {
                  headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
              });
              const data = await res.json();
              return { content: [{ type: "text", text: JSON.stringify(data[0] || {}, null, 2) }] };
          }
          return { content: [{ type: "text", text: "{}" }] };
        }

        case "magentalab_get_revision": {
          const rev = await getRevision(args.revision_id as string);
          if (!rev) throw new Error("NOT_FOUND");
          return { content: [{ type: "text", text: JSON.stringify(rev, null, 2) }] };
        }

        case "magentalab_get_revision_diff": {
          const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          const secret = process.env.AI_CONTENT_API_SECRET;
          const res = await fetch(`${url}/api/ai-content/revisions/${args.revision_id}/diff`, {
              headers: { 'Authorization': `Bearer ${secret}` }
          });
          const diff = await res.json();
          return { content: [{ type: "text", text: JSON.stringify(diff, null, 2) }] };
        }

        case "magentalab_get_revision_preview": {
          const previewUrl = `https://www.magentalabblog.com/preview/${args.revision_id}`;
          return { content: [{ type: "text", text: JSON.stringify({ preview_url: previewUrl }, null, 2) }] };
        }

        case "magentalab_get_review_queue": {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          const status = args.status || 'pending_review';
          const limit = args.limit || 10;
          if (supabaseUrl && supabaseKey) {
              const res = await fetch(`${supabaseUrl}/rest/v1/ai_revisions?status=eq.${status}&order=created_at.desc&limit=${limit}`, {
                  headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
              });
              const data = await res.json();
              return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
          }
          return { content: [{ type: "text", text: "[]" }] };
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
