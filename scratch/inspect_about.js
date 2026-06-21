async function run() {
  try {
    // 1. 모든 pages를 뒤집니다.
    const pagesUrl = `https://magentalab.mycafe24.com/wp-json/wp/v2/pages?per_page=100`;
    const resPages = await fetch(pagesUrl);
    const pages = await resPages.json();
    console.log("=== SCANNING PAGES ===");
    for (const page of pages) {
      const idx = page.content.rendered.indexOf("연구소 그 이상의 가치");
      if (idx !== -1) {
        console.log(`FOUND in PAGE [id: ${page.id}, slug: ${page.slug}, title: ${page.title.rendered}]`);
        console.log(page.content.rendered.substring(idx - 50, idx + 400));
      }
    }

    // 2. 모든 posts를 뒤집니다.
    const postsUrl = `https://magentalab.mycafe24.com/wp-json/wp/v2/posts?per_page=100`;
    const resPosts = await fetch(postsUrl);
    const posts = await resPosts.json();
    console.log("\n=== SCANNING POSTS ===");
    for (const post of posts) {
      const idx = post.content.rendered.indexOf("연구소 그 이상의 가치");
      if (idx !== -1) {
        console.log(`FOUND in POST [id: ${post.id}, slug: ${post.slug}, title: ${post.title.rendered}]`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
