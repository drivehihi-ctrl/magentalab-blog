require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 5961;
const title = "犬の皮膚病でまず確認したい7つのサイン：かゆみ・フケ・赤み・脱毛から原因を考える";

const excerpt = `1. 犬がかゆがっているからといって、すべてが「アレルギー」とは限りません。ノミやダニ、細菌・酵母、皮膚糸状菌、アレルギー性皮膚疾患、そして一部の全身性疾患でも似た皮膚症状が現れることがあります。

2. 最初に病名を当てようとするより、どこをかいているのか、皮膚が赤いか、においが変わったか、毛が抜けているか、フケやかさぶたがあるかを見てみましょう。

3. 皮膚病は見た目だけで原因を特定できないことが少なくありません。かゆみが繰り返す場合は、経過や皮膚病変の分布、皮膚細胞診、皮膚掻爬、寄生虫の確認などから原因を絞っていきます。

[Empathy]

愛犬がずっと体をかいていると、「いったい何の病気なんだろう」と気になりますよね。

でも皮膚病は、写真と病名を一対一で当てるクイズではありません。

まずは、愛犬の皮膚が見せているサインを一緒に整理してみましょう。`;

let userBodyHtml = `<p>犬がときどき体をかくのは自然な行動です。</p>

<p>でも、眠っていたのに起きてまでかく、同じ足を何度もなめる、同じ場所をかみ続けて毛が濡れたり薄くなったりするなら、少し違う見方が必要です。</p>

<p>飼い主さんから見ると、どれも「かゆい皮膚病」に見えるかもしれません。</p>

<p>けれど原因は一つとは限りません。</p>

<p>アレルギー、ノミやダニなどの外部寄生虫、細菌や酵母の増殖、皮膚糸状菌、そのほか皮膚そのものの病気が関わることがあります。場合によっては、全身性の病気が皮膚や被毛の変化として現れることもあります。</p>

<p><strong>アンシミが分かりやすく整理しますね。</strong></p>

<p>皮膚は外から見えるので変化に気づきやすい一方で、<strong>違う病気がよく似た姿で現れる</strong>という特徴があります。</p>

<p>だから最初から病名を決めつけず、見えている変化を一つずつ確認することが大切です。</p>

<h2>1. 何度もかく・なめる・かむ</h2>

<p>かゆみは、犬の皮膚トラブルで飼い主さんが気づきやすいサインの一つです。</p>

<p>耳の後ろを繰り返しかく、足先をずっとなめる、お腹や脇腹をかむような行動として見えることがあります。</p>

<p>ただし、大切なのは<strong>「かゆがっている」ことだけではありません。</strong></p>

<p><strong>どこをかくのか、いつ始まったのか、季節で変わるのか、どのくらい強いのか、以前の治療でどう変わったのか。</strong></p>

<p>こうした情報が、原因を絞る手がかりになります。</p>

<p>AAHAもアレルギー性皮膚疾患が疑われる犬では、かゆみの程度、季節性、発症時期と経過、外部寄生虫予防、以前の治療への反応などを詳しく確認することを勧めています。</p>

<!-- IMAGE 1 -->

<h2>2. 皮膚が赤くなっている</h2>

<p>毛をかき分けたとき、いつもより皮膚が赤く見えるなら炎症が起きている可能性があります。</p>

<p>足先、わき、股、皮膚のしわ、耳の周囲などで目立つことがあります。</p>

<p>ただし、<strong>赤い皮膚そのものが病名ではありません。</strong></p>

<p>アレルギー性炎症でも赤くなりますし、何度もかくことで皮膚が傷つき、その上で細菌や酵母が増えて炎症が強くなることもあります。</p>

<p>そのため「赤い＝アレルギー」と一つの原因に直結させないことが大切です。</p>

<h2>3. フケや鱗屑が増えた</h2>

<p>黒い毛の上に白いフケが目立つと、「乾燥しているのかな」と考えやすいですよね。</p>

<p>乾燥で増える場合もありますが、炎症、感染、皮膚糸状菌症、角化や皮脂の異常などでも鱗屑が見られることがあります。</p>

<p><strong>アンシミなら、フケだけを単独では見ません。</strong></p>

<p>周囲が赤くないか、毛が抜けていないか、かさぶたやにおいがないか、皮膚が脂っぽくなっていないかも一緒に見てみます。</p>

<!-- IMAGE 2 -->

<h2>4. 皮膚のにおいがいつもと違う</h2>

<p>犬にはもともとその子らしい体臭があります。</p>

<p>でも一部分から急に強いにおいがするようになり、赤みや脂っぽさ、かゆみも一緒に見られるなら、皮膚の状態が変わっている可能性があります。</p>

<p>細菌や酵母の増殖では、においと炎症が一緒に見られることがあります。</p>

<p>またアレルギー性皮膚疾患では、二次的な細菌・酵母感染が加わってかゆみを悪化させることがあります。AAHAもこうした二次感染を診断・管理の中で確認するよう推奨しています。</p>

<h2>5. 毛が抜けた、薄くなった</h2>

<p>脱毛も原因によって見え方が違います。</p>

<p>かゆくてなめたりかいたりした結果、毛が折れて薄くなる犬もいます。</p>

<p>一方で、強いかゆみがないのに被毛が薄くなっていくこともあります。</p>

<p><strong>アンシミなら「かゆみが先だったのか、それとも毛が先に抜けたのか」を確認します。</strong></p>

<p>経過や脱毛の分布、炎症の有無は、次に何を調べるかを考える手がかりになります。</p>

<!-- IMAGE 3 -->

<h2>6. かさぶた、湿った部分、小さなブツブツがある</h2>

<p>毛の中に小さなかさぶたが触れたり、小さく盛り上がった病変が見えたり、湿ってただれた部分ができたりすることがあります。</p>

<p>細菌性皮膚炎を含め、いくつかの皮膚病で似た変化が起こるため、写真だけで原因を決めることはできません。</p>

<p>また、かゆみのためになめたりかいたりし続けると、小さな病変が短期間で広がることもあります。</p>

<p><strong>大きさだけでなく、数日の間にどのくらい変化しているか</strong>も見てください。</p>

<h2>7. 耳や足のトラブルも何度も繰り返す</h2>

<p>耳と足は、繰り返す皮膚病で大切なヒントになることがあります。</p>

<p>体より先に足先をなめ続けたり、耳を何度もかいたりする犬もいます。</p>

<p>足の赤み、唾液による毛色の変化、繰り返す外耳炎などはアレルギー性皮膚疾患で見られることがあります。</p>

<p>ただし、その分布だけでアトピー性皮膚炎と診断することはできません。</p>

<p>AAHAはアトピーを<strong>除外診断</strong>と位置づけており、ICADAも似た症状を示すほかの病気を除外してから診断することを推奨しています。</p>

<!-- IMAGE 4 -->

<h2>では、犬の皮膚病にはどんな原因がある？</h2>

<p>ここまで読むと、「結局うちの子は何の皮膚病？」と思いますよね。</p>

<p>アンシミは、病名をたくさん覚えるよりも、まず<strong>原因の方向</strong>をいくつかに分けて考える方が分かりやすいと思います。</p>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>原因のグループ</th>
<th>飼い主さんが気づくこと</th>
<th>なぜ区別が必要？</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>アレルギー性皮膚疾患</strong></td>
<td>繰り返すかゆみ、足なめ、耳のトラブル、顔・腹・わきの炎症</td>
<td>環境、ノミ、食物に関連するアレルギーは見た目が重なることがあります。</td>
</tr>
<tr>
<td><strong>ノミ・ダニなどの外部寄生虫</strong></td>
<td>強いかゆみ、脱毛、かさぶた、特定部位に集中する病変</td>
<td>寄生虫の種類や予防状況によって確認方法が変わります。</td>
</tr>
<tr>
<td><strong>細菌・酵母関連の皮膚炎</strong></td>
<td>赤み、におい、脂っぽさ、かさぶた、かゆみ</td>
<td>単独で起こる場合も、別の皮膚病に二次的に起こる場合もあります。</td>
</tr>
<tr>
<td><strong>真菌性皮膚疾患</strong></td>
<td>脱毛、フケ、かさぶた、赤みなど</td>
<td>皮膚糸状菌症などは検査で確認する必要があります。</td>
</tr>
<tr>
<td><strong>全身性疾患・その他の皮膚疾患</strong></td>
<td>かゆみの少ない脱毛、被毛の変化、色素変化など</td>
<td>一部の内分泌疾患などは皮膚だけを治療しても解決しません。</td>
</tr>
</tbody>
</table>
</div>

<p>ここで一つ覚えておきたいことがあります。</p>

<p><strong>細菌や酵母が見つかったからといって、それが必ず最初の原因だったとは限りません。</strong></p>

<p>アレルギーや寄生虫などが先に皮膚を傷め、その後に二次感染が起こることもあります。</p>

<h2>「アレルギーっぽいからフードを変えればいい？」</h2>

<p>かゆみを見ると、まず食べ物を疑いたくなることがあります。</p>

<p>でも、かゆみだけで食物が原因だと判断することはできません。</p>

<p>環境アレルギー、ノミアレルギー、寄生虫、感染なども似た症状を作ります。</p>

<p>AAHAは、病歴や身体検査だけではアトピーと食物アレルギーを区別できないため、必要に応じて適切な食事試験を診断過程に組み込むとしています。</p>

<p><strong>つまり、「フードを変えたら少し良くなった」と「食物アレルギーと診断された」は同じ意味ではありません。</strong></p>

<!-- IMAGE 5 -->

<h2>動物病院では何を調べる？</h2>

<p>皮膚病というと、皮膚を見ればすぐ病名が分かるように思うかもしれません。</p>

<p>でも、繰り返すかゆみでは段階的な確認が必要になることが多いです。</p>

<p>AAHAは詳しい病歴と身体検査のあと、必要に応じて<strong>皮膚細胞診、ノミの確認、皮膚掻爬、耳に症状があれば耳垢細胞診</strong>などを含む基本的な皮膚科検査を行うことを推奨しています。</p>

<p>その結果によっては、さらに別の検査が必要になる場合もあります。</p>

<p><strong>アンシミが簡単に言えば、皮膚診療は「見た目で病名を当てる」より、可能性を一つずつ絞っていく作業に近いです。</strong></p>

<h2>頻繁にシャンプーすれば治る？</h2>

<p>入浴やスキンケアが役立つ皮膚病はあります。</p>

<p>ただし、すべての犬に同じシャンプーや頻度が合うわけではありません。</p>

<p>ICADAも犬アトピー性皮膚炎の管理では入浴や被毛ケアを含む複数の方法を組み合わせることを説明しており、入浴だけで治すという考え方ではありません。</p>

<p>そのため、このページでは「何日ごとに洗う」という一律のルールは示しません。</p>

<h2>こんなときは様子見を続けないで</h2>

<p>たまに体をかくのと、かゆくて眠れず自分の皮膚を傷つけるほどかき続けるのは違います。</p>

<p>皮膚の赤みや病変が急速に広がる、出血や滲出液がある、強い痛みがある、耳や皮膚の問題を何度も繰り返す場合は診察を受けることをおすすめします。</p>

<p>顔が急に腫れたり、呼吸がおかしいなど急な全身症状を伴う場合は、速やかな動物病院での評価が必要です。</p>

<p>食欲低下、強い元気消失、原因不明の体重変化などが皮膚症状と一緒に起きている場合も、皮膚だけの問題と決めつけないようにしましょう。</p>

<!-- IMAGE 6 -->

<h2>アンシミがおすすめする皮膚の記録</h2>

<p>皮膚病の経過の大部分は診察室ではなく、自宅で起こっています。</p>

<p>だから飼い主さんの記録はとても役立ちます。</p>

<p>かゆみが始まった時期、最もかゆがる場所、季節による変化、ノミ・ダニ予防の状況、以前の治療でどう変化したかなどを簡単に残しておきましょう。</p>

<p>これらはAAHAがかゆみのある犬の病歴で重視している項目とも重なります。</p>

<p>同じ明るさ、同じ距離で数日ごとに写真を撮ると、変化も比べやすくなります。</p>

<p><strong>皮膚では、一枚の写真より「どう変わってきたか」が大切な情報になることがあります。</strong></p>

<h2>アンシミの研究ノート</h2>

<p>犬の皮膚病を検索すると、「足をなめる＝アレルギー」「フケ＝乾燥肌」のように一つの症状と一つの病名を結びつけた説明を見かけます。</p>

<p>でも実際の皮膚病は、もっと重なり合っています。</p>

<p><strong>同じかゆみでも me、アレルギー、寄生虫、感染、あるいは複数の問題が同時に関わっていることがあります。</strong></p>

<p>だからアンシミは、皮膚病の名前をたくさん覚えてほしいわけではありません。</p>

<p>まず<strong>「どこが」「いつから」「どう変わっているか」</strong>を見てほしいと思っています。</p>

<p>その情報が積み重なると、漠然とした「皮膚病」が、原因を探すための具体的な手がかりに変わっていきます。</p>`;

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
      console.log('⚠️ Post 5961 not found in CSV to update.');
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

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 5961!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
