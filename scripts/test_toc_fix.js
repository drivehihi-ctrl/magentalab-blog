require('dotenv').config({ path: '.env.local' });

async function testFixWpLinksLocal4() {
  const res = await fetch('https://magentalab.mycafe24.com/wp-json/wp/v2/posts/1792');
  const post = await res.json();
  let fixed = post.content ? post.content.rendered : '';

  const h2Matches = Array.from(fixed.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/gi));
  let refH2Index = -1;
  for (const match of h2Matches) {
    if (match[0].includes('🔬') || match[0].includes('수의학 연구 근거') || match[0].includes('Veterinary Evidence') || match[0].includes('獣医学')) {
      refH2Index = match.index;
    }
  }
  if (refH2Index !== -1) {
    fixed = fixed.slice(0, refH2Index);
  }

  // Remove TOC link item
  fixed = fixed.replace(/<li[^>]*class=['"][^'"]*ez-toc-[^'"]*['"][^>]*>[\s\S]*?(?:🔬|수의학 연구 근거|Veterinary Evidence|獣医学)[\s\S]*?<\/li>/gi, '');

  console.log('Fixed HTML contains 🔬 anywhere:', fixed.includes('🔬'));
}

testFixWpLinksLocal4();
