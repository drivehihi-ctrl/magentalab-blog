const fs = require('fs');
const html = fs.readFileSync('temp_wp_content.txt', 'utf8');

function parseV3(html) {
  if (!html) return { isV3: false, htmlContent: html };
  const ansimRegex = /(?:<[^>]+>\s*)*\[안심이 요약 \(new_ansim_summary\)\](?:\s*<\/[^>]+>)*/;
  const evidenceRegex = /(?:<[^>]+>\s*)*\[검증된 근거 \(Evidence\)\](?:\s*<\/[^>]+>)*/;
  const contentRegex = /(?:<[^>]+>\s*)*\[본문 내용 \(Content\)\](?:\s*<\/[^>]+>)*/;

  const hasAll = ansimRegex.test(html) && evidenceRegex.test(html) && contentRegex.test(html);
  if (!hasAll) return { isV3: false, htmlContent: html };

  const [, ansimRest] = html.split(ansimRegex);
  const [ansimRaw, evidenceRest] = ansimRest.split(evidenceRegex);
  const [evidenceRaw, htmlContent] = evidenceRest.split(contentRegex);
  
  return { isV3: true, htmlContent: htmlContent.trim() };
}

const res = parseV3(html);
console.log('isV3:', res.isV3);
if (res.htmlContent) {
  console.log('htmlContent length:', res.htmlContent.length);
  console.log('htmlContent preview:', res.htmlContent.substring(0, 200));
} else {
  console.log('htmlContent is undefined or empty');
}
