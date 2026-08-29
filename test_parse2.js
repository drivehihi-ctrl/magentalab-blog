const fs = require('fs');
const html = fs.readFileSync('temp_wp_content.txt', 'utf8');

function parseV3(html) {
  if (!html) return { isV3: false, htmlContent: html };
  const ansimRegex = /(?:<[^>]+>\s*)*\[안심이 요약 \(new_ansim_summary\)\](?:\s*<\/[^>]+>)*/;
  const evidenceRegex = /(?:<[^>]+>\s*)*\[검증된 근거 \(Evidence\)\](?:\s*<\/[^>]+>)*/;
  const contentRegex = /(?:<[^>]+>\s*)*\[본문 내용 \(Content\)\](?:\s*<\/[^>]+>)*/;
  const [, ansimRest] = html.split(ansimRegex);
  if (!ansimRest) return { isV3: false, htmlContent: html };
  const [ansimRaw, evidenceRest] = ansimRest.split(evidenceRegex);
  if (!evidenceRest) return { isV3: false, htmlContent: html };
  const [evidenceRaw, htmlContent] = evidenceRest.split(contentRegex);
  return { isV3: true, htmlContent: htmlContent.trim() };
}

const { htmlContent } = parseV3(html);
let fixed = htmlContent;

fixed = fixed.replace(/<!--[\s\S]*?VETERINARY EVIDENCE[\s\S]*?-->/gi, "");
fixed = fixed.replace(/<div[^>]*class="[^"]*bg-\[#faf6f0\][^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, "");
fixed = fixed.replace(/<div[^>]*class="[^"]*bg-\[#faf6f0\][^"]*"[\s\S]*?<\/div>\s*<\/div>/gi, "");
fixed = fixed.replace(/<div[^>]*class="[^"]*bg-\[#faf6f0\][^"]*"[\s\S]*?<\/div>/gi, "");
fixed = fixed.replace(/<h2[^>]*>(?:(?!<h2)[\s\S])*?(Veterinary Evidence|獣医学根拠|수의학 연구 근거|Veterinary References)[\s\S]*$/gi, "");

const wpUrlPattern = /href="https?:\/\/magentalab\.mycafe24\.com\/[^"]+\/#([^"]+)"/g;
fixed = fixed.replace(wpUrlPattern, 'href="#$1"');

fixed = fixed.replace(/<h2[^>]*>[^<]*🔬[\s\S]*$/gi, '');

console.log('Final fixed html length:', fixed.length);
if (fixed.length < 100) console.log('Fixed html is empty or very small!', fixed);
