import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListLayout from "@/components/blog/BlogListLayout";
import { getTagBySlugOrName } from "@/lib/wp";
import { decodeHtmlEntities } from "@/lib/utils";
import React from "react";

export const revalidate = 86400;

export async function generateMetadata({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const decodedSlug = decodeURIComponent(slug);
  
  const currentTag = await getTagBySlugOrName(decodedSlug);
  
  if (!currentTag) {
    return { title: "태그를 찾을 수 없습니다 | Magentalab" };
  }

  const tagName = decodeHtmlEntities(currentTag.name);
  let title = `${tagName} 핵심 정보 모음 - 마젠타랩`;
  let description = `반려견, 반려묘의 ${tagName} 관련 전문 연구 데이터와 핵심 정보를 마젠타랩에서 확인하세요.`;

  if (page && page !== "1") {
    title += ` (${page}페이지)`;
    description += ` (${page}페이지 목록)`;
  }

  const canonicalUrl = page && page !== "1"
    ? `https://www.magentalabblog.com/blog/tag/${slug}?page=${page}`
    : `https://www.magentalabblog.com/blog/tag/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TagBlogListPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const decodedSlug = decodeURIComponent(slug);
  
  const currentTag = await getTagBySlugOrName(decodedSlug);

  if (!currentTag) {
    notFound();
  }

  const tagName = decodeHtmlEntities(currentTag.name);

  // Custom Breadcrumb for Tag Page
  const breadcrumbs = [
    { name: "블로그", item: "https://www.magentalabblog.com/blog" },
    { name: `태그: ${tagName}`, item: `https://www.magentalabblog.com/blog/tag/${slug}` }
  ];

  return (
    <BlogListLayout 
      page={page}
      tagId={currentTag.id.toString()}
      badgeText={`${tagName} 핵심 연구`}
      titleNode={
        <><span className="text-magenta">#{tagName}</span> 연관 데이터 모음</>
      }
      breadcrumbItems={breadcrumbs}
    />
  );
}
