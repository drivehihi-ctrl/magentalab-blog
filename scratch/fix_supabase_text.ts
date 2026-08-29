import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const text = `평소 분홍색이던 강아지 혀나 잇몸이 갑자기 파랗거나 보라색으로 변하면, 혈액의 산소화가 크게 떨어진 청색증 가능성을 생각해야 합니다.
청색증은 이첨판 폐쇄부전증(MMVD) 하나의 증상이 아닙니다. 상기도 폐쇄, 폐질환, 심장·순환 문제, 심한 열 스트레스 등 여러 상황에서 나타날 수 있어 원인을 집에서 단정하면 안 됩니다.
혀 색 변화와 함께 목을 뻗고 숨 쉬기, 복부까지 크게 움직이는 호흡, 편하게 눕지 못함, 쓰러짐이나 의식 변화가 보이면 원인을 검색하며 기다리기보다 응급 동물병원 평가를 우선해야 합니다.

F. “산책 중 아이 혀가 갑자기 보라색으로 보이면 보호자님 머릿속도 순간 하얘질 수 있어요. 안심이가 꼭 기억하셨으면 하는 건 하나예요. 병명을 맞히려고 애쓰기보다, 지금 우리 아이가 편하게 숨을 쉬고 있는지를 먼저 봐주세요.”`;

  const { data, error } = await supabase
    .from('ai_revisions')
    .update({ new_ansim_summary: text })
    .eq('revision_id', 'rev_22a8d9a24d9d2f3e');
    
  if (error) console.error(error);
  else console.log('Successfully updated new_ansim_summary');
}
fix();
