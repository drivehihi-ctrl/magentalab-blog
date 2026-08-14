require('dotenv').config({ path: '.env.local' });
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  const res = await fetch(`${WP_URL}/posts/5885`, { headers: { 'Authorization': auth } });
  const post = await res.json();
  console.log("Current post 5885 content length:", post.content.rendered.length);

  const backupData = require('../data/backups.json');
  const backup = Object.values(backupData).find(b => b.wordpress_id === 5885);

  if (backup) {
    console.log("Backup content length:", backup.content.length);
    if (backup.content === post.content.rendered) {
      console.log("Backup content EXACT MATCHES WP Current Restored Content!");
    } else {
      console.log("Backup content differs from WP Current Content!");
    }
  } else {
    console.log("No backup found for 5885");
  }
}

main();
