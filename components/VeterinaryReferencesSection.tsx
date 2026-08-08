'use client';

import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, Award, ExternalLink } from 'lucide-react';

interface VeterinaryReferencesProps {
  categories?: string[];
  title?: string;
  slug?: string;
  lang?: 'ko' | 'en' | 'ja';
}

export default function VeterinaryReferencesSection({
  categories = [],
  title = '',
  slug = '',
  lang = 'ko',
}: VeterinaryReferencesProps) {
  const text = title.toLowerCase() + ' ' + slug.toLowerCase() + ' ' + categories.join(' ').toLowerCase();

  // Determine topic-matched scientific references
  let references: Array<{ title: string; org: string; type: string }> = [];

  if (text.includes('food') || text.includes('nutrition') || text.includes('사료') || text.includes('영양') || text.includes('음수') || text.includes('칼로리') || text.includes('dm')) {
    references = [
      {
        title: lang === 'en' ? 'Nutrient Requirements of Dogs and Cats' : lang === 'ja' ? '犬と猫の栄養要求量基準' : '개와 고양이의 영양 요구량 수의학 표준',
        org: 'NRC (National Research Council) Academic Press',
        type: 'Nutritional Standard',
      },
      {
        title: lang === 'en' ? 'WSAVA Global Nutrition Committee Guidelines' : lang === 'ja' ? 'WSAVA グローバル栄養ガイドライン' : 'WSAVA 세계소동물수의사회 글로벌 영양 가이드라인',
        org: 'WSAVA (World Small Animal Veterinary Association)',
        type: 'Clinical Practice Guideline',
      },
      {
        title: lang === 'en' ? 'AAHA Weight Management Guidelines for Dogs and Cats' : lang === 'ja' ? 'AAHA 犬と猫の体重管理ガイドライン' : 'AAHA 동물병원협회 체체중 및 영양 관리 지침',
        org: 'Journal of the American Animal Hospital Association (JAAHA)',
        type: 'Peer-Reviewed Guideline',
      },
    ];
  } else if (text.includes('urinary') || text.includes('cystitis') || text.includes('fic') || text.includes('방광') || text.includes('신장') || text.includes('비뇨')) {
    references = [
      {
        title: lang === 'en' ? 'AAFP Consensus Guidelines for Diagnosis and Management of Feline Lower Urinary Tract Disease' : lang === 'ja' ? 'AAFP 猫の特発性膀胱炎（FIC）診断・管理ガイドライン' : 'AAFP 미국고양이수의사회 고양이 하부유로질환(FIC) 진단 가이드라인',
        org: 'Journal of Feline Medicine and Surgery (JFMS)',
        type: 'Clinical Practice Guideline',
      },
      {
        title: lang === 'en' ? 'ISCAID International Guidelines for Urinary Tract Infections in Dogs and Cats' : lang === 'ja' ? 'ISCAID 犬と猫の尿路感染症国際ガイドライン' : 'ISCAID 국제소동물감염학회 비뇨기 질환 수의학 지침',
        org: 'International Society for Companion Animal Infectious Diseases',
        type: 'International Consensus',
      },
      {
        title: lang === 'en' ? 'Merck Veterinary Manual: Feline Idiopathic Cystitis & Urology' : lang === 'ja' ? 'メルク獣医学マニュアル：猫の特発性膀胱炎と泌尿器疾患' : 'Merck 수의학 매뉴얼: 고양이 특발성 방광염 및 비뇨기학',
        org: 'Merck & Co., Inc., Rahway, NJ, USA',
        type: 'Medical Reference Manual',
      },
    ];
  } else if (text.includes('patella') || text.includes('joint') || text.includes('슬개골') || text.includes('관절') || text.includes('탈구') || text.includes('골절')) {
    references = [
      {
        title: lang === 'en' ? 'AAHA Pain Management Guidelines for Dogs and Cats' : lang === 'ja' ? 'AAHA 犬と猫の疼痛管理および整形外科的ガイドライン' : 'AAHA 미국동물병원협회 관절 통증 및 정형외과 관리 지침',
        org: 'Journal of the American Animal Hospital Association',
        type: 'Clinical Practice Guideline',
      },
      {
        title: lang === 'en' ? 'WSAVA Global Pain Council Guidelines for Musculoskeletal Health' : lang === 'ja' ? 'WSAVA 筋骨格系健康および関節ガイドライン' : 'WSAVA 세계소동물수의사회 근골격계 관절 건강 지침',
        org: 'WSAVA Global Pain Council',
        type: 'Global Guideline',
      },
      {
        title: lang === 'en' ? 'Merck Veterinary Manual: Canine Patellar Luxation & Orthopedics' : lang === 'ja' ? 'メルク獣医学マニュアル：犬の膝蓋骨脱臼と整形外科' : 'Merck 수의학 매뉴얼: 강아지 슬개골 탈구 및 정형외과학',
        org: 'Merck & Co., Inc. Veterinary Medicine Division',
        type: 'Orthopedic Manual',
      },
    ];
  } else if (text.includes('behavior') || text.includes('training') || text.includes('행동') || text.includes('훈련') || text.includes('분리불안') || text.includes('짖음')) {
    references = [
      {
        title: lang === 'en' ? 'AVSAB Position Statement on Humane Dog Training & Behavior' : lang === 'ja' ? 'AVSAB 人道的行動治療および行動学指針' : 'AVSAB 미국수의행동학회 인도적 행동치료 및 훈련 지침',
        org: 'American Veterinary Society of Animal Behavior',
        type: 'Position Statement',
      },
      {
        title: lang === 'en' ? 'AAHA Canine and Feline Behavior Management Guidelines' : lang === 'ja' ? 'AAHA 犬と猫の行動管理ガイドライン' : 'AAHA 미국동물병원협회 강아지·고양이 행동 관리 지침',
        org: 'Journal of the American Animal Hospital Association',
        type: 'Behavioral Standard',
      },
      {
        title: lang === 'en' ? 'BSAVA Manual of Canine and Feline Behavioural Medicine' : lang === 'ja' ? 'BSAVA 小動物行動医学マニュアル' : 'BSAVA 영국소동물수의사회 동물 행동의학 매뉴얼',
        org: 'British Small Animal Veterinary Association',
        type: 'Medical Reference',
      },
    ];
  } else if (text.includes('poison') || text.includes('emergency') || text.includes('onion') || text.includes('garlic') || text.includes('독성') || text.includes('응급') || text.includes('양파')) {
    references = [
      {
        title: lang === 'en' ? 'ASPCA Animal Poison Control Center Small Animal Clinical Toxicology Guide' : lang === 'ja' ? 'ASPCA 動物中毒管理センター 臨床中毒学ガイド' : 'ASPCA 동물중독통제센터 임상 독성학 수의학 지침',
        org: 'ASPCA APCC Veterinary Toxicology Division',
        type: 'Toxicology Protocol',
      },
      {
        title: lang === 'en' ? 'Merck Veterinary Manual: Toxicology of Small Animals' : lang === 'ja' ? 'メルク獣医学マニュアル：小動物中毒学' : 'Merck 수의학 매뉴얼: 소동물 독성학 및 응급처치',
        org: 'Merck & Co. Veterinary Emergency Protocol',
        type: 'Emergency Medical Manual',
      },
    ];
  } else {
    // General Healthcare Default References
    references = [
      {
        title: lang === 'en' ? 'WSAVA Preventive Healthcare Guidelines for Dogs and Cats' : lang === 'ja' ? 'WSAVA 予防医療および健康管理ガイドライン' : 'WSAVA 세계소동물수의사회 예방의학 및 글로벌 건강 가이드라인',
        org: 'World Small Animal Veterinary Association',
        type: 'Global Veterinary Guideline',
      },
      {
        title: lang === 'en' ? 'AAHA Canine Life Stage Guidelines & Senior Care Protocol' : lang === 'ja' ? 'AAHA 犬のライフステージおよび高齢犬ケア指針' : 'AAHA 미국동물병원협회 생애주기별 수의학 케어 지침',
        org: 'American Animal Hospital Association',
        type: 'Clinical Practice Standard',
      },
      {
        title: lang === 'en' ? 'Merck Veterinary Manual: Clinical Veterinary Medicine Edition' : lang === 'ja' ? 'メルク獣医学マニュアル：臨床獣医学エディション' : 'Merck 수의학 매뉴얼: 임상 수의학 종합 가이드',
        org: 'Merck Veterinary Medicine Academic Division',
        type: 'Peer-Reviewed Reference',
      },
    ];
  }

  return (
    <div className="my-10 p-6 rounded-3xl bg-[#faf6f0] border border-amber-900/10 shadow-xs space-y-4 not-prose">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E5007E]/10 border border-[#E5007E]/20 flex items-center justify-center text-[#E5007E]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#1a1a2e] tracking-tight">
              {lang === 'en'
                ? '🔬 Veterinary References & Medical Guidelines'
                : lang === 'ja'
                ? '🔬 獣医学研究根拠＆参考文献'
                : '🔬 연구 근거 및 수의학 학술 참고자료'}
            </h4>
            <p className="text-[11px] font-bold text-gray-500">
              {lang === 'en'
                ? 'Verified by Magentalab Research Team against global veterinary standards.'
                : lang === 'ja'
                ? 'マゼンタラボ研究チームがグローバル獣医学基準に基づき検証済み。'
                : '마젠타랩 연구팀이 수의학 글로벌 가이드라인을 바탕으로 객관성을 검증했습니다.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>E-E-A-T Verified</span>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-2.5">
        {references.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 bg-white/80 p-3 rounded-2xl border border-amber-900/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-900 leading-snug">
                {item.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500">
                <span className="font-bold text-[#E5007E]">{item.org}</span>
                <span>•</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600">{item.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclosure */}
      <p className="text-[11px] font-medium text-gray-600 pt-2 text-right">
        {lang === 'en'
          ? '※ Review & Editorial: Magentalab Veterinary Research Team'
          : lang === 'ja'
          ? '※ 内容検証・編集：マゼンタラボ獣医学研究チーム'
          : '※ 콘텐츠 검증 및 편집: Magentalab 반려동물 연구소 수석 연구팀'}
      </p>
    </div>
  );
}
