async function testWpCommentForm() {
  const wpUrl = "https://magentalab.mycafe24.com";
  // 주소 뒤에 슬래시를 빼보기도 하고, 폼 형식으로도 시도
  const apiUrl = `${wpUrl}/wp-json/wp/v2/comments`;
  
  const params = new URLSearchParams();
  params.append('post', '1080');
  params.append('author_name', '안심이 폼테스트');
  params.append('author_email', 'formtest@magentalab.com');
  params.append('content', '폼 데이터 형식으로 전송하는 테스트입니다. ' + new Date().toLocaleString());

  console.log("🚀 워드프레스 댓글 API (Form Data) 테스트 시작...");
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: params.toString(),
    });

    const data = await response.json();
    console.log("📊 응답 상태 코드:", response.status);
    console.log("📄 응답 본문:", JSON.stringify(data, null, 2));

    if (response.ok && data.id) {
      console.log("✅ 성공! 댓글 ID:", data.id);
    } else {
      console.log("❌ 실패 혹은 데이터 없음");
    }
  } catch (error) {
    console.error("💥 통신 에러:", error.message);
  }
}

testWpCommentForm();
