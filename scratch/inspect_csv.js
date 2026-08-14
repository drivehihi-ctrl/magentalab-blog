const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'magentalab_classification_454.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

console.log('Header:', lines[0]);
for (let i = 1; i < Math.min(20, lines.length); i++) {
  console.log(`Line ${i}:`, lines[i]);
}
