const fs = require('fs');
const path = require('path');

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

async function run() {
  const textFile = path.join(process.cwd(), 'Magentalab_2.0_작업순서_011-050_최종제작규칙.txt');
  const rawText = fs.readFileSync(textFile, 'utf8');
  
  const classCsvPath = path.join(process.cwd(), 'magentalab_classification_454.csv');
  let csvContent = fs.readFileSync(classCsvPath, 'utf8');
  const hasBOM = csvContent.charCodeAt(0) === 0xFEFF;
  if (hasBOM) {
    csvContent = csvContent.slice(1);
  }

  const postRegex = /POST \d+ \/ 454[\s\S]*?={80}\s*([\s\S]*?)(?=={80}\s*POST|$)/g;
  const chunks = [];
  let match;
  while ((match = postRegex.exec(rawText)) !== null) {
    chunks.push(match[1]);
  }

  let appendedLines = [];

  for (const chunk of chunks) {
    const extract = (regex) => {
      const m = chunk.match(regex);
      return m ? m[1].trim() : '';
    };

    const order = extract(/- 작업순서:\s*([^\r\n]+)/);
    const id = extract(/- content_id:\s*([^\r\n]+)/);
    const lang = extract(/- 언어:\s*([^\r\n]+)/);
    const slug = extract(/- 기존 slug:\s*([^\r\n]+)/);
    const mainCategory = extract(/- 대분류:\s*([^\r\n]+)/);
    const cluster = extract(/- 주제 클러스터:\s*([^\r\n]+)/);
    const role = extract(/- 역할:\s*([^\r\n]+)/);
    const hub = extract(/- 상위 HUB:\s*([^\r\n]+)/);
    const slugJudge = extract(/- slug 판단:\s*([^\r\n]+)/);
    const splitJudge = extract(/- 통합·분리 판단:\s*([^\r\n]+)/);
    const title = extract(/\[제목\]\s*([\s\S]*?)\[요약\]/);

    if (id) {
      const row = [order, id, lang, slug, mainCategory, cluster, role, hub, slugJudge, splitJudge, title];
      appendedLines.push(row.map(escapeCsvField).join(','));
    }
  }

  if (appendedLines.length > 0) {
    const newCsvStr = (hasBOM ? '\uFEFF' : '') + csvContent.trim() + '\n' + appendedLines.join('\n') + '\n';
    fs.writeFileSync(classCsvPath, newCsvStr, 'utf8');
    console.log(`Added ${appendedLines.length} rows to classification CSV.`);
  } else {
    console.log('No posts found in the text file.');
  }
}

run().catch(console.error);
