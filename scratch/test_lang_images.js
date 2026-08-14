async function testLanguageAndImages() {
  const WP_BASE = "https://magentalab.mycafe24.com/wp-json/wp/v2/posts?_fields=id,slug,title,excerpt,content,date,modified,_embedded&_embed";
  
  // 1. Fetch posts by language matching the logic in lib/wp.ts
  const res = await fetch(`${WP_BASE}&per_page=50`);
  const allPosts = await res.json();
  
  const koPosts = allPosts.filter(p => !p.slug.endsWith('-en') && !p.slug.endsWith('-ja')).slice(0, 2);
  const enPosts = allPosts.filter(p => p.slug.endsWith('-en')).slice(0, 2);
  const jaPosts = allPosts.filter(p => p.slug.endsWith('-ja')).slice(0, 2);
  
  const selectedPosts = [...koPosts, ...enPosts, ...jaPosts];
  
  console.log(`[언어별 실제 조회]`);
  console.log(`KO: ${koPosts.map(p => p.id).join(', ')}`);
  console.log(`EN: ${enPosts.map(p => p.id).join(', ')}`);
  console.log(`JA: ${jaPosts.map(p => p.id).join(', ')}\n`);
  
  selectedPosts.forEach(post => {
    const slug = post.slug || "";
    const lang = slug.endsWith('-en') ? 'en' : slug.endsWith('-ja') ? 'ja' : 'ko';
    const sanitize = (html) => html ? html.replace(/<[^>]*>?/gm, "").trim() : "";
    const title = sanitize(post.title?.rendered);
    const meta_desc = sanitize(post.excerpt?.rendered).substring(0, 160);
    const featured_img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";
    
    const images = [];
    const contentHtml = post.content?.rendered || "";
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(contentHtml)) !== null) {
      const imgTag = match[0];
      const src = match[1];
      const altMatch = imgTag.match(/alt="([^"]*)"/i);
      const alt = altMatch ? altMatch[1] : "";
      const classMatch = imgTag.match(/class="[^"]*wp-image-(\d+)[^"]*"/i);
      const media_id = classMatch ? parseInt(classMatch[1], 10) : null;
      images.push({ src, alt, media_id });
    }
    
    console.log(`ID: ${post.id} | Lang: ${lang.toUpperCase()} | Slug: ${slug}`);
    console.log(`Title: ${title}`);
    console.log(`Content length: ${contentHtml.length}`);
    console.log(`Meta Desc: ${meta_desc.substring(0,30)}...`);
    console.log(`Featured Image: ${featured_img}`);
    console.log(`Published: ${post.date} | Modified: ${post.modified}`);
    if (images.length > 0) {
      console.log(`Extracted Images:`);
      images.slice(0,2).forEach(img => { // print up to 2
        console.log(`  - src: ${img.src}\n    alt: ${img.alt}\n    media_id: ${img.media_id}`);
      });
      if(images.length > 2) console.log(`  ... and ${images.length - 2} more`);
    } else {
      console.log(`Extracted Images: None in body`);
    }
    console.log("------------------------");
  });
}

testLanguageAndImages().catch(console.error);
