require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 2457;
const title = "犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン";

const excerpt = `1. 犬の糖尿病管理は、「血糖値を完璧な数字に合わせること」だけではありません。食事、インスリン、水を飲む量、尿、体重、元気の変化を一緒に見ていくことが大切です。

2. インスリンの種類や量、投与のタイミングは、その子の治療計画によって異なります。食欲が落ちた、吐いた、急に元気がなくなったなど、いつもと違う日には自己判断で量や時間を変えず、かかりつけの獣医師に相談しましょう。

3. 血糖曲線は、1回の血糖値では見えない「1日の血糖の動き」を確認するための方法です。ただし、曲線だけで治療を判断するのではなく、飲水量、尿、食欲、体重、低血糖のサインなどと合わせて評価します。

[Empathy]

糖尿病と診断されると、急に数字ばかり가気になってしまうことがあります。

血糖値はいくつならいいの？ インスリンはいつ？ ごはんの炭水化物は？

でも、飼い主さんが内分泌の専門家になる必要はありません。

まず覚えてほしいのは、「いつものその子」を知っておくこと。

アンシミと一緒に、ひとつずつ整理していきましょう。`;

const userBodyHtml = `<p>愛犬が糖尿病と診断されると、今まで何気なく過ごしていた1日が急に複雑に感じられることがあります。</p>

<p>ごはんを食べるたびに時計が気になったり、水をいつもより多く飲んだだけで不安になったり、「今日はよく寝ているけど、もしかして血糖値が低いのかな」と心配になることもあるでしょう。</p>

<p><strong>アンシミが最初にひとつだけ、覚えやすく整理しますね。</strong></p>

<p>犬の糖尿病管理は、ひとつの血糖値を当てるテストではありません。</p>

<p><strong>食べられているか、水や尿はどうか、体重は維持できているか、いつものように動けているか、그리고 インスリンにどう反応しているか。</strong></p>

<p>こうした情報を一緒に見ることが大切です。</p>

<h2>1. インスリン管理は「いつもの生活リズム」とセットで考えます</h2>

<p>糖尿病の毎日は、次のようにつながっています。</p>

<p><strong>食事 → インスリン → いつもの生活 → 観察</strong></p>

<p>食事の時間や量が大きく変わらず、獣医師から指示された方法でインスリンを使い、生活リズムが安定していると、その子が治療にどう反応しているのかも分かりやすくなります。</p>

<p>ところが、いつも完食する子が急に半分しか食べなかったり、吐いたり、ぐったりしている日は少し違います。</p>

<p>そんな日は「インスリンの数字」だけを見るのではなく、まず<strong>「今日はいつもと何が違う？」</strong>と考えてみてください。</p>

<!-- IMAGE 1 -->

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

<!-- IMAGE 2 -->

<h2>4. 血糖曲線は何を見るためのもの？</h2>

<p>「血糖曲線」と聞くと、少し難しい検査に感じるかもしれません。</p>

<p>でも、考え方はそれほど難しくありません。</p>

<p><strong>1回の血糖測定が「写真1枚」なら、血糖曲線は「1日の短い動画」のようなものです。</strong></p>

<p>時間の経過とともに血糖値がどのように下がり、そしてまた上がっていくのかを複数回測定して、流れを確認します。</p>

<p>その中で獣医師は、インスリンの効果がどのくらい続いているのか、血糖値が最も低くなる時期はどこか、低くなりすぎていないかなどを確認します。</p>

<p>血糖値が最も低くなるポイントは、獣医学では<strong>ナディア（nadir）</strong>と呼ばれます。</p>

<p>ここで大切なのは、ナディアの数字を飼い主さんが見て、その場でインスリン量を変更するためのものではないということです。</p>

<p>血糖曲線は、食欲、体重、水や尿の変化、低血糖の有無、使用しているインスリンなどと合わせて解釈します。</p>

<!-- IMAGE 3 -->

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

<!-- IMAGE 4 -->

<h2>NFEの計算は必要ないの？</h2>

<p>NFEは、フードに含まれる炭水化物に相当する成分を推定するときに使われる考え方のひとつです。</p>

<p>フードを比較するときの参考にはなりますが、<strong>NFEがある数字より低いから、そのフードが糖尿病の犬に最適だとは言えません。</strong></p>

<p>もちろん、NFEの値をそのままインスリン量と結びつけるものでもありません。</p>

<p><strong>アンシミがここで注目したいのは、「同じ条件で比較すること」です。</strong></p>

<p>ドライフードとウェットフードでは水分量が大きく違うため、パッケージに書かれた保証成分をそのまま比べると、実際の栄養バランスを分かりにくくしてしまいます。</p>

<p>そんなときに役立つのが、水分を除いた<strong>乾物基準（DM：Dry Matter）</strong>です。</p>

<p>愛犬のフードに含まれるたんぱく質、脂肪、食物繊維などを乾物基準で比べたいときは、Magentalabの<strong>「栄養成分（DM）＆1日の飲水量計算ツール」</strong>も参考にできます。</p>

<p>ただし、計算結果はフード比較のための参考情報です。糖尿病の治療方針やインスリン量を決める数値として使用するものではありません。</p>

<p><strong>→ 내부링크: 사료 탄수화물·NFE 계산 가이드</strong></p>

<h2>糖尿病管理では「完璧な1日」より、いつもの状態を知ること</h2>

<p>毎日まったく同じ生活をするのは現実的ではありません。</p>

<p>散歩が少し長い日もあれば、ごはんをゆっくり食べる日もあります。少し元気がない日だってあります。</p>

<p>だからアンシミは、飼い主さんに完璧さを求めたいわけではありません。</p>

<p><strong>大切なのは「いつもの状態」を知っていて、そこから変わったときに気づけることです。</strong></p>

<p>「今日は水を飲む量が多い気がする」</p>

<p>「最近少しずつ体重が減っている」</p>

<p>「今日はほとんど食べなかった」</p>

<p>こうした小さな変化も、積み重なると大切な医療情報になります。</p>

<h2>再診のときに持っていくと役立つもの</h2>

<p>血糖値だけではなく、最近の生活の様子も一緒に伝えてみてください。</p>

<p>食欲、食事量、処方されたインスリン計画、水や尿の変化、体重、元気の変化、震えやふらつきがなかったかなど、簡単なメモでも役立ちます。</p>

<p>変わった行動が短時間だけ現れて消えてしまった場合は、可能であればスマートフォンで撮影した動画も診察時の参考になることがあります。</p>

<h2>アンシミの研究ノート</h2>

<p>糖尿病の記事を探していると、たくさんの数字が目に入ります。</p>

<p>「食後何分」「血糖値がいくつ」「炭水化物が何％」といった数字は、確かに医療の中では大切です。</p>

<p>でも<strong>もっと大切なのは、その数字を「どの犬に」「どんな状況で」使うのかということです。</strong></p>

<p>犬の糖尿病は、ひとつの時間、ひとつの血糖値、ひとつのフード成分だけで管理する病気ではありません。</p>

<p><strong>食事、インスリン、水、尿、食欲、体重、活動、そして血糖値の変化。</strong></p>

<p>それらが合わさって、その子の糖尿病管理のストーリーになります。</p>

<p>そして、そのストーリーを毎日いちばん近くで見ているのは飼い主さんです。</p>

<p>アンシミは、難しい数字を増やすのではなく、その情報を飼い主さんが理解しやすい形に整理していきます。</p>`;

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

const originalImgs = [
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2372" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2373" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2374" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2375" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2376" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2378" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2377" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-1024x572.jpeg" alt="犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`
];

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

  // 4. Update local magentalab_all_posts_454.csv
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
      console.log('⚠️ Post 2457 not found in CSV to update.');
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

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 2457!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
