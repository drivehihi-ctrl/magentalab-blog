import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { clearPostsCache, getSafeSlugTag } from '@/lib/wp';

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

    // 2. 포스트 ID 또는 Slug 식별 (URL 쿼리 파라미터로도 수동 지원)
    const postId = body.post_id || body.ID || body.post?.ID || request.nextUrl.searchParams.get('id');
    const postSlug = body.post_name || body.slug || body.post?.post_name || request.nextUrl.searchParams.get('slug');
    const clearAll = request.nextUrl.searchParams.get('clear_all') === 'true';

    // 3. 메모리 전역 캐시(postsIndexCache) 100% 즉시 삭제 (목록 데이터 동기화용)
    clearPostsCache();

    // 4. Next.js 타겟팅 무효화
    // @ts-ignore
    revalidateTag('posts');        // 전체 포스트 목록
    // @ts-ignore
    revalidateTag('posts-index');  // 포스트 메타 요약 인덱스
    // @ts-ignore
    revalidateTag('sitemap');      // 사이트맵
    // @ts-ignore
    revalidateTag('categories');   // 카테고리
    // @ts-ignore
    revalidateTag('tags');         // 태그
    
    if (postId) {
      // @ts-ignore
      revalidateTag(`post-${postId}`); // 특정 포스트 데이터 무효화
    }
    
    if (postSlug) {
      // 안전한 ASCII 캐시 태그 무효화 (한글 슬러그 TypeError 방지)
      const safeSlugTag = getSafeSlugTag(postSlug);
      // @ts-ignore
      revalidateTag(safeSlugTag);
    }

    // 수동으로 전체 초기화가 필요한 경우 (예: 브라우저 주소창에서 강제 갱신 시)
    if (clearAll) {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ 
      revalidated: true, 
      clearedMemoryCache: true,
      processedPostId: postId || null,
      processedSlug: postSlug || null,
      clearedAll: clearAll,
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
