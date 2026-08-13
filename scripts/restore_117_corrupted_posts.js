require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2';
const auth = 'Basic ' + Buffer.from(process.env.WORDPRESS_API_USERNAME + ':' + process.env.WORDPRESS_API_APP_PASSWORD).toString('base64');

async function fetchRevisionContent(postId, revisionId) {
  const res = await fetch(`${WP_URL}/posts/${postId}/revisions/${revisionId}`, {
    headers: { 'Authorization': auth }
  });
  const data = await res.json();
  return data.content.rendered;
}

function generateCustomReferencesHtml(evidenceText, lang) {
  const referencesSection = evidenceText;
  if (!referencesSection) return '';

  const tierBadge = referencesSection.includes('Evidence Level: Tier 1') 
    ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold">Evidence Level: Tier 1</span>` 
    : `<span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-extrabold">Evidence Level: Tier 2</span>`;
  
  const evidenceClassText = referencesSection.includes('Veterinary Clinical Guidelines')
    ? (lang === 'ko' ? '수의학 임상 가이드라인 & 기관 지침' : lang === 'ja' ? '獣医学臨床ガイドライン＆機関指침' : 'Veterinary Clinical Guidelines & Institution Guidelines')
    : (lang === 'ko' ? '수의학 논문 & 연구 자료' : lang === 'ja' ? '獣医学論文＆研究資料' : 'Veterinary Papers & Research Data');

  const titleText = lang === 'ko' ? '🔬 수의학 연구 근거 & 학술 참고자료' : lang === 'ja' ? '🔬 獣医学研究根拠 & 学術参考資料' : '🔬 Veterinary Evidence & References';
  const verifiedText = lang === 'ko' ? 'Magentalab Research Team이 직접 수의학 가이드라인을 교차 검증하여 작성했습니다.' : lang === 'ja' ? 'Magentalab Research Teamが直接獣医学ガイドラインを交差検証して作成しました。' : 'Magentalab Research Team has reviewed relevant veterinary guidelines to verify the core content.';
  const summaryTitle = lang === 'ko' ? '💡 핵심 의학 근거 요약' : lang === 'ja' ? '💡 核心医学根拠要約' : '💡 Key Medical Evidence Summary';
  const refTitle = lang === 'ko' ? '📚 출처 & 공식 문서' : lang === 'ja' ? '📚 出所 & 公式文書' : '📚 Primary References & Official Documents';
  const warningTitle = lang === 'ko' ? '⚠️ 의학적 면책 조항 & 개체별 특이성' : lang === 'ja' ? '⚠️ 医学的免責条項 & 個体別特異性' : '⚠️ Medical Disclaimer & Individual Variance';
  const viewSource = lang === 'ko' ? '원문 보기' : lang === 'ja' ? '原文を見る' : 'View Source';
  const footnoteText = lang === 'ko' ? '* 근거 등급은 Magentalab 자체 평가 기준을 따릅니다.' : lang === 'ja' ? '* 根拠等級はMagentalab自己評価基準に従います。' : '* Evidence classification based on Magentalab evaluation standards.';

  // Extract Summary
  let summary = '';
  const summaryMatch = referencesSection.match(/💡\s*.*?(?:Summary|요약|要約)?\s*([\s\S]*?)(?:📚|⚠️|$)/i);
  if (summaryMatch) {
    summary = summaryMatch[1].trim().replace(/^[:\s-]+/, '');
  }

  // Extract Warning
  let warning = '';
  const warningMatch = referencesSection.match(/⚠️\s*.*?(?:Disclaimer|주의사항|免責条項)?\s*([\s\S]*?)(?:Evidence Level:|$)/i);
  if (warningMatch) {
    warning = warningMatch[1].trim().replace(/^[:\s-]+/, '');
  }

  // Extract References List
  let refListHtml = '';
  const refMatch = referencesSection.match(/📚\s*.*?(?:References|출처|出所)?\s*([\s\S]*?)(?:⚠️|Evidence Level:|$)/i);
  if (refMatch) {
    let refs = refMatch[1].trim().split('\n').map(l => l.trim()).filter(l => l);
    // filter out the title line if it accidentally got included
    refs = refs.filter(l => !l.includes('출처 & 공식') && !l.includes('References & Official') && !l.includes('出所 & 公式'));
    
    let formattedRefs = [];
    let currentRef = '';
    for (let line of refs) {
      if (line.match(/^(?:-|\d+\.)/)) {
        if (currentRef) formattedRefs.push(currentRef);
        currentRef = line.replace(/^(?:-|\d+\.)\s*/, '');
      } else {
        currentRef += ' ' + line;
      }
    }
    if (currentRef) formattedRefs.push(currentRef);

    if (formattedRefs.length === 0 && refs.length > 0) {
      formattedRefs = refs;
    }

    formattedRefs.forEach(ref => {
      let refTitle = ref;
      let url = '';
      
      const urlMatch = ref.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        url = urlMatch[1];
        refTitle = ref.replace(url, '').replace(/View Source/gi, '').replace(/원문 보기/gi, '').replace(/原文を見る/gi, '').trim();
      }

      refListHtml += `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-2xs">
          <div class="flex items-start gap-2.5">
            <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
              <p class="font-extrabold text-gray-900 leading-snug">${refTitle}</p>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500">
                <span class="font-bold text-[#E5007E]">Reference</span>
                <span>•</span>
                <span class="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600">Guideline</span>
              </div>
            </div>
          </div>
          ${url ? `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-[#E5007E] border border-gray-200 hover:border-rose-200 text-[11px] font-extrabold transition-all self-end sm:self-auto">
            <span>${viewSource}</span>
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
          ` : ''}
        </div>
      `;
    });
  }

  return `
    <div id="custom-vet-references" class="my-10 p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] border border-amber-900/10 shadow-xs space-y-6 not-prose">
      
      <div class="border-b border-amber-900/10 pb-4">
        <div class="flex items-center gap-2.5 mb-1.5">
          <div class="w-8 h-8 rounded-2xl bg-[#E5007E]/10 border border-[#E5007E]/20 flex items-center justify-center text-[#E5007E]">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <h4 class="text-sm sm:text-base font-extrabold text-[#1a1a2e] tracking-tight">${titleText}</h4>
        </div>
        <p class="text-xs font-medium text-gray-600 leading-relaxed pl-10">${verifiedText}</p>
      </div>

      ${summary ? `
      <div class="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-2">
        <div class="flex items-center gap-2 text-xs font-extrabold text-[#E5007E]">
          <svg class="w-4 h-4 text-[#E5007E]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
          <span>${summaryTitle}</span>
        </div>
        <p class="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed pl-6">${summary}</p>
      </div>
      ` : ''}

      ${refListHtml ? `
      <div class="space-y-3">
        <span class="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest block px-1">${refTitle}</span>
        <div class="space-y-2.5">
          ${refListHtml}
        </div>
      </div>
      ` : ''}

      ${warning ? `
      <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-extrabold text-amber-900">
          <svg class="w-4 h-4 text-amber-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>${warningTitle}</span>
        </div>
        <p class="text-xs font-medium text-amber-950 leading-relaxed pl-6">${warning}</p>
      </div>
      ` : ''}

      <div class="pt-3 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500">
        <div class="flex items-center gap-2 font-bold">
          ${tierBadge}
          <span class="text-gray-500">${evidenceClassText}</span>
        </div>
        <p class="font-medium text-gray-500 text-right">${footnoteText}</p>
      </div>

    </div>
  `;
}

async function run() {
  const corrupted = require('../true_corrupted_posts.json');
  console.log(`Starting surgical restoration of ${corrupted.length} posts...`);

  // Map to get languages. We have magentalab_all_posts_454.csv which has slugs.
  const csvData = fs.readFileSync('./magentalab_all_posts_454.csv', 'utf8').split('\n');
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < corrupted.length; i++) {
    const t = corrupted[i];
    console.log(`[${i+1}/${corrupted.length}] Processing Post ID ${t.id}...`);
    
    // Determine language from CSV slug (or title)
    // Actually simpler: if title ends with -en or -ja (wait, title doesn't end with it, slug does).
    // Let's just assume KO if not found in CSV. But we can grep CSV.
    let lang = 'ko';
    try {
      const line = csvData.find(l => l.includes(`"${t.id}"`));
      if (line) {
        if (line.includes(',"EN",')) lang = 'en';
        else if (line.includes(',"JA",')) lang = 'ja';
      }
    } catch(e) {}

    let content = await fetchRevisionContent(t.id, t.healthyRevId);
    
    const lastH2Regex = /<h2[^>]*>(?:(?!<h2)[\\s\\S])*?(?:Veterinary Evidence|獣医学根拠|수의학 연구 근거|Veterinary References)[\\s\\S]*$/gi;
    let match = lastH2Regex.exec(content);
    if (match) {
      const oldEvidenceHtml = match[0];
      const evidenceText = oldEvidenceHtml.replace(/<[^>]+>/g, '\\n').replace(/\\n\\s*\\n/g, '\\n');
      const newHtmlBlock = generateCustomReferencesHtml(evidenceText, lang);
      content = content.substring(0, match.index) + newHtmlBlock;
    }

    const updateRes = await fetch(`${WP_URL}/posts/${t.id}`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    
    if (updateRes.ok) {
      successCount++;
    } else {
      failCount++;
      console.log(`❌ Failed to update Post ${t.id}`);
    }
    
    // Small delay to avoid hammering WP API
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`Finished! Success: ${successCount}, Failed: ${failCount}`);
}

run();
