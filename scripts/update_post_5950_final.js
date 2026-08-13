require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 5950;
const title = "강아지 피부병, 먼저 확인할 7가지 신호: 가려움·비듬·붉은 피부부터 원인까지";

const excerpt = `1. 강아지가 계속 긁는다고 모두 같은 피부병은 아닙니다. 알레르기, 벼룩·진드기 같은 외부기생충, 세균·효모 감염, 곰팡이성 피부질환, 피부 자체의 이상이나 일부 전신질환이 비슷한 모습으로 나타날 수 있습니다.

2. 보호자가 먼저 볼 것은 병명보다 어디를 긁는지, 피부가 붉은지, 냄새가 나는지, 털이 빠지는지, 비듬이나 딱지가 생겼는지 같은 실제 변화입니다.

3. 피부질환은 겉모습만으로 원인을 확정하기 어려운 경우가 많습니다. 반복되는 가려움이나 귀·발 문제에서는 피부검사와 병력 확인을 통해 원인을 하나씩 좁혀가는 과정이 중요합니다.

[공감]

우리 아이가 계속 긁고 있으면 보호자님도 같이 신경이 쓰일 수밖에 없어요.

그런데 피부병은 사진 한 장만 보고 “이건 알레르기예요”라고 맞히는 문제가 아닙니다.

안심이가 먼저 보여드릴 건 병명 목록이 아니라, 우리 아이 피부에서 무엇을 관찰해야 하는지예요.`;

const userBodyHtml = `<p>강아지가 몸을 한두 번 긁는 건 자연스러운 행동입니다.</p>

<p>하지만 자다가도 벌떡 일어나 긁고, 발을 계속 핥고, 같은 곳을 깨물어 털이 축축해질 정도라면 조금 다르게 봐야 합니다.</p>

<p>보호자님 눈에는 모두 ‘가려운 피부병’처럼 보일 수 있지만 실제 원인은 하나가 아닐 수 있어요.</p>

<p>알레르기가 원인일 수도 있고, 벼룩이나 진드기 같은 외부기생충, 세균이나 효모의 과증식, 피부사상균 같은 감염, 피부 자체의 이상이 관련될 수도 있습니다. 어떤 경우에는 호르몬을 포함한 전신질환이 털과 피부의 변화로 먼저 드러나기도 합니다.</p>

<p><strong>안심이가 쉽게 설명해볼게요.</strong></p>

<p>피부는 밖에서 바로 볼 수 있어서 변화가 잘 보이는 장기입니다. 대신 <strong>서로 다른 원인이 아주 비슷한 모습으로 나타날 수 있다는 특징</strong>도 있습니다.</p>

<p>그래서 처음부터 병명을 맞히려고 하기보다, 피부에서 보이는 신호를 차근차근 확인하는 것이 더 도움이 됩니다.</p>

<h2>1. 계속 긁거나 핥고 깨물어요</h2>

<p>가려움은 강아지 피부질환에서 보호자가 가장 쉽게 알아차릴 수 있는 신호 가운데 하나입니다.</p>

<p>귀 뒤를 발로 긁거나, 발을 계속 핥거나, 배나 옆구리를 깨무는 모습으로 나타날 수 있습니다.</p>

<p>여기서 중요한 것은 단순히 <strong>“긁는다”</strong>는 사실만은 아니에요.</p>

<p><strong>어디를 긁는지, 언제부터 시작했는지, 계절에 따라 달라지는지, 얼마나 심한지</strong>가 원인을 좁히는 데 더 중요한 정보가 됩니다.</p>

<p>AAHA도 가려운 강아지를 평가할 때 가려움의 정도와 시작 시점, 계절성, 외부기생충 예방 상태, 이전 치료에 대한 반응 등을 자세히 확인하도록 권고합니다.</p>

<!-- IMAGE 1 -->

<h2>2. 피부가 붉어졌어요</h2>

<p>털을 살짝 벌렸을 때 피부가 평소보다 붉게 보인다면 염증이 있다는 신호일 수 있습니다.</p>

<p>특히 발, 겨드랑이, 사타구니, 피부가 접히는 곳, 귀 주변처럼 습하거나 자극을 받기 쉬운 곳에서 눈에 띄기도 합니다.</p>

<p>다만 <strong>붉은 피부 자체가 하나의 병명은 아닙니다.</strong></p>

<p>알레르기성 염증 때문일 수도 있고, 반복해서 긁으면서 피부가 손상됐을 수도 있습니다. 그 위에 세균이나 효모가 2차적으로 늘어나면서 더 붉어지는 경우도 있습니다.</p>

<p>그래서 <strong>“붉다 = 알레르기”</strong>처럼 한 가지 원인으로 바로 연결하지 않는 것이 중요합니다.</p>

<h2>3. 비듬이나 각질이 많아졌어요</h2>

<p>검은 털 사이에 하얀 비듬이 눈에 띄면 가장 먼저 “피부가 건조한가?”라고 생각하기 쉽습니다.</p>

<p>건조함도 한 원인이 될 수 있지만, 각질과 비듬은 피부 염증이나 감염, 피부사상균증, 피지·각질 이상 등에서도 나타날 수 있습니다.</p>

<p>Merck Veterinary Manual에서도 피부사상균증에서 탈모뿐 아니라 각질, 딱지, 홍반 등이 함께 나타날 수 있다고 설명합니다.</p>

<p><strong>안심이는 비듬만 따로 보지 말고 주변 피부를 함께 보라고 말씀드리고 싶어요.</strong></p>

<p>붉지는 않은지, 냄새가 나는지, 털이 빠지는지, 딱지나 작은 병변이 같이 생기지는 않았는지 살펴보세요.</p>

<!-- IMAGE 2 -->

<h2>4. 피부 냄새가 평소와 달라졌어요</h2>

<p>강아지에게는 원래 고유한 체취가 있습니다.</p>

<p>하지만 목욕한 지 얼마 되지 않았는데도 특정 부위에서 평소와 다른 강한 냄새가 나고, 피부가 붉거나 기름져 보인다면 피부 환경이 달라졌을 가능성을 생각해볼 수 있습니다.</p>

<p>세균성 피부염이나 효모의 과증식이 있을 때 이런 변화가 함께 나타나는 경우가 있습니다.</p>

<p>특히 반복적인 알레르기성 피부질환에서는 세균이나 효모 감염이 2차적으로 동반될 수 있기 때문에, 가려움만 줄이는 것과 감염 여부를 확인하는 것은 별개의 문제일 수 있습니다. AAHA 역시 알레르기성 피부질환을 평가할 때 2차 세균·효모 감염을 함께 확인하도록 권고합니다.</p>

<h2>5. 털이 빠지거나 듬성듬성해졌어요</h2>

<p>털이 빠졌다고 모두 같은 탈모는 아닙니다.</p>

<p>강아지가 계속 긁고 핥아서 털이 부러지고 빠지는 경우도 있고, 가려움이 별로 없는데 몸통 양쪽의 털이 비슷한 모양으로 줄어드는 경우도 있습니다.</p>

<p>이 차이는 꽤 중요합니다.</p>

<p>Merck Veterinary Manual은 일부 내분비성 탈모에서는 <strong>가려움이 적으면서 좌우 대칭에 가까운 탈모</strong>가 나타날 수 있다고 설명합니다. 반대로 염증성 피부질환에서는 홍반·각질·가려움 등이 함께 나타나는 경우가 많습니다.</p>

<p><strong>안심이가 여기서 보고 싶은 건 “탈모가 있다”보다 “어떤 순서로 털이 빠졌는가”예요.</strong></p>

<p>먼저 가려워서 긁다가 털이 빠졌는지, 아니면 별로 긁지 않았는데 털부터 얇아졌는지도 진료 때 중요한 정보가 될 수 있습니다.</p>

<!-- IMAGE 3 -->

<h2>6. 딱지, 진물 또는 작은 뾰루지가 보여요</h2>

<p>털 사이를 만졌을 때 작은 딱지가 느껴지거나, 피부에 좁쌀처럼 올라온 병변이 보이거나, 축축하게 진물이 나는 곳이 생길 수도 있습니다.</p>

<p>이런 모습은 세균성 피부염을 포함해 여러 피부질환에서 나타날 수 있기 때문에 사진만 보고 원인을 확정하기 어렵습니다.</p>

<p>최근 업데이트된 Merck Veterinary Manual의 개 피부 세균감염 자료도 세균성 피부염의 진단에서 피부 세포검사와 함께, 피부사상균증이나 기생충 등 다른 원인을 배제하고 <strong>왜 감염이 생겼는지 기저 원인까지 확인하는 과정</strong>을 중요하게 다룹니다.</p>

<p>강아지가 계속 핥고 긁으면 작은 병변도 빠르게 악화될 수 있으니 크기만 보지 말고 <strong>며칠 사이 얼마나 변하고 있는지</strong>도 확인해주세요.</p>

<h2>7. 귀와 발까지 반복해서 문제가 생겨요</h2>

<p>피부 문제를 볼 때 귀와 발은 아주 중요한 단서가 될 수 있습니다.</p>

<p>어떤 강아지는 몸통보다 발가락 사이를 계속 핥거나 귀를 반복해서 긁는 모습으로 먼저 시작합니다.</p>

<p>발 피부가 붉어지거나 침 때문에 털 색이 변하고, 귀가 자주 붉고 가렵거나 외이염이 반복된다면 다른 피부 증상과 함께 살펴볼 필요가 있습니다.</p>

<p>특히 알레르기성 피부질환에서는 발과 귀를 포함한 특정 부위가 반복적으로 영향을 받을 수 있습니다. 하지만 이런 분포만으로 아토피를 확정할 수는 없습니다.</p>

<p>ICADA와 AAHA 모두 아토피성 피부염을 진단할 때 비슷하게 보이는 다른 질환을 먼저 확인하고 배제하는 과정이 필요하다고 설명합니다.</p>

<!-- IMAGE 4 -->

<h2>그렇다면 강아지 피부병의 원인은 무엇일까요?</h2>

<p>여기까지 읽으면 보호자님은 아마 “그래서 우리 아이는 무슨 피부병인가요?”라는 생각이 드실 거예요.</p>

<p>안심이는 병명을 하나씩 외우기보다 <strong>원인의 방향</strong>을 몇 가지로 나누면 훨씬 이해하기 쉽다고 봅니다.</p>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>원인 범주</th>
<th>보호자가 볼 수 있는 모습</th>
<th>왜 구분이 필요할까요?</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>알레르기성 피부질환</strong></td>
<td>반복되는 가려움, 발 핥기, 귀 문제, 얼굴·배·겨드랑이의 피부 변화</td>
<td>환경 알레르기와 음식 관련 반응 등은 겉모습만으로 쉽게 구분되지 않을 수 있습니다.</td>
</tr>
<tr>
<td><strong>벼룩·진드기 등 외부기생충</strong></td>
<td>심한 가려움, 탈모, 딱지, 특정 부위에 집중되는 피부병변</td>
<td>기생충 종류와 예방 상태에 따라 확인 방법이 달라집니다.</td>
</tr>
<tr>
<td><strong>세균·효모 관련 피부염</strong></td>
<td>붉음, 냄새, 딱지, 기름진 피부, 가려움</td>
<td>독립적으로 생기기도 하지만 알레르기나 다른 피부질환에 2차적으로 생길 수도 있습니다.</td>
</tr>
<tr>
<td><strong>곰팡이성 피부질환</strong></td>
<td>탈모, 각질, 딱지, 붉음 등이 다양한 형태로 나타날 수 있음</td>
<td>피부사상균증처럼 검사로 확인해야 하는 감염이 있습니다.</td>
</tr>
<tr>
<td><strong>전신질환과 기타 피부질환</strong></td>
<td>가려움이 많지 않은 대칭성 탈모, 피모 변화, 피부색 변화 등이 나타날 수 있음</td>
<td>일부 호르몬 질환 등은 피부만 치료해서 해결되지 않습니다.</td>
</tr>
</tbody>
</table>
</div>

<p>여기서 아주 중요한 점이 있습니다.</p>

<p><strong>피부에서 세균이나 효모가 발견됐다고 해서 그것이 항상 문제의 시작점이라는 뜻은 아닙니다.</strong></p>

<p>알레르기나 기생충 같은 다른 문제가 먼저 피부를 손상시키고, 그 뒤 2차 감염이 생길 수도 있습니다.</p>

<p>Merck Veterinary Manual 역시 반복적인 세균성 피부염에서 알레르기, 외부기생충, 일부 내분비질환 등 기저 원인을 함께 확인하는 것을 중요하게 설명합니다.</p>

<h2>“알레르기 같으니까 사료부터 바꾸면 되나요?”</h2>

<p>피부가 가려우면 음식부터 의심하는 보호자님이 많습니다.</p>

<p>하지만 피부가 가렵다는 이유만으로 음식 반응이라고 바로 단정할 수는 없습니다.</p>

<p>환경 알레르기, 벼룩 알레르기, 기생충, 감염 등도 비슷한 증상을 만들 수 있기 때문입니다.</p>

<p>특히 아토피와 음식 관련 알레르기성 피부질환은 병력이나 신체검사만으로 확실히 구별하기 어려울 수 있습니다.</p>

<p>AAHA는 이런 경우 체계적인 식이시험을 진단 과정의 한 단계로 사용하며, 좋아졌다는 반응이 있으면 음식 재도전을 통해 실제 음식 관련 반응인지 확인하는 과정을 설명합니다.</p>

<p><strong>그러니까 “사료를 바꿨더니 조금 나아진 것 같다”와 “음식 알레르기로 확인됐다”는 같은 말은 아닙니다.</strong></p>

<!-- IMAGE 5 -->

<h2>병원에서는 피부병을 어떻게 확인할까요?</h2>

<p>피부 진료라고 하면 수의사가 피부를 한 번 보고 바로 병명을 말하는 장면을 떠올릴 수 있습니다.</p>

<p>하지만 특히 반복적으로 가려운 강아지는 보통 그렇게 단순하지 않습니다.</p>

<p>AAHA가 권고하는 기본 접근은 먼저 자세한 병력을 듣고 피부 전체를 살펴본 다음, 필요에 따라 <strong>피부 세포검사, 피부소파검사, 벼룩 확인, 귀에 문제가 있다면 귀 세포검사</strong> 같은 기본 검사를 진행하는 것입니다.</p>

<p>피부사상균이 의심되면 털이나 각질을 직접 확인하거나 배양, PCR 같은 추가 검사가 필요할 수도 있습니다.</p>

<p><strong>안심이가 쉽게 표현하면, 피부 진료는 ‘사진을 보고 병명 하나를 맞히는 과정’이 아니라 가능성을 하나씩 좁혀가는 과정에 가깝습니다.</strong></p>

<h2>목욕을 자주 하면 피부병이 좋아질까요?</h2>

<p>목욕은 피부질환 관리에서 도움이 될 때가 있습니다.</p>

<p>특히 알레르기성 피부질환에서는 피부와 피모 관리의 일부로 적절한 목욕이나 국소 관리가 활용될 수 있습니다.</p>

<p>하지만 <strong>모든 피부병에 똑같은 샴푸와 목욕 횟수가 적용되는 것은 아닙니다.</strong></p>

<p>원인이 무엇인지, 피부 장벽이 어떤 상태인지, 감염이 있는지, 어떤 제품을 사용하는지에 따라 계획이 달라질 수 있습니다.</p>

<p>그래서 이 글에서는 “며칠마다 씻으세요” 또는 “이 성분을 쓰세요” 같은 하나의 고정된 목욕법을 제시하지 않습니다.</p>

<h2>이럴 때는 피부 문제를 그냥 지켜보지 마세요</h2>

<p>한두 번 긁는 것과, 가려움 때문에 잠을 제대로 자지 못하고 계속 몸을 물어뜯는 것은 다릅니다.</p>

<p>피부가 빠르게 붉어지거나 병변이 넓어지고, 피나 진물이 나거나, 만질 때 심하게 아파한다면 진료가 필요합니다.</p>

<p>얼굴이나 입 주변이 갑자기 붓거나 호흡에 이상이 생기는 등 피부 변화와 함께 급격한 전신 반응이 나타난다면 일반적인 피부질환 관찰의 범위를 넘어설 수 있으므로 신속한 진료가 필요합니다.</p>

<p>또 피부 문제와 함께 식욕저하, 심한 무기력, 체중 변화처럼 다른 몸의 변화가 이어진다면 단순히 피부만의 문제라고 생각하지 않는 것이 좋습니다.</p>

<!-- IMAGE 6 -->

<h2>안심이가 권하는 피부 기록법</h2>

<p>피부질환은 진료실에서보다 집에서 보내는 시간이 훨씬 깁니다.</p>

<p>그래서 보호자님의 기록이 의외로 중요한 정보를 만들어줍니다.</p>

<p>언제부터 긁기 시작했는지, 어느 부위를 가장 많이 긁는지, 특정 계절에 심해지는지, 벼룩·진드기 예방은 어떻게 하고 있는지, 이전 치료에서 어떤 반응이 있었는지를 간단히 기록해두면 좋습니다.</p>

<p>이런 정보들은 실제로 AAHA가 가려운 강아지의 병력을 확인할 때 중요하게 보는 항목과도 겹칩니다.</p>

<p>피부 병변은 비슷한 조명과 거리에서 며칠 간격으로 사진을 찍어두는 것도 도움이 됩니다.</p>

<p><strong>피부에서는 사진 한 장보다 ‘어떻게 변해왔는지’가 더 많은 이야기를 해주는 경우가 있습니다.</strong></p>

<h2>안심이의 연구노트</h2>

<p>강아지 피부병을 검색하다 보면 “비듬이면 이 병”, “발을 핥으면 알레르기”처럼 증상 하나와 병명 하나를 바로 연결하는 설명을 쉽게 만나게 됩니다.</p>

<p>하지만 실제 피부질환은 그렇게 간단하지 않을 때가 많아요.</p>

<p><strong>하나의 가려움에도 알레르기, 벼룩과 진드기, 감염 등 여러 가능성이 있고, 한 강아지에게 두 가지 이상의 문제가 함께 있을 수도 있습니다.</strong></p>

<p>특히 알레르기성 피부질환에서는 2차 세균·효모 감염이나 귀 문제가 함께 생기면서 원래의 가려움을 더 심하게 만들 수 있습니다.</p>

<p>그래서 안심이는 피부병을 병명 목록으로 외우게 만들고 싶지 않습니다.</p>

<p>대신 보호자님이 <strong>“어디가, 언제부터, 어떤 모습으로 달라졌는지”</strong>를 먼저 볼 수 있게 도와드리고 싶어요.</p>

<p>그 정보가 쌓이면 막연했던 ‘피부병’이 조금씩 구체적인 문제로 바뀌고, 수의사가 원인을 찾는 데도 더 좋은 단서가 됩니다.</p>`;

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

async function run() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  // 1. Fetch current WP post to extract original <img> tags
  console.log(`Fetching current WP content for Post ID ${postId}...`);
  const getRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    headers: { 'Authorization': authHeader }
  });
  if (!getRes.ok) {
    throw new Error(`Failed to fetch post ${postId}: ${getRes.statusText}`);
  }
  const currentPost = await getRes.json();
  const currentHtml = currentPost.content.rendered || '';

  const originalImgs = currentHtml.match(/<img[^>]+>/gi) || [];
  console.log(`Extracted ${originalImgs.length} original <img> tags from WP.`);

  // 2. Replace <!-- IMAGE X --> comments with actual <img> tags
  let finalContent = userBodyHtml;
  for (let i = 1; i <= 10; i++) {
    const commentRegex = new RegExp(`<!--\\s*IMAGE ${i}[^>]*-->`, 'gi');
    if (i <= originalImgs.length) {
      const imgHtml = `<p class="my-6">${originalImgs[i - 1]}</p>`;
      finalContent = finalContent.replace(commentRegex, imgHtml);
    } else {
      finalContent = finalContent.replace(commentRegex, '');
    }
  }

  // 3. Update WordPress Post via REST API
  console.log(`Updating WordPress Post ID ${postId}...`);
  const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      title: title,
      excerpt: excerpt,
      content: finalContent
    })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`WP API Error (${updateRes.status}): ${errText}`);
  }

  const updatedPost = await updateRes.json();
  console.log(`✅ Successfully updated WP Post ID ${updatedPost.id}!`);
  console.log(`Title: ${updatedPost.title.rendered}`);
  console.log(`Slug: ${updatedPost.slug}`);

  // 4. Update local magentalab_all_posts_454.csv if exists
  const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
  if (fs.existsSync(csvPath)) {
    console.log('Updating magentalab_all_posts_454.csv...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(csvContent);
    let updatedCount = 0;

    const modifiedDateStr = new Date().toISOString().replace(/\.\d{3}Z$/, '');

    const updatedRows = rows.map((r, idx) => {
      if (idx === 0) return r; // Header row
      if (r[0] === String(postId)) {
        updatedCount++;
        r[3] = title;
        r[5] = modifiedDateStr;
        r[9] = cleanHtml(excerpt);
        r[10] = cleanHtml(finalContent);
        r[11] = finalContent;
      }
      return r;
    });

    if (updatedCount > 0) {
      const newCsvStr = updatedRows.map(row => row.map(escapeCsvField).join(',')).join('\n');
      fs.writeFileSync(csvPath, '\uFEFF' + newCsvStr, 'utf8');
      console.log(`✅ Updated ${updatedCount} row(s) in magentalab_all_posts_454.csv!`);
    } else {
      console.log('⚠️ Post 5950 not found in CSV to update.');
    }
  }

  // 5. Trigger Instant CDN Revalidation
  console.log('Triggering instant CDN revalidation...');
  try {
    const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
    const revalJson = await revalRes.json();
    console.log('Revalidate status:', revalJson);
  } catch (err) {
    console.log('Revalidation warning:', err.message);
  }

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 5950!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
