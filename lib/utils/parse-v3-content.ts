import { decodeHtmlEntities } from '../utils';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

export interface ParsedV3Content {
  isV3: boolean;
  ansimSummary?: string;
  empathyText?: string;
  evidence?: {
    keyInsight: string;
    cautionNote: string;
    references: Array<{ title: string; org: string; type: string; url: string }>;
  };
  htmlContent: string;
}

export function parseV3Content(html: string): ParsedV3Content {
  if (!html) return { isV3: false, htmlContent: html };

  const ansimRegex = /(?:<[^>]+>\s*)*\[안심이 요약 \(new_ansim_summary\)\](?:\s*<\/[^>]+>)*/;
  const evidenceRegex = /(?:<[^>]+>\s*)*\[검증된 근거 \(Evidence\)\](?:\s*<\/[^>]+>)*/;
  const contentRegex = /(?:<[^>]+>\s*)*\[본문 내용 \(Content\)\](?:\s*<\/[^>]+>)*/;

  const hasAll = ansimRegex.test(html) && evidenceRegex.test(html) && contentRegex.test(html);
  if (!hasAll) return { isV3: false, htmlContent: html };

  const [, ansimRest] = html.split(ansimRegex);
  const [ansimRaw, evidenceRest] = ansimRest.split(evidenceRegex);
  const [evidenceRaw, htmlContent] = evidenceRest.split(contentRegex);

  let listIndex = 1;
  const ansimWithNumbers = ansimRaw.replace(/<li[^>]*>/gi, () => `${listIndex++}. `);

  // Convert block tags and <br> to newlines before stripping HTML so text doesn't merge
  const ansimWithNewlines = ansimWithNumbers.replace(/<\/?(p|div)[^>]*>/gi, '\n').replace(/<br[^>]*>/gi, '\n');
  const ansimClean = decodeHtmlEntities(stripHtml(ansimWithNewlines)).replace(/&nbsp;/g, ' ').trim();
  
  const empathySplit = ansimClean.split(/F형 공감:/);
  const ansimSummary = empathySplit[0].replace(/\n{2,}/g, '\n').trim();
  const empathyText = empathySplit[1] ? empathySplit[1].replace(/\n{2,}/g, '\n').trim() : '';

  const evidenceWithNewlines = evidenceRaw.replace(/<\/?(p|div|li)[^>]*>/gi, '\n').replace(/<br[^>]*>/gi, '\n');
  const evidenceClean = decodeHtmlEntities(stripHtml(evidenceWithNewlines)).replace(/&nbsp;/g, ' ').trim();
  
  const keyInsightMatch = evidenceClean.match(/핵심 인사이트 \(keyInsight\):\s*([\s\S]*?)(?=주의 사항|$)/);
  const cautionNoteMatch = evidenceClean.match(/주의 사항 \(cautionNote\):\s*([\s\S]*?)(?=참고 자료|$)/);

  const references = [];
  // Use \s* or \n+ to flexibly match line breaks and spaces between reference fields
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
