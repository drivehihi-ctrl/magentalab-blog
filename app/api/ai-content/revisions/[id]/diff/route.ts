import { NextResponse } from 'next/server';
import { getRevision } from '@/lib/ai-revisions';

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  if (!secret || !authHeader || !authHeader.startsWith('Bearer ')) return false;
  return authHeader.split(' ')[1] === secret;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid or missing API secret' }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    const revision = await getRevision(id);
    
    if (!revision) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Revision not found' }, { status: 404 });
    }

    return NextResponse.json({
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
          previous_length: revision.previous_content.length,
          new_length: revision.new_content.length,
          changed: revision.previous_content !== revision.new_content
        }
      },
      source: revision.source,
      reason: revision.reason,
      created_at: revision.created_at
    });

  } catch (error: any) {
    console.error("Error fetching revision diff:", error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
