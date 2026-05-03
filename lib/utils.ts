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
