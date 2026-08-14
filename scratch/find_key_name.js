require('dotenv').config({ path: '.env.local' });

const secretsToTest = [
  { name: 'AI_CONTENT_API_SECRET', val: process.env.AI_CONTENT_API_SECRET },
  { name: 'REVALIDATION_SECRET', val: process.env.REVALIDATION_SECRET },
  { name: 'NEXTAUTH_SECRET', val: process.env.NEXTAUTH_SECRET },
  { name: 'hardcoded1', val: 'magentalab-ai-secret-key-1234' },
  { name: 'hardcoded2', val: 'magentalab-secret-key-1234' },
  { name: 'hardcoded3', val: 'magentalab-1234' },
  { name: 'hardcoded4', val: '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2' }
].filter(s => !!s.val);

async function findMatch() {
  for (const item of secretsToTest) {
    const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${item.val}`
      },
      body: JSON.stringify({ wordpress_id: 5800 })
    });
    console.log(`Key Name [${item.name}]: Status ${res.status}`);
    if (res.status === 201) {
      console.log(`Matched key name: ${item.name}`);
      return item.val;
    }
  }
}

findMatch();
