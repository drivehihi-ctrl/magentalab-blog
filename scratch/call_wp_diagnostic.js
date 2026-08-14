require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET;

async function runDiagnostic() {
  console.log("=== Vercel Production WP REST Diagnostic ===\n");

  const res = await fetch('https://www.magentalabblog.com/api/ai-content/diagnostic/wp-read', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_SECRET}`
    }
  });

  console.log(`HTTP Status: ${res.status}`);
  const body = await res.json();
  console.log(JSON.stringify(body, null, 2));
}

runDiagnostic().catch(e => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
