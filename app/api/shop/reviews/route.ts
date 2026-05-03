import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// 리뷰 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");
  if (!productId) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("shop_reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data || [] });
}

// 리뷰 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, author_name, rating, content } = body;

    if (!product_id || !author_name || !rating || !content) {
      return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
    }

    const { error } = await supabase.from("shop_reviews").insert([{
      product_id,
      author_name,
      rating: Number(rating),
      content,
    }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
