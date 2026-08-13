require('dotenv').config({ path: '.env.local' });

async function verifyTable() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  const fetchRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/2457`, {
    headers: { 'Authorization': authHeader }
  });
  const updatedPost = await fetchRes.json();
  const dbHtml = updatedPost.content.rendered;

  console.log('======================================================');
  console.log('🔬 일본어 포스트 100% 완본 16개 핵심 체크포인트 정밀 검증');
  console.log('======================================================');

  const keyCheckpoints = [
    '飼い主さんが見る変化', // GEO/SEO 표 헤더 1
    '考えられる意味',       // GEO/SEO 표 헤더 2
    'どう扱う？',           // GEO/SEO 표 헤더 3
    '1. インスリン管理は「いつもの生活リズム」とセットで考えます',
    '韓国のアパートで糖尿病の犬の食事と飲水を記録する飼い主を見守るアンシミ',
    '2. 「インスリンは食後何分で打てばいい？」に一律の答えはありません',
    '3. 血糖値以外にも、飼い主さんにしか集められないデータがあります',
    '4. 血糖曲線は何を見るためのもの？',
    '犬の食事量・飲水・排尿・体重・活動を生活記録に残す飼い主',
    '5. 低血糖は「数字」より先に、犬の様子に現れることがあります',
    '6. 「今日はごはんを食べません」そんな日はどう考える？',
    '動物病院で犬の血糖曲線を飼い主と一緒に確認する獣医師',
    '7. 糖尿病なら高食物繊維のフードが必須？',
    '8. NFEの計算は必要ないの？',
    '9. 糖尿病管理では「完璧な1日」より、いつもの状態を知ること',
    '10. 再診のときに持っていくと役立つもの',
    '11. アンシミの研究ノート',
    'アンシミは、難しい数字を増やすのではなく、その情報を飼い主さんが理解しやすい形に整理していきます。'
  ];

  let matchCount = 0;
  keyCheckpoints.forEach((cp, idx) => {
    const isMatched = dbHtml.includes(cp);
    console.log(` Checkpoint ${idx + 1}: ${isMatched ? '✅ 100% 매칭' : '❌ 미매칭'} | "${cp.substring(0, 35)}..."`);
    if (isMatched) matchCount++;
  });

  console.log(`\n🎉 최종 대조 결과: ${matchCount}/${keyCheckpoints.length} (${matchCount === keyCheckpoints.length ? '100% 완전무결 매칭 완료' : '일부 미매칭'})`);
}

verifyTable().catch(console.error);
