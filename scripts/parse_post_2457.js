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
        i++;
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
const rows = parseCSV(csvText);
const post2457 = rows.find(r => r[0] === '2457' || r[2] === 'dog_diabetes_diet_insulin-ja');

if (post2457) {
  console.log('✅ Found Post 2457!');
  console.log('ID:', post2457[0]);
  console.log('Slug:', post2457[2]);
  console.log('Title:', post2457[3]);
  const rawHtml = post2457[11] || '';
  const imgs = rawHtml.match(/<img[^>]+>/gi) || [];
  console.log('Original <img> tags count in Post 2457:', imgs.length);
  imgs.forEach((img, idx) => {
    console.log(`\n--- [ORIGINAL IMG ${idx + 1}] ---`);
    console.log(img);
  });
} else {
  console.log('Post 2457 not found!');
}
