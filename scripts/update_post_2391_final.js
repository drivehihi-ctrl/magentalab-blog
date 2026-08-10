require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 2391;
const title = "반려동물 사료 영양성분표 읽는 법 7가지: 탄수화물·NFE·건물기준(DM)까지";

const excerpt = `1. 사료 포장지의 조단백질·조지방 같은 숫자는 중요한 정보지만, 건사료와 습식사료처럼 수분 함량이 크게 다른 제품은 그대로 비교하면 오해할 수 있습니다.

2. 탄수화물이 성분표에 직접 표시되지 않는 경우에는 단백질·지방·섬유·수분·조회분 등을 이용해 탄수화물에 해당하는 부분을 추정할 수 있습니다. 이 계산을 NFE라고 합니다.

3. NFE와 건물기준(DM)은 사료를 비교하는 데 도움이 되는 도구이지, 사료의 전체 품질을 한 숫자로 평가하거나 특정 질병의 예방·치료 여부를 판단하는 기준은 아닙니다.

[공감]

사료 봉투를 뒤집어보면 숫자는 많은데, 정작 “그래서 어느 사료가 어떤 점에서 다른 거지?”라는 생각이 들 때가 있어요.

안심이가 숫자를 외우게 하기보다, 보호자님이 실제로 비교할 수 있도록 하나씩 풀어볼게요.`;

let userBodyHtml = `<p>사료 봉투 뒤쪽을 보면 조단백질, 조지방, 조섬유, 조회분, 수분 같은 단어들이 줄지어 있습니다.</p>

<p>숫자는 분명 적혀 있는데 두 제품을 나란히 놓으면 오히려 더 헷갈리기도 해요.</p>

<p>예를 들어 한 사료의 조단백질이 30%이고 다른 사료가 12%라면, 30%짜리가 실제로도 단백질이 훨씬 많은 사료일까요?</p>

<p><strong>수분 함량이 비슷하다면 어느 정도 비교할 수 있지만, 하나가 건사료이고 다른 하나가 습식사료라면 이야기가 달라집니다.</strong></p>

<p>안심이가 이 글에서 가장 먼저 알려드리고 싶은 건 숫자 자체보다 <strong>같은 기준으로 비교하는 법</strong>입니다.</p>

<h2>1. ‘조단백질’의 조(粗)는 품질이 낮다는 뜻이 아니에요</h2>

<p>처음 성분표를 읽을 때 ‘조단백질’이라는 말부터 낯설 수 있습니다.</p>

<p>여기서 ‘조(crude)’는 거칠다거나 질이 낮다는 뜻이 아니라, 정해진 분석법으로 측정한 영양성분이라는 의미입니다.</p>

<p>조단백질은 단백질과 관련된 양을 분석법으로 추정한 값이고, 조지방과 조섬유도 각각 정해진 분석방법에 따라 표시됩니다.</p>

<p>그래서 조단백질 30%라는 숫자는 <strong>“이 사료의 단백질 원료 품질이 다른 제품보다 더 좋다”</strong>라는 뜻까지 알려주지는 않습니다.</p>

<p>성분표는 영양의 양을 이해하는 출발점이지, 원료의 소화율이나 실제 이용률을 전부 보여주는 성적표는 아니에요.</p>

<!-- IMAGE 1 -->

<h2>2. 왜 탄수화물은 성분표에서 바로 찾기 어려울까요?</h2>

<p>보호자님이 사료 포장을 아무리 살펴봐도 ‘탄수화물 00%’라는 항목이 보이지 않는 제품이 있습니다.</p>

<p>그렇다고 제조사가 반드시 탄수화물을 숨기고 있다는 뜻은 아닙니다.</p>

<p>사료 표시제도에서는 어떤 영양성분을 의무적으로 표시할지 정해져 있고, 시장에 따라 탄수화물이 기본 보증성분으로 직접 표시되지 않는 경우가 있습니다.</p>

<p>예를 들어 AAFCO가 설명하는 미국의 일반적인 Guaranteed Analysis에서는 조단백질과 조지방의 최소치, 조섬유와 수분의 최대치가 기본 보증항목입니다.</p>

<p>그래서 탄수화물에 해당하는 부분을 알고 싶다면 다른 영양성분을 이용해 <strong>추정</strong>하는 방식을 쓰기도 합니다.</p>

<h2>3. NFE는 탄수화물을 직접 측정한 숫자가 아니에요</h2>

<p>NFE는 <strong>Nitrogen-Free Extract</strong>의 약자입니다.</p>

<p>한국어로는 가용무질소물이라고 부르기도 하는데, 이름만 들으면 꽤 어렵게 느껴지죠.</p>

<p><strong>안심이가 쉽게 설명하면, 사료 전체에서 이미 알고 있는 주요 성분들을 빼고 남은 부분으로 탄수화물에 해당하는 양을 추정하는 방식입니다.</strong></p>

<p>일반적인 계산 개념은 다음과 같습니다.</p>

<p><strong>NFE(%) ≈ 100 − 수분 − 조단백질 − 조지방 − 조섬유 − 조회분</strong></p>

<p>하지만 여기에는 중요한 한계가 있어요.</p>

<p><strong>NFE는 탄수화물만을 직접 실험실에서 측정한 값이 아니라 여러 분석값을 차감해서 얻은 추정치입니다.</strong></p>

<p>AAFCO 역시 칼로리 계산 설명에서 탄수화물을 직접 측정하는 대신 NFE 방식으로 추정할 수 있다고 설명합니다.</p>

<!-- IMAGE 2 -->

<h2>4. NFE 계산에서 조회분이 빠져 있다면?</h2>

<p>여기서 보호자님이 실제 사료 봉투를 보고 막히는 경우가 있습니다.</p>

<p><strong>조회분(ash)이 표시돼 있지 않은 제품</strong>입니다.</p>

<p>NFE를 계산하려면 조회분을 포함한 주요 성분값이 필요합니다.</p>

<p>조회분을 모르는 상태에서 임의로 “보통 이 정도겠지”라고 숫자를 넣으면 결과도 그 가정에 따라 달라집니다.</p>

<p>따라서 그런 계산값은 어디까지나 대략적인 추정치로 보는 것이 맞습니다.</p>

<p>안심이는 NFE 결과가 32.7%처럼 나왔다고 해서 <strong>소수점까지 정확한 실제 탄수화물 함량</strong>이라고 받아들이지는 않기를 권해요.</p>

<h2>5. 건사료와 습식사료는 숫자를 그대로 비교하면 안 돼요</h2>

<p>이 부분이 사료 비교에서 가장 중요한 포인트 중 하나입니다.</p>

<p>습식사료는 많은 부분이 수분이고, 건사료는 상대적으로 수분이 적습니다.</p>

<p>그래서 포장지에 적힌 조단백질 수치만 보면 습식사료의 단백질이 훨씬 낮아 보일 수 있어요.</p>

<p>하지만 물을 제외하고 실제 고형분끼리 비교하면 결과가 달라질 수 있습니다.</p>

<p>이때 사용하는 것이 <strong>건물기준(Dry Matter, DM)</strong>입니다.</p>

<p>FDA도 수분 함량이 크게 다른 사료를 비교할 때는 포장지의 as-fed 수치를 그대로 비교하지 말고, 수분을 제외한 건물기준으로 환산해야 의미 있는 비교가 된다고 설명합니다.</p>

<p><strong>안심이가 비유하면, 국과 볶음밥의 영양성분을 물 무게까지 포함해서 그대로 비교하는 것과 비슷해요.</strong></p>

<!-- IMAGE 3 -->

<h2>6. NFE가 낮으면 무조건 좋은 사료일까요?</h2>

<p><strong>그렇게 단순하게 판단하면 안 됩니다.</strong></p>

<p>NFE는 사료의 탄수화물 수준을 비교하는 데 참고할 수 있지만, 사료 전체의 영양 품질을 한 숫자로 평가하는 점수는 아닙니다.</p>

<p>단백질과 지방, 필수 아미노산, 지방산, 비타민과 미네랄, 칼로리, 소화성, 생애단계에 맞는 영양설계 등도 함께 봐야 합니다.</p>

<p>그리고 특정 NFE 비율이 모든 강아지와 고양이에게 공통으로 적용되는 ‘건강선’도 아닙니다.</p>

<p>특히 질환이 있는 반려동물에서는 더욱 조심해야 합니다.</p>

<p><strong>NFE 하나만 보고 당뇨병이나 다른 질환의 예방·치료 효과를 판단해서는 안 됩니다.</strong></p>

<h2>7. 사료 봉투에서는 무엇을 먼저 확인하면 좋을까요?</h2>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>확인할 항목</th>
<th>무엇을 알려주나요?</th>
<th>안심이가 짚는 포인트</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>대상 동물·생애단계</strong></td>
<td>어떤 동물과 생애단계를 위해 만들어졌는지</td>
<td>성장기와 성체의 영양 요구는 같지 않습니다.</td>
</tr>
<tr>
<td><strong>영양적 완전성</strong></td>
<td>주식으로 필요한 영양을 제공하도록 설계됐는지</td>
<td>주식과 간식·보조식은 역할이 다릅니다.</td>
</tr>
<tr>
<td><strong>보증성분</strong></td>
<td>단백질·지방·섬유·수분 등의 기본 정보</td>
<td>최소치와 최대치가 섞여 있다는 점을 봅니다.</td>
</tr>
<tr>
<td><strong>수분</strong></td>
<td>제품에서 물이 차지하는 비율</td>
<td>건식과 습식을 비교할 때 특히 중요합니다.</td>
</tr>
<tr>
<td><strong>칼로리</strong></td>
<td>급여량과 체중 관리에 필요한 에너지 정보</td>
<td>영양비율과 별도로 확인할 가치가 있습니다.</td>
</tr>
<tr>
<td><strong>NFE·DM</strong></td>
<td>탄수화물 추정과 수분 차이를 보정한 비교에 도움</td>
<td>진단이나 치료 숫자가 아니라 비교 도구입니다.</td>
</tr>
</tbody>
</table>
</div>

<h2>사료 성분표에서 자주 생기는 오해 3가지</h2>

<p><strong>첫 번째, “단백질 수치가 높으면 무조건 더 좋은 사료다.”</strong></p>

<p>단백질 양은 중요하지만 그 수치 하나로 전체 사료의 품질을 판단할 수는 없습니다.</p>

<p><strong>두 번째, “탄수화물이 적혀 있지 않으면 제조사가 숨기고 있다.”</strong></p>

<p>탄수화물의 직접 표시 여부는 해당 시장의 표시규정과 제품 정보에 따라 달라질 수 있습니다.</p>

<p><strong>세 번째, “NFE가 낮으면 질병을 예방할 수 있다.”</strong></p>

<p>NFE는 탄수화물 수준을 추정하고 비교하는 방법일 뿐, 특정 질환의 위험이나 치료 결과를 혼자 설명하는 숫자가 아닙니다.</p>

<h2>안심이의 연구노트</h2>

<p>사료 성분표를 깊이 들여다보기 시작하면 숫자가 정말 많아집니다.</p>

<p>단백질 몇 퍼센트, 지방 몇 퍼센트, NFE 몇 퍼센트, 다시 DM으로 환산하면 몇 퍼센트….</p>

<p>그러다 보면 정작 중요한 질문을 놓치기 쉬워요.</p>

<p><strong>“이 사료가 우리 아이에게 주식으로 적절한가?”</strong></p>

<p>안심이는 NFE나 DM 계산이 필요 없다고 생각하지 않습니다.</p>

<p>잘 사용하면 서로 다른 사료를 좀 더 공정하게 비교하는 데 꽤 유용한 도구입니다.</p>

<p>다만 그 계산값을 사료 전체의 점수표로 바꾸지는 않았으면 해요.</p>

<p><strong>숫자는 비교를 도와주는 도구이고, 반려동물에게 맞는 영양은 그보다 훨씬 큰 그림입니다.</strong></p>`;

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
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
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
      console.log('⚠️ Post 2391 not found in CSV to update.');
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

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 2391!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
