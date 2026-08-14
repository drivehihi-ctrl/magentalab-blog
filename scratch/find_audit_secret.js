require('dotenv').config({ path: '.env.local' });

const keysToTest = [
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  'magentalab-1234',
  'magentalab-ai-secret-key-1234',
  'magentalab-secret-key-1234'
].filter(Boolean);

async function findAuditSecret() {
  console.log("Testing secret keys against https://www.magentalabblog.com/api/ai-content/audit ...");
  for (let i = 0; i < keysToTest.length; i++) {
    const key = keysToTest[i];
    const res = await fetch('https://www.magentalabblog.com/api/ai-content/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ limit: 5, language: 'ko' })
    });
    console.log(`Key Index [${i}]: HTTP ${res.status}`);
    if (res.ok) {
      console.log(`🎉 MATCH FOUND at Key Index [${i}]!`);
      return key;
    }
  }
}

findAuditSecret();
