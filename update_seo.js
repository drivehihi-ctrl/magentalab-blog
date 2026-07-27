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
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if languages already defined
    if (content.includes('languages: {') || content.includes('languages: {')) return;

    // Find canonical URL
    const canonicalMatch = content.match(/canonical:\s*"(https:\/\/www\.magentalabblog\.com\/?([^"]*))"/);
    if (canonicalMatch) {
      const canonicalUrl = canonicalMatch[1];
      let subPath = canonicalMatch[2];
      
      // Remove en/ or ja/ from start
      subPath = subPath.replace(/^en\/?/, '').replace(/^ja\/?/, '');
      if (subPath.endsWith('/')) subPath = subPath.slice(0, -1);
      
      const koUrl = subPath ? `https://www.magentalabblog.com/${subPath}` : 'https://www.magentalabblog.com/';
      const enUrl = subPath ? `https://www.magentalabblog.com/en/${subPath}` : 'https://www.magentalabblog.com/en/';
      const jaUrl = subPath ? `https://www.magentalabblog.com/ja/${subPath}` : 'https://www.magentalabblog.com/ja/';

      const langStr = `\n    languages: {\n      'ko-KR': '${koUrl}',\n      'en-US': '${enUrl}',\n      'ja-JP': '${jaUrl}',\n    },`;
      
      const newContent = content.replace(/(canonical:\s*"[^"]*",?)/, `$1${langStr}`);
      
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated: ' + filePath);
      }
    }
  }
});
