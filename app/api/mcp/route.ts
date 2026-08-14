import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { createMCPServer } from '@/lib/mcp/server';

function checkOrigin(req: NextRequest) {
  return true; 
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


