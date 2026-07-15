import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/wp";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const lang = searchParams.get("lang") || "ko";
    // searchPosts in lib/wp.ts uses the server-side WORDPRESS_URL
    const results = await searchPosts(query, lang);
    return NextResponse.json(results);
  } catch (error) {
    console.error("API Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
