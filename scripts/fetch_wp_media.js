require('dotenv').config({ path: '.env.local' });

async function fetchMedia() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log('Fetching media library items...');
  const res = await fetch('https://magentalab.mycafe24.com/wp-json/wp/v2/media?per_page=50', {
    headers: { 'Authorization': authHeader }
  });

  if (res.ok) {
    const mediaList = await res.json();
    console.log(`Total recent media items: ${mediaList.length}`);
    mediaList.forEach((m, idx) => {
      console.log(`Media ${idx + 1}: ID ${m.id} | Slug: ${m.slug} | Date: ${m.date} | URL: ${m.source_url}`);
    });
  } else {
    console.error('Failed to fetch media:', res.status);
  }
}

fetchMedia().catch(console.error);
