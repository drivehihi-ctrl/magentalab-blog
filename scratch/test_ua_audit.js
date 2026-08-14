async function testUAAudit() {
  console.log("Testing with User-Agent and Authorization header...");
  const res = await fetch('https://www.magentalabblog.com/api/ai-content/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Authorization': 'Bearer magentalab-1234',
      'X-Authorization': 'Bearer magentalab-1234',
      'x-api-secret': 'magentalab-1234'
    },
    body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
  });

  console.log("Status:", res.status);
  console.log("Response Body:", await res.text());
}

testUAAudit();
