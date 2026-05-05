import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 서버 사이드 마스터 키 사용 (RLS 우회)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// 케어 가이드 저장 (등록 또는 수정)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...payload } = body;

    let result;
    if (id) {
      result = await supabase.from("shop_care_guides").update(payload).eq("id", id);
    } else {
      result = await supabase.from("shop_care_guides").insert([payload]);
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Care Guide Save API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 케어 가이드 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await supabase.from("shop_care_guides").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Care Guide Delete API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
