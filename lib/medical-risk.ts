export type MedicalRiskAssessment = {
  isMedical: boolean;
  score: 0 | 100;
  level: 'low' | 'high';
  signals: string[];
};

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

const STRONG_JA_TERMS = [
  '糖尿病', '膵炎', 'インスリン', '膀胱炎', '腎不全', '腎臓病', '膝蓋骨脱臼', '骨折', '中毒',
  '毒性', '緊急', '皮膚炎', 'アトピー', 'アレルギー', '感染症', '疾患', '病気', '発作', 'けいれん',
  '癌', 'がん', '腫瘍', '心臓病', '肝疾患', '嘔吐', '下痢'
];

const SUPPORTING_TERMS = [
  '수의사', '동물병원', '진단', '치료', '약물', '검사', '증상', '통증', '염증', '처방',
  'veterinarian', 'veterinary', 'diagnosis', 'treatment', 'medication', 'symptoms', 'pain', 'inflammation',
  '獣医', '動物病院', '診断', '治療', '薬', '症状', '痛み', '炎症'
];

function countDistinctMatches(text: string, terms: string[]) {
  const normalized = text.toLowerCase();
  return terms.reduce((count, term) => count + (normalized.includes(term.toLowerCase()) ? 1 : 0), 0);
}

export function assessMedicalRisk(slug: string, title: string, content: string): MedicalRiskAssessment {
  const headingText = `${title} ${slug}`;
  const fullText = `${title} ${content}`;
  const signals: string[] = [];

  if (STRONG_SLUG_TERMS.test(slug)) signals.push('strong_slug_term');

  const strongHeadingMatches = countDistinctMatches(headingText, [...STRONG_KO_TERMS, ...STRONG_EN_TERMS, ...STRONG_JA_TERMS]);
  if (strongHeadingMatches > 0) signals.push('strong_title_term');

  const strongBodyMatches = countDistinctMatches(fullText, [...STRONG_KO_TERMS, ...STRONG_EN_TERMS, ...STRONG_JA_TERMS]);
  const supportingMatches = countDistinctMatches(fullText, SUPPORTING_TERMS);

  // High confidence when the topic itself is medical, or when multiple independent medical signals appear in body text.
  const isMedical = signals.length > 0 || strongBodyMatches >= 2 || (strongBodyMatches >= 1 && supportingMatches >= 2);

  if (strongBodyMatches >= 2) signals.push('multiple_medical_terms');
  if (strongBodyMatches >= 1 && supportingMatches >= 2) signals.push('medical_term_with_clinical_context');

  return {
    isMedical,
    score: isMedical ? 100 : 0,
    level: isMedical ? 'high' : 'low',
    signals: Array.from(new Set(signals))
  };
}
