async function testWpCommentAuth() {
  const wpUrl = "https://magentalab.mycafe24.com";
  const apiUrl = `${wpUrl}/wp-json/wp/v2/comments`;
  
  // 주인님이 주신 실제 출입증
  const wpUser = "magentalab";
  const wpPass = "hTRE G48G IZ9j ThlE eO4I 9YjZ";
  const auth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');

  const testData = {
    post: 1080, 
    author_name: "마젠타 팬",
    author_email: "fan@magentalab.com",
    content: "리트리버 건강 정보 정말 유익하네요! 특히 유전 질환 부분은 몰랐던 내용인데 감사합니다. 다음 편도 기대할게요!",
  };

  console.log("🚀 워드프레스 인증 댓글 API 테스트 시작...");
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    console.log("📊 응답 상태 코드:", response.status);
    console.log("📄 응답 본문:", JSON.stringify(data, null, 2));

    if (response.ok && data.id) {
      console.log("✅ 대성공! 생성된 댓글 ID:", data.id);
      console.log("🔗 댓글 상태:", data.status);
    } else {
      console.log("❌ 실패 사유:", data.message || "알 수 없는 오류");
    }
  } catch (error) {
    console.error("💥 통신 에러:", error.message);
  }
}

testWpCommentAuth();
