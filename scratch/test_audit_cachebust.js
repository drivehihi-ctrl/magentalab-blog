async function testCacheBust() {
  const ts = Date.now();
  console.log("Testing with cache busting timestamp:", ts);
  const res = await fetch(`https://www.magentalabblog.com/api/ai-content/audit?_t=${ts}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer magentalab-1234',
      'Cache-Control': 'no-cache, no-store'
    },
    body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
  });

  console.log("Status:", res.status);
  console.log("Response Body:", await res.text());
}

testCacheBust();
