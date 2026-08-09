const fs = require('fs');
const csv = fs.readFileSync('magentalab_all_posts_454.csv', 'utf8');

const rows = csv.split('\n');
for (const row of rows) {
  if (row.startsWith('"2451"')) {
    console.log('Row 2451 found!');
    const imgMatches = row.match(/<img[^>]+>/gi);
    console.log('IMG matches:', imgMatches);
    const figureMatches = row.match(/<figure[^>]*>[\s\S]*?<\/figure>/gi);
    console.log('Figure matches:', figureMatches);
    break;
  }
}
