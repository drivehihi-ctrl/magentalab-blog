import { decodeHtmlEntities } from '../lib/utils'; // if available

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

const sampleHtml = `
<p>[안심이 요약 (new_ansim_summary)]</p>
<p>1. 강아지 만성신장병 식단은...</p>
<p>2. 두번째 요약...</p>
<p>3. 세번째 요약...</p>
<p><br></p>
<p>F형 공감: 너무 힘들죠...</p>
<p><br></p>
<p><strong>[검증된 근거 (Evidence)]</strong></p>
<p>핵심 인사이트 (keyInsight): 신장병 관리는...</p>
<p>주의 사항 (cautionNote): 주의하세요...</p>
<p><br></p>
<p>참고 자료 1 (references)</p>
<p>제목: IRIS Guidelines</p>
<p>기관/출처: IRIS</p>
<p>타입: 가이드라인</p>
<p>URL: https://example.com</p>
<p><br></p>
<p><span>[본문 내용 (Content)]</span></p>
<h2>실제 본문 시작</h2>
<p>이것은 본문입니다.</p>
`;

function parse(html: string) {
  // Use regex to split allowing optional HTML tags around the markers
  const ansimRegex = /(?:<[^>]+>\s*)*\[안심이 요약 \(new_ansim_summary\)\](?:\s*<\/[^>]+>)*/;
  const evidenceRegex = /(?:<[^>]+>\s*)*\[검증된 근거 \(Evidence\)\](?:\s*<\/[^>]+>)*/;
  const contentRegex = /(?:<[^>]+>\s*)*\[본문 내용 \(Content\)\](?:\s*<\/[^>]+>)*/;

  const hasAll = ansimRegex.test(html) && evidenceRegex.test(html) && contentRegex.test(html);
  if (!hasAll) return { isV3: false };

  // If there's content before ansim, we just discard it.
  const [, ansimRest] = html.split(ansimRegex);
  const [ansimRaw, evidenceRest] = ansimRest.split(evidenceRegex);
  const [evidenceRaw, htmlContent] = evidenceRest.split(contentRegex);

  // Clean ansimRaw
  // Convert <br> or <p> endings to newlines before stripping HTML so lines don't merge!
  const ansimWithNewlines = ansimRaw.replace(/<\/?p[^>]*>/gi, '\n').replace(/<br[^>]*>/gi, '\n');
  const ansimClean = stripHtml(ansimWithNewlines).replace(/&nbsp;/g, ' ').trim();
  const empathySplit = ansimClean.split(/F형 공감:/);
  const ansimSummary = empathySplit[0].trim();
  const empathyText = empathySplit[1] ? empathySplit[1].trim() : '';

  // Clean evidenceRaw
  const evidenceWithNewlines = evidenceRaw.replace(/<\/?p[^>]*>/gi, '\n').replace(/<br[^>]*>/gi, '\n');
  const evidenceClean = stripHtml(evidenceWithNewlines).replace(/&nbsp;/g, ' ').trim();
  const keyInsightMatch = evidenceClean.match(/핵심 인사이트 \(keyInsight\):\s*([\s\S]*?)(?=주의 사항|$)/);
  const cautionNoteMatch = evidenceClean.match(/주의 사항 \(cautionNote\):\s*([\s\S]*?)(?=참고 자료|$)/);

  const references = [];
  const refRegex = /참고 자료 \d+[^\n]*\n+제목:\s*([^\n]+)\n+기관\/출처:\s*([^\n]+)\n+타입:\s*([^\n]+)\n+URL:\s*([^\n]+)/g;
  let match;
  while ((match = refRegex.exec(evidenceClean)) !== null) {
    references.push({
      title: match[1].trim(),
      org: match[2].trim(),
      type: match[3].trim(),
      url: match[4].trim()
    });
  }

  return {
    isV3: true,
    ansimSummary,
    empathyText,
    evidence: {
      keyInsight: keyInsightMatch ? keyInsightMatch[1].trim() : '',
      cautionNote: cautionNoteMatch ? cautionNoteMatch[1].trim() : '',
      references
    },
    htmlContent: htmlContent.trim()
  };
}

console.log(JSON.stringify(parse(sampleHtml), null, 2));
