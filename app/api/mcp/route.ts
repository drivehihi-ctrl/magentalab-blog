import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { createMCPServer } from '@/lib/mcp/server';

function checkOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  // 1. If no origin, it's a server-to-server request (e.g. from ChatGPT backend).
  // We allow it because the request is still protected by the Bearer token (isAIContentAuthenticated).
  if (!origin) return true;

  // 2. If origin exists, strictly validate against MCP_ALLOWED_ORIGINS allowlist.
  const allowedOriginsStr = process.env.MCP_ALLOWED_ORIGINS || '';
  if (!allowedOriginsStr) {
      // If the environment variable is missing, we strictly reject all browser requests to be safe.
      return false;
  }
  
  const allowedOrigins = allowedOriginsStr.split(',').map(s => s.trim());
  return allowedOrigins.includes(origin);
}

async function handleMCPRequest(req: NextRequest) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'MCP_AUTH_FAILED' }, { status: 401 });
  }
  if (!checkOrigin(req)) {
    return NextResponse.json({ error: 'MCP_ORIGIN_FORBIDDEN' }, { status: 403 });
  }

  // Fully stateless: Instantiate per request
  const mcpServer = createMCPServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  await mcpServer.connect(transport);
  return transport.handleRequest(req);
}

export async function GET(req: NextRequest) {
  return handleMCPRequest(req);
}

export async function POST(req: NextRequest) {
  return handleMCPRequest(req);
}


