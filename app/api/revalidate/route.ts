import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { clearPostsCache } from '@/lib/wp';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.REVALIDATION_SECRET;
  
  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // If parsing fails or no body, we might be getting a generic GET request or empty payload
    }

    // 1. 상태 검증: publish, trash, draft 등 체크
    // 워드프레스 Webhook이나 플러그인에 따라 post_status 필드가 다를 수 있음
    const postStatus = body.post_status || body.post?.post_status || body.status;
    
    // autosave, draft, revision 등 공개 콘텐츠에 영향을 주지 않는 변경은 캐시 갱신 스킵
    if (postStatus && ['draft', 'auto-draft', 'inherit', 'revision'].includes(postStatus)) {
      return NextResponse.json({ 
        revalidated: false, 
        reason: `Ignored status: ${postStatus}`,
        now: Date.now() 
      });
    }

    // 2. 포스트 ID 또는 Slug 식별
    const postId = body.post_id || body.ID || body.post?.ID;
    const postSlug = body.post_name || body.slug || body.post?.post_name;

    // 3. 메모리 전역 캐시(postsCache) 100% 즉시 삭제 (목록 데이터 동기화용)
    clearPostsCache();

    // 4. Next.js 타겟팅 무효화
    // @ts-ignore
    revalidateTag('posts');      // 전체 포스트 목록(목록 페이지 등에 영향)
    // @ts-ignore
    revalidateTag('categories'); // 카테고리
    // @ts-ignore
    revalidateTag('tags');       // 태그
    
    if (postId) {
      // @ts-ignore
      revalidateTag(`post-${postId}`); // 특정 포스트 데이터 무효화
    }
    
    if (postSlug) {
      // 슬러그를 포함한 태그 무효화
      // @ts-ignore
      revalidateTag(`post-slug-${postSlug.slice(0, 100)}`);
    }

    // layout 전체 초기화(revalidatePath('/', 'layout'))는 제거됨.
    // 기존에 revalidatePath로 다이내믹 라우트를 초기화하던 로직도 제거 (tags로 커버됨)

    return NextResponse.json({ 
      revalidated: true, 
      clearedMemoryCache: true,
      processedPostId: postId || null,
      processedStatus: postStatus || null,
      now: Date.now() 
    });

  } catch (err: any) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}

// 혹시 모를 GET 요청 호환성을 위한 래퍼 (안전을 위해 POST와 동일한 로직 호출)
export async function GET(request: NextRequest) {
  return POST(request);
}
