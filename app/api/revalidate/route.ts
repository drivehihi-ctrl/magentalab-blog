import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 'posts' 태그가 달린 모든 데이터를 새로고침합니다.
  // @ts-ignore - Next.js versions may vary in type definitions for revalidateTag
  revalidateTag('posts');
  
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
