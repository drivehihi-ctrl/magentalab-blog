import { Metadata } from "next";
import BlogListLayout from "@/components/blog/BlogListLayout";

// ISR 캐시 적용 (24시간 주기 갱신)
export const revalidate = 86400;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, search?: string, category?: string }>;
}): Promise<Metadata> {
  const { page, search, category } = await searchParams;
  let canonicalUrl = "https://www.magentalabblog.com/blog";
  let searchSuffix = "";
  if (page && page !== "1") searchSuffix += `?page=${page}`;
  if (search) searchSuffix += (searchSuffix ? "&" : "?") + `search=${encodeURIComponent(search)}`;
  if (category) searchSuffix += (searchSuffix ? "&" : "?") + `category=${encodeURIComponent(category)}`;

  let pageTitle = "전체 글 목록";
  let pageDesc = "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.";
  
  if (page && page !== "1") {
    pageTitle += ` - ${page}페이지`;
    pageDesc += ` (${page}페이지)`;
  }
  if (search) {
    pageTitle = `'${search}' 검색 결과 - ${pageTitle}`;
  }

  let canonicalSuffix = "";
  if (page && page !== "1") canonicalSuffix += `?page=${page}`;
  if (category) canonicalSuffix += (canonicalSuffix ? "&" : "?") + `category=${encodeURIComponent(category)}`;

  const robots = search ? { index: false, follow: true } : { index: true, follow: true };

  return {
    title: `${pageTitle} | Magentalab`,
    description: pageDesc,
    robots,
    alternates: {
      canonical: canonicalUrl + canonicalSuffix,
      languages: {
        'ko-KR': 'https://www.magentalabblog.com/blog' + canonicalSuffix,
        'en-US': 'https://www.magentalabblog.com/en/blog' + canonicalSuffix,
        'ja-JP': 'https://www.magentalabblog.com/ja/blog' + canonicalSuffix,
      },
    },
    openGraph: {
      title: `${pageTitle} | Magentalab`,
      description: pageDesc,
      url: canonicalUrl + canonicalSuffix,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Magentalab`,
      description: pageDesc,
    },
  };
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, search?: string, category?: string }>;
}) {
  const { page, search, category } = await searchParams;

  return (
    <BlogListLayout 
      page={page}
      search={search}
      categoryId={category}
    />
  );
}
