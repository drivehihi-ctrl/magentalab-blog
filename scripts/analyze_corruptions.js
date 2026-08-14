const fs = require('fs');

function run() {
  const data = fs.readFileSync('magentalab_all_posts_454.csv', 'utf8');
  const lines = data.split('\n');
  
  let corruptedPosts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Simple CSV parser for this specific format
    // Format: "id","lang","slug","title","date","modified","url","category_ids","tag_ids","excerpt","content"
    // Since content might have commas, we match the quotes
    const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (!matches || matches.length < 11) continue;
    
    const id = matches[0].replace(/^,?"|"?$/g, '');
    const lang = matches[1].replace(/^,?"|"?$/g, '');
    const slug = matches[2].replace(/^,?"|"?$/g, '');
    const content = matches[10].replace(/^,?"|"?$/g, '');
    
    // Check 1: Does the content contain ez-toc-container hardcoded?
    const hasEzToc = content.includes('ez-toc-container') || content.includes('ez-toc-list');
    
    // Check 2: Does it miss the "1. " section if it has a TOC?
    // In WP, normally TOC is injected dynamically. If it's hardcoded, it's highly suspicious.
    
    // We specifically know the bug from July 24 involved ez-toc hardcoded and cutting off the start.
    if (hasEzToc) {
      // Is "1. " or "1_" present in the content BEFORE the TOC?
      // Wait, in the corrupted post, the TOC was at the very beginning of the post or near it.
      const tocIndex = content.indexOf('ez-toc');
      const textBeforeToc = content.substring(0, tocIndex);
      
      // If the text before TOC is very short (e.g. less than 1000 characters), it's probably truncated.
      if (textBeforeToc.length < 1500) {
        corruptedPosts.push({
          id, lang, slug, 
          reason: `Hardcoded ez-toc found at position ${tocIndex}. Text before TOC is only ${textBeforeToc.length} chars.`
        });
      }
    }
  }
  
  console.log(`Found ${corruptedPosts.length} potentially corrupted posts:`);
  console.log(corruptedPosts);
}

run();
