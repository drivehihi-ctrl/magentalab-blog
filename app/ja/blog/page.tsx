import { Metadata } from "next";
import BlogListLayout from "@/components/blog/BlogListLayout";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, search?: string, category?: string }>;
}): Promise<Metadata> {
  const { page, search, category } = await searchParams;
  let canonicalUrl = "https://www.magentalabblog.com/ja/blog";
  let searchSuffix = "";
  if (page && page !== "1") searchSuffix += `?page=${page}`;
  if (search) searchSuffix += (searchSuffix ? "&" : "?") + `search=${encodeURIComponent(search)}`;
  if (category) searchSuffix += (searchSuffix ? "&" : "?") + `category=${encodeURIComponent(category)}`;

  let pageTitle = "すべての研究データ";
  let pageDesc = "Magentalabペット研究所のすべての研究データと健康情報をご確認ください。";
  
  if (page && page !== "1") {
    pageTitle += ` - ${page}ページ`;
    pageDesc += ` (${page}ページ)`;
  }
  if (search) {
    pageTitle = `'${search}' 検索結果 - ${pageTitle}`;
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

export default async function JaBlogListPage({
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
      lang="ja"
    />
  );
}
