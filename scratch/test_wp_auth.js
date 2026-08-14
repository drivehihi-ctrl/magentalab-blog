require('dotenv').config({ path: '.env.local' });

const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2/posts/5800';
const user = 'magentalab';

const passesToTest = [
  '7q3n UBO5 gHyJ gLos weag GWn9',
  '7q3nUBO5gHyJgLosweagGWn9',
  'hTRE G48G IZ9j ThlE eO4I 9YjZ',
  'hTREG48GIZ9jThlEeO4I9YjZ'
];

async function testWpAuth() {
  console.log("Testing WP Application Passwords...");
  for (const p of passesToTest) {
    const auth = 'Basic ' + Buffer.from(user + ':' + p).toString('base64');
    const res = await fetch(WP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify({
        // Send exact current title so nothing really changes
        title: "고양이 사진 찍기 거부, 카메라 렌즈 피하는 고양이 심리와 시선 끌기 팁"
      })
    });
    console.log(`Pass length ${p.length} chars (Starts with '${p.substring(0, 4)}'): HTTP ${res.status}`);
    if (res.status === 200) {
      console.log("🎉 SUCCESS WP AUTH! Password:", p);
      return p;
    } else {
      console.log("Failed body:", await res.text());
    }
  }
}

testWpAuth();
