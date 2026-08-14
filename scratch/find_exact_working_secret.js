require('dotenv').config({ path: '.env.local' });

const keysToTest = [
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  'magentalab-1234',
  'magentalab-ai-secret-key-1234',
  '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2'
].filter(Boolean);

async function testAllKeys() {
  console.log("Testing secret keys against batch endpoint...");
  for (let i = 0; i < keysToTest.length; i++) {
    const k = keysToTest[i];
    const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${k}`
      },
      body: JSON.stringify({
        revisions: [{ wordpress_id: 6090 }]
      })
    });
    console.log(`Key Index [${i}]: Status ${res.status}`);
    if (res.status === 201 || res.status === 400 || res.status === 409) {
      console.log(`🎉 MATCH FOUND at Index [${i}]!`);
      return k;
    }
  }
}

testAllKeys();
