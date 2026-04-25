// Native fetch is available in Node.js v24

async function testWpComment() {
  const wpUrl = "http://magentalab.mycafe24.com";
  const apiUrl = `${wpUrl}/wp-json/wp/v2/comments/`;
  
  // 테스트용 댓글 데이터 (최근 포스트 ID 1번 가정)
  const testData = {
    post: 1080, 
    author_name: "안심이 테스트",
    author_email: "test@magentalab.com",
    content: "시스템 정밀 점검 중인 댓글입니다. " + new Date().toLocaleString(),
  };

  console.log("🚀 워드프레스 댓글 API 테스트 시작...");
  console.log("URL:", apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    console.log("📊 응답 상태 코드:", response.status);
    console.log("📄 응답 본문:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ 성공! 댓글 ID:", data.id);
    } else {
      console.log("❌ 실패: ", data.message);
    }
  } catch (error) {
    console.error("💥 통신 에러:", error.message);
  }
}

testWpComment();
