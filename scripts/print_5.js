const data = require('../true_corrupted_posts.json');
const csv = require('fs').readFileSync('./magentalab_all_posts_454.csv','utf8').split('\n');

console.log("Here are 5 examples of posts that were corrupted and just restored:\n");
for(let i=0; i<5; i++) {
  const p = data[i];
  const line = csv.find(l => l.includes(`"${p.id}"`));
  if(line) {
    const urlMatch = line.match(/https:\/\/www\.magentalabblog\.com[^\s",]+/);
    const url = urlMatch ? urlMatch[0] : `https://magentalab.mycafe24.com/?p=${p.id}`;
    // Attempt to parse title from CSV or fallback to the one in JSON (which might be garbled in PS, but JS console.log might handle it better, actually the JSON one is fine, PS just couldn't print it).
    console.log(`- ${url}`);
  }
}
