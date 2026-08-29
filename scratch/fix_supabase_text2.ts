import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const ansimSummary = `1. 평소 분홍색이던 강아지 혀나 잇몸이 갑자기 파랗거나 보라색으로 변하면, 혈액의 산소화가 크게 떨어진 청색증 가능성을 생각해야 합니다.
2. 청색증은 이첨판 폐쇄부전증(MMVD) 하나의 증상이 아닙니다. 상기도 폐쇄, 폐질환, 심장·순환 문제, 심한 열 스트레스 등 여러 상황에서 나타날 수 있어 원인을 집에서 단정하면 안 됩니다.
3. 혀 색 변화와 함께 목을 뻗고 숨 쉬기, 복부까지 크게 움직이는 호흡, 편하게 눕지 못함, 쓰러짐이나 의식 변화가 보이면 원인을 검색하며 기다리기보다 응급 동물병원 평가를 우선해야 합니다.

“산책 중 아이 혀가 갑자기 보라색으로 보이면 보호자님 머릿속도 순간 하얘질 수 있어요. 안심이가 꼭 기억하셨으면 하는 건 하나예요. 병명을 맞히려고 애쓰기보다, 지금 우리 아이가 편하게 숨을 쉬고 있는지를 먼저 봐주세요.”`;

  const evidence = {
    keyInsight: "청색증은 특정 심장질환 하나를 뜻하는 진단명이 아니라, 점막에 청색·회색빛이 나타날 정도로 산소화가 심하게 저하됐음을 시사하는 임상 신호입니다. Merck Veterinary Manual은 호흡곤란이 진행할 때 빠르고 힘든 호흡, 자세 변화, 개구호흡과 함께 점막이 회색·푸른색으로 변할 수 있으며, 이러한 변화는 심각한 폐 기능 저하와 호흡정지에 앞서 나타날 수 있다고 설명합니다.",
    cautionNote: "평소 분홍색이던 혀·잇몸이 갑자기 파랗거나 회색으로 변하면서 호흡곤란, 쓰러짐, 의식 변화가 있다면 집에서 미온수 분무, 산소 유도 자세, 독성물질 배제 같은 처치를 반복하며 시간을 보내지 마세요. 강아지를 과도하게 움직이거나 억지로 눕히지 말고, 가능한 한 스트레스를 줄인 상태에서 즉시 응급 진료를 받아야 합니다. 심한 호흡곤란 환자는 검사보다 먼저 산소화와 안정화가 필요할 수 있습니다.",
    references: [
      {
        title: "Clinical Signs of Respiratory Disease in Animals",
        org: "Merck Veterinary Manual",
        type: "Veterinary Manual",
        url: "https://www.merckvetmanual.com/respiratory-system/respiratory-system-introduction/clinical-signs-of-respiratory-disease-in-animals"
      },
      {
        title: "Initial Triage and Resuscitation of Small Animal Emergency Patients",
        org: "Merck Veterinary Manual",
        type: "Veterinary Manual",
        url: "https://www.merckvetmanual.com/emergency-medicine-and-critical-care/evaluation-and-initial-treatment-of-small-animal-emergency-patients/initial-triage-and-resuscitation-of-small-animal-emergency-patients"
      },
      {
        title: "Heatstroke in Pets: Signs, Risks, and What to Do",
        org: "AAHA",
        type: "Clinical Education Article",
        url: "https://www.aaha.org/resources/heatstroke-in-pets/"
      }
    ]
  };

  const { data, error } = await supabase
    .from('ai_revisions')
    .update({ 
      new_ansim_summary: ansimSummary,
      evidence: evidence
    })
    .eq('revision_id', 'rev_22a8d9a24d9d2f3e');
    
  if (error) console.error(error);
  else console.log('Successfully updated strict data entry');
}
fix();
