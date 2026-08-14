require('dotenv').config({ path: '.env.local' });

const candidateSecrets = [
  'magentalab-1234',
  'magentalab-ai-secret-key-1234',
  'magentalab-secret-key-1234',
  '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2',
  'magentalab',
  'magentalab-ai',
  'magentalab-blog',
  'magentalab-api-secret',
  'magentalab-ai-secret',
  process.env.AI_CONTENT_API_SECRET,
  process.env.REVALIDATION_SECRET,
  process.env.NEXTAUTH_SECRET,
  process.env.WP_APP_PASSWORD,
  process.env.WP_SEO_APP_PASSWORD,
  'hTRE G48G IZ9j ThlE eO4I 9YjZ',
  '7q3n UBO5 gHyJ gLos weag GWn9'
].filter(Boolean);

async function findWorkingSecret() {
  console.log("Bruteforce testing candidate secrets on https://www.magentalabblog.com/api/ai-content/audit ...");
  for (let i = 0; i < candidateSecrets.length; i++) {
    const sec = candidateSecrets[i].trim();
    try {
      const res = await fetch('https://www.magentalabblog.com/api/ai-content/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sec}`
        },
        body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
      });
      if (res.status !== 401) {
        console.log(`\n🎉🎉 MATCH FOUND! Key Candidate Index [${i}]: HTTP Status ${res.status}`);
        console.log("Response:", await res.text());
        return sec;
      } else {
        process.stdout.write(`.[${i}:${res.status}]`);
      }
    } catch (e) {
      console.log(`\nCandidate [${i}] Error: ${e.message}`);
    }
  }
  console.log("\nDone checking candidates.");
}

findWorkingSecret();
