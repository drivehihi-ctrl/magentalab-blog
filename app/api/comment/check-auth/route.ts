import { NextResponse } from "next/server";

export async function GET() {
  const wpUrl = process.env.WORDPRESS_URL || "https://magentalab.mycafe24.com";
  const wpUser = (process.env.WP_USER || "").trim();
  const wpPassword = (process.env.WP_APP_PASSWORD || "").trim();

  const authHeader = Buffer.from(`${wpUser}:${wpPassword}`).toString("base64");

  try {
    // 단순히 인증이 유효한지만 체크 (사용자 정보 조회 API)
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        "Authorization": `Basic ${authHeader}`,
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      user_id: data.id || "unknown",
      user_name: data.name || "unknown",
      message: response.ok ? "인증 성공! 열쇠가 맞습니다." : "인증 실패! 열쇠가 틀립니다.",
      debug: {
        user_prefix: wpUser.substring(0, 3) + "***",
        pass_prefix: wpPassword.substring(0, 3) + "***",
        pass_length: wpPassword.length
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
