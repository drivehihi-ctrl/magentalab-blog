require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 2461;
const title = "ペットフードの成分表示で確認したい7つのポイント：炭水化物・NFE・乾物基準（DM）まで";

const excerpt = `1. ペットフードに表示されている粗たんぱく質や粗脂肪の数字は大切ですが、水分量が大きく違うドライフードとウェットフードをそのまま比較すると、実際の栄養バランスを誤解することがあります。

2. 炭水化物が保証成分として直接表示されていない場合、たんぱく質・脂肪・繊維・水分・灰分などから炭水化物に相当する部分を推定する方法があります。これがNFEです。

3. NFEや乾物基準（DM）はフードを比較するための道具です。一つの数値だけでフード全体の質や、病気の予防・治療効果を判断するものではありません。

[Empathy]

フードの袋を裏返すと数字がたくさん並んでいます。でも数字が多いほど分かりやすいとは限りません。

アンシミと一緒に、「どの数字が高いか」ではなく「同じ条件でどう比べるか」を見ていきましょう。`;

let userBodyHtml = `<p><strong>1.</strong> ペットフードに表示されている粗たんぱく質や粗脂肪の数字は大切ですが、水分量が大きく違うドライフードとウェットフードをそのまま比較すると、実際の栄養バランスを誤解することがあります。</p>

<p><strong>2.</strong> 炭水化物が保証成分として直接表示されていない場合、たんぱく質・脂肪・繊維・水分・灰分などから炭水化物に相当する部分を推定する方法があります。これがNFEです。</p>

<p><strong>3.</strong> NFEや乾物基準（DM）はフードを比較するための道具です。一つの数値だけでフード全体の質や、病気の予防・治療効果を判断するものではありません。</p>

<h2>1. 「粗たんぱく質」の“粗”は品質が悪いという意味ではありません</h2>

<p>「粗たんぱく質」という言葉を見ると、少し品質が低そうに聞こえるかもしれません。</p>

<p>でも、ここでの「粗（crude）」は品質の良し悪しではなく、決められた分析方法で測定した成分という意味です。</p>

<p>粗たんぱく質、粗脂肪、粗繊維は、それぞれ分析方法に基づいて示される数値です。</p>

<p>そのため、粗たんぱく質が30%だからといって、別のフードより必ず「質の良いたんぱく質」が使われているとは限りません。</p>

<p>保証成分は量を理解するための出発点であり、消化性やアミノ酸の利用性まで一つの数字で示すものではありません。</p>

<!-- IMAGE 1 -->

<h2>2. 炭水化物が表示欄に見つからないのはなぜ？</h2>

<p>フードの表示を見ても「炭水化物○%」という項目がないことがあります。</p>

<p>だからといって、必ずしもメーカーが炭水化物を隠しているわけではありません。</p>

<p>ペットフードの表示制度では、どの栄養成分を保証表示する必要があるかが定められており、炭水化物が標準的な保証項目に含まれない制度もあります。</p>

<p>AAFCOが説明する米国の一般的なGuaranteed Analysisでは、粗たんぱく質と粗脂肪の最低値、粗繊維と水分の最高値が基本的な保証項目です。</p>

<p>そのため、炭水化物に相当する量を知りたいときは、ほかの成分から推定する方法が使われることがあります。</p>

<h2>3. NFEは炭水化物を直接測った数字ではありません</h2>

<p>NFEは<strong>Nitrogen-Free Extract</strong>の略です。</p>

<p>日本語では可溶無窒素物などと表現されることがありますが、名前だけでは分かりにくいですよね。</p>

<p><strong>アンシミが簡単に言うと、フード全体から分かっている主要成分を差し引き、残った部分から炭水化物に相当する量を推定する考え方です。</strong></p>

<p>一般的な考え方は次の通りです。</p>

<p><strong>NFE（%）≈ 100 − 水分 − 粗たんぱく質 − 粗脂肪 − 粗繊維 − 灰分</strong></p>

<p>大切なのは、これは<strong>推定値</strong>だということです。</p>

<p>NFEは炭水化物だけを直接分析して得た数値ではなく、ほかの分析値との差から計算します。</p>

<!-- IMAGE 2 -->

<h2>4. 灰分が表示されていない場合は？</h2>

<p>実際のフード表示では、灰分が記載されていない製品もあります。</p>

<p>通常のNFE計算には灰分が必要です。</p>

<p>灰分が分からない状態で「このくらいだろう」と仮の数字を入れると、その結果も仮定を含んだ推定値になります。</p>

<p>計算自体が無意味になるわけではありませんが、精度についての見方は変える必要があります。</p>

<p><strong>アンシミなら、たとえば32.7%という結果が出ても、それを実測された正確な炭水化物量とは考えません。</strong></p>

<h2>5. ドライとウェットは表示値をそのまま比較しない</h2>

<p>ウェットフードには多くの水分が含まれています。</p>

<p>そのため、パッケージ上の粗たんぱく質がドライフードよりかなり低く見えることがあります。</p>

<p>でも表示値は水分を含んだ<strong>as-fed基準</strong>です。</p>

<p>水分量の大きく異なる製品を比較する場合は、水分を除いた<strong>乾物基準（Dry Matter、DM）</strong>に換算すると、より同じ条件で比べやすくなります。</p>

<p>FDAも、水分量の大きく異なるペットフードを比較するときは、保証成分を乾物基準に換算する必要があると説明しています。</p>

<p><strong>アンシミのイメージでは、スープと乾いた料理を水分込みの重さだけで比較しないのと似ています。</strong></p>

<!-- IMAGE 3 -->

<h2>6. NFEが低ければ、必ず良いフード？</h2>

<p><strong>いいえ。</strong></p>

<p>NFEは炭水化物に関する一つの特徴を比較するのには役立ちますが、フード全体の品質を決める点数ではありません。</p>

<p>たんぱく質や脂肪、必須アミノ酸、脂肪酸、ビタミン、ミネラル、エネルギー、生涯ステージに合った栄養設計なども一緒に考える必要があります。</p>

<p>また、すべての犬や猫に共通する「このNFE以下なら健康」という一つの基準もありません。</p>

<p>特に病気のある子では、単純な数値比較はさらに慎重に考える必要があります。</p>

<p><strong>NFEだけを見て糖尿病やほかの病気の予防・治療効果を判断しないことが大切です。</strong></p>

<h2>7. フードの表示では何を順番に見ればいい？</h2>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>確認する項目</th>
<th>分かること</th>
<th>アンシミのポイント</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>対象動物・ライフステージ</strong></td>
<td>どの動物・年齢段階を想定したフードか</td>
<td>成長期と成犬・成猫では必要な栄養が異なります。</td>
</tr>
<tr>
<td><strong>栄養的な完全性</strong></td>
<td>主食として必要な栄養を満たすよう設計されているか</td>
<td>主食とおやつ・補助食は役割が異なります。</td>
</tr>
<tr>
<td><strong>保証成分</strong></td>
<td>たんぱく質・脂肪・繊維・水分などの基本情報</td>
<td>最低値と最高値が混在することに注意します。</td>
</tr>
<tr>
<td><strong>水分</strong></td>
<td>製品に含まれる水の割合</td>
<td>ドライとウェットの比較で特に重要です。</td>
</tr>
<tr>
<td><strong>カロリー</strong></td>
<td>フードが供給するエネルギー</td>
<td>給与量や体重管理を考えるときに重要です。</td>
</tr>
<tr>
<td><strong>NFE・DM</strong></td>
<td>炭水化物の推定や水分差を補正した比較に役立つ</td>
<td>治療目標ではなく比較のための数字です。</td>
</tr>
</tbody>
</table>
</div>

<h2>成分表示でよくある3つの誤解</h2>

<p><strong>1つ目は、「たんぱく質が高いほど必ず良いフード」という考え方です。</strong></p>

<p>量は大切ですが、一つの割合だけでフード全体の栄養価を評価することはできません。</p>

<p><strong>2つ目は、「炭水化物が書いていない＝メーカーが隠している」という考え方です。</strong></p>

<p>炭水化物を直接表示するかどうかは、表示制度や製品情報によって異なります。</p>

<p><strong>3つ目は、「NFEが低ければ病気を予防できる」という考え方です。</strong></p>

<p>NFEは栄養成分を比較するための推定値であり、病気のリスクを一つで説明する数字ではありません。</p>

<h2>アンシミの研究ノート</h2>

<p>フードの表示を詳しく見始めると、数字がどんどん増えていきます。</p>

<p>たんぱく質、脂肪、水分、NFE、そしてDM換算後の数字。</p>

<p>気づくと、「一番低いNFEはどれ？」ということばかり気になってしまうこともあります。</p>

<p>でもアンシミが忘れたくないのは、もっと大きな質問です。</p>

<p><strong>「このフードは、うちの子の主食として適切なのか？」</strong></p>

<p>NFEもDMも、正しく使えば便利な比較方法です。</p>

<p>ただし、それだけでフード全体を採点するものではありません。</p>

<p><strong>数字は比較を助けてくれます。でも栄養は、その数字を囲むもっと大きな話です。</strong></p>`;

// Clean GPT reference tags if any
userBodyHtml = userBodyHtml.replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '');

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
      console.log('⚠️ Post 2461 not found in CSV to update.');
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

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 2461!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
