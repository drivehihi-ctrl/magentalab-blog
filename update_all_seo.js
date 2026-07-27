const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./app', function(filePath) {
  if (filePath.endsWith('page.tsx')) {
    // skip dynamic routes for now, we handled posts manually, others like place/[id] or blog/category/[slug] might need it, but let's focus on static pages first.
    if (filePath.includes('[id]') || filePath.includes('[slug]')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if languages already defined
    if (content.includes('languages: {') || content.includes('languages: {')) return;

    // We only care if there is an export const metadata
    if (!content.includes('export const metadata: Metadata = {')) return;

    // Determine path from filePath (e.g. app\en\privacy\page.tsx -> en/privacy)
    let relativeRoute = filePath.replace(/^app[\\/]/, '').replace(/[\\/]page\.tsx$/, '');
    relativeRoute = relativeRoute.replace(/\\/g, '/');
    if (relativeRoute === 'page.tsx') relativeRoute = ''; // root app/page.tsx

    let baseRoute = relativeRoute.replace(/^en\/?/, '').replace(/^ja\/?/, '');
    if (baseRoute === 'en' || baseRoute === 'ja') baseRoute = '';
    if (baseRoute.endsWith('/')) baseRoute = baseRoute.slice(0, -1);

    const koUrl = baseRoute ? `https://www.magentalabblog.com/${baseRoute}` : 'https://www.magentalabblog.com';
    const enUrl = baseRoute ? `https://www.magentalabblog.com/en/${baseRoute}` : 'https://www.magentalabblog.com/en';
    const jaUrl = baseRoute ? `https://www.magentalabblog.com/ja/${baseRoute}` : 'https://www.magentalabblog.com/ja';

    // check if it has alternates block
    if (content.includes('alternates: {')) {
        // inject languages after alternates: {
        const langStr = `\n    languages: {\n      'ko-KR': '${koUrl}',\n      'en-US': '${enUrl}',\n      'ja-JP': '${jaUrl}',\n    },`;
        content = content.replace(/(alternates:\s*\{)/, `$1${langStr}`);
    } else {
        // inject alternates block before closing brace of metadata
        const currentCanonicalUrl = relativeRoute ? `https://www.magentalabblog.com/${relativeRoute}` : 'https://www.magentalabblog.com';
        const alternatesBlock = `  alternates: {\n    canonical: "${currentCanonicalUrl}",\n    languages: {\n      'ko-KR': '${koUrl}',\n      'en-US': '${enUrl}',\n      'ja-JP': '${jaUrl}',\n    },\n  },\n`;
        // regex to find export const metadata = { ... }
        content = content.replace(/(export const metadata: Metadata = \{([\s\S]*?))\n};/, `$1\n${alternatesBlock}};`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
});
