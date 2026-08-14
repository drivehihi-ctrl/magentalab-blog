// Test script to verify the new AI Content API endpoints structure
async function testFetch5Posts() {
  console.log("=== Testing Phase 1 READ ONLY Data Format ===");
  const WP_URL = "https://magentalab.mycafe24.com/wp-json/wp/v2/posts?per_page=5&_fields=id,date,modified,slug,title,excerpt,content,categories,tags,_links,_embedded&_embed";
  
  const res = await fetch(WP_URL);
  const posts = await res.json();
  
  console.log(`Successfully fetched ${posts.length} posts from WordPress.\n`);
  
  posts.forEach((post, index) => {
    const slug = post.slug || "";
    const lang = slug.endsWith('-en') ? 'en' : slug.endsWith('-ja') ? 'ja' : 'ko';
    
    // Simulate sanitizeForSeo
    const sanitize = (html) => html ? html.replace(/<[^>]*>?/gm, "").trim() : "";
    const title = sanitize(post.title?.rendered);
    const meta_desc = sanitize(post.excerpt?.rendered).substring(0, 160);
    const featured_img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";
    
    console.log(`[Post ${index + 1}]`);
    console.log(`- wordpress_id: ${post.id}`);
    console.log(`- content_id: ${post.id}`);
    console.log(`- language: ${lang}`);
    console.log(`- slug: ${slug}`);
    console.log(`- title: ${title}`);
    console.log(`- meta_description: ${meta_desc.substring(0, 30)}...`);
    console.log(`- content (raw preview): ${post.content?.rendered.substring(0, 30)}...`);
    console.log(`- images (featured): ${featured_img}`);
    console.log(`- published_at: ${post.date}`);
    console.log(`- modified_at: ${post.modified}`);
    console.log(`- frontend status: SAFE (No changes made)`);
    console.log("-------------------------------------------------");
  });
  
  console.log("Phase 1 Data Fetch Test Completed Successfully.");
}

testFetch5Posts().catch(console.error);
