require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const result = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(field);
      if (row.length > 1) result.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    result.push(row);
  }
  return result;
}

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

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
  
  const modifiedDateStr = new Date().toISOString().replace(/\.\d{3}Z$/, '');

  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
  const backupFile = path.join(backupDir, `posts_051_060_backup_${Date.now()}.json`);
  const backups = [];

  let csvUpdated = false;
  const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
  let csvRows = fs.existsSync(csvPath) ? parseCSV(fs.readFileSync(csvPath, 'utf8')) : [];

  for (const chunk of chunks) {
    const idMatch = chunk.match(/- content_id:\s*(\d+)/);
    if (!idMatch) continue;
    const postId = idMatch[1];
    const langMatch = chunk.match(/- 언어:\s*(KO|EN|JA)/);
    const lang = langMatch ? langMatch[1] : 'KO';
    const slugMatch = chunk.match(/- 기존 slug:\s*([^\r\n]+)/);
    const slug = slugMatch ? slugMatch[1].trim() : '';

    const titleMatch = chunk.match(/\[제목\]\s*([\s\S]*?)\[요약\]/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    const summaryMatch = chunk.match(/\[요약\]\s*([\s\S]*?)\[공감\]/);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    const empathyMatch = chunk.match(/\[공감\]\s*([\s\S]*?)\[GEO\/SEO 요약 테이블\]/);
    const empathy = empathyMatch ? empathyMatch[1].trim() : '';

    const tableMatch = chunk.match(/\[GEO\/SEO 요약 테이블\]\s*([\s\S]*?)\[본문\]/);
    const table = tableMatch ? tableMatch[1].trim() : '';
    
    const bodyMatch = chunk.match(/\[본문\]\s*([\s\S]*)$/);
    let rawBody = bodyMatch ? bodyMatch[1].trim() : '';

    const excerpt = summary + '\n\n[공감]\n\n' + empathy;

    // Replace images with raw text placeholders
    let htmlBody = rawBody;
    const imgRegex = /\[이미지 (\d+)\]\s*alt 태그: (.*?)\s*이미지 프롬프트: ([\s\S]*?)(?=\n\n|\n<|<|$)/g;
    
    htmlBody = htmlBody.replace(imgRegex, (m, numStr, altTag, imgPrompt) => {
      return `<p><strong>[이미지 ${numStr}]</strong><br>\n<strong>alt 태그:</strong> ${altTag.trim()}<br>\n<strong>이미지 프롬프트:</strong> ${imgPrompt.trim()}</p>\n\n`;
    });

    // Extract Custom References [근거] and STRIP IT from the WP Content
    const refMatch = htmlBody.match(/\[근거\]([\s\S]*)$/);
    if (refMatch) {
      console.log(`Stripping [근거] section from Post ID ${postId} (${lang}) to allow native React rendering.`);
      htmlBody = htmlBody.replace(/\[근거\][\s\S]*$/, '').trim();
    }
    
    // Add Table formatting
    const formattedTable = `<div class="table-responsive my-6">\n<table>\n${table.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('|---')).map(l => {
        if (!l.startsWith('|')) return l;
        const cells = l.split('|').filter(c => c).map(c => c.trim());
        const tag = l.includes('범주') || l.includes('categories') || l.includes('意味') || l.includes('What you notice') || l.includes('飼い主が気づ') ? 'th' : 'td';
        return '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
    }).join('\n').replace(/<tr><th/g, '<thead>\n<tr><th').replace(/<\/th><\/tr>/g, '</th></tr>\n</thead>\n<tbody>').replace(/<\/tr>$/g, '</tr>\n</tbody>')}\n</table>\n</div>`;

    // Construct final content
    const finalContent = `${formattedTable}\n\n${htmlBody}`;

    // 1. Fetch existing post for Backup
    console.log(`Backing up Post ID ${postId}...`);
    try {
      const getRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
        headers: { 'Authorization': authHeader }
      });
      if (getRes.ok) {
        const postData = await getRes.json();
        backups.push(postData);
      } else {
        console.error(`❌ Failed to fetch backup for ${postId}`);
      }
    } catch(err) {
      console.error(`❌ Network Error on Backup ${postId}:`, err);
    }

    // 2. Update WP
    console.log(`Updating Post ID ${postId} (${lang})...`);
    try {
      const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          title,
          excerpt,
          content: finalContent,
          slug
        })
      });

      if (updateRes.ok) {
        console.log(`✅ WP Post ID ${postId} updated successfully!`);
      } else {
        console.error(`❌ Failed WP Update for ${postId}: ${await updateRes.text()}`);
      }
    } catch(err) {
      console.error(`❌ Network Error on Update ${postId}:`, err);
    }

    // 3. Update CSV rows
    csvRows = csvRows.map((r, idx) => {
      if (idx === 0) return r;
      if (r[0] === String(postId)) {
        r[3] = title;
        r[4] = slug;
        r[5] = modifiedDateStr;
        r[9] = cleanHtml(excerpt);
        r[10] = cleanHtml(finalContent);
        r[11] = finalContent;
        csvUpdated = true;
      }
      return r;
    });
  }
  
  fs.writeFileSync(backupFile, JSON.stringify(backups, null, 2), 'utf8');
  console.log(`✅ Backup saved to ${backupFile}`);

  if (csvUpdated) {
    const newCsvStr = '\uFEFF' + csvRows.map(r => r.map(escapeCsvField).join(',')).join('\n');
    fs.writeFileSync(csvPath, newCsvStr, 'utf8');
    console.log(`✅ CSV updated!`);
  }
}

run().catch(console.error);
