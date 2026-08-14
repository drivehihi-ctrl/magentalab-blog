require('dotenv').config({ path: '.env.local' });

const secretsToTest = [
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  process.env.NEXTAUTH_SECRET,
  'magentalab-ai-secret-key-1234',
  'magentalab-secret-key-1234',
  'magentalab-1234',
  '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2'
].filter(Boolean);

async function testSecrets() {
  console.log("Testing API secrets against https://www.magentalabblog.com/api/ai-content/revisions ...");
  for (const secret of secretsToTest) {
    const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
      },
      body: JSON.stringify({ wordpress_id: 5800 })
    });
    console.log(`Secret starting with '${secret.substring(0, 8)}...': HTTP ${res.status}`);
    if (res.status !== 401) {
      const text = await res.text();
      console.log("SUCCESS MATCH SECRET! Response:", text.substring(0, 200));
      return secret;
    }
  }
  console.log("No matching secret found from list.");
}

testSecrets();
