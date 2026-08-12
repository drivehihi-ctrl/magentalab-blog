import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { clearPostsCache } from '@/lib/wp';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 1. 메모리 전역 캐시(postsCache) 100% 즉시 삭제
  clearPostsCache();

  // 2. Next.js 태그 및 전체 페이지 레이아웃 캐시 즉시 갱신
  try {
    // @ts-ignore
    revalidateTag('posts');
    // @ts-ignore
    revalidateTag('categories');
    // @ts-ignore
    revalidateTag('tags');
    revalidatePath('/', 'layout');
    revalidatePath('/posts/[id]', 'page');
    revalidatePath('/en/posts/[id]', 'page');
    revalidatePath('/ja/posts/[id]', 'page');
  } catch (err) {
    console.error("Revalidation error:", err);
  }
  
  return NextResponse.json({ 
    revalidated: true, 
    clearedMemoryCache: true, 
    now: Date.now() 
  });
}
