const fs = require('fs');

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
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(field);
      if (row.length > 1) {
        result.push(row);
      }
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

const csvText = fs.readFileSync('magentalab_all_posts_454.csv', 'utf8');
console.log('Parsing CSV with proper multi-line field support...');
const rows = parseCSV(csvText);
console.log(`Parsed ${rows.length} rows.`);

const post2451 = rows.find(r => r[0] === '2451' || r[2] === 'dog_diabetes_diet_insulin-en');

if (post2451) {
  console.log('✅ Found Post 2451!');
  console.log('ID:', post2451[0]);
  console.log('Slug:', post2451[2]);
  console.log('Title:', post2451[3]);
  const rawHtml = post2451[11] || '';
  console.log('Raw HTML length:', rawHtml.length);
  const imgs = rawHtml.match(/<img[^>]+>/gi);
  console.log('Original <img> tags count in Post 2451:', imgs ? imgs.length : 0);
  if (imgs) {
    imgs.forEach((img, idx) => {
      console.log(`\n--- [ORIGINAL IMG ${idx + 1}] ---`);
      console.log(img);
    });
  }
} else {
  console.log('Post 2451 not found in parsed CSV!');
}
