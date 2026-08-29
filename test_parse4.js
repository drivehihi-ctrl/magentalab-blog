const fs = require('fs');
const html = fs.readFileSync('temp_wp_content.txt', 'utf8');

function parseV3(html) {
  if (!html) return { isV3: false, htmlContent: html };
  const ansimRegex = /(?:<[^>]+>\s*)*\[안심이 요약 \(new_ansim_summary\)\](?:\s*<\/[^>]+>)*/;
  const evidenceRegex = /(?:<[^>]+>\s*)*\[검증된 근거 \(Evidence\)\](?:\s*<\/[^>]+>)*/;
  const contentRegex = /(?:<[^>]+>\s*)*\[본문 내용 \(Content\)\](?:\s*<\/[^>]+>)*/;
  const [, ansimRest] = html.split(ansimRegex);
  const [ansimRaw, evidenceRest] = ansimRest.split(evidenceRegex);
  const [evidenceRaw, htmlContent] = evidenceRest.split(contentRegex);
  return { isV3: true, htmlContent: htmlContent.trim() };
}

const { htmlContent } = parseV3(html);
let fixed = htmlContent;

const regex = /<h2[^>]*>(?:(?!<h2)[\s\S])*?(Veterinary Evidence|獣医学根拠|수의학 연구 근거|Veterinary References)[\s\S]*$/gi;
const match = fixed.match(regex);
if (match) {
  console.log('Match found! Length:', match[0].length);
  console.log('Match starts with:', match[0].substring(0, 500));
}
