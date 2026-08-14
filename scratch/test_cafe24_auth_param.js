const user = 'magentalab';
const pass = '7q3n UBO5 gHyJ gLos weag GWn9';
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2/posts/5800';

async function testParamAuth() {
  console.log("Testing ?_wp_http_authorization param...");
  const res = await fetch(`${WP_URL}?_wp_http_authorization=${encodeURIComponent(auth)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: "고양이 사진 찍기 거부, 카메라 렌즈 피하는 고양이 심리와 시선 끌기 팁" })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text.substring(0, 200));
}

testParamAuth();
