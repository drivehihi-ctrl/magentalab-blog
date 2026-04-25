import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post, author_name, author_email, content } = body;

    const wpUrl = process.env.WORDPRESS_URL || "https://magentalab.mycafe24.com";
    const wpUser = (process.env.WP_USER || "").trim();
    // 비밀번호에서 모든 공백 제거 (워드프레스 앱 비밀번호 특성)
    const wpPassword = (process.env.WP_APP_PASSWORD || "").replace(/\s/g, "");

    if (!wpUser || !wpPassword) {
      return NextResponse.json(
        { message: "서버 환경 변수(WP_USER, WP_APP_PASSWORD)가 설정되지 않았습니다. Vercel 설정을 확인해주세요." },
        { status: 500 }
      );
    }

    const apiUrl = `${wpUrl}/wp-json/wp/v2/comments/`;
    const authHeader = Buffer.from(`${wpUser}:${wpPassword}`).toString("base64");

    const params = new URLSearchParams();
    params.append("post", post.toString());
    params.append("author_name", author_name);
    params.append("author_email", author_email);
    // 중복 댓글 필터 회피를 위해 미세한 타임스탬프 추가
    params.append("content", `${content}\n\n(ref: ${Date.now()})`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${authHeader}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      console.error("WordPress API Error:", data);
      return NextResponse.json(
        { 
          message: data.message || "워드프레스 서버에서 댓글 등록을 거부했습니다. (ID 미발급)",
          rawError: data 
        },
        { status: 500 } // 워드프레스가 200을 줘도 ID가 없으면 강제로 500 에러 처리!
      );
    }

    return NextResponse.json({ success: true, id: data.id, message: "댓글이 성공적으로 등록되었습니다." });
  } catch (error: any) {
    console.error("Comment Proxy Error:", error);
    return NextResponse.json(
      { message: "댓글 서버 통신 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
