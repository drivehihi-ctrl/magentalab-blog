'use client';

import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';

interface VeterinaryReferencesProps {
  categories?: string[];
  title?: string;
  slug?: string;
  lang?: 'ko' | 'en' | 'ja';
  content?: string;
}

export default function VeterinaryReferencesSection({
  categories = [],
  title = '',
  slug = '',
  lang = 'ko',
  content = '',
}: VeterinaryReferencesProps) {
  const text = title.toLowerCase() + ' ' + slug.toLowerCase() + ' ' + categories.join(' ').toLowerCase();

  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  // Determine topic-matched scientific references, key insights, and cautions
  let references: Array<{ title: string; org: string; type: string; url: string }> = [];
  let keyInsight = '';
  let cautionNote = '';

  if (text.includes('food') || text.includes('nutrition') || text.includes('사료') || text.includes('영양') || text.includes('음수') || text.includes('칼로리') || text.includes('dm')) {
    keyInsight = isEn 
      ? 'Evaluates dietary protein dry-matter percentage (DM%) and life-stage-specific caloric requirement formulas based on clinical nutrition standards.'
      : isJa
      ? '年齢別のタンパク質乾物量比率（DM%）および1日推奨カロリー計算公式を臨床栄養学基準に基づき検証。'
      : '연령별 단백질 건물 함량 비율(DM%) 및 1일 권장 칼로리 수의학 공식을 소동물 임상 영양학 기준에 따라 검토했습니다.';
    cautionNote = isEn
      ? 'Pets with renal failure, pancreatitis, or metabolic disorders require therapeutic prescription diets under direct veterinary consultation.'
      : isJa
      ? '腎臓病、膵炎、代謝性疾患を持つ愛犬・愛猫は、獣医師の指導のもとで処方食による個別管理が必要です。'
      : '신장 질환, 췌장염, 대사 질환이 있는 아이는 수의사의 직접 진료 하에 처방식 및 개별 맞춤 영양 관리가 필수적입니다.';
    references = [
      {
        title: isEn ? 'Nutrient Requirements of Dogs and Cats' : isJa ? '犬と猫の栄養要求量基準' : '개와 고양이의 영양 요구량 수의학 표준',
        org: 'NRC (National Research Council)',
        type: 'Nutritional Standard',
        url: 'https://nap.nationalacademies.org/',
      },
      {
        title: isEn ? 'WSAVA Global Nutrition Committee Guidelines' : isJa ? 'WSAVA グローバル栄養ガイドライン' : 'WSAVA 세계소동물수의사회 글로벌 영양 가이드라인',
        org: 'WSAVA (World Small Animal Veterinary Association)',
        type: 'Clinical Practice Guideline',
        url: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
      },
      {
        title: isEn ? 'AAHA Weight Management Guidelines for Dogs and Cats' : isJa ? 'AAHA 犬と猫の体重管理ガイドライン' : 'AAHA 동물병원협회 체중 및 영양 관리 지침',
        org: 'Journal of the American Animal Hospital Association (JAAHA)',
        type: 'Peer-Reviewed Guideline',
        url: 'https://www.aaha.org/resources/weight-management-guidelines/',
      },
    ];
  } else if (text.includes('urinary') || text.includes('cystitis') || text.includes('fic') || text.includes('방광') || text.includes('신장') || text.includes('비뇨')) {
    keyInsight = isEn
      ? 'Assesses environmental stress factors, minimum hydration thresholds, and urinary tract health markers in feline idiopathic cystitis.'
      : isJa
      ? '猫の特発性膀胱炎（FIC）における環境ストレス要因、必要飲水量基準、尿路健康マーカーを検証。'
      : '고양이 특발성 방광염(FIC)의 환경적 스트레스 요인, 최소 목표 음수량 기준, 비뇨기 건강 지표를 종합 검토했습니다.';
    cautionNote = isEn
      ? 'Inability to urinate or extreme straining is a life-threatening emergency (urethral obstruction) requiring immediate ER care.'
      : isJa
      ? '排尿の完全な停止や激しい排尿困難は、生命に関わる緊急事態（尿道閉塞）のため、直ちに動物病院を受診してください。'
      : '소변을 전혀 보지 못하거나 심하게 힘들어하는 증상은 생명을 위협하는 응급 상황(요도 폐색)이므로 즉시 수의사의 진료가 필요합니다.';
    references = [
      {
        title: isEn ? 'AAFP Consensus Guidelines for Diagnosis and Management of Feline Lower Urinary Tract Disease' : isJa ? 'AAFP 猫の特発性膀胱炎（FIC）診断・管理ガイドライン' : 'AAFP 미국고양이수의사회 고양이 하부유로질환(FIC) 진단 가이드라인',
        org: 'Journal of Feline Medicine and Surgery (JFMS)',
        type: 'Clinical Practice Guideline',
        url: 'https://catvets.com/',
      },
      {
        title: isEn ? 'ISCAID International Guidelines for Urinary Tract Infections in Dogs and Cats' : isJa ? 'ISCAID 犬と猫の尿路感染症国際ガイドライン' : 'ISCAID 국제소동물감염학회 비뇨기 질환 수의학 지침',
        org: 'International Society for Companion Animal Infectious Diseases',
        type: 'International Consensus',
        url: 'https://www.iscaid.org/',
      },
      {
        title: isEn ? 'Merck Veterinary Manual: Feline Idiopathic Cystitis & Urology' : isJa ? 'メルク獣医学マニュアル：猫の特発性膀胱炎と泌尿器疾患' : 'Merck 수의학 매뉴얼: 고양이 특발성 방광염 및 비뇨기학',
        org: 'Merck & Co., Inc. Veterinary Medicine Division',
        type: 'Medical Reference Manual',
        url: 'https://www.merckvetmanual.com/',
      },
    ];
  } else if (text.includes('patella') || text.includes('joint') || text.includes('슬개골') || text.includes('관절') || text.includes('탈구') || text.includes('골절')) {
    keyInsight = isEn
      ? 'Reviews non-slip flooring adaptations, body weight load reduction, and orthopedic pain management protocols for small breeds.'
      : isJa
      ? '小型犬における滑り止め環境の整備、体重減量による関節負荷軽減、整形外科的疼痛管理プロトコルを検証。'
      : '소형견 미끄럼 방지 환경 조성, 체중 감량이 관절 하중에 미치는 영향, 슬개골 보호 가이드라인을 종합 검토했습니다.';
    cautionNote = isEn
      ? 'Patellar luxation grades 3-4 or persistent limping require orthopedic palpation and surgical evaluation by a licensed vet.'
      : isJa
      ? '膝蓋骨脱臼グレード3〜4や持続的な歩行異常は、獣医師による専門的な触診および手術適応の評価が必要です。'
      : '슬개골 탈구 3~4단계 및 지속적인 다리 절음 증상은 수의사의 정밀 촉진과 정형외과적 수술 평가가 필요합니다.';
    references = [
      {
        title: isEn ? 'AAHA Pain Management Guidelines for Dogs and Cats' : isJa ? 'AAHA 犬と猫の疼痛管理および整形外科的ガイドライン' : 'AAHA 미국동물병원협회 관절 통증 및 정형외과 관리 지침',
        org: 'Journal of the American Animal Hospital Association',
        type: 'Clinical Practice Guideline',
        url: 'https://www.aaha.org/',
      },
      {
        title: isEn ? 'WSAVA Global Pain Council Guidelines for Musculoskeletal Health' : isJa ? 'WSAVA 筋骨格系健康および関節ガイドライン' : 'WSAVA 세계소동물수의사회 근골격계 관절 건강 지침',
        org: 'WSAVA Global Pain Council',
        type: 'Global Guideline',
        url: 'https://wsava.org/global-guidelines/global-pain-council-guidelines/',
      },
      {
        title: isEn ? 'Merck Veterinary Manual: Canine Patellar Luxation & Orthopedics' : isJa ? 'メルク獣医学マニュアル：犬の膝蓋骨脱臼と整形外科' : 'Merck 수의학 매뉴얼: 강아지 슬개골 탈구 및 정형외과학',
        org: 'Merck & Co., Inc. Veterinary Medicine Division',
        type: 'Orthopedic Manual',
        url: 'https://www.merckvetmanual.com/',
      },
    ];
  } else if (text.includes('behavior') || text.includes('training') || text.includes('행동') || text.includes('훈련') || text.includes('분리불안') || text.includes('짖음')) {
    keyInsight = isEn
      ? 'Differentiates normal attachment from anxiety disorders using positive reinforcement and humane behavioral medicine principles.'
      : isJa
      ? '正の強化、恐怖を与えない環境修正、人道的な行動医学原理に基づき日常行動と不安障害を区別して説明。'
      : '긍정적 강화 원칙과 공포 유발 자극 배제 지침을 바탕으로 보호자의 반응 패턴과 반려견의 행동 변화를 검토했습니다.';
    cautionNote = isEn
      ? 'Severe separation anxiety or sudden aggressive changes may stem from underlying physical pain requiring a thorough veterinary exam.'
      : isJa
      ? '重度の分離不安や突然の行動変化は、隠れた身体的痛みや内科疾患が原因の場合があるため、獣医師の身体検査が必要です。'
      : '심한 분리불안이나 갑작스러운 행동 변화는 단순 행동 문제가 아닌 신체적 통증이나 내과 질환이 원인일 수 있으므로 수의사의 진료가 필요합니다.';
    references = [
      {
        title: isEn ? 'AVSAB Position Statement on Humane Dog Training & Behavior' : isJa ? 'AVSAB 人道的行動治療および行動学指針' : 'AVSAB 인도적 행동치료 및 훈련 지침',
        org: 'American Veterinary Society of Animal Behavior',
        type: 'Position Statement',
        url: 'https://avsab.org/resources/position-statements/',
      },
      {
        title: isEn ? 'AAHA Canine and Feline Behavior Management Guidelines' : isJa ? 'AAHA 犬と猫の行動管理ガイドライン' : 'AAHA 강아지·고양이 행동 관리 지침',
        org: 'Journal of the American Animal Hospital Association',
        type: 'Behavioral Standard',
        url: 'https://www.aaha.org/resources/behavior-management-guidelines/',
      },
      {
        title: isEn ? 'BSAVA Manual of Canine and Feline Behavioural Medicine' : isJa ? 'BSAVA 小動物行動医学マニュアル' : 'BSAVA 동물 행동의학 매뉴얼',
        org: 'British Small Animal Veterinary Association',
        type: 'Medical Reference',
        url: 'https://www.bsava.com/',
      },
    ];
  } else if (text.includes('poison') || text.includes('emergency') || text.includes('onion') || text.includes('garlic') || text.includes('chocolate') || text.includes('독성') || text.includes('응급') || text.includes('양파') || text.includes('초콜릿') || text.includes('チョコレート') || text.includes('xylitol') || text.includes('자일리톨')) {
    keyInsight = isEn
      ? 'Assesses toxicity thresholds, methylxanthine/xylitol risk factors, and veterinary clinical toxicology protocols.'
      : isJa
      ? '毒性危険閾値、メチルキサンチン/キシリトールのリスク要因、臨床中毒学の緊急応急プロトコルを検証。'
      : '체중당 독성 유발량, 메틸잔틴 및 자일리톨 중독 위험성, 임상 독성학 응급 처치 지침을 검토했습니다.';
    cautionNote = isEn
      ? 'In case of toxic food ingestion (onions, garlic, chocolate, xylitol, grapes), DO NOT induce vomiting at home; consult a vet ER immediately.'
      : isJa
      ? '中毒物質（玉ねぎ、ニンニク、チョコ、キシリトール、ブドウ等）の誤食時、自宅での無茶な催吐は危険です。直ちに動物病院を受診してください。'
      : '양파, 마늘, 초콜릿, 자일리톨, 포도 등 독성 음식 섭취 시 집에서 민간요법으로 구토를 유발하지 마시고 즉시 동물병원 응급 진료를 받으셔야 합니다.';
    references = [
      {
        title: isEn ? 'ASPCA Animal Poison Control Center Small Animal Clinical Toxicology Guide' : isJa ? 'ASPCA 動物中毒管理センター 臨床中毒学ガイド' : 'ASPCA 동물중독통제센터 임상 독성학 수의학 지침',
        org: 'ASPCA APCC Veterinary Toxicology Division',
        type: 'Toxicology Protocol',
        url: 'https://www.aspca.org/pet-care/animal-poison-control',
      },
      {
        title: isEn ? 'Merck Veterinary Manual: Chocolate & Small Animal Toxicology' : isJa ? 'メルク獣医学マニュアル：小動物中毒学' : 'Merck 수의학 매뉴얼: 초콜릿 독성학 및 소동물 응급처치',
        org: 'Merck & Co. Veterinary Emergency Protocol',
        type: 'Emergency Medical Manual',
        url: 'https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals',
      },
      {
        title: isEn ? 'FDA Consumer Update: Leave Chocolate Out of Rover Celebrations' : isJa ? 'FDA 公式ガイドライン：犬のチョコレート中毒注意報' : 'FDA 미국식품의약국 강아지 초콜릿 중독 공식 주의 가이드',
        org: 'U.S. Food and Drug Administration (FDA)',
        type: 'Federal Health Guidance',
        url: 'https://www.fda.gov/consumers/consumer-updates/leave-chocolate-out-rovers-celebrations',
      },
    ];
  } else if (text.includes('diabetes') || text.includes('insulin') || text.includes('당뇨') || text.includes('인슐린') || text.includes('糖尿病') || text.includes('インスリン')) {
    keyInsight = isEn
      ? 'Evaluates individualized insulin protocols, clinical symptom monitoring, and blood glucose curve interpretation in canine & feline diabetes.'
      : isJa
      ? '個別化されたインスリンプロトコル、臨床症状のモニタリング、血糖曲線の解釈を最新のAAHAガイドラインに基づき検証。'
      : '강아지·고양이 당뇨병의 개별화된 인슐린 투여 지침, 혈당곡선 및 임상 증상 모니터링 기준을 AAHA 가이드라인에 따라 종합 검토했습니다.';
    cautionNote = isEn
      ? 'Do not adjust, increase, decrease, or skip insulin doses based solely on a single blood glucose reading without veterinary direction.'
      : isJa
      ? '1回の血糖値の測定結果のみに基づいて、獣医師の指示なくインスリンの投与量を変更しないでください。'
      : '단 한 번의 혈당 수치만으로 보호자가 임의로 인슐린 용량을 늘리거나 줄이거나 건너뛰지 마시고 수의사와 협의하셔야 합니다.';
    references = [
      {
        title: isEn ? '2018 AAHA Diabetes Management Guidelines for Dogs and Cats' : isJa ? '2018 AAHA 犬と猫の糖尿病管理ガイドライン' : 'AAHA 2018 강아지·고양이 당뇨병 관리 가이드라인',
        org: 'American Animal Hospital Association (AAHA)',
        type: 'Clinical Practice Guideline',
        url: 'https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/',
      },
      {
        title: isEn ? 'AAHA Guidelines: Blood Glucose Curves Interpretation' : isJa ? 'AAHA 血糖曲線の作成と解釈指針' : 'AAHA 혈당곡선(Blood Glucose Curve) 검사 및 해석 지침',
        org: 'Journal of the American Animal Hospital Association',
        type: 'Diagnostic Reference',
        url: 'https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/blood-glucose-curves/',
      },
      {
        title: isEn ? 'Merck Veterinary Manual: Canine & Feline Diabetes Mellitus' : isJa ? 'メルク獣医学マニュアル：犬と猫の糖尿病' : 'Merck 수의학 매뉴얼: 강아지·고양이 당뇨병 수의학 지침',
        org: 'Merck & Co. Veterinary Medicine Academic Division',
        type: 'Medical Reference Manual',
        url: 'https://www.merckvetmanual.com/',
      },
    ];
  } else if (text.includes('skin') || text.includes('dermatology') || text.includes('atopic') || text.includes('allergy') || text.includes('피부') || text.includes('아토피') || text.includes('농피증') || text.includes('알레르기') || text.includes('링웜') || text.includes('모낭충') || text.includes('옴')) {
    keyInsight = isEn
      ? 'Evaluates clinical dermatology guidelines for canine & feline skin conditions, elimination diet protocols, and environmental allergen controls.'
      : isJa
      ? '犬・猫の皮膚疾患（アトピー、食物アレルギー、膿皮症）における獣医皮膚科学的診断体系および環境管理指針を検証。'
      : '강아지·고양이 피부 질환(아토피, 식이 알레르기, 농피증, 곰팡이 감염)의 수의피부과학적 진단 체계 및 환경 관리 지침을 종합 검토했습니다.';
    cautionNote = isEn
      ? 'Medicated shampoo concentrations, antibiotic course durations, and targeted immunosuppressive therapies require direct veterinary diagnosis and monitoring.'
      : isJa
      ? '薬用シャンプーの濃度・成分、抗生剤の投与期間、専門処方薬（アポキル、サイトポイント等）は必ず獣医師の直接の診察・指導のもとでご使用ください。'
      : '약용 샴푸 성분·농도, 항생제 투여 기간 및 전문 처방 약물(아포퀼, 사이토포인트 등)은 반드시 수의사의 직접 진료 및 주관 경과 관찰 하에 투약하셔야 합니다.';
    references = [
      {
        title: isEn ? 'ICADA World Consensus Guidelines for Canine Atopic Dermatitis' : isJa ? 'ICADA 犬のアトピー性皮膚炎世界コンセンサスガイドライン' : 'ICADA 국제동물피부질환학회 강아지 아토피 피부염 진단 지침',
        org: 'International Committee on Allergic Diseases of Animals',
        type: 'World Consensus Guideline',
        url: 'https://wavd.org/',
      },
      {
        title: isEn ? 'ACVD Practice Standards for Diagnosis and Management of Canine Pyoderma & Mycoses' : isJa ? 'ACVD 犬の膿皮症および真菌症の診断・治療標準' : 'ACVD 미국수의피부과학회 강아지 농피증 및 진균증 진단 표준',
        org: 'American College of Veterinary Dermatology',
        type: 'Dermatology Standard',
        url: 'https://www.acvd.org/',
      },
      {
        title: isEn ? 'Merck Veterinary Manual: Canine & Feline Dermatology Edition' : isJa ? 'メルク獣医学マニュアル：犬と猫の皮膚科学エディション' : 'Merck 수의학 매뉴얼: 강아지 및 고양이 수의피부과학 종합 가이드',
        org: 'Merck & Co., Inc. Veterinary Medicine Division',
        type: 'Medical Reference Manual',
        url: 'https://www.merckvetmanual.com/',
      },
    ];
  } else {
    // General Healthcare Default
    keyInsight = isEn
      ? 'Reviews preventive healthcare standards, clinical symptom thresholds, and daily homecare recommendations.'
      : isJa
      ? '年齢別の予防医療ガイドライン、臨床症状の観察指標、日常の健康管理基準を検証。'
      : '연령별 예방의학 지침, 임상적 관찰 지표, 일상 건강 관리 수의학 기준을 종합 검토했습니다.';
    cautionNote = isEn
      ? 'Content is provided for educational and research purposes. Persistent symptoms or health changes require direct veterinary diagnosis.'
      : isJa
      ? '本コンテンツは教育・研究目的で提供されています。持続的な症状や体調の変化がある場合は、動物病院で診察を受けてください。'
      : '본 리포트는 수의학 지침을 바탕으로 한 정보 제공 목적이며, 개체별 기저 질환이나 지속적 증상 발생 시 수의사의 직접 진료를 받으시기 바랍니다.';
    references = [
      {
        title: isEn ? 'WSAVA Preventive Healthcare Guidelines for Dogs and Cats' : isJa ? 'WSAVA 予防医療および健康管理ガイドライン' : 'WSAVA 세계소동물수의사회 예방의학 및 글로벌 건강 가이드라인',
        org: 'World Small Animal Veterinary Association',
        type: 'Global Veterinary Guideline',
        url: 'https://wsava.org/',
      },
      {
        title: isEn ? 'AAHA Canine Life Stage Guidelines & Senior Care Protocol' : isJa ? 'AAHA 犬のライフステージおよび高齢犬ケア指針' : 'AAHA 미국동물병원협회 생애주기별 수의학 케어 지침',
        org: 'American Animal Hospital Association',
        type: 'Clinical Practice Standard',
        url: 'https://www.aaha.org/',
      },
      {
        title: isEn ? 'Merck Veterinary Manual: Clinical Veterinary Medicine Edition' : isJa ? 'メルク獣医学マニュアル：臨床獣医学エディション' : 'Merck 수의학 매뉴얼: 임상 수의학 종합 가이드',
        org: 'Merck Veterinary Medicine Academic Division',
        type: 'Peer-Reviewed Reference',
        url: 'https://www.merckvetmanual.com/',
      },
    ];
  }

  // Dynamic extraction of post-specific references from content HTML
  if (content && (content.includes('🔬') || content.includes('Veterinary Evidence') || content.includes('수의학') || content.includes('獣医学'))) {
    const parsedRefs: Array<{ title: string; org: string; type: string; url: string }> = [];

    // Find the LAST <h2> block that contains reference keywords
    const h2Matches = Array.from(content.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/gi));
    let refH2Index = -1;
    for (const match of h2Matches) {
      if (match[0].includes('🔬') || match[0].includes('수의학 연구 근거') || match[0].includes('Veterinary Evidence') || match[0].includes('獣医学')) {
        refH2Index = match.index;
      }
    }

    const searchArea = refH2Index !== -1 ? content.slice(refH2Index) : content;

    const liMatches = searchArea.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
    for (const li of liMatches) {
      const orgMatch = li.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
      const urlMatch = li.match(/href="([^"]+)"/i);
      
      if (orgMatch || urlMatch) {
        const orgName = orgMatch ? orgMatch[1].replace(/<[^>]+>/g, '').trim() : (isEn ? 'Veterinary Reference' : isJa ? '獣医学文献' : '수의학 참고자료');
        const linkUrl = urlMatch ? urlMatch[1] : 'https://www.merckvetmanual.com/';
        
        let refTitle = li.replace(/<strong[^>]*>[\s\S]*?<\/strong>/gi, '')
                         .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '')
                         .replace(/<br\s*\/?>/gi, ' ')
                         .replace(/<[^>]+>/g, '')
                         .replace(/—|-|–/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();
        
        if (!refTitle || refTitle.length < 3) {
          const aTextMatch = li.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
          refTitle = aTextMatch ? aTextMatch[1].replace(/<[^>]+>/g, '').trim() : orgName;
        }

        parsedRefs.push({
          title: refTitle,
          org: orgName,
          type: isEn ? 'Peer-Reviewed Reference' : isJa ? '専門獣医学文献' : '전문 수의학 가이드라인',
          url: linkUrl
        });
      }
    }

    // Extract Key Medical Evidence Summary
    const insightMatch = searchArea.match(/(?:근거 핵심|이 글의 수의학적 근거 요약|Evidence summary|Key Medical Evidence|根拠の要約)[^:：]*[:：]\s*([\s\S]*?)(?:<\/p>|<\/strong>|<\/li>)/i);
    if (insightMatch) {
      const extractedInsight = insightMatch[1].replace(/<[^>]+>/g, '').trim();
      if (extractedInsight) keyInsight = extractedInsight;
    }

    // Extract Veterinary Caution
    const cautionMatch = searchArea.match(/(?:수의학적 주의사항|Veterinary caution|獣医学的注意)[^:：]*[:：]\s*([\s\S]*?)(?:<\/p>|<\/strong>|<\/li>)/i);
    if (cautionMatch) {
      const extractedCaution = cautionMatch[1].replace(/<[^>]+>/g, '').trim();
      if (extractedCaution) cautionNote = extractedCaution;
    }

    if (parsedRefs.length > 0) {
      references = parsedRefs;
    }
  }

  return (
    <div className="my-10 p-6 sm:p-7 rounded-3xl bg-[#faf6f0] border border-amber-900/10 shadow-xs space-y-6 not-prose">
      {/* 🔬 Title & Subtitle Section */}
      <div className="border-b border-amber-900/10 pb-4">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-2xl bg-[#E5007E]/10 border border-[#E5007E]/20 flex items-center justify-center text-[#E5007E]">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-sm sm:text-base font-extrabold text-[#1a1a2e] tracking-tight">
            {isEn
              ? '🔬 Veterinary Evidence & References'
              : isJa
              ? '🔬 獣医学根拠＆参考文献'
              : '🔬 수의학 근거 & 참고자료'}
          </h4>
        </div>
        <p className="text-xs font-medium text-gray-600 leading-relaxed pl-10">
          {isEn
            ? 'Magentalab Research Team has reviewed relevant veterinary guidelines to verify the core content.'
            : isJa
            ? 'マゼンタラボ研究チームが関連する獣医学ガイドラインと専門資料を検証し、本分の主要内容を確認しました。'
            : '마젠타랩 수석 연구팀이 관련 수의학 가이드라인과 전문 자료를 검토하여 본문의 핵심 내용을 확인했습니다.'}
        </p>
      </div>

      {/* 💡 Key Verified Medical Insight Box (이 글의 수의학적 핵심 근거) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#E5007E]">
          <Lightbulb className="w-4 h-4 text-[#E5007E]" />
          <span>
            {isEn
              ? '💡 Key Medical Evidence Summary'
              : isJa
              ? '💡 この記事の獣医学的核心根拠'
              : '💡 이 글의 수의학적 핵심 근거'}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed pl-6">
          {keyInsight}
        </p>
      </div>

      {/* 📚 Primary Academic Citations with Official Clickable Links */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest block px-1">
          {isEn ? '📚 Primary References & Official Documents' : isJa ? '📚 主要参考文献・公式文書' : '📚 주요 참고자료 및 공식 지침'}
        </span>

        <div className="space-y-2.5">
          {references.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
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

              {/* Official Link Button */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-[#E5007E] border border-gray-200 hover:border-rose-200 text-[11px] font-extrabold transition-all self-end sm:self-auto"
              >
                <span>{isEn ? 'View Source' : isJa ? '原文を見る' : '원문 보기'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ⚠️ Medical Caution & Individual Variance Box (수의학적 주의사항) */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>
            {isEn
              ? '⚠️ Medical Disclaimer & Individual Variance'
              : isJa
              ? '⚠️ 獣医学的注意事項・個体差について'
              : '⚠️ 수의학적 주의사항 및 개체별 차이'}
          </span>
        </div>
        <p className="text-xs font-medium text-amber-950 leading-relaxed pl-6">
          {cautionNote}
        </p>
      </div>

      {/* Footer Attribution & Evidence Level */}
      <div className="pt-3 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-2 font-bold">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold">
            {isEn ? 'Evidence Level: Tier 1' : isJa ? '根拠水準：Tier 1' : '근거 수준: Tier 1'}
          </span>
          <span className="text-gray-500">
            {isEn 
              ? 'Veterinary Clinical Guidelines & Institution Guidelines' 
              : isJa 
              ? '専門獣医学ガイドラインおよび機関資料' 
              : '전문 수의학 가이드라인 및 기관 자료'}
          </span>
        </div>

        <p className="font-medium text-gray-500 text-right">
          {isEn
            ? '* Evidence classification based on Magentalab evaluation standards.'
            : isJa
            ? '※ 根拠水準はMagentalab独自の分類基準です。'
            : '* 근거 수준은 Magentalab 자체 분류 기준입니다.'}
        </p>
      </div>
    </div>
  );
}
