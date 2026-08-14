require('dotenv').config({ path: '.env.local' });

// Inline version of assessMedicalRisk to test locally
const STRONG_SLUG_TERMS = /diabetes|pancreatitis|urinary|cystitis|kidney|renal|patella|luxation|poison|toxic|toxicity|emergency|dermatitis|atopic|allergy|infection|disease|symptom|seizure|cancer|tumou?r|heart|cardiac|liver|hepatic|vomit|diarrhea/i;

const STRONG_KO_TERMS = [
  '당뇨', '췌장염', '인슐린', '방광염', '신부전', '신장질환', '비뇨기질환', '슬개골 탈구',
  '골절', '중독', '독성', '응급', '피부염', '아토피', '알레르기', '감염', '질환', '질병',
  '발작', '경련', '암', '종양', '심장병', '간질환', '구토', '설사'
];

const STRONG_EN_TERMS = [
  'diabetes', 'pancreatitis', 'insulin', 'cystitis', 'kidney disease', 'renal disease', 'patellar luxation',
  'fracture', 'poisoning', 'toxicity', 'emergency', 'dermatitis', 'atopic', 'allergy', 'infection', 'disease',
  'seizure', 'cancer', 'tumor', 'tumour', 'heart disease', 'liver disease', 'vomiting', 'diarrhea'
];

const SUPPORTING_TERMS = [
  '수의사', '동물병원', '진단', '치료', '약물', '검사', '증상', '통증', '염증', '처방',
  'veterinarian', 'veterinary', 'diagnosis', 'treatment', 'medication', 'symptoms', 'pain', 'inflammation'
];

function countDistinctMatches(text, terms) {
  const normalized = text.toLowerCase();
  return terms.reduce((count, term) => count + (normalized.includes(term.toLowerCase()) ? 1 : 0), 0);
}

function assessMedicalRisk(slug, title, content) {
  const headingText = `${title} ${slug}`;
  const fullText = `${title} ${content}`;
  const signals = [];

  if (STRONG_SLUG_TERMS.test(slug)) signals.push('strong_slug_term');

  const strongHeadingMatches = countDistinctMatches(headingText, [...STRONG_KO_TERMS, ...STRONG_EN_TERMS]);
  if (strongHeadingMatches > 0) signals.push('strong_title_term');

  const strongBodyMatches = countDistinctMatches(fullText, [...STRONG_KO_TERMS, ...STRONG_EN_TERMS]);
  const supportingMatches = countDistinctMatches(fullText, SUPPORTING_TERMS);

  const isMedical = signals.length > 0 || strongBodyMatches >= 2 || (strongBodyMatches >= 1 && supportingMatches >= 2);
  return { isMedical, strongBodyMatches, supportingMatches, signals };
}

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const WP_AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

async function checkPosts() {
  // Fetch recent Korean posts
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=30&lang=ko&status=publish`, {
    headers: { 'Authorization': WP_AUTH }
  });
  const posts = await res.json();

  const nonMedical = [];
  for (const post of posts) {
    const risk = assessMedicalRisk(post.slug, post.title?.rendered || '', post.content?.rendered || '');
    if (!risk.isMedical) {
      nonMedical.push({ id: post.id, slug: post.slug, strong: risk.strongBodyMatches, support: risk.supportingMatches });
    }
  }

  console.log(`Checked ${posts.length} posts. Non-medical: ${nonMedical.length}`);
  nonMedical.slice(0, 5).forEach(p => {
    console.log(`  WP ${p.id}: ${p.slug} (strong=${p.strong}, support=${p.support})`);
  });
}

checkPosts().catch(e => console.error(e.message));
