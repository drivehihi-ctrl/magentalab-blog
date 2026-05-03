import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// 서버 사이드 마스터 키 사용 (RLS 우회)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// 상품 저장 (등록 또는 수정)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...payload } = body;

    let result;
    if (id) {
      result = await supabase.from("products").update(payload).eq("id", id);
    } else {
      result = await supabase.from("products").insert([payload]);
    }

    if (result.error) throw result.error;

    // ✅ 저장 즉시 캐시 무효화 → 새로고침 시 최신 이미지 즉시 반영
    revalidatePath("/shop");
    if (id) revalidatePath(`/shop/${id}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product Save API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 상품 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    // ✅ 삭제 후 즉시 캐시 무효화
    revalidatePath("/shop");
    revalidatePath(`/shop/${id}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product Delete API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
