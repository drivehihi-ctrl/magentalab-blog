require('dotenv').config({ path: '.env.local' });

const postsData = [
  {
    postId: 1724,
    lang: 'ko',
    title: "슬개골 탈구 강아지, 산책해도 될까? 증상·등급별 운동과 병원 진료 기준",
    excerpt: `1. 슬개골 탈구가 있다고 해서 모든 강아지가 산책을 완전히 중단해야 하는 것은 아닙니다. 경증에서는 체중 관리와 함께 통제된 저충격 운동이 보존적 관리의 일부가 될 수 있습니다.
2. 반대로 절뚝거림이 심해지거나 다리를 지속적으로 들고 걷고, 통증이나 기능 저하가 나타난다면 운동량을 임의로 늘리기보다 수의학적 재평가가 우선입니다.
3. 산책 시간과 강도에는 모든 강아지에게 적용되는 하나의 정답이 없습니다. 슬개골 탈구 등급뿐 아니라 통증, 파행, 체중, 근육 상태, 동반 관절질환과 수술 여부에 따라 개별적으로 조절해야 합니다.

[공감]
슬개골 탈구 진단을 받고 나면 “내가 산책을 너무 많이 시켰나?”, “이제 평생 산책하면 안 되는 걸까?”라는 걱정이 가장 먼저 들 수 있습니다.

안심이가 말씀드리고 싶은 것은 산책 자체를 좋은 운동과 나쁜 운동으로 단순하게 나누기보다, 지금 우리 아이의 무릎이 어느 정도 불편한지를 먼저 보는 것이 중요하다는 점이에요.

걷는 모습과 통증 변화를 기록하고, 우리 아이에게 맞는 활동량을 담당 수의사와 함께 찾아가는 것이 가장 안전합니다.`,
    userBodyTemplate: `<p>강아지가 슬개골 탈구 진단을 받으면 보호자가 가장 많이 묻는 질문 중 하나가 있습니다.</p>

<p><strong>“이제 산책을 하면 안 되나요?”</strong></p>

<p>답은 모든 강아지에게 똑같지 않습니다.</p>

<p>슬개골 탈구의 정도가 경미하고 통증이나 파행이 거의 없는 강아지에서는 체중 관리와 통제된 운동이 보존적 관리의 일부가 될 수 있습니다. 반대로 지속적인 파행이나 통증, 진행성 증상이 있다면 운동 계획보다 먼저 정형외과적 재평가가 필요할 수 있습니다.</p>

<h2>슬개골 탈구 강아지 산책, 한눈에 판단하기</h2>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>현재 상태</th>
<th>의미</th>
<th>운동 접근</th>
<th>보호자가 할 일</th>
</tr>
</thead>
<tbody>

<tr>
<td><strong>증상이 거의 없음</strong></td>
<td>경미한 슬개골 탈구는 검진 중 우연히 발견되기도 합니다.</td>
<td>수의사가 허용한 범위에서 통제된 저충격 활동을 고려할 수 있습니다.</td>
<td>체중과 보행 변화를 관찰합니다.</td>
</tr>

<tr>
<td><strong>간헐적으로 다리를 듦</strong></td>
<td>몇 걸음 다리를 들었다가 다시 정상적으로 걷는 skipping gait가 나타날 수 있습니다.</td>
<td>증상 빈도와 운동 후 변화를 기록합니다.</td>
<td>반복 횟수가 증가하면 재평가를 받습니다.</td>
</tr>

<tr>
<td><strong>파행·통증이 증가함</strong></td>
<td>질환 진행이나 다른 무릎 문제가 동반됐을 가능성을 평가해야 합니다.</td>
<td>운동 강도를 임의로 높이지 않습니다.</td>
<td>수의사에게 진료받습니다.</td>
</tr>

<tr>
<td><strong>지속적으로 다리를 사용하지 않음</strong></td>
<td>단순한 간헐적 skipping과 다른 상황일 수 있습니다.</td>
<td>운동을 강행하지 않습니다.</td>
<td>신속한 수의학적 평가가 필요합니다.</td>
</tr>

<tr>
<td><strong>수술 후</strong></td>
<td>회복 단계에 따라 허용되는 운동이 달라집니다.</td>
<td>일반적인 인터넷 산책 시간표를 적용하지 않습니다.</td>
<td>수술한 병원의 재활·활동 제한 지침을 따릅니다.</td>
</tr>

</tbody>
</table>
</div>

<!-- EXISTING IMAGE 1 -->

<h2>1. 슬개골 탈구란 무엇인가요?</h2>

<p>슬개골은 강아지 무릎 앞쪽에 위치하며 정상적으로는 대퇴골의 활차구 안에서 움직입니다.</p>

<p>슬개골 탈구는 이 슬개골이 정상적인 홈에서 안쪽 또는 바깥쪽으로 벗어나는 상태입니다.</p>

<p>특히 소형견에서는 내측 슬개골 탈구가 흔하지만 단순히 “무릎뼈 하나가 빠지는 병”으로만 이해해서는 안 됩니다.</p>

<p>Merck Veterinary Manual은 슬개골 탈구가 대퇴골, 경골, 고관절 및 전체 후지 정렬의 발달 이상과 연관될 수 있다고 설명합니다.</p>

<h2>2. 슬개골 탈구가 있으면 산책을 끊어야 할까요?</h2>

<p><strong>모든 강아지에게 산책을 완전히 금지하는 것은 일반적인 원칙이 아닙니다.</strong></p>

<p>Merck는 임상증상이 경미한 일부 환자에서 체중 관리, 통제된 운동, 물리치료 등이 보존적 관리에 포함될 수 있다고 설명합니다.</p>

<p>중요한 표현은 ‘통제된 운동(controlled exercise)’입니다.</p>

<p>운동의 목적은 무조건 많이 걷게 하는 것이 아니라 현재 관절 상태와 통증 수준에 맞게 활동성을 유지하는 것입니다.</p>

<!-- EXISTING IMAGE 2 -->

<h2>3. 어떤 운동이 상대적으로 관절 부담이 적을까요?</h2>

<p>일반적으로 관절 문제가 있는 강아지에서는 예측 가능한 속도로 진행하는 통제된 활동이 갑작스러운 고충격 운동보다 관리하기 쉽습니다.</p>

<p>ACVS의 골관절염 관리 자료에서도 달리기와 점프 같은 고충격 활동을 제한하고 통제된 리드 산책 같은 활동으로 대체하는 접근을 설명합니다.</p>

<p>다만 이것을 “슬개골 탈구 강아지는 하루 몇 분씩 걸어야 한다”는 공식으로 바꾸면 안 됩니다.</p>

<p>적절한 운동량은 다음 요인에 따라 달라집니다.</p>

<ul>
<li>슬개골 탈구 등급</li>
<li>통증 여부</li>
<li>파행 빈도</li>
<li>체중과 체형</li>
<li>근육량</li>
<li>나이</li>
<li>동반 정형외과 질환</li>
<li>수술 여부와 회복 단계</li>
</ul>

<h2>4. 피하는 것이 좋은 고충격 행동</h2>

<p>관절에 반복적인 충격이나 급격한 방향 전환을 만드는 활동은 증상이 있는 강아지에서 부담을 증가시킬 수 있습니다.</p>

<p>예를 들면:</p>

<ul>
<li>높은 가구에서 반복적으로 뛰어내리기</li>
<li>미끄러운 바닥에서 급하게 뛰기</li>
<li>갑작스럽게 방향을 바꾸는 격렬한 공놀이</li>
<li>통증이 있는데도 운동을 계속시키기</li>
</ul>

<p>하지만 개별 강아지에게 어떤 활동을 어느 정도 제한할지는 현재 무릎 상태를 확인한 수의사의 판단이 우선입니다.</p>

<!-- EXISTING IMAGE 3 -->

<h2>5. 다리를 잠깐 들었다가 다시 걷는 이유</h2>

<p>슬개골 탈구의 특징적인 모습 중 하나가 흔히 ‘스키핑 보행(skipping gait)’이라고 부르는 행동입니다.</p>

<p>강아지가 갑자기 한쪽 뒷다리를 몇 걸음 들고 걷다가 다시 정상적으로 사용하는 모습입니다.</p>

<p>Merck와 ACVS 모두 이런 간헐적 비체중부하성 파행을 슬개골 탈구에서 관찰할 수 있는 대표적인 임상증상으로 설명합니다.</p>

<p>하지만 다리를 드는 행동만으로 보호자가 슬개골 탈구의 등급을 판단할 수는 없습니다.</p>

<h2>6. 언제 다시 병원에서 확인해야 할까요?</h2>

<p>다음과 같은 변화가 나타나면 기존 운동 계획을 그대로 유지하기보다 재평가가 필요합니다.</p>

<ul>
<li>다리를 드는 횟수가 뚜렷하게 증가함</li>
<li>절뚝거림이 지속됨</li>
<li>다리에 체중을 싣지 않으려 함</li>
<li>무릎 주변을 만질 때 통증 반응이 나타남</li>
<li>활동량이 눈에 띄게 감소함</li>
<li>평소 가능했던 계단이나 움직임을 꺼림</li>
<li>갑작스러운 심한 파행이 발생함</li>
</ul>

<p>갑작스러운 심한 파행은 슬개골 탈구뿐 아니라 외상이나 십자인대 등 다른 문제도 감별해야 할 수 있습니다.</p>

<!-- EXISTING IMAGE 4 -->

<h2>7. 슬개골 탈구에서 체중 관리가 중요한 이유</h2>

<p>체중은 관절에 가해지는 기계적 부담과 밀접한 관련이 있습니다.</p>

<p>특히 과체중인 강아지는 체중 감량 자체가 관절 관리의 중요한 목표가 될 수 있습니다.</p>

<p>ACVS는 골관절염 관리에서 적정 체중 유지와 저충격 운동을 중요한 관리 요소로 설명합니다.</p>

<p>다만 급격하게 사료량을 줄이는 방식보다는 현재 체형과 목표 체중을 평가해 적절한 급여량을 정하는 것이 좋습니다.</p>

<p><a href="/bcs-calculator" class="inline-block my-4 px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg hover:bg-pink-200">👉 마젠타랩 슬개골·BCS 체중/칼로리 계산기 바로가기 →</a></p>

<h2>8. 수술이 필요한 슬개골 탈구도 있나요?</h2>

<p>있습니다.</p>

<p>슬개골 탈구 치료는 등급 숫자 하나만으로 결정되는 것이 아니라 임상증상과 파행 정도, 진행 여부, 골격 변형 등을 함께 평가합니다.</p>

<p>Merck는 중등도에서 중증의 슬개골 탈구, 뚜렷한 파행 또는 증상이 진행되는 경우 수술적 치료가 고려된다고 설명합니다.</p>

<p>ACVS 역시 환자를 직접 검사한 수의외과 전문의가 상태에 따라 적절한 수술 방법을 결정한다고 안내합니다.</p>

<!-- EXISTING IMAGE 5 -->

<h2>9. 수술 후 산책은 일반 산책과 다릅니다</h2>

<p>수술을 받은 강아지에게 인터넷의 일반적인 “슬개골 산책법”을 적용해서는 안 됩니다.</p>

<p>수술 방법, 뼈와 연부조직의 회복 상태, 재검 결과에 따라 활동 제한과 재활 과정이 달라집니다.</p>

<p>따라서 수술 후에는 수술한 병원에서 제공한 활동 제한 및 재활 계획이 이 글보다 우선합니다.</p>

<!-- EXISTING IMAGE 6 -->

<h2>10. 안심 연구원의 핵심 정리</h2>

<p><strong>슬개골 탈구 진단 = 평생 산책 금지가 아닙니다.</strong></p>

<p>하지만 <strong>슬개골 탈구 진단 = 무조건 산책해야 한다</strong>도 아닙니다.</p>

<p>경증이고 편안하게 걷는 강아지에서는 통제된 저충격 활동이 관리의 일부가 될 수 있지만, 파행과 통증이 증가하거나 기능이 떨어진다면 먼저 상태를 재평가해야 합니다.</p>

<p>마젠타랩에서는 앞으로 슬개골 탈구를 단순히 등급 숫자로만 설명하지 않고 <strong>보행·통증·체중·활동성 데이터를 함께 기록하는 방식</strong>으로 안내하겠습니다.</p>

<h2>🔬 수의학 연구 근거 &amp; 참고자료</h2>

<ul>
<li><strong>Merck Veterinary Manual</strong> — Patellar Luxation in Dogs and Cats
<br>
<a href="https://www.merckvetmanual.com/musculoskeletal-system/arthropathies-and-related-disorders/patellar-luxation-in-dogs-and-cats" target="_blank" rel="noopener noreferrer">원문 보기</a>
</li>
<li><strong>American College of Veterinary Surgeons (ACVS)</strong> — Patellar Luxations
<br>
<a href="https://www.acvs.org/small-animal/patellar-luxations" target="_blank" rel="noopener noreferrer">원문 보기</a>
</li>
<li><strong>American College of Veterinary Surgeons (ACVS)</strong> — Osteoarthritis in Dogs
<br>
<a href="https://www.acvs.org/small-animal/osteoarthritis-in-dogs" target="_blank" rel="noopener noreferrer">원문 보기</a>
</li>
</ul>

<p><strong>근거 핵심:</strong> 경증 환자에서는 체중관리와 통제된 운동 등이 보존적 관리에 포함될 수 있으며, 중등도·중증 또는 뚜렷한 파행과 진행성 임상증상이 있는 환자에서는 수술적 치료가 고려될 수 있습니다.</p>

<p><strong>수의학적 주의사항:</strong> 이 글은 슬개골 탈구 강아지에게 고정된 산책 시간이나 운동 강도를 처방하지 않습니다. 운동 계획은 현재 임상증상과 정형외과적 평가에 따라 개별화해야 합니다.</p>

<p><strong>콘텐츠 검증 및 편집:</strong> Magentalab 수석 연구팀</p>`
  },
  {
    postId: 5928,
    lang: 'en',
    title: "Can Dogs With Patellar Luxation Still Walk? Exercise, Warning Signs, and Weight Management",
    excerpt: `1. A diagnosis of patellar luxation does not automatically mean that every dog must stop walking. In mild cases, controlled low-impact activity and weight management may be part of conservative care.
2. If limping becomes persistent, your dog repeatedly refuses to bear weight, or pain and mobility worsen, the knee should be reassessed rather than simply increasing exercise.
3. There is no universal walking duration for every dog with patellar luxation. Exercise should be individualized according to clinical signs, body condition, muscle strength, concurrent orthopedic disease, and whether surgery has been performed.

[Empathy]
Seeing your dog suddenly skip or hold up a hind leg can make you wonder whether your walks caused the problem—or whether walking should stop completely.

I’m Ansim-i. Patellar luxation is not managed by choosing between “exercise” and “no exercise.”

The more useful question is how comfortably your dog is moving today. Track changes in gait and pain, and work with your veterinary team to find an activity level appropriate for your dog's knee.`,
    userBodyTemplate: `<p>One of the first questions pet parents ask after a diagnosis of patellar luxation is simple:</p>

<p><strong>“Can my dog still go for walks?”</strong></p>

<p>There is no single answer that applies to every dog.</p>

<p>Dogs with mild clinical signs may be managed conservatively with measures that include weight management, controlled exercise and rehabilitation. Dogs with persistent or progressive lameness may need a different approach, including surgical evaluation.</p>

<h2>Walking With Patellar Luxation: A Practical Guide</h2>

<div class="table-responsive">
<table>
<thead>
<tr><th>Current Situation</th><th>What It May Mean</th><th>Exercise Approach</th><th>Next Step</th></tr>
</thead>
<tbody>
<tr><td><strong>Minimal or no clinical signs</strong></td><td>Mild luxation may sometimes be found incidentally.</td><td>Controlled low-impact activity may be appropriate if approved by the veterinarian.</td><td>Monitor gait and body weight.</td></tr>
<tr><td><strong>Occasional skipping</strong></td><td>Intermittent non-weight-bearing lameness is characteristic of some patellar luxations.</td><td>Track frequency and changes after activity.</td><td>Arrange reassessment if episodes become more frequent.</td></tr>
<tr><td><strong>Increasing lameness or pain</strong></td><td>Disease progression or another knee problem may need evaluation.</td><td>Do not simply increase exercise.</td><td>Seek veterinary reassessment.</td></tr>
<tr><td><strong>Persistent refusal to bear weight</strong></td><td>This differs from brief intermittent skipping.</td><td>Do not force continued walking.</td><td>Prompt veterinary assessment is appropriate.</td></tr>
<tr><td><strong>After surgery</strong></td><td>Activity depends on healing stage and procedure.</td><td>Do not use a generic online walking schedule.</td><td>Follow the surgeon's rehabilitation plan.</td></tr>
</tbody>
</table>
</div>

<!-- EXISTING IMAGE 1 -->

<h2>1. What Is Patellar Luxation?</h2>

<p>The patella, or kneecap, normally moves within a groove in the femur as the knee flexes and extends.</p>

<p>Patellar luxation occurs when the kneecap moves outside that groove, either medially or laterally.</p>

<p>It is often part of a broader developmental alignment problem involving structures of the hindlimb rather than simply an isolated kneecap problem.</p>

<h2>2. Does Patellar Luxation Mean Walking Must Stop?</h2>

<p><strong>Not necessarily.</strong></p>

<p>The Merck Veterinary Manual includes weight management, controlled exercise and physical therapy among conservative options for selected dogs with mild clinical signs.</p>

<p>The important word is <strong>controlled</strong>.</p>

<p>The goal is not to make every dog walk more. It is to maintain appropriate activity without repeatedly provoking pain or lameness.</p>

<!-- EXISTING IMAGE 2 -->

<h2>3. What Type of Activity Is Lower Impact?</h2>

<p>Predictable, controlled movement is generally easier on an affected joint than repetitive jumping, sprinting or abrupt direction changes.</p>

<p>ACVS guidance for canine joint disease emphasizes replacing high-impact activity with controlled activities such as leash walking when appropriate.</p>

<p>However, there is no evidence-based universal rule such as “every dog with patellar luxation should walk exactly 10 or 15 minutes.”</p>

<p>Exercise should account for clinical grade, pain, lameness, body condition, muscle mass, age, concurrent orthopedic disease and surgical status.</p>

<h2>4. Activities That May Increase Joint Stress</h2>

<ul>
<li>Repeated jumping from high furniture</li>
<li>Hard running on slippery flooring</li>
<li>High-impact games with abrupt stopping and turning</li>
<li>Continuing activity when the dog is clearly painful or lame</li>
</ul>

<p>The appropriate restriction for an individual dog should be determined with the veterinarian who has examined that dog.</p>

<!-- EXISTING IMAGE 3 -->

<h2>5. Why Does My Dog Skip for a Few Steps?</h2>

<p>A characteristic sign of patellar luxation is intermittent non-weight-bearing lameness, often described as a skipping gait.</p>

<p>A dog may briefly carry one hind limb and then return to apparently normal walking.</p>

<p>Both Merck and ACVS describe this pattern, but the behavior alone cannot tell a pet parent the exact grade of luxation.</p>

<h2>6. When Should the Knee Be Rechecked?</h2>

<ul>
<li>Skipping episodes become noticeably more frequent</li>
<li>Lameness persists rather than resolving</li>
<li>The dog repeatedly avoids bearing weight</li>
<li>Pain appears to increase</li>
<li>Normal activity declines</li>
<li>The dog becomes reluctant to perform previously comfortable movements</li>
<li>Severe lameness develops suddenly</li>
</ul>

<p>Sudden severe lameness can also occur with trauma or other orthopedic problems, so it should not automatically be attributed to the known patellar luxation.</p>

<!-- EXISTING IMAGE 4 -->

<h2>7. Why Weight Management Matters</h2>

<p>Excess body weight increases mechanical load on joints and can complicate mobility.</p>

<p>For an overweight dog, achieving a healthier body condition may therefore be an important part of long-term joint management.</p>

<p><a href="/en/bcs-calculator" class="inline-block my-4 px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg hover:bg-pink-200">👉 Try Magentalab Patella &amp; BCS Calorie Calculator →</a></p>

<h2>8. Does Patellar Luxation Ever Require Surgery?</h2>

<p>Yes.</p>

<p>Treatment is based on clinical severity rather than the grade number alone.</p>

<p>Merck notes that surgery is typically considered for moderate to severe luxation, marked lameness or progressive clinical signs.</p>

<p>ACVS similarly explains that surgical procedures are selected individually after orthopedic assessment.</p>

<!-- EXISTING IMAGE 5 -->

<h2>9. Walking After Patellar Luxation Surgery Is Different</h2>

<p>Postoperative activity should not be based on a generic internet walking schedule.</p>

<p>The surgical procedure, healing progress and follow-up findings all influence when and how activity is increased.</p>

<p>The rehabilitation instructions from the surgeon who treated the dog take priority over general advice in this article.</p>

<!-- EXISTING IMAGE 6 -->

<h2>10. Ansim-i's Research Summary</h2>

<p><strong>Patellar luxation does not automatically mean “never walk again.”</strong></p>

<p>It also does not mean that every affected dog should exercise regardless of symptoms.</p>

<p>Controlled low-impact activity can be part of conservative management for selected mild cases, while increasing pain, persistent lameness or loss of function should prompt reassessment.</p>

<h2>🔬 Veterinary Evidence &amp; References</h2>

<ul>
<li><strong>Merck Veterinary Manual</strong> — Patellar Luxation in Dogs and Cats
<br>
<a href="https://www.merckvetmanual.com/musculoskeletal-system/arthropathies-and-related-disorders/patellar-luxation-in-dogs-and-cats" target="_blank" rel="noopener noreferrer">View original reference</a>
</li>
<li><strong>American College of Veterinary Surgeons (ACVS)</strong> — Patellar Luxations
<br>
<a href="https://www.acvs.org/small-animal/patellar-luxations" target="_blank" rel="noopener noreferrer">View original reference</a>
</li>
<li><strong>American College of Veterinary Surgeons (ACVS)</strong> — Osteoarthritis in Dogs
<br>
<a href="https://www.acvs.org/small-animal/osteoarthritis-in-dogs" target="_blank" rel="noopener noreferrer">View original reference</a>
</li>
</ul>

<p><strong>Evidence summary:</strong> Conservative care for selected mildly affected dogs may include weight management, controlled exercise and rehabilitation. More clinically significant or progressive disease may require surgical treatment.</p>

<p><strong>Veterinary caution:</strong> This article does not prescribe a universal walking duration, rehabilitation program or medication regimen.</p>

<p><strong>Content review and editing:</strong> Magentalab Research Team</p>`
  },
  {
    postId: 5930,
    lang: 'ja',
    title: "膝蓋骨脱臼（パテラ）の犬は散歩してもいい？症状別の運動・体重管理・受診の目安",
    excerpt: `1. 膝蓋骨脱臼と診断されたからといって、すべての犬が散歩を完全に中止する必要があるわけではありません。症状が軽い場合には、体重管理とともにコントロールされた低負荷の運動が保存的管理の一部になることがあります。
2. 跛行が続く、足を繰り返し地面につけなくなる、痛みや動きにくさが悪化する場合は、運動量を増やすのではなく獣医師による再評価が優先されます。
3. すべての犬に共通する「1日○分」という散歩時間はありません。脱臼の程度、痛み、跛行、体重、筋肉量、他の整形外科疾患、手術歴などに応じて個別に調整する必要があります。

[共感]
愛犬が突然後ろ足を上げて歩く姿を見ると、「散歩させすぎたのかな」「もう散歩をさせない方がいいのかな」と不安になりますよね。

アンシミがお伝えしたいのは、パテラの管理は「運動する・しない」の二択ではないということです。

今日どのくらい楽に歩けているのか、痛みや歩き方に変化がないかを記録し、その子の膝に合った活動量を獣医師と一緒に考えていきましょう。`,
    userBodyTemplate: `<p>膝蓋骨脱臼（パテラ）と診断された後、飼い主さんが最も気になることの一つが「散歩を続けてもいいのか」という問題です。</p>

<p>答えは、すべての犬で同じではありません。</p>

<p>症状が軽い犬では、体重管理やコントロールされた運動、リハビリテーションなどが保存的管理に含まれることがあります。一方、跛行や痛みが強い場合、また症状が進行している場合には、運動計画より先に整形外科的な再評価が必要になることがあります。</p>

<h2>膝蓋骨脱臼と散歩：状態別チェック表</h2>

<div class="table-responsive">
<table>
<thead>
<tr><th>現在の状態</th><th>考えられる意味</th><th>運動の考え方</th><th>飼い主さんの対応</th></tr>
</thead>
<tbody>
<tr><td><strong>症状がほとんどない</strong></td><td>軽度では健康診断などで偶然見つかることもあります。</td><td>獣医師が許可した範囲で低負荷の運動を検討できます。</td><td>歩き方と体重の変化を観察します。</td></tr>
<tr><td><strong>時々足を上げる</strong></td><td>数歩だけ足を上げ、その後普通に歩く「スキッピング」がみられることがあります。</td><td>頻度と運動後の変化を記録します。</td><td>頻度が増えた場合は再診を検討します。</td></tr>
<tr><td><strong>跛行や痛みが増える</strong></td><td>病状の進行や他の膝疾患を評価する必要があります。</td><td>自己判断で運動量を増やしません。</td><td>獣医師による再評価を受けます。</td></tr>
<tr><td><strong>足を継続して使わない</strong></td><td>一時的なスキッピングとは異なる状態です。</td><td>無理に歩かせません。</td><td>早めの獣医学的評価が適切です。</td></tr>
<tr><td><strong>手術後</strong></td><td>回復段階によって許可される運動が異なります。</td><td>一般的なネット上の散歩時間を適用しません。</td><td>執刀医のリハビリ計画を優先します。</td></tr>
</tbody>
</table>
</div>

<!-- EXISTING IMAGE 1 -->

<h2>1. 膝蓋骨脱臼とは？</h2>

<p>膝蓋骨は膝の前にある小さな骨で、正常では大腿骨の溝の中を動きます。</p>

<p>膝蓋骨脱臼では、この骨が正常な溝から内側または外側へ外れます。</p>

<p>Merck Veterinary Manualでは、膝蓋骨だけの問題ではなく、大腿骨や脛骨など後肢全体の発達やアライメント異常と関連することがあると説明されています。</p>

<h2>2. パテラなら散歩をやめるべき？</h2>

<p><strong>必ずしもそうではありません。</strong></p>

<p>症状が軽い一部の犬では、体重管理、コントロールされた運動、理学療法などが保存的管理の選択肢になります。</p>

<p>重要なのは「たくさん歩くこと」ではなく、現在の状態に合わせて活動をコントロールすることです。</p>

<!-- EXISTING IMAGE 2 -->

<h2>3. 関節への負担が比較的少ない運動とは？</h2>

<p>一般に、ジャンプや急な方向転換を繰り返す高負荷の活動より、予測可能な速度で行うコントロールされた活動の方が管理しやすくなります。</p>

<p>ただし「パテラなら毎日10分歩けばよい」という共通ルールはありません。</p>

<p>運動量は脱臼の程度、痛み, 跛行, 体重, 筋肉量、年齢、併発疾患、手術歴などを考慮して決めます。</p>

<h2>4. 関節への負担が増えやすい活動</h2>

<ul>
<li>高い家具から繰り返し飛び降りる</li>
<li>滑りやすい床で激しく走る</li>
<li>急停止や急旋回を繰り返す遊び</li>
<li>痛みや跛行があるのに運動を続ける</li>
</ul>

<p>個々の犬に必要な活動制限については、実際に診察した獣医師の判断を優先してください。</p>

<!-- EXISTING IMAGE 3 -->

<h2>5. 数歩だけ後ろ足を上げるのはなぜ？</h2>

<p>膝蓋骨脱臼では、後ろ足を数歩だけ上げた後に再び普通に歩く「スキッピング」と呼ばれる歩様がみられることがあります。</p>

<p>Merck Veterinary ManualとACVSのいずれも、間欠的な非荷重性跛行を代表的な臨床症状として説明しています。</p>

<p>ただし、この行動だけで飼い主さんが脱臼のグレードを判断することはできません。</p>

<h2>6. 再診を検討したい変化</h2>

<ul>
<li>足を上げる頻度が明らかに増えた</li>
<li>跛行が持続する</li>
<li>足に体重をかけたがらない</li>
<li>痛みが強くなったように見える</li>
<li>活動量が明らかに低下した</li>
<li>以前できていた動きを避けるようになった</li>
<li>突然強い跛行が現れた</li>
</ul>

<p>突然の強い跛行は外傷や他の膝疾患でも起こるため、すべてを既知のパテラのせいと決めつけないことが重要です。</p>

<!-- EXISTING IMAGE 4 -->

<h2>7. 体重管理が重要な理由</h2>

<p>余分な体重は関節への機械的負荷を増やします。</p>

<p>過体重の場合、適正なボディコンディションを目指すことは長期的な関節管理の重要な要素になります。</p>

<p><a href="/ja/bcs-calculator" class="inline-block my-4 px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg hover:bg-pink-200">👉 Magentalab BCS・カロリー計算ツールはこちら →</a></p>

<h2>8. 手術が必要になることもある？</h2>

<p>あります。</p>

<p>治療方針はグレードの数字だけではなく、跛行、痛み、進行性、骨格変形などを総合して判断します。</p>

<p>Merck Veterinary Manualでは、中等度から重度の脱臼、明らかな跛行、進行する臨床症状などでは外科治療が検討されるとしています。</p>

<!-- EXISTING IMAGE 5 -->

<h2>9. 手術後の散歩は別に考える</h2>

<p>術後の犬に一般的なインターネット上の散歩時間を当てはめるべきではありません。</p>

<p>手術方法、骨や軟部組織の治癒、再診結果などによって活動制限やリハビリの進め方は変わります。</p>

<p>術後は執刀した病院の指示を最優先してください。</p>

<!-- EXISTING IMAGE 6 -->

<h2>10. アンシミ研究員のまとめ</h2>

<p><strong>膝蓋骨脱臼と診断されたからといって、一生散歩禁止という意味ではありません。</strong></p>

<p>同時に、症状に関係なく必ず散歩を続けるべきという意味でもありません。</p>

<p>症状が軽い犬ではコントロールされた低負荷運動が管理の一部になることがありますが、痛みや跛行、機能低下が進む場合は再評価が優先されます。</p>

<h2>🔬 獣医学的根拠・参考資料</h2>

<ul>
<li><strong>Merck Veterinary Manual</strong> — Patellar Luxation in Dogs and Cats
<br>
<a href="https://www.merckvetmanual.com/musculoskeletal-system/arthropathies-and-related-disorders/patellar-luxation-in-dogs-and-cats" target="_blank" rel="noopener noreferrer">原文を見る</a>
</li>
<li><strong>American College of Veterinary Surgeons (ACVS)</strong> — Patellar Luxations
<br>
<a href="https://www.acvs.org/small-animal/patellar-luxations" target="_blank" rel="noopener noreferrer">原文を見る</a>
</li>
<li><strong>American College of Veterinary Surgeons (ACVS)</strong> — Osteoarthritis in Dogs
<br>
<a href="https://www.acvs.org/small-animal/osteoarthritis-in-dogs" target="_blank" rel="noopener noreferrer">原文を見る</a>
</li>
</ul>

<p><strong>根拠の要約：</strong>軽症例では体重管理、コントロールされた運動、リハビリなどが保存的管理に含まれる場合があります。症状がより強い場合や進行性の場合には外科治療が検討されます。</p>

<p><strong>獣医学的注意：</strong>この記事では、すべての犬に共通する散歩時間、リハビリメニュー、薬物治療を提示していません。</p>

<p><strong>コンテンツ検証・編集：</strong>Magentalab Research Team</p>`
  }
];

async function updateTriplet() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log(`\n🚀 Starting Batch Triplet Update for Patellar Luxation (KO 1724 / EN 5928 / JA 5930)...`);

  for (const item of postsData) {
    console.log(`\n----------------------------------------------`);
    console.log(`[${item.lang.toUpperCase()}] Fetching current WP content for Post ID ${item.postId}...`);
    
    const getRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${item.postId}`, {
      headers: { 'Authorization': authHeader }
    });
    
    if (!getRes.ok) {
      console.error(`Failed to fetch WP post ${item.postId}`);
      continue;
    }
    
    const currentPost = await getRes.json();
    const currentHtml = currentPost.content.rendered || '';
    const originalImgs = currentHtml.match(/<img[^>]+>/gi) || [];
    console.log(`Extracted ${originalImgs.length} original <img> tags for Post ${item.postId}.`);

    let finalContent = item.userBodyTemplate;
    for (let i = 1; i <= 10; i++) {
      const commentRegex = new RegExp(`<!--\\s*EXISTING IMAGE ${i}\\s*-->`, 'gi');
      if (i <= originalImgs.length) {
        const imgHtml = `<p className="my-6">${originalImgs[i - 1]}</p>`;
        finalContent = finalContent.replace(commentRegex, imgHtml);
      } else {
        finalContent = finalContent.replace(commentRegex, '');
      }
    }

    console.log(`Sending update to WordPress REST API for Post ID ${item.postId}...`);
    const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${item.postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        title: item.title,
        excerpt: item.excerpt,
        content: finalContent
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error(`WP API Error for ID ${item.postId}: ${errText}`);
      continue;
    }

    const updatedPost = await updateRes.json();
    console.log(`✅ Successfully updated Post ID ${updatedPost.id} [${item.lang.toUpperCase()}]!`);
    console.log(`New Title: ${updatedPost.title.rendered}`);
    console.log(`Slug: ${updatedPost.slug}`);
  }

  // Trigger Instant Revalidation once for all
  console.log('\nTriggering instant CDN revalidation for all posts...');
  const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
  const revalJson = await revalRes.json();
  console.log('Revalidate status:', revalJson);
}

updateTriplet().catch(err => console.error(err));
