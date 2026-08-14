const user = 'magentalab';
const pass = '7q3n UBO5 gHyJ gLos weag GWn9';
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2/posts/5800';

async function testWafPayload() {
  // Fetch edit context first
  const editRes = await fetch(`${WP_URL}?context=edit`, {
    headers: { 'Authorization': auth }
  });
  const editPost = await editRes.json();

  console.log("Testing POST update with full raw content...");
  const res = await fetch(WP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
      'X-Authorization': auth,
      'x-http-authorization': auth
    },
    body: JSON.stringify({
      title: editPost.title.raw,
      content: editPost.content.raw + "\n\n<!-- WAF Test -->",
      excerpt: editPost.excerpt.raw
    })
  });

  console.log("Status:", res.status);
  if (!res.ok) {
    console.log("Error body:", await res.text());
  } else {
    console.log("🎉 SUCCESS WP Payload Update!");
  }
}

testWafPayload();
