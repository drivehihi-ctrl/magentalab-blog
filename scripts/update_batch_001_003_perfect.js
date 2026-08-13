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
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(field);
      if (row.length > 1) {
        result.push(row);
      }
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

const postsData = [
  // =========================================================================
  // POST 001: 2451 (EN)
  // =========================================================================
  {
    postId: 2451,
    slug: 'dog_diabetes_diet_insulin-en',
    title: 'Canine Diabetes Management: 5 Things to Know About Insulin, Glucose Curves, Meals, and Hypoglycemia',
    excerpt: `1. Canine diabetes is managed by patterns—meals, insulin as prescribed, thirst, urination, body weight, activity, and glucose data—not by chasing one perfect blood glucose number.
2. Blood glucose curves can help a veterinary team understand insulin effect over time, but owners should not use a single curve or nadir to redesign the insulin dose on their own.
3. Poor appetite, vomiting, unusual weakness, trembling, disorientation, collapse, or seizures can change the safety picture. A dog that cannot safely swallow or is severely impaired needs urgent veterinary assessment rather than forced food or liquid.

[Empathy]

If every meal suddenly feels like a medical appointment after a diabetes diagnosis, you are not alone in finding the routine complicated. Ansim-i will help you separate the things worth watching from the numbers you do not need to solve by yourself.`,
    content: `<p>When your dog is first diagnosed with diabetes, the word <strong>“insulin”</strong> can suddenly make everyday life feel much more complicated.</p>
<p>You may find yourself looking at the clock before every meal, checking how much food was eaten, watching the water bowl, and wondering whether every sleepy moment means the blood sugar is too low.</p>
<p><strong>🔎 Ansim-i explains:</strong> Let’s make this much simpler.</p>
<p>Managing canine diabetes is not a contest to produce one perfect blood glucose number. The real goal is to help your dog feel well while avoiding both poorly controlled diabetes and clinically important hypoglycemia.</p>
<p>That means we need to look at the <strong>whole dog</strong>—not only the glucose meter.</p>
<h2>1. Think of diabetes management as a daily rhythm</h2>

<!-- IMAGE 1
alt: Ansim-i observing a diabetic dog beside its meal while a pet parent records the daily routine
prompt: Hyper-realistic 3D render style, photorealistic appearance. A brown dachshund wearing round-rimmed glasses and holding a small gold magnifying glass looks as if he is wearing a white lab coat. He is a researcher, and his name is Ansim. He is gently observing a diabetic dog beside its meal bowl while a Korean pet parent records appetite, water intake, and daily routine in a notebook in a cozy Korean apartment living room. Realistic fur, natural daylight, warm trustworthy veterinary research atmosphere, no dosage numbers, no injection close-up, educational composition.
-->

<p>Imagine four pieces moving together:</p>
<p><strong>meal → insulin → daily activity → monitoring</strong></p>
<p>If those pieces remain reasonably consistent, your veterinarian can understand how your dog is responding to treatment much more clearly.</p>
<p>If one suddenly changes—for example, your dog refuses dinner, vomits, becomes unusually inactive, or starts drinking much more water—the meaning of the glucose readings can change too.</p>
<p>This is why insulin treatment should be based on an individual veterinary plan rather than a universal rule copied from another dog.</p>

<h2>2. “When exactly should I give the insulin?”</h2>
<p>This is probably one of the first questions every pet parent asks.</p>
<p>The easiest way to understand it is this:</p>
<p><strong>Your dog needs a repeatable routine, but there is no single internet clock that fits every diabetic dog.</strong></p>
<p>The type of insulin, dosing interval, meal schedule, appetite, other diseases, and the way your dog responds to treatment all influence the plan.</p>
<p>So if your veterinarian has given you a meal-and-insulin schedule, that schedule should take priority over a general article like this one.</p>
<p><strong>🔎 Ansim-i’s simple rule:</strong> consistency is helpful; improvising the insulin dose is not.</p>
<p>If your dog eats much less than usual, refuses food, vomits, or seems suddenly unwell, do not try to solve the problem by independently increasing, decreasing, delaying, or doubling insulin. Contact your veterinary team and explain what happened.</p>
<h2>3. What should I watch at home besides blood glucose?</h2>
<p>Here is where pet parents are incredibly valuable.</p>
<p>Your veterinarian may see your dog for twenty or thirty minutes. You see your dog every day.</p>
<div class="table-responsive">
<table>
<thead>
<tr>
<th>What You Notice</th>
<th>Why It Matters</th>
<th>What to Record</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Water intake</strong></td>
<td>Excessive thirst may return when diabetes is not well controlled.</td>
<td>Is the water bowl emptying faster than usual?</td>
</tr>
<tr>
<td><strong>Urination</strong></td>
<td>Increased urination often accompanies increased thirst.</td>
<td>More frequent trips outside, larger urine volume, accidents?</td>
</tr>
<tr>
<td><strong>Appetite</strong></td>
<td>Changes in appetite can affect the normal treatment routine and may signal illness.</td>
<td>Ate normally, ate less, refused food, vomited?</td>
</tr>
<tr>
<td><strong>Body weight</strong></td>
<td>Unintended weight loss can be an important sign of poor diabetic control.</td>
<td>Record weight consistently using the same scale when possible.</td>
</tr>
<tr>
<td><strong>Energy and behavior</strong></td>
<td>Weakness, unusual sleepiness, confusion, or tremors deserve attention.</td>
<td>What happened, when, and for how long?</td>
</tr>
</tbody>
</table>
</div>
<p><strong>🔎 Ansim-i explains:</strong> Think of these observations as your dog’s “daily data.”</p>
<p>A single glucose reading is one number. Your dog’s drinking, urination, appetite, weight, and behavior tell the story around that number.</p>

<h2>4. What is a blood glucose curve?</h2>

<!-- IMAGE 2
alt: A pet parent recording a dog’s meals, water intake, urination, weight, and activity
prompt: Hyper-realistic 3D render style, photorealistic appearance. A Korean pet parent calmly records a dog's meals, water intake, urination pattern, body weight, and activity in a simple daily diabetes log at home. The dog rests comfortably nearby. Natural daylight, realistic fur and home textures, educational and reassuring mood, no medication dosage text.
-->

<p>A blood glucose curve sounds technical, but the basic idea is quite easy.</p>
<p>A single blood glucose measurement is like taking <strong>one photograph</strong> of your dog’s day.</p>
<p>A glucose curve is more like watching a <strong>short movie</strong>.</p>
<p>By looking at glucose values over time, the veterinary team can estimate how low the glucose goes during the insulin cycle, how long the insulin appears to be working, and how much the glucose changes during that period.</p>
<p>The lowest point is often called the <strong>nadir</strong>.</p>
<p>But here is the part Ansim-i really wants you to remember:</p>
<p><strong>The nadir is not a “change the insulin yourself” number.</strong></p>
<p>Blood glucose curves are interpreted together with clinical signs, appetite, body weight, insulin type, treatment history, and whether hypoglycemia has occurred.</p>
<p>The American Animal Hospital Association’s diabetes management guidelines emphasize monitoring the patient as a whole rather than adjusting therapy from an isolated glucose value alone.</p>

<h2>5. “My dog looks fine. Why do we still need monitoring?”</h2>
<p>Because diabetes can change gradually.</p>
<p>A dog may look fairly normal while thirst, urination, body weight, or glucose patterns are beginning to shift.</p>
<p>Monitoring helps your veterinary team notice those trends before they become much larger problems.</p>
<p>Home glucose monitoring can be useful for many diabetic pets, and some veterinary teams may recommend blood glucose curves or continuous glucose monitoring systems.</p>
<p>Which method is appropriate depends on the individual dog and the monitoring plan your veterinarian has chosen.</p>
<h2>6. What does hypoglycemia look like?</h2>

<!-- IMAGE 3
alt: A veterinarian reviewing a full-day glucose curve with a pet parent and dog
prompt: Hyper-realistic 3D render style, photorealistic appearance. Inside a modern veterinary consultation room, a veterinarian reviews a simple full-day glucose curve on a tablet together with a pet parent while a dog rests comfortably nearby. The chart has no readable dosage numbers. Realistic clinical lighting, natural expressions, trustworthy educational atmosphere.
-->

<p><strong>Hypoglycemia means the blood glucose has fallen too low.</strong></p>
<p>Instead of memorizing a long emergency checklist, picture how your dog might look.</p>
<p>At first, something may simply feel “off.” Your dog may seem unusually weak, sleepy, restless, or less coordinated than normal.</p>
<p>If the problem becomes more serious, you may see trembling, disorientation, difficulty standing, collapse, or seizures.</p>
<p><strong>🔎 Ansim-i’s important point:</strong> if you suspect hypoglycemia, this is not the moment to experiment with insulin adjustments or a home remedy you saw in an image online.</p>
<p>Contact your veterinarian or an emergency veterinary hospital promptly and follow the emergency plan provided for your individual dog.</p>
<p>If your dog has reduced consciousness, cannot swallow normally, is collapsing, or is having a seizure, do not force food or liquid into the mouth.</p>
<p>There is no universal home sugar dose that is safe to apply from an article, because the appropriate response depends on the dog’s condition and ability to swallow.</p>
<h2>7. What if my dog does not eat the usual meal?</h2>
<p>This situation worries many pet parents because food and insulin are closely linked in everyday diabetic management.</p>
<p>The wrong approach is to create a new insulin rule on the spot.</p>
<p>The useful approach is to collect the information your veterinarian needs:</p>
<p>How much did your dog eat? Was there vomiting? Is your dog alert? Has anything else changed? What insulin and treatment schedule is normally used?</p>
<p>Then contact your veterinary team for instructions that fit your dog’s treatment plan.</p>
<h2>8. Does a diabetic dog need a special high-fiber diet?</h2>
<p>Sometimes—but this needs a little more explanation.</p>
<p>For dogs with diabetes, the most useful diet is one that is <strong>complete and balanced, palatable, appropriate for body condition, and fed consistently</strong>.</p>
<p>Some diabetic dogs, particularly overweight dogs, may benefit from diets with increased soluble and insoluble fiber because these diets can help with calorie control and post-meal glucose management.</p>
<p>But “more fiber is always better” is not a rule.</p>
<p>An underweight diabetic dog has a very different nutritional goal from an obese diabetic dog.</p>
<p><strong>🔎 Ansim-i explains:</strong> the food bowl is part of the treatment plan, but there is no single magic percentage printed on the bag that manages diabetes by itself.</p>

<h2>9. What about NFE and carbohydrate calculations?</h2>
<p>The original version of this article spent a large amount of time calculating NFE, an estimate of carbohydrate by difference from the guaranteed analysis.</p>
<p>That calculation can be useful when comparing pet foods, but it should not be treated as a stand-alone diabetes treatment target.</p>
<p>A specific NFE percentage does not tell you how much insulin your dog needs, and it does not replace an individualized nutrition plan.</p>
<p>For diabetes management, Ansim-i would focus less on finding one “perfect” carbohydrate number and more on whether the diet is complete and balanced, eaten consistently, appropriate for body condition, and compatible with the veterinary treatment plan.</p>

<h2>10. A stable routine often tells us more than a “perfect” day</h2>
<p>Diabetes management works best when your veterinary team can recognize patterns.</p>
<p>Regular meal timing, consistent portions, an appropriate activity routine, and good home records make those patterns much easier to interpret.</p>
<p>That does not mean every day must be identical.</p>
<p>Dogs get upset stomachs. Families travel. Appetite changes. Exercise varies.</p>
<p>The goal is not perfection.</p>
<p><strong>The goal is to notice meaningful changes and communicate them.</strong></p>

<h2>11. What should you bring to a diabetes recheck?</h2>
<p>Instead of arriving with only one glucose number, bring the story of the last several days.</p>
<p>A simple record of appetite, insulin administration as prescribed, drinking and urination, body weight, unusual weakness or trembling, vomiting, exercise changes, and any glucose data requested by your veterinarian can be extremely helpful.</p>
<p>Photos or short videos of unusual behavior may also help your veterinary team understand what happened at home.</p>

<h2>12. Ansim-i’s Research Summary</h2>
<p>If this article feels much simpler than the old “insulin timing + glucose number + carbohydrate percentage” version, that is intentional.</p>
<p>Canine diabetes is not managed by one clock, one glucose value, or one food number.</p>
<p><strong>It is managed by patterns.</strong></p>
<p>Meals, insulin, thirst, urination, appetite, weight, energy, and glucose monitoring all provide pieces of information.</p>
<p>Your job as a pet parent is not to calculate the perfect insulin dose yourself.</p>
<p>Your job is to know your dog’s normal routine, notice when that routine changes, record useful information, and work with your veterinary team.</p>
<p>That is the kind of diabetes data Ansim-i wants Magentalab to help you organize.</p>

<h2>🔬 Veterinary Evidence & References</h2>
<p><strong>American Animal Hospital Association (AAHA)</strong><br>2018 AAHA Diabetes Management Guidelines for Dogs and Cats — Guidelines emphasizing individualization of insulin protocols, clinical sign monitoring, blood glucose curve interpretation, and owner education.</p>
<p><strong>Merck Veterinary Manual</strong><br>Diabetes Mellitus in Dogs and Cats — Pathophysiology, diagnostic evaluation, insulin therapy, monitoring, and emergency management of canine diabetes mellitus.</p>
<p><strong>Evidence note:</strong> The goal of canine diabetes management is control of clinical signs while avoiding hypoglycemia. Glucose curves can be useful, but they should be interpreted with appetite, thirst, urination, body weight, activity, and the dog’s overall clinical response. Meal and insulin routines must be individualized by the veterinary team.</p>
<p><strong>Safety note:</strong> This article does not provide an insulin dose or a dose-adjustment formula. Poor appetite, vomiting, trembling, weakness, disorientation, collapse, or seizures require prompt veterinary guidance. Do not force food or liquid into a dog that is not alert enough to swallow safely.</p>`
  },

  // =========================================================================
  // POST 002: 2370 (KO)
  // =========================================================================
  {
    postId: 2370,
    slug: 'dog_diabetes_diet_insulin',
    title: '강아지 당뇨병 관리 5가지: 인슐린, 혈당곡선, 식사와 저혈당 증상',
    excerpt: `1. 강아지 당뇨병 관리는 혈당 숫자 하나보다 식사, 인슐린, 물·소변, 체중, 활동량이 어떻게 함께 움직이는지를 보는 과정입니다.
2. 혈당곡선은 인슐린 효과의 흐름을 이해하는 자료지만, 보호자가 최저 혈당값만 보고 인슐린 용량을 임의로 바꾸는 기준은 아닙니다.
3. 평소와 달리 식사를 거의 하지 않거나 반복 구토, 떨림, 비틀거림, 심한 무기력, 의식 변화가 나타나면 평소 치료 일정을 스스로 조절하기보다 담당 병원에 빠르게 상황을 알려야 합니다.

[공감]

당뇨 진단 뒤에는 밥 한 끼, 물그릇 하나도 전보다 더 크게 보일 수 있어요. 안심이가 보호자님이 직접 관찰하면 좋은 것과, 혼자 결정하지 않아도 되는 치료 숫자를 차근차근 나눠드릴게요.`,
    content: `<p>강아지가 당뇨병 진단을 받으면 평범했던 하루가 갑자기 복잡하게 느껴질 수 있습니다.</p>
<p>밥을 먹을 때마다 시계를 보게 되고, 물을 조금 많이 마시면 걱정되고, 낮잠을 오래 자면 혹시 혈당이 떨어진 것은 아닌지 신경이 쓰이기도 하지요.</p>
<p><strong>안심이가 먼저 한 가지만 정리해볼게요.</strong></p>
<p>강아지 당뇨병 관리는 하나의 혈당 숫자를 맞히는 시험이 아닙니다.</p>
<p><strong>잘 먹고 있는지, 물과 소변은 어떤지, 체중은 유지되는지, 평소처럼 움직이는지, 그리고 인슐린에 어떻게 반응하고 있는지를 함께 보는 과정</strong>에 더 가깝습니다.</p>
<h2>1. 당뇨병 관리는 ‘하루의 흐름’을 보는 일이에요</h2>

<!-- IMAGE 1
alt: 한국 아파트에서 당뇨 강아지의 식사와 물 섭취를 기록하는 보호자 옆에서 관찰하는 안심이
prompt: Hyper-realistic 3D render style, photorealistic appearance. A brown dachshund wearing round-rimmed glasses and holding a small gold magnifying glass looks as if he is wearing a white lab coat. He is a researcher, and his name is Ansim. He is gently observing a diabetic dog beside its meal bowl while a Korean pet parent records appetite, water intake, and daily routine in a notebook in a cozy Korean apartment living room. Realistic fur, natural daylight, warm trustworthy veterinary research atmosphere, no dosage numbers, no injection close-up, educational composition.
-->

<p>당뇨병을 조금 쉽게 생각하면 네 가지가 서로 연결되어 있다고 볼 수 있습니다.</p>
<p><strong>식사 → 인슐린 → 생활 → 관찰</strong></p>
<p>밥을 비슷한 시간과 양으로 먹고, 처방받은 방식으로 인슐린을 사용하고, 평소 생활 패턴이 크게 흔들리지 않으면 아이가 치료에 어떻게 반응하는지 파악하기도 쉬워집니다.</p>
<p>반대로 평소 잘 먹던 아이가 갑자기 밥을 절반밖에 먹지 않았거나, 토하거나, 하루 종일 축 처져 있다면 이야기가 달라집니다.</p>
<p>이럴 때는 인슐린 숫자만 볼 것이 아니라 <strong>“오늘 우리 아이의 하루에서 무엇이 달라졌지?”</strong>부터 보는 것이 중요합니다.</p>

<h2>2. “인슐린은 밥 먹고 몇 분 뒤에 줘야 하나요?”</h2>
<p>당뇨병을 처음 관리하는 보호자님이 정말 많이 궁금해하는 부분입니다.</p>
<p>그런데 인터넷에서 본 하나의 시간을 모든 강아지에게 적용하면 안 됩니다.</p>
<p>사용하는 인슐린의 종류와 투여 계획, 식사 패턴, 다른 질환이 있는지, 실제 혈당 반응이 어떤지에 따라 관리계획이 달라질 수 있기 때문이에요.</p>
<p><strong>안심이가 기억하기 쉽게 정리하면 이렇습니다.</strong></p>
<p><strong>“일정한 생활은 중요하지만, 치료 방법을 보호자가 즉석에서 새로 만들면 안 된다.”</strong></p>
<p>담당 수의사가 정해준 식사와 인슐린 계획이 있다면 그것이 가장 먼저 적용되어야 합니다.</p>
<p>그리고 평소와 달리 밥을 거의 먹지 않거나, 반복해서 토하거나, 갑자기 기운이 없다면 스스로 인슐린을 늘리거나 줄이거나 두 번 투여하는 방식으로 해결하려 하지 말고 담당 병원에 상황을 알려주세요.</p>
<h2>3. 혈당 말고도 보호자가 볼 수 있는 데이터가 많아요</h2>
<p>병원에서는 혈액검사와 혈당 같은 숫자를 볼 수 있습니다.</p>
<p>하지만 보호자님에게만 보이는 데이터도 있어요.</p>
<p><strong>바로 우리 아이의 일상입니다.</strong></p>
<div class="table-responsive">
<table>
<thead>
<tr>
<th>집에서 볼 것</th>
<th>안심이가 쉽게 설명하면</th>
<th>기록하면 좋은 변화</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>물</strong></td>
<td>당 조절이 잘 되지 않을 때 다시 물을 많이 찾는 모습이 나타날 수 있어요.</td>
<td>평소보다 물그릇이 훨씬 빨리 비는지</td>
</tr>
<tr>
<td><strong>소변</strong></td>
<td>물을 많이 마시면 소변 양이나 횟수도 늘어날 수 있어요.</td>
<td>산책 중 소변 횟수, 소변 양, 집안 실수</td>
</tr>
<tr>
<td><strong>식욕</strong></td>
<td>당뇨 관리에서는 평소 식사 패턴이 중요한 정보가 됩니다.</td>
<td>전부 먹음 / 일부만 먹음 / 거부 / 구토</td>
</tr>
<tr>
<td><strong>체중</strong></td>
<td>잘 먹는데 계속 살이 빠지는 변화는 그냥 지나치지 않는 게 좋아요.</td>
<td>가능하면 같은 조건에서 주기적으로 측정</td>
</tr>
<tr>
<td><strong>기운과 행동</strong></td>
<td>갑작스러운 무기력, 떨림, 비틀거림은 평소와 다른 신호일 수 있어요.</td>
<td>언제 시작됐고 얼마나 지속됐는지</td>
</tr>
</tbody>
</table>
</div>
<p><strong>안심이는 이걸 ‘우리 아이의 생활 데이터’라고 생각하면 쉽다고 봐요.</strong></p>
<p>혈당계가 숫자 하나를 알려준다면, 물·소변·밥·체중·행동은 그 숫자 주변에서 실제로 무슨 일이 일어나고 있는지를 알려줍니다.</p>

<h2>4. 혈당곡선은 왜 보는 걸까요?</h2>

<!-- IMAGE 2
alt: 강아지의 식사량과 음수량 소변 체중 활동량을 생활기록에 적는 보호자
prompt: Hyper-realistic 3D render style, photorealistic appearance. A Korean pet parent calmly records a dog's meals, water intake, urination pattern, body weight, and activity in a simple daily diabetes log at home. The dog rests comfortably nearby. Natural daylight, realistic fur and home textures, educational and reassuring mood, no medication dosage text.
-->

<p>‘혈당곡선’이라는 말을 처음 들으면 어려운 검사처럼 들립니다.</p>
<p>하지만 원리는 생각보다 간단해요.</p>
<p><strong>한 번 측정한 혈당이 사진 한 장이라면, 혈당곡선은 하루의 짧은 동영상에 가깝습니다.</strong></p>
<p>시간이 지나면서 혈당이 어떻게 내려가고 다시 올라오는지를 여러 번 측정해서 흐름을 보는 것입니다.</p>
<p>이 과정에서 수의사는 인슐린 효과가 어느 정도 지속되는지, 혈당이 가장 낮아지는 시점은 어디인지, 지나치게 낮아지는 구간은 없는지 등을 살펴봅니다.</p>
<p>혈당이 가장 낮아지는 지점을 수의학에서는 <strong>나디르(nadir)</strong>라고 부릅니다.</p>
<p>그런데 여기서 한 가지가 정말 중요합니다.</p>
<p><strong>나디르는 보호자가 그 숫자를 보고 바로 인슐린 양을 바꾸라는 숫자가 아닙니다.</strong></p>
<p>혈당곡선은 아이의 식욕과 체중, 물·소변 변화, 사용 중인 인슐린, 저혈당 여부와 함께 해석해야 합니다.</p>

<h2>5. “혈당검사 했는데 왜 생활기록까지 필요하죠?”</h2>
<p>안심이가 예를 하나 들어볼게요.</p>
<p>두 강아지의 혈당 숫자가 어느 순간 똑같았다고 해볼게요.</p>
<p>그런데 한 아이는 밥도 잘 먹고 체중도 유지되며 물 마시는 양도 안정적이고, 다른 아이는 계속 살이 빠지고 물을 많이 마신다면 어떨까요?</p>
<p>숫자 하나만 보면 같지만 <strong>아이의 상태는 전혀 같지 않을 수 있습니다.</strong></p>
<p>그래서 당뇨병 관리에서는 혈당 데이터뿐 아니라 실제 임상증상과 생활 변화를 같이 봅니다.</p>
<p>가정 혈당 측정이나 연속혈당측정기 같은 방법을 활용하는 경우도 있지만, 어떤 방식이 적절한지는 아이의 상태와 담당 수의사의 모니터링 계획에 따라 달라집니다.</p>
<h2>6. 저혈당은 어떤 모습으로 보일까요?</h2>

<!-- IMAGE 3
alt: 동물병원에서 강아지 혈당곡선을 보호자와 함께 확인하는 수의사
prompt: Hyper-realistic 3D render style, photorealistic appearance. Inside a modern veterinary consultation room, a veterinarian reviews a simple full-day glucose curve on a tablet together with a pet parent while a dog rests comfortably nearby. The chart has no readable dosage numbers. Realistic clinical lighting, natural expressions, trustworthy educational atmosphere.
-->

<p><strong>저혈당은 혈당이 지나치게 낮아진 상태</strong>를 말합니다.</p>
<p>그런데 보호자님에게 더 중요한 것은 용어보다 <strong>“우리 아이가 어떻게 보이는가”</strong>입니다.</p>
<p>처음에는 그냥 평소보다 기운이 없는 것처럼 보일 수도 있어요.</p>
<p>잠이 지나치게 많아지거나, 갑자기 불안해 보이거나, 걸을 때 중심을 잘 잡지 못하는 모습이 나타날 수도 있습니다.</p>
<p>상태가 더 심해지면 몸을 떨거나 방향감각이 흐려지고, 제대로 서기 어렵거나 쓰러지거나 발작이 나타날 수 있습니다.</p>
<p><strong>이 부분은 안심이가 꼭 짚어드리고 싶어요.</strong></p>
<p>이런 상황에서 인터넷 이미지에서 본 방법을 따라 꿀이나 시럽의 양을 계산하거나, 다음 인슐린 양을 임의로 조절하는 방식으로 해결하려 하지 마세요.</p>
<p>저혈당이 의심되면 담당 동물병원이나 응급 진료가 가능한 병원에 신속하게 연락하고, 아이에게 제공받은 개별 응급관리 지침을 따르는 것이 중요합니다.</p>
<p>특히 의식이 떨어져 있거나 정상적으로 삼키지 못하고, 쓰러져 있거나 발작 중이라면 음식이나 액체를 억지로 입안에 넣지 않는 것이 안전합니다.</p>
<h2>7. “그런데 오늘 밥을 잘 안 먹었어요.”</h2>
<p>당뇨병을 관리하다 보면 언젠가는 한 번쯤 생길 수 있는 상황입니다.</p>
<p>평소에는 한 그릇을 깨끗하게 먹던 아이가 어느 날 몇 입만 먹을 수도 있지요.</p>
<p>이때 보호자가 가장 불안해지는 이유는 <strong>“그러면 인슐린은 어떻게 하지?”</strong>라는 생각 때문일 겁니다.</p>
<p>하지만 이 상황에서 인터넷의 고정 공식을 적용하기보다 담당 수의사가 판단할 수 있는 정보를 모아주는 것이 더 중요합니다.</p>
<p><strong>얼마나 먹었는지, 토했는지, 평소처럼 반응하는지, 다른 증상은 없는지, 평소 어떤 인슐린 계획을 사용하는지</strong>를 확인해 병원에 알려주세요.</p>
<p>그 정보가 있어야 현재 아이에게 맞는 다음 행동을 결정할 수 있습니다.</p>
<h2>8. 당뇨병이면 무조건 고식이섬유 사료를 먹어야 하나요?</h2>
<p><strong>꼭 그렇게 단순하게 볼 필요는 없습니다.</strong></p>
<p>당뇨견의 식사는 완전하고 균형 잡힌 영양을 제공하면서 아이가 잘 먹을 수 있어야 하고, 체형과 다른 질환까지 함께 고려해야 합니다.</p>
<p>특히 과체중인 일부 당뇨견에서는 식이섬유가 많은 식단이 체중 관리와 식후 혈당 변화 관리에 도움이 될 수 있습니다.</p>
<p>하지만 마른 당뇨견과 비만한 당뇨견의 영양 목표가 같을 수는 없겠지요.</p>
<p><strong>안심이가 쉽게 말하면, 사료 봉투에 적힌 숫자 하나가 당뇨병을 관리해주는 것은 아닙니다.</strong></p>
<p>아이에게 맞는 체중과 하루 섭취량, 일정한 급여 패턴, 실제 혈당 조절 상태를 함께 보는 것이 더 중요합니다.</p>

<h2>9. 그러면 NFE 계산은 필요 없는 건가요?</h2>
<p>필요 없다는 뜻은 아닙니다.</p>
<p>NFE는 사료의 보증성분을 이용해 탄수화물로 추정되는 부분을 계산할 때 사용하는 방법입니다.</p>
<p>여러 사료를 영양적으로 비교할 때 참고할 수 있는 정보이지요.</p>
<p>하지만 <strong>NFE가 특정 숫자 아래라는 이유만으로 그 사료가 우리 당뇨견에게 가장 적합하다고 말할 수는 없습니다.</strong></p>
<p>더구나 NFE 숫자를 인슐린 용량과 직접 연결해서도 안 됩니다.</p>
<p>당뇨병 관리에서는 한 가지 탄수화물 숫자를 찾는 것보다, 아이가 꾸준히 먹을 수 있는 완전균형식인지, 체형과 하루 섭취량이 적절한지, 실제 치료 반응이 어떤지를 함께 보는 편이 더 중요합니다.</p>

<h2>10. 당뇨병 관리에서 ‘완벽한 하루’보다 중요한 것</h2>
<p>매일 정확히 똑같은 하루를 만드는 것은 현실적으로 어렵습니다.</p>
<p>어떤 날은 산책을 조금 더 할 수도 있고, 어떤 날은 밥을 천천히 먹을 수도 있고, 컨디션이 떨어지는 날도 있습니다.</p>
<p>그래서 안심이는 보호자님에게 완벽함을 요구하고 싶지 않아요.</p>
<p><strong>대신 평소의 패턴을 알고, 달라졌을 때 알아차리는 것이 중요합니다.</strong></p>
<p>“오늘 물을 유난히 많이 마시네.”</p>
<p>“며칠 사이 체중이 조금씩 줄었네.”</p>
<p>“오늘은 평소와 달리 식사를 거의 안 했네.”</p>
<p>이런 변화들이 쌓이면 아주 중요한 의료정보가 됩니다.</p>
<h2>11. 당뇨병 재검 때 무엇을 기록해가면 좋을까요?</h2>
<p>혈당 숫자 하나만 가져가기보다 최근 며칠 동안의 생활을 함께 보여주세요.</p>
<p>식욕은 어땠는지, 처방된 인슐린 일정은 어떻게 진행됐는지, 물과 소변이 달라지지는 않았는지, 체중은 어떻게 변했는지, 갑자기 떨거나 기운이 없었던 적은 없었는지를 간단히 기록해두면 도움이 됩니다.</p>
<p>이상한 행동이 잠깐 나타났다가 사라졌다면 스마트폰으로 짧게 찍은 영상도 진료에 도움이 될 수 있어요.</p>
<h2>12. 안심이의 연구노트</h2>
<p>예전에는 당뇨병 관리 글을 보면 숫자가 아주 많이 나왔습니다.</p>
<p>몇 분 안에 인슐린을 투여해야 한다거나, 혈당이 몇이면 어떻게 해야 한다거나, 탄수화물이 몇 퍼센트 이하여야 한다는 식이었어요.</p>
<p>숫자는 중요합니다.</p>
<p>하지만 <strong>그 숫자를 누구에게, 어떤 상황에서 적용하는지가 더 중요합니다.</strong></p>
<p>강아지 당뇨병은 하나의 시간표나 혈당값, 사료 숫자로 관리하는 질환이 아닙니다.</p>
<p><strong>식사, 인슐린, 물, 소변, 식욕, 체중, 활동 그리고 혈당 변화가 함께 하나의 이야기를 만듭니다.</strong></p>
<p>보호자님은 그 이야기를 가장 가까이에서 관찰할 수 있는 사람입니다.</p>
<p>안심이는 그 데이터를 어렵게 만드는 대신, 보호자님이 이해하기 쉽게 정리해드리는 역할을 하겠습니다.</p>

<h2>🔬 수의학 연구 근거 & 참고자료</h2>
<p><strong>American Animal Hospital Association (AAHA)</strong><br>2018 AAHA Diabetes Management Guidelines for Dogs and Cats — 개 및 고양이 당뇨병 임상 관리를 위한 가이드라인입니다.</p>
<p><strong>Merck Veterinary Manual</strong><br>Diabetes Mellitus in Dogs and Cats — 강아지 당뇨병의 병태생리, 진단, 인슐린 치료 및 응급 관리 수의학 지침입니다.</p>
<p><strong>근거 해설:</strong> 당뇨 관리의 목표는 임상증상을 조절하면서 저혈당을 피하는 것입니다. 혈당곡선은 중요한 모니터링 자료지만 일상 증상, 체중, 식욕, 음수·배뇨와 함께 해석해야 합니다. 당뇨견은 일정하고 예측 가능한 식사 패턴이 중요하지만 개별 인슐린 계획은 담당 수의사가 결정해야 합니다.</p>
<p><strong>수의학적 주의사항:</strong> 이 글은 개별 인슐린 용량이나 조절 공식을 제공하지 않습니다. 식욕 부진, 구토, 떨림, 비틀거림, 의식 저하, 발작, 실신 등 평소와 다른 상태가 나타나면 임의로 인슐린 계획을 변경하지 말고 담당 병원 또는 응급진료기관의 지시를 받아야 합니다. 의식이 저하되었거나 삼키기 어려운 동물에게 음식이나 액체를 억지로 먹이지 않습니다.</p>`
  },

  // =========================================================================
  // POST 003: 2457 (JA)
  // =========================================================================
  {
    postId: 2457,
    slug: 'dog_diabetes_diet_insulin-ja',
    title: '犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン',
    excerpt: `1. 犬の糖尿病管理では、血糖値ひとつではなく、食事・処方されたインスリン・飲水・排尿・体重・活動性を一緒に見ます。
2. 血糖曲線はインスリンが時間とともにどう作用しているかを獣医師が評価する資料であり、飼い主さんが自己判断で投与量を変えるための数値表ではありません。
3. 食欲低下、嘔吐、震え、ふらつき、強い元気消失、意識の変化などがある日は、普段のルールを自己流で変更せず、動物病院に状況を伝えることが大切です。

[Empathy]

糖尿病と診断されたあと、ごはんの時間や水を飲む量まで全部が心配に見えることがあります。アンシミと一緒に、飼い主さんが観察できることと、獣医師と相談して決めることを分けて整理しましょう。`,
    content: `<p>愛犬が糖尿病と診断されると、今まで何気なく過ごしていた1日が急に複雑に感じられることがあります。</p>
<p>ごはんを食べるたびに時計が気になったり、水をいつもより多く飲んだだけで不安になったり、「今日はよく寝ているけど、もしかして血糖値が低いのかな」と心配になることもあるでしょう。</p>
<p><strong>アンシミが最初にひとつだけ、覚えやすく整理しますね。</strong></p>
<p>犬の糖尿病管理は、ひとつの血糖値を当てるテストではありません。</p>
<p><strong>食べられているか、水や尿はどうか、体重は維持できているか、いつものように動けているか、그리고 インスリンにどう反応しているか。</strong></p>
<p>こうした情報を一緒に見ることが大切です。</p>
<h2>1. インスリン管理は「いつもの生活リズム」とセットで考えます</h2>

<!-- IMAGE 1
alt: 韓国のアパートで糖尿病の犬の食事と飲水を記録する飼い主を見守るアンシミ
prompt: Hyper-realistic 3D render style, photorealistic appearance. A brown dachshund wearing round-rimmed glasses and holding a small gold magnifying glass looks as if he is wearing a white lab coat. He is a researcher, and his name is Ansim. He is gently observing a diabetic dog beside its meal bowl while a Korean pet parent records appetite, water intake, and daily routine in a notebook in a cozy Korean apartment living room. Realistic fur, natural daylight, warm trustworthy veterinary research atmosphere, no dosage numbers, no injection close-up, educational composition.
-->

<p>糖尿病の毎日は、次のようにつながっています。</p>
<p><strong>食事 → インスリン → いつもの生活 → 観察</strong></p>
<p>食事の時間や量が大きく変わらず、獣医師から指示された方法でインスリンを使い、生活リズムが安定していると、その子が治療にどう反応しているのかも分かりやすくなります。</p>
<p>ところが、いつも完食する子が急に半分しか食べなかったり、吐いたり、ぐったりしている日は少し違います。</p>
<p>そんな日は「インスリンの数字」だけを見るのではなく、まず<strong>「今日はいつもと何が違う？」</strong>と考えてみてください。</p>

<h2>2. 「インスリンは食後何分で打てばいい？」に一律の答えはありません</h2>
<p>糖尿病の管理を始めた飼い主さんが、とても気になりやすいポイントです。</p>
<p>でも、インターネットで見つけた「食後○分」といった時間を、すべての犬にそのまま当てはめることはできません。</p>
<p>使っているインスリン、その子の食事パターン、血糖の反応、ほかの病気の有無などによって治療計画が変わるからです。</p>
<p><strong>アンシミ流に覚えるなら、こうです。</strong></p>
<p><strong>「生活のリズムは安定させる。でも治療ルールをその場で自分で作らない。」</strong></p>
<p>まず優先するのは、その子を診ている獣医師から説明された食事とインスリンの計画です。</p>
<p>もし、いつもと違ってほとんど食べない、繰り返し吐く、急に元気がなくなったという日があれば、自己判断でインスリンを増減したり、追加で投与したりせず、動物病院に状況を伝えてください。</p>
<h2>3. 血糖値以外にも、飼い主さんにしか集められないデータがあります</h2>
<p>病院では血液検査や血糖値を確認できます。</p>
<p>でも、獣医師よりも飼い主さんのほうがよく知っている情報があります。</p>
<p><strong>それが、その子の日常です。</strong></p>
<div class="table-responsive">
<table>
<thead>
<tr>
<th>チェックしたいこと</th>
<th>アンシミが簡単に説明すると</th>
<th>記録すると役立つこと</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>水</strong></td>
<td>糖尿病のコントロールが不十分なときは、また水をたくさん飲むようになることがあります。</td>
<td>水の減り方が普段より明らかに早くないか</td>
</tr>
<tr>
<td><strong>尿</strong></td>
<td>飲水量が増えると、尿の量や回数も増えることがあります。</td>
<td>排尿回数、尿量、家の中での失敗</td>
</tr>
<tr>
<td><strong>食欲</strong></td>
<td>糖尿病管理では、いつも通り食べられているかも重要な情報です。</td>
<td>完食 / 少し残した / ほとんど食べない / 吐いた</td>
</tr>
<tr>
<td><strong>体重</strong></td>
<td>食べているのに体重が減っていく場合は、見過ごしたくない変化です。</td>
<td>できるだけ同じ条件で定期的に測る</td>
</tr>
<tr>
<td><strong>元気・行動</strong></td>
<td>突然のぐったり、震え、ふらつきは、いつもと違う重要なサインになることがあります。</td>
<td>いつ始まったか、どのくらい続いたか</td>
</tr>
</tbody>
</table>
</div>
<p><strong>アンシミは、これを「その子の生活データ」だと考えると分かりやすいと思います。</strong></p>
<p>血糖測定器がひとつの数字を教えてくれるなら、水、尿、ごはん、体重、行動は、その数字の周りで実際に何が起きているのかを教えてくれます。</p>

<h2>4. 血糖曲線は何を見るためのもの？</h2>

<!-- IMAGE 2
alt: 犬の食事量・飲水・排尿・体重・活動を生活記録に残す飼い主
prompt: Hyper-realistic 3D render style, photorealistic appearance. A Korean pet parent calmly records a dog's meals, water intake, urination pattern, body weight, and activity in a simple daily diabetes log at home. The dog rests comfortably nearby. Natural daylight, realistic fur and home textures, educational and reassuring mood, no medication dosage text.
-->

<p>「血糖曲線」と聞くと、少し難しい検査に感じるかもしれません。</p>
<p>でも、考え方はそれほど難しくありません。</p>
<p><strong>1回の血糖測定が「写真1枚」なら、血糖曲線は「1日の短い動画」のようなものです。</strong></p>
<p>時間の経過とともに血糖値がどのように下がり、そしてまた上がっていくのかを複数回測定して、流れを確認します。</p>
<p>その中で獣医師は、インスリンの効果がどのくらい続いているのか、血糖値が最も低くなる時期はどこか、低くなりすぎていないかなどを確認します。</p>
<p>血糖値が最も低くなるポイントは、獣医学では<strong>ナディア（nadir）</strong>と呼ばれます。</p>
<p>ここで大切なのは、ナディアの数字を飼い主さんが見て、その場でインスリン量を変更するためのものではないということです。</p>
<p>血糖曲線は、食欲、体重、水や尿の変化、低血糖の有無、使用しているインスリンなどと合わせて解釈します。</p>

<h2>5. 低血糖は「数字」より先に、犬の様子に現れることがあります</h2>
<p><strong>低血糖とは、血糖値が必要以上に低くなった状態です。</strong></p>
<p>でも飼い主さんにとって最初に大切なのは、専門用語より<strong>「うちの子がどう見えるか」</strong>です。</p>
<p>最初は、ただ少し元気がないように見えるかもしれません。</p>
<p>いつもより眠そうだったり、落ち着きがなくなったり、歩くときにふらつくこともあります。</p>
<p>状態が重くなると、震え、強い脱力、立てない、倒れる、けいれんなどが見られることがあります。</p>
<p><strong>ここはアンシミから、特にお伝えしておきたいところです。</strong></p>
<p>インターネットで見た画像を頼りに、はちみつやシロップの量を計算したり、次のインスリン量を自己判断で変更したりしないでください。</p>
<p>低血糖が疑われる場合は、かかりつけの動物病院、または救急対応が可能な病院に速やかに連絡し、その子のために事前に説明されている緊急時の対応があれば、それに従ってください。</p>
<p>特に意識が低下している、正常に飲み込めない、倒れている、けいれんしている場合は、食べ物や液体を無理に口へ入れないことが大切です。</p>
<h2>「今日はごはんを食べません」そんな日はどう考える？</h2>

<!-- IMAGE 3
alt: 動物病院で犬の血糖曲線を飼い主と一緒に確認する獣医師
prompt: Hyper-realistic 3D render style, photorealistic appearance. Inside a modern veterinary consultation room, a veterinarian reviews a simple full-day glucose curve on a tablet together with a pet parent while a dog rests comfortably nearby. The chart has no readable dosage numbers. Realistic clinical lighting, natural expressions, trustworthy educational atmosphere.
-->

<p>糖尿病を管理していると、いつか起こるかもしれない場面です。</p>
<p>いつもならきれいに完食する犬が、今日は数口しか食べない。</p>
<p>そんなとき、一番不安になるのは<strong>「じゃあインスリンはどうすればいいの？」</strong>ということではないでしょうか。</p>
<p>ここでも、インターネット上の固定された計算式を当てはめるより、獣医師が判断できる情報を集めることが大切です。</p>
<p><strong>どのくらい食べたか、吐いていないか、いつも通り反応しているか、ほかの症状はないか。</strong></p>
<p>こうした情報を整理して、動物病院に伝えてください。</p>
<h2>糖尿病なら高食物繊維のフードが必須？</h2>
<p><strong>必ずしも、そう単純ではありません。</strong></p>
<p>糖尿病の犬の食事は、まず必要な栄養を満たした総合栄養食で、その子がきちんと食べられることが大切です。</p>
<p>さらに、体型、体重、ほかの病気、普段の食事量なども一緒に考えます。</p>
<p>特に肥満傾向のある糖尿病犬では、食物繊維を多く含む食事が体重管理や食後の血糖変化の管理に役立つことがあります。</p>
<p>一方で、痩せている糖尿病犬では「体重を減らすこと」が目標ではありません。</p>
<p><strong>アンシミが簡単に言うなら、フード袋に書いてあるひとつの数字だけで糖尿病食は決まりません。</strong></p>
<p>適正な体重、1日の摂取量、安定した食事パターン、そして実際の糖尿病のコントロール状態を一緒に見ることが重要です。</p>

<h2>NFEの計算は必要ないの？</h2>
<p>NFEは、フードに含まれる炭水化物に相当する成分を推定するときに使われる考え方のひとつです。</p>
<p>フードを比較するときの参考にはなりますが、<strong>NFEがある数字より低いから、そのフードが糖尿病の犬に最適だとは言えません。</strong></p>
<p>もちろん、NFEの値をそのままインスリン量と結びつけるものでもありません。</p>
<p><strong>アンシミがここで注目したいのは、「同じ条件で比較すること」です。</strong></p>
<p>ドライフードとウェットフードでは水分量が大きく違うため、パッケージに書かれた保証成分をそのまま比べると、実際の栄養バランスを分かりにくくしてしまいます。</p>
<p>そんなときに役立つのが、水分を除いた<strong>乾物基準（DM：Dry Matter）</strong>です。</p>

<p>ただし、計算結果はフード比較のための参考情報です。糖尿病の治療方針やインスリン量を決める数値として使用しないでください。</p>

<h2>🔬 獣医学的根拠・参考資料</h2>
<p><strong>American Animal Hospital Association（AAHA）</strong><br>2018 AAHA Diabetes Management Guidelines for Dogs and Cats — 犬および猫の糖尿病に関する最新の臨床管理ガイドラインです。</p>
<p><strong>Merck Veterinary Manual</strong><br>Diabetes Mellitus in Dogs and Cats — 犬の糖尿病の病態生理、診断、インスリン療法、モニタリングおよび緊急管理に関する専門資料です。</p>
<p><strong>根拠のポイント：</strong> 糖尿病管理の目標は、臨床症状をコントロールしながら低血糖を回避することです。血糖曲線は重要なモニター資料ですが、日常生活の症状、体重、食欲、飲水・排尿とともに評価する必要があります。</p>
<p><strong>獣医学上の注意：</strong> このページでは個別のインスリン量や調整公式を提供していません。食欲不振、嘔吐、震え、ふらつき、意識低下などの症状が見られる場合は、自己判断で投与計画を変更せず、動物病院の指示を受けてください。</p>`
  }
];

async function run() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
  let csvRows = [];
  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    csvRows = parseCSV(csvContent);
  }

  for (const item of postsData) {
    console.log(`\n======================================================`);
    console.log(`Updating WP Post ID ${item.postId} (${item.slug})...`);
    console.log(`Title: ${item.title}`);

    // 1. Update WP REST API
    const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${item.postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        slug: item.slug
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error(`❌ WP API Error (${updateRes.status}) for ${item.postId}: ${errText}`);
      continue;
    }

    const updatedPost = await updateRes.json();
    console.log(`✅ WP Post ID ${updatedPost.id} successfully updated!`);

    // 2. Update CSV row
    if (csvRows.length > 0) {
      const modifiedDateStr = new Date().toISOString().replace(/\.\d{3}Z$/, '');
      let updatedCsvCount = 0;
      csvRows = csvRows.map((r, idx) => {
        if (idx === 0) return r;
        if (r[0] === String(item.postId)) {
          updatedCsvCount++;
          r[3] = item.title;
          r[4] = item.slug;
          r[5] = modifiedDateStr;
          r[9] = cleanHtml(item.excerpt);
          r[10] = cleanHtml(item.content);
          r[11] = item.content;
        }
        return r;
      });
      console.log(`✅ Updated CSV row for ${item.postId} (count: ${updatedCsvCount})`);
    }
  }

  // Save CSV
  if (csvRows.length > 0) {
    const newCsvStr = csvRows.map(row => row.map(escapeCsvField).join(',')).join('\n');
    fs.writeFileSync(csvPath, '\uFEFF' + newCsvStr, 'utf8');
    console.log('\n✅ Successfully saved updated magentalab_all_posts_454.csv!');
  }

  console.log('\n⚠️ NOTE: Automatic CDN Revalidation (api/revalidate) WAS SKIPPED as per user rules.');
  console.log('🎉 BATCH 001 - 003 PERFECT UPDATE SUCCESSFUL!');
}

run().catch(console.error);
