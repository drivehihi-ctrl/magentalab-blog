import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { createPendingRevision, RevisionError } from '@/lib/services/revision-service';
import { parseEvidence } from '@/lib/evidence-parser';

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid or missing API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { wordpress_id, new_title, new_content, new_excerpt, reason, source } = body;

    let payload = {
      wordpress_id,
      new_title,
      new_content,
      new_excerpt,
      reason,
      evidence: undefined as any
    };

    if (new_content) {
      const { content, evidence } = parseEvidence(new_content);
      payload.new_content = content;
      if (evidence) {
        payload.evidence = evidence;
      } else if (new_content.includes('[근거]')) {
        return NextResponse.json({ error: 'EVIDENCE_SECTION_PARSE_FAILED', message: 'Found [근거] block but failed to parse references' }, { status: 400 });
      }
    }

    const revision = await createPendingRevision(payload, source || 'chatgpt');

    return NextResponse.json(revision, { status: 201 });
  } catch (error: any) {
    console.error('Error creating revision:', error);
    if (error instanceof RevisionError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
