import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { controlledApply } from '@/lib/controlled-apply';

const BATCH_MAX = 3;

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  let body: { revision_ids?: unknown; confirm?: unknown; dry_run?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Request body must be valid JSON' }, { status: 400 });
  }

  // ── Input validation ──────────────────────────────────────────────────────
  if (body.confirm !== true) {
    return NextResponse.json(
      { error: 'REQUIRE_CONFIRM', message: 'confirm: true is required' },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.revision_ids) || body.revision_ids.length === 0) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'revision_ids must be a non-empty array' },
      { status: 400 }
    );
  }

  if (body.revision_ids.length > BATCH_MAX) {
    return NextResponse.json(
      { error: 'BATCH_LIMIT_EXCEEDED', message: `Maximum ${BATCH_MAX} revisions per batch` },
      { status: 400 }
    );
  }

  const revisionIds: string[] = body.revision_ids.map(String);
  const dryRun = body.dry_run === true;

  const result = await controlledApply(revisionIds, { dryRun, source: 'batch' });

  return NextResponse.json(result);
}
