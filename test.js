const fs = require('fs');
let content = fs.readFileSync('app/about/page.tsx', 'utf8');
const canonicalMatch = content.match(/canonical:\s*"(https:\/\/www\.magentalabblog\.com\/?([^"]*))"/);
console.log(canonicalMatch);
