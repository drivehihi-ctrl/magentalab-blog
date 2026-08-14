require('dotenv').config({ path: '.env.local' });

const keysToTest = [
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  process.env.NEXTAUTH_SECRET,
  'magentalab-1234',
  'magentalab-ai-secret-key-1234',
  'magentalab-secret-key-1234',
  '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2'
].filter(Boolean);

async function testAll() {
  console.log("Testing keys against https://www.magentalabblog.com/api/ai-content/audit ...");
  for (let i = 0; i < keysToTest.length; i++) {
    const k = keysToTest[i];
    try {
      const res = await fetch('https://www.magentalabblog.com/api/ai-content/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${k}`
        },
        body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
      });
      console.log(`Key Index [${i}]: HTTP Status ${res.status}`);
      if (res.ok) {
        console.log(`🎉 SUCCESS MATCH FOR KEY INDEX [${i}]!`);
        return k;
      }
    } catch (e) {
      console.log(`Key Index [${i}]: Error ${e.message}`);
    }
  }
}

testAll();
