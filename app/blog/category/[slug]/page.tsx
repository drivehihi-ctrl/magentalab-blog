import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListLayout from "@/components/blog/BlogListLayout";
import { getAllCategories } from "@/lib/wp";
import { decodeHtmlEntities } from "@/lib/utils";
import React from "react";

export const revalidate = 86400;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const categories = await getAllCategories().catch(() => []);
  const currentCategory = categories.find(c => c.slug === decodedSlug || c.name === decodedSlug);
  
  if (!currentCategory) {
    return { title: "카테고리를 찾을 수 없습니다 | Magentalab" };
  }

  const categoryName = decodeHtmlEntities(currentCategory.name);
  const title = `${categoryName} 핵심 정보 모음 - 마젠타랩 블로그`;
  const description = `반려동물 건강, 양육 가이드 등 ${categoryName} 관련 최고 수준의 연구 데이터 모음입니다.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.magentalabblog.com/blog/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.magentalabblog.com/blog/category/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryBlogListPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const decodedSlug = decodeURIComponent(slug);
  
  const categories = await getAllCategories().catch(() => []);
  const currentCategory = categories.find(c => c.slug === decodedSlug || c.name === decodedSlug);

  if (!currentCategory) {
    notFound();
  }

  const categoryName = decodeHtmlEntities(currentCategory.name);

  const breadcrumbs = [
    { name: "블로그", item: "https://www.magentalabblog.com/blog" },
    { name: `카테고리: ${categoryName}`, item: `https://www.magentalabblog.com/blog/category/${slug}` }
  ];

  return (
    <BlogListLayout 
      page={page}
      categoryId={currentCategory.id.toString()}
      badgeText={`${categoryName} 핵심 데이터`}
      titleNode={
        <><span className="text-magenta">{categoryName}</span> 관련 핵심 정보 모음</>
      }
      breadcrumbItems={breadcrumbs}
    />
  );
}
