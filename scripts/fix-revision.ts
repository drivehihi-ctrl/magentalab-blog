import { supabaseAdmin } from '../lib/supabase-admin';

async function updateSummary() {
  try {
    const revisionId = 'rev_5de08baba271a2a9';
    const newSummary = `1. 강아지 만성신장병(CKD)에서는 식이 인을 조절하는 것이 중요한 관리 축이지만, 모든 강아지에게 DM 인 0.3~0.5% 이하 같은 하나의 숫자를 적용해 사료를 고르는 방식은 적절하지 않습니다. CKD 단계와 실제 혈중 인 수치, 식욕·체중·근육 상태를 함께 봐야 합니다.
2. 뼈와 뼈가 많이 포함된 간식은 인과 칼슘이 많은 경우가 있어 CKD 강아지에게 적합하지 않을 수 있습니다. 그렇다고 붉은 고기 전체 금지, 흰살생선은 무조건 안전처럼 식재료 색깔로 판단해서도 안 됩니다. 신장 식단은 전체 영양 구성과 실제 섭취량이 더 중요합니다.
3. 신장 처방식은 단순한 ‘저인 사료’가 아니라 인·단백질·에너지 등 여러 요소를 CKD 환자에게 맞춘 식단입니다. 식이 조절만으로 혈중 인 목표가 유지되지 않을 때 인결합제를 고려할 수 있지만, 보호자가 임의로 시작하거나 양을 조절하는 약은 아닙니다.

신장병 진단을 받고 나면 사료 봉투 뒤 숫자 하나도 무섭게 느껴지죠. ‘이 인 수치가 높은 건 아닐까, 간식 한 조각 때문에 더 나빠지는 건 아닐까’ 싶어질 수 있어요. 안심이가 숫자를 더 많이 외우게 하기보다, 어떤 숫자를 왜 보고 어디까지 보호자가 판단해도 되는지부터 차근차근 정리해볼게요.`;

    const { error } = await supabaseAdmin
      .from('ai_revisions')
      .update({ new_ansim_summary: newSummary })
      .eq('revision_id', revisionId);

    if (error) {
      console.error('Update failed:', error);
    } else {
      console.log('Update success!');
    }
  } catch (err) {
    console.error(err);
  }
}

updateSummary();
