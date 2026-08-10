const fs = require('fs');
const path = require('path');

function parseCSVRow(text) {
  const result = [];
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
      result.push(field);
      field = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      result.push(field);
      break;
    } else {
      field += char;
    }
  }
  return result;
}

const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split(/\r?\n/);
const header = parseCSVRow(lines[0]);
console.log('CSV Header Columns (Total ' + header.length + '):');
header.forEach((h, i) => console.log(`Column ${i}: "${h}"`));

console.log('\nSample Row 1 (Post 2451):');
const sampleRow = parseCSVRow(lines[1]);
sampleRow.forEach((val, i) => {
  if (val.length > 50) val = val.substring(0, 50) + '...';
  console.log(`Col ${i} (${header[i]}): "${val}"`);
});
