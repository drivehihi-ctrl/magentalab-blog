require('dotenv').config({ path: '.env.local' });

const secretsToTest = [
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  process.env.NEXTAUTH_SECRET,
  'magentalab-1234',
  'magentalab-ai-secret-key-1234',
  '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2'
].filter(Boolean);

async function testAuthSecrets() {
  console.log("Testing secret keys against audit endpoint...");
  for (let i = 0; i < secretsToTest.length; i++) {
    const s = secretsToTest[i];
    const res = await fetch('https://www.magentalabblog.com/api/ai-content/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${s}`
      },
      body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
    });
    console.log(`Secret Index [${i}]: HTTP ${res.status}`);
    if (res.ok) {
      console.log(`🎉 MATCH FOUND at Index [${i}]!`);
      return s;
    }
  }
}

testAuthSecrets();
