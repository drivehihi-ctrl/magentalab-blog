import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post, author_name, author_email, content } = body;

    const wpUrl = process.env.WORDPRESS_URL || "http://magentalab.mycafe24.com";
    const apiUrl = `${wpUrl}/wp-json/wp/v2/comments`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post,
        author_name,
        author_email,
        content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WordPress API Error:", data);
      return NextResponse.json(
        { message: data.message || "워드프레스 서버에서 댓글 등록을 거부했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Comment Proxy Error:", error);
    return NextResponse.json(
      { message: "댓글 서버 통신 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
