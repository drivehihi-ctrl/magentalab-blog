const fs = require('fs');
const csv = fs.readFileSync('magentalab_all_posts_454.csv', 'utf8');

const rows = csv.split('\n');
for (const row of rows) {
  if (row.includes('dog_diabetes_diet_insulin-en') || row.includes('"2451"')) {
    console.log('Found 2451!');
    const imgs = row.match(/<img[^>]+>/gi);
    console.log('Img count:', imgs ? imgs.length : 0);
    if (imgs) {
      imgs.forEach((img, idx) => {
        console.log(`\n--- IMG ${idx + 1} ---`);
        console.log(img);
      });
    }
    break;
  }
}
