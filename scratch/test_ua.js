const user = 'magentalab';
const pass = '7q3n UBO5 gHyJ gLos weag GWn9';
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2/posts/5800';

async function testUA() {
  console.log("Test without User-Agent:");
  const res1 = await fetch(WP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: JSON.stringify({ title: "고양이 사진 찍기 거부, 카메라 렌즈 피하는 고양이 심리와 시선 끌기 팁" })
  });
  console.log("Status 1:", res1.status);

  console.log("Test with User-Agent:");
  const res2 = await fetch(WP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({ title: "고양이 사진 찍기 거부, 카메라 렌즈 피하는 고양이 심리와 시선 끌기 팁" })
  });
  console.log("Status 2:", res2.status);
}

testUA();
