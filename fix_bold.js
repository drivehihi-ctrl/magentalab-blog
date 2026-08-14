const fs = require('fs');
const files = [
  'app/petcare-expenses-calculator/page.tsx',
  'app/ja/petcare-expenses-calculator/page.tsx',
  'app/en/petcare-expenses-calculator/page.tsx',
  'app/fic-diagnoser/page.tsx',
  'app/ja/fic-diagnoser/page.tsx',
  'app/en/fic-diagnoser/page.tsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let nc = c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  if (c !== nc) {
    fs.writeFileSync(f, nc);
    console.log('Updated ' + f);
  }
});
