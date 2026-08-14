const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'magentalab_classification_454.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

const categories = new Set();
const items = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  // Parse CSV line simply handling quotes
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);

  const seq = parts[0];
  const content_id = parts[1];
  const lang = parts[2];
  const slug = parts[3];
  const mainCat = parts[4];
  const subCat = parts[5];
  const title = parts[parts.length - 1];

  if (mainCat) categories.add(mainCat);

  items.push({ seq, content_id, lang, slug, mainCat, subCat, title });
}

console.log('Categories found:', Array.from(categories));

console.log('\n--- Non-medical/nutrition categories samples ---');
const filtered = items.filter(item => {
  const c = item.mainCat || '';
  return !c.includes('건강') && !c.includes('질병') && !c.includes('푸드') && !c.includes('영양') && !c.includes('의료');
});

filtered.slice(0, 15).forEach(item => {
  console.log(`ID: ${item.content_id} | Lang: ${item.lang} | Cat: ${item.mainCat} / ${item.subCat} | Slug: ${item.slug} | Title: ${item.title}`);
});
