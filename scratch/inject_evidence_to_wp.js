require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function run() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');
  
  const textFile = path.join(process.cwd(), 'Magentalab_2.0_작업순서_051-060_고밀도_최종제작규칙.txt');
  if (!fs.existsSync(textFile)) {
    console.error(`File not found: ${textFile}`);
    return;
  }
  const rawText = fs.readFileSync(textFile, 'utf8');

  // Extract post chunks using Regex
  const postRegex = /POST \d+ \/ 454[\s\S]*?={80}\s*([\s\S]*?)(?=={80}\s*POST|$)/g;
  const chunks = [];
  let match;
  while ((match = postRegex.exec(rawText)) !== null) {
    chunks.push(match[1]);
  }

  for (const chunk of chunks) {
    const idMatch = chunk.match(/- content_id:\s*(\d+)/);
    if (!idMatch) continue;
    const postId = idMatch[1];

    const refMatch = chunk.match(/\[근거\]([\s\S]*)$/);
    if (!refMatch) continue;

    const refText = refMatch[1].trim();
    const lines = refText.split('\n').map(l => l.trim()).filter(l => l);

    let keyInsight = '';
    let cautionNote = '';
    const references = [];

    for (const line of lines) {
      if (line.startsWith('-')) {
        const parts = line.substring(1).trim().split(/(https?:\/\/[^\s]+)/);
        let titleOrg = parts[0];
        const url = parts.length > 1 ? parts[1].trim() : '';
        if (titleOrg.endsWith(':')) titleOrg = titleOrg.slice(0, -1).trim();
        
        let title = titleOrg;
        let org = 'Veterinary Reference';
        if (titleOrg.includes('—')) {
          const split = titleOrg.split('—');
          org = split[0].trim();
          title = split[1].trim();
        } else if (titleOrg.includes('-')) {
          const split = titleOrg.split('-');
          org = split[0].trim();
          title = split[1].trim();
        }

        references.push({ title, org, type: 'Clinical Practice Guideline', url });
      } else if (line.match(/^(Evidence note|根拠の解説|근거 해설):\s*(.*)/i)) {
        keyInsight = line.match(/^(Evidence note|根拠の解説|근거 해설):\s*(.*)/i)[2];
      } else if (line.match(/^(Safety note|安全上の注意|안전 주의사항|주의사항):\s*(.*)/i)) {
        cautionNote = line.match(/^(Safety note|安全上の注意|안전 주의사항|주의사항):\s*(.*)/i)[2];
      }
    }

    const evidenceJson = { keyInsight, cautionNote, references };
    const scriptTag = `\n\n<script type="application/json" id="custom-vet-references">${JSON.stringify(evidenceJson)}</script>`;

    console.log(`Fetching current WP Post ID ${postId} to inject evidence block...`);
    try {
      const getRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}?context=edit`, {
        headers: { 
          'Authorization': authHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      
      if (!getRes.ok) {
        console.error(`❌ Failed to fetch Post ${postId}: ${getRes.status} ${getRes.statusText}`);
        continue;
      }
      
      const postData = await getRes.json();
      let currentContent = postData.content.raw || postData.content.rendered || '';
      
      if (currentContent.includes('id="custom-vet-references"')) {
        console.log(`⚠️ Post ${postId} already has custom-vet-references injected. Skipping.`);
        continue;
      }

      currentContent += scriptTag;

      const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        body: JSON.stringify({ content: currentContent })
      });

      if (updateRes.ok) {
        console.log(`✅ WP Post ID ${postId} successfully injected with custom evidence without modifying images!`);
      } else {
        console.error(`❌ Failed WP Update for ${postId}: ${await updateRes.text()}`);
      }
    } catch(err) {
      console.error(`❌ Network Error on Post ${postId}:`, err);
    }
  }
}

run().catch(console.error);
