async function findVercelDomains() {
  const domains = [
    'https://www.magentalabblog.com',
    'https://magentalab-blog.vercel.app',
    'https://magentalabblog.vercel.app',
    'https://magentalab-blog-drivehihi-ctrls-projects.vercel.app'
  ];

  for (const d of domains) {
    try {
      const res = await fetch(`${d}/api/ai-content/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test'
        },
        body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
      });
      console.log(`Domain [${d}]: HTTP ${res.status}`);
      const text = await res.text();
      console.log(`  Response: ${text.slice(0, 100)}`);
    } catch (e) {
      console.log(`Domain [${d}]: Fetch Failed (${e.message})`);
    }
  }
}

findVercelDomains();
