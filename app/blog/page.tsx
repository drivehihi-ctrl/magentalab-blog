import { Metadata } from "next";
import BlogListLayout from "@/components/blog/BlogListLayout";

export const revalidate = 3600;

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

  return {
    title: `${pageTitle} | Magentalab`,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl + searchSuffix,
      languages: {
        'ko-KR': 'https://www.magentalabblog.com/blog' + searchSuffix,
        'en-US': 'https://www.magentalabblog.com/en/blog' + searchSuffix,
        'ja-JP': 'https://www.magentalabblog.com/ja/blog' + searchSuffix,
      },
    },
    openGraph: {
      title: `${pageTitle} | Magentalab`,
      description: pageDesc,
      url: canonicalUrl + searchSuffix,
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
