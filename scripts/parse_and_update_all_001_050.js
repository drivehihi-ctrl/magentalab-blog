require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const result = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(field);
      if (row.length > 1) result.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    result.push(row);
  }
  return result;
}

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function generateCustomReferencesHtml(refBlock, lang) {
  // Regex parsing the [근거] block
  const isEn = lang === 'EN';
  const isJa = lang === 'JA';

  const titlePrefix = isEn ? '🔬 Veterinary Evidence & References' : isJa ? '🔬 獣医学根拠＆参考文献' : '🔬 수의학 근거 & 참고자료';
  const subPrefix = isEn ? 'Magentalab Research Team has reviewed relevant veterinary guidelines to verify the core content.' : isJa ? 'マゼンタラボ研究チームが関連する獣医学ガイドラインと専門資料を検証し、本分の主要内容を確認しました。' : '마젠타랩 수석 연구팀이 관련 수의학 가이드라인과 전문 자료를 검토하여 본문의 핵심 내용을 확인했습니다.';
  const keyInsightTitle = isEn ? '💡 Key Medical Evidence Summary' : isJa ? '💡 この記事の獣医学的核心根拠' : '💡 이 글의 수의학적 핵심 근거';
  const refTitle = isEn ? '📚 Primary References & Official Documents' : isJa ? '📚 主要参考文献・公式文書' : '📚 주요 참고자료 및 공식 지침';
  const cautionTitle = isEn ? '⚠️ Medical Disclaimer & Individual Variance' : isJa ? '⚠️ 獣医学的注意事項・個体差について' : '⚠️ 수의학적 주의사항 및 개체별 차이';
  const sourceBtnText = isEn ? 'View Source' : isJa ? '原文を見る' : '원문 보기';
  const evidenceLevel = isEn ? 'Evidence Level: Tier 1' : isJa ? '根拠水準：Tier 1' : '근거 수준: Tier 1';
  const evidenceDesc = isEn ? 'Veterinary Clinical Guidelines & Institution Guidelines' : isJa ? '専門獣医学ガイドラインおよび機関資料' : '전문 수의학 가이드라인 및 기관 자료';
  const footerNote = isEn ? '* Evidence classification based on Magentalab evaluation standards.' : isJa ? '※ 根拠水準はMagentalab独自の分類基準です。' : '* 근거 수준은 Magentalab 자체 분류 기준입니다.';

  const lines = refBlock.split('\n');
  let referencesHtml = '';
  let keyInsight = '';
  let caution = '';
  
  let currentSection = 'refs';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.match(/^(근거 해설|Evidence note|根拠解説)[:：]/)) {
      currentSection = 'insight';
      keyInsight += line.replace(/^(근거 해설|Evidence note|根拠解説)[:：]\s*/, '') + ' ';
    } else if (line.match(/^(안전 주의사항|Safety note|安全上の注意)[:：]/)) {
      currentSection = 'caution';
      caution += line.replace(/^(안전 주의사항|Safety note|安全上の注意)[:：]\s*/, '') + ' ';
    } else if (currentSection === 'refs' && line.startsWith('- ')) {
      let refText = line.substring(2);
      let url = '';
      const urlMatch = refText.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        url = urlMatch[1];
        refText = refText.replace(url, '').trim();
        if (refText.endsWith(':')) refText = refText.slice(0, -1).trim();
      }
      
      let title = refText;
      let org = 'Reference';
      let type = 'Guideline';
      
      // Simple splitting by commas or dashes if possible
      const parts = refText.split(/[,—\-]/);
      if (parts.length >= 2) {
         org = parts[0].trim();
         title = parts.slice(1).join('-').trim();
      }

      referencesHtml += `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-2xs">
          <div class="flex items-start gap-2.5">
            <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
              <p class="font-extrabold text-gray-900 leading-snug">${title}</p>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500">
                <span class="font-bold text-[#E5007E]">${org}</span>
                <span>•</span>
                <span class="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600">${type}</span>
              </div>
            </div>
          </div>
          ${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-[#E5007E] border border-gray-200 hover:border-rose-200 text-[11px] font-extrabold transition-all self-end sm:self-auto">
            <span>${sourceBtnText}</span>
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>` : ''}
        </div>
      `;
    } else {
      if (currentSection === 'insight') keyInsight += line + ' ';
      else if (currentSection === 'caution') caution += line + ' ';
    }
  }

  return `
    <div id="custom-vet-references" class="my-10 p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] border border-amber-900/10 shadow-xs space-y-6 not-prose">
      <div class="border-b border-amber-900/10 pb-4">
        <div class="flex items-center gap-2.5 mb-1.5">
          <div class="w-8 h-8 rounded-2xl bg-[#E5007E]/10 border border-[#E5007E]/20 flex items-center justify-center text-[#E5007E]">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <h4 class="text-sm sm:text-base font-extrabold text-[#1a1a2e] tracking-tight">${titlePrefix}</h4>
        </div>
        <p class="text-xs font-medium text-gray-600 leading-relaxed pl-10">${subPrefix}</p>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-2">
        <div class="flex items-center gap-2 text-xs font-extrabold text-[#E5007E]">
          <svg class="w-4 h-4 text-[#E5007E]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
          <span>${keyInsightTitle}</span>
        </div>
        <p class="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed pl-6">${keyInsight.trim()}</p>
      </div>

      <div class="space-y-3">
        <span class="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest block px-1">${refTitle}</span>
        <div class="space-y-2.5">
          ${referencesHtml}
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-extrabold text-amber-900">
          <svg class="w-4 h-4 text-amber-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>${cautionTitle}</span>
        </div>
        <p class="text-xs font-medium text-amber-950 leading-relaxed pl-6">${caution.trim()}</p>
      </div>

      <div class="pt-3 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500">
        <div class="flex items-center gap-2 font-bold">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold">${evidenceLevel}</span>
          <span class="text-gray-500">${evidenceDesc}</span>
        </div>
        <p class="font-medium text-gray-500 text-right">${footerNote}</p>
      </div>
    </div>
  `;
}

async function run() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');
  
  const filesToProcess = [
    'Magentalab_2.0_작업순서_001-010_최종제작규칙_테스트.txt',
    'Magentalab_2.0_작업순서_011-050_최종제작규칙.txt'
  ];

  let csvUpdated = false;
  const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
  let csvRows = fs.existsSync(csvPath) ? parseCSV(fs.readFileSync(csvPath, 'utf8')) : [];

  for (const fileName of filesToProcess) {
    const textFile = path.join(process.cwd(), fileName);
    if (!fs.existsSync(textFile)) {
      console.warn(`File not found: ${fileName}`);
      continue;
    }
    const rawText = fs.readFileSync(textFile, 'utf8');

    // Extract post chunks using Regex
    const postRegex = /POST \d+ \/ 454[\s\S]*?={80}\s*([\s\S]*?)(?=={80}\s*POST|$)/g;
    const chunks = [];
    let match;
    while ((match = postRegex.exec(rawText)) !== null) {
      chunks.push(match[1]);
    }
    const modifiedDateStr = new Date().toISOString().replace(/\.\d{3}Z$/, '');

    for (const chunk of chunks) {
      const idMatch = chunk.match(/- content_id:\s*(\d+)/);
      if (!idMatch) continue;
      const postId = idMatch[1];
      const langMatch = chunk.match(/- 언어:\s*(KO|EN|JA)/);
      const lang = langMatch ? langMatch[1] : 'KO';
      const slugMatch = chunk.match(/- 기존 slug:\s*([^\r\n]+)/);
      const slug = slugMatch ? slugMatch[1].trim() : '';

      const titleMatch = chunk.match(/\[제목\]\s*([\s\S]*?)\[요약\]/);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      const summaryMatch = chunk.match(/\[요약\]\s*([\s\S]*?)\[공감\]/);
      const summary = summaryMatch ? summaryMatch[1].trim() : '';

      const empathyMatch = chunk.match(/\[공감\]\s*([\s\S]*?)\[GEO\/SEO 요약 테이블\]/);
      const empathy = empathyMatch ? empathyMatch[1].trim() : '';

      const tableMatch = chunk.match(/\[GEO\/SEO 요약 테이블\]\s*([\s\S]*?)\[본문\]/);
      const table = tableMatch ? tableMatch[1].trim() : '';
      
      const bodyMatch = chunk.match(/\[본문\]\s*([\s\S]*)$/);
      let rawBody = bodyMatch ? bodyMatch[1].trim() : '';

      const excerpt = summary + '\n\n[공감]\n\n' + empathy;

      // Replace images with raw text placeholders
      let htmlBody = rawBody;
      const imgRegex = /\[이미지 (\d+)\]\s*alt 태그: (.*?)\s*이미지 프롬프트: ([\s\S]*?)(?=\n\n|\n<|<|$)/g;
      
      htmlBody = htmlBody.replace(imgRegex, (match, numStr, altTag, imgPrompt) => {
        return `<p><strong>[이미지 ${numStr}]</strong><br>\n<strong>alt 태그:</strong> ${altTag.trim()}<br>\n<strong>이미지 프롬프트:</strong> ${imgPrompt.trim()}</p>\n\n`;
      });

      // Extract Custom References [근거] and replace with Beautiful HTML
      const refMatch = htmlBody.match(/\[근거\]([\s\S]*)$/);
      if (refMatch) {
        const refBlock = refMatch[1].trim();
        const customHtml = generateCustomReferencesHtml(refBlock, lang);
        htmlBody = htmlBody.replace(/\[근거\][\s\S]*$/, customHtml);
      }
      
      // Add Table formatting
      const formattedTable = `<div class="table-responsive my-6">\n<table>\n${table.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('|---')).map(l => {
          if (!l.startsWith('|')) return l;
          const cells = l.split('|').filter(c => c).map(c => c.trim());
          const tag = l.includes('범주') || l.includes('categories') || l.includes('意味') ? 'th' : 'td';
          return '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
      }).join('\n').replace(/<tr><th/g, '<thead>\n<tr><th').replace(/<\/th><\/tr>/g, '</th></tr>\n</thead>\n<tbody>').replace(/<\/tr>$/g, '</tr>\n</tbody>')}\n</table>\n</div>`;

      // Construct final content
      const finalContent = `${formattedTable}\n\n${htmlBody}`;

      // Update WP
      console.log(`Updating Post ID ${postId} (${lang})...`);
      const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          title,
          excerpt,
          content: finalContent,
          slug
        })
      });

      if (updateRes.ok) {
        console.log(`✅ WP Post ID ${postId} updated!`);
      } else {
        console.error(`❌ Failed WP Update for ${postId}: ${await updateRes.text()}`);
      }

      // Update CSV rows
      csvRows = csvRows.map((r, idx) => {
        if (idx === 0) return r;
        if (r[0] === String(postId)) {
          r[3] = title;
          r[4] = slug;
          r[5] = modifiedDateStr;
          r[9] = cleanHtml(excerpt);
          r[10] = cleanHtml(finalContent);
          r[11] = finalContent;
          csvUpdated = true;
        }
        return r;
      });
    }
  }

  if (csvUpdated) {
    const newCsvStr = '\uFEFF' + csvRows.map(r => r.map(escapeCsvField).join(',')).join('\n');
    fs.writeFileSync(csvPath, newCsvStr, 'utf8');
    console.log(`✅ CSV updated!`);
  }
}

run().catch(console.error);
