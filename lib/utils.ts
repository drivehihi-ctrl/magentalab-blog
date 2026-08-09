/**
 * SEO 및 메타데이터용 텍스트 정제 유틸리티
 */

/**
 * HTML 태그를 모두 제거합니다.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

/**
 * HTML 엔티티(&#8220;, &amp; 등)를 일반 문자로 변환합니다.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  
  // 숫자형 엔티티 처리 (예: &#8220;)
  let decoded = text.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  // 주요 명칭형 엔티티 처리
  const entities: { [key: string]: string } = {
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&apos;": "'",
    "&#038;": "&",
  };

  return decoded.replace(/&[#a-zA-Z0-9]+;/g, (match) => {
    return entities[match] || match;
  });
}

/**
 * SEO용으로 텍스트를 완전히 정제합니다 (태그 제거 + 엔티티 변환 + 공백 정리).
 */
export function sanitizeForSeo(text: string, maxLength?: number): string {
  if (!text) return "";
  
  const sanitized = decodeHtmlEntities(stripHtml(text)).trim();
  
  if (maxLength && sanitized.length > maxLength) {
    return sanitized.slice(0, maxLength) + "...";
  }
  
  return sanitized;
}

/**
 * 본문 HTML 내부에 하드코딩되었거나 잔재로 남아있는 수의학 근거 HTML 블록을 정제합니다.
 */
export function cleanContentReferences(html: string): string {
  if (!html) return "";
  let cleaned = html;
  
  // 1. 하드코딩된 RICH VETERINARY EVIDENCE & REFERENCES COMPONENT div 블록 및 모든 bg-[#faf6f0] 테두리 껍데기 박스 완전 제거
  cleaned = cleaned.replace(/<!--[\s\S]*?VETERINARY EVIDENCE[\s\S]*?-->/gi, "");
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*bg-\[#faf6f0\][^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, "");
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*bg-\[#faf6f0\][^"]*"[\s\S]*?<\/div>\s*<\/div>/gi, "");
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*bg-\[#faf6f0\][^"]*"[\s\S]*?<\/div>/gi, "");

  // 2. 본문 끝자락의 <h2>🔬 수의학... / Veterinary... / 獣医学...</h2> 섹션 및 하위 문단 제거
  cleaned = cleaned.replace(/<h2[^>]*>[\s\S]*?(Veterinary Evidence|獣医学根拠|수의학 연구 근거|Veterinary References)[\s\S]*$/gi, "");
  
  return cleaned.trim();
}
