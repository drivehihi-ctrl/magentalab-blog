

async function inspect(id) {
  try {
    const url = `https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${id}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Post ${id} fetch failed:`, res.status);
      return;
    }
    const data = await res.json();
    const content = data.content.rendered;
    
    console.log(`\n================ INSPECTING POST ${id}: ${data.title.rendered} ================`);
    
    // TOC container가 있는지 정규식으로 매칭하여 찾아봅니다.
    const tocRegex = /<div[^>]*id="ez-toc-container"[^>]*>([\s\S]*?)<\/div>/gi;
    const tocMatch = tocRegex.exec(content);
    if (tocMatch) {
      console.log("TOC Container Found!");
      console.log("TOC Content HTML (brief):");
      console.log(tocMatch[0].substring(0, 1000));
    } else {
      console.log("No ez-toc-container found in HTML.");
    }
    
    // h2와 h3 태그들이 본문에 어떻게 깔려있는지 확인합니다.
    const headers = [];
    const headerRegex = /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi;
    let match;
    while ((match = headerRegex.exec(content)) !== null) {
      headers.push({ tag: match[1], text: match[2].replace(/<[^>]*>?/gm, '').trim() });
    }
    
    console.log(`Headers Count: ${headers.length}`);
    console.log("Headers List:");
    headers.forEach((h, index) => {
      console.log(`  ${index + 1}. [${h.tag}] ${h.text}`);
    });

    // TOC 앞뒤에 있는 HTML 내용을 간략히 봅니다.
    const tocIndex = content.indexOf('ez-toc-container');
    if (tocIndex !== -1) {
      console.log("\nContext around TOC (200 chars before & 500 chars after):");
      const start = Math.max(0, tocIndex - 200);
      const end = Math.min(content.length, tocIndex + 500);
      console.log(content.substring(start, end));
    }
  } catch (error) {
    console.error(`Error inspecting ${id}:`, error);
  }
}

async function run() {
  await inspect(1896);
  await inspect(1905);
  await inspect(1914);
}

run();
