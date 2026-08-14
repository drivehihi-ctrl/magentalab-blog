const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const newSecret = crypto.randomBytes(32).toString('hex');
const oldSecret = 'magentalab-1234';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.next' && f !== 'public' && f !== 'scratch' && f !== 'plugin' && !f.startsWith('.')) {
        walk(dirPath, callback);
      }
    } else {
      if (f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.md') || f === '.env.local') {
        callback(dirPath);
      }
    }
  });
}

walk('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(oldSecret)) {
    console.log(`Replacing in ${filePath}`);
    if (filePath.includes('.env.local')) {
       content = content.replace(`REVALIDATION_SECRET=${oldSecret}`, `REVALIDATION_SECRET=${newSecret}`);
    } else if (filePath.includes('route.ts') && filePath.includes('revalidate')) {
       // Replace fallback in route.ts
       content = content.replace(/ \|\| 'magentalab-1234'/g, "");
       content = content.replace(/ && secret !== 'magentalab-1234'/g, "");
    } else if (filePath.endsWith('.js')) {
       // scripts
       content = content.replace(new RegExp(oldSecret, 'g'), '${process.env.REVALIDATION_SECRET}');
       // Need to replace quotes if they used single quotes around the URL
       content = content.replace(/'https:\/\/www\.magentalabblog\.com\/api\/revalidate\?secret=\$\{process\.env\.REVALIDATION_SECRET\}'/g, '`https://www.magentalabblog.com/api/revalidate?secret=${process.env.REVALIDATION_SECRET}`');
       
       if (!content.includes('dotenv')) {
          content = `require('dotenv').config({ path: '.env.local' });\n` + content;
       }
    } else if (filePath.endsWith('.md')) {
       content = content.replace(new RegExp(oldSecret, 'g'), '<YOUR_SECRET_HERE>');
    }
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Secret rotation done in codebase.');
// Also update .env.example
try {
  let envExample = fs.readFileSync('.env.example', 'utf8');
  if (!envExample.includes('REVALIDATION_SECRET')) {
     fs.appendFileSync('.env.example', '\nREVALIDATION_SECRET=<your-secret-here>\n');
  }
} catch (e) {}

console.log('NEW_SECRET_GENERATED: ' + newSecret.substring(0, 5) + '...');
