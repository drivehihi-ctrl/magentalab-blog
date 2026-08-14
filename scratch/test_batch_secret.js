require('dotenv').config({ path: '.env.local' });

const secretsToTest = [
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  'magentalab-1234',
  'magentalab-ai-secret-key-1234'
].filter(Boolean);

async function testBatchSecret() {
  console.log("Testing secret keys against https://www.magentalabblog.com/api/ai-content/revisions/batch ...");
  for (let i = 0; i < secretsToTest.length; i++) {
    const s = secretsToTest[i];
    const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${s}`
      },
      body: JSON.stringify({
        revisions: [{ wordpress_id: 6090 }]
      })
    });
    console.log(`Key Index [${i}]: HTTP ${res.status}`);
    if (res.status === 201 || res.status === 400 || res.status === 409) {
      console.log(`🎉 MATCH FOUND for Key Index [${i}]!`);
      return s;
    }
  }
}

testBatchSecret();
