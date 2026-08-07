import { Metadata } from "next";
import BlogListLayout from "@/components/blog/BlogListLayout";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, search?: string, category?: string }>;
}): Promise<Metadata> {
  const { page, search, category } = await searchParams;
  let canonicalUrl = "https://www.magentalabblog.com/en/blog";
  let searchSuffix = "";
  if (page && page !== "1") searchSuffix += `?page=${page}`;
  if (search) searchSuffix += (searchSuffix ? "&" : "?") + `search=${encodeURIComponent(search)}`;
  if (category) searchSuffix += (searchSuffix ? "&" : "?") + `category=${encodeURIComponent(category)}`;

  let pageTitle = "All Research Articles";
  let pageDesc = "Explore all pet health and research articles from Magentalab Pet Research Institute.";
  
  if (page && page !== "1") {
    pageTitle += ` - Page ${page}`;
    pageDesc += ` (Page ${page})`;
  }
  if (search) {
    pageTitle = `'${search}' Search Results - ${pageTitle}`;
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

export default async function EnBlogListPage({
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
      lang="en"
    />
  );
}
