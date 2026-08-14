require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  const res = await fetch(`${WP_URL}/posts/5885`, { headers: { 'Authorization': auth } });
  const post = await res.json();
  const currentRendered = post.content.rendered;

  const backupData = require('../data/backups.json');
  const backup = Object.values(backupData).find(b => b.wordpress_id === 5885);

  console.log("Original Backup Content Length:", backup.content.length);
  console.log("Current WP Rendered Length    :", currentRendered.length);

  // Compare where the length added
  const endBackup = backup.content.substring(backup.content.length - 500);
  const endCurrent = currentRendered.substring(currentRendered.length - 2000);

  console.log("\n--- END OF ORIGINAL BACKUP CONTENT ---");
  console.log(endBackup);

  console.log("\n--- END OF CURRENT WP RENDERED CONTENT ---");
  console.log(endCurrent);
}

main();
