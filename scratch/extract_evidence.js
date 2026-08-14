const fs = require('fs');
const path = require('path');

const textFile = path.join(process.cwd(), 'Magentalab_2.0_작업순서_051-060_고밀도_최종제작규칙.txt');
const rawText = fs.readFileSync(textFile, 'utf8');

const postRegex = /POST \d+ \/ 454[\s\S]*?={80}\s*([\s\S]*?)(?=={80}\s*POST|$)/g;
const chunks = [];
let match;
while ((match = postRegex.exec(rawText)) !== null) {
  chunks.push(match[1]);
}

const evidenceData = {};

for (const chunk of chunks) {
  const slugMatch = chunk.match(/- 기존 slug:\s*([^\r\n]+)/);
  if (!slugMatch) continue;
  const slug = slugMatch[1].trim();

  const langMatch = chunk.match(/- 언어:\s*(KO|EN|JA)/);
  const lang = langMatch ? langMatch[1] : 'KO';

  const refMatch = chunk.match(/\[근거\]([\s\S]*)$/);
  if (!refMatch) continue;

  const refText = refMatch[1].trim();
  const lines = refText.split('\n').map(l => l.trim()).filter(l => l);

  let keyInsight = '';
  let cautionNote = '';
  const references = [];

  for (const line of lines) {
    if (line.startsWith('-')) {
      // parse reference
      // e.g. - Title: https://url
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

      references.push({
        title,
        org,
        type: 'Clinical Practice Guideline',
        url
      });
    } else if (line.match(/^(Evidence note|根拠の解説|근거 해설):\s*(.*)/i)) {
      keyInsight = line.match(/^(Evidence note|根拠の解説|근거 해설):\s*(.*)/i)[2];
    } else if (line.match(/^(Safety note|安全上の注意|안전 주의사항|주의사항):\s*(.*)/i)) {
      cautionNote = line.match(/^(Safety note|安全上の注意|안전 주의사항|주의사항):\s*(.*)/i)[2];
    }
  }

  evidenceData[slug] = {
    keyInsight,
    cautionNote,
    references
  };
}

fs.writeFileSync(
  path.join(process.cwd(), 'lib', 'evidence-051-060.json'), 
  JSON.stringify(evidenceData, null, 2), 
  'utf8'
);
console.log('Successfully generated lib/evidence-051-060.json with ' + Object.keys(evidenceData).length + ' entries.');
