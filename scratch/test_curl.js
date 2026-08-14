require('dotenv').config({ path: '.env.local' });

async function testApi() {
  const secret = 'magentalab-ai-secret-key-1234';
  const url = 'https://www.magentalabblog.com/api/ai-content/revisions';

  console.log(`Sending POST to ${url} with secret '${secret}'...`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secret}`
    },
    body: JSON.stringify({ wordpress_id: 5800 })
  });

  console.log(`Response status: ${res.status}`);
  const text = await res.text();
  console.log(`Response body:\n${text}`);
}

testApi();
