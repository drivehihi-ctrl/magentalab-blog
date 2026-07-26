import { Metadata } from "next";
import BlogListLayout from "@/components/blog/BlogListLayout";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "전체 글 목록 | Magentalab",
  description: "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/blog",
  },
  openGraph: {
    title: "전체 글 목록 | Magentalab",
    description: "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.",
    url: "https://www.magentalabblog.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "전체 글 목록 | Magentalab",
    description: "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.",
  },
};

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
