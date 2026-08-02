import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post, author_name, author_email, content, is_approved } = body;

    if (!post || !author_name || !content) {
      return NextResponse.json(
        { message: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // Supabase에 댓글/질문 저장
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: parseInt(post) || 8888,
          author_name,
          author_email: author_email || "ask_ansimi@magentalab.com",
          content,
          is_approved: is_approved !== undefined ? is_approved : true,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { message: "데이터베이스 저장 중 오류가 발생했습니다.", rawError: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "댓글이 성공적으로 등록되었습니다!",
      id: data[0].id,
      post: post
    });

  } catch (error: any) {
    console.error("Comment Submit Error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다.", rawError: error.message },
      { status: 500 }
    );
  }
}
