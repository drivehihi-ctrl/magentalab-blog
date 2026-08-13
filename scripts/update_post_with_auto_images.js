require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

function parseCSV(text) {
  const result = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(field);
      if (row.length > 1) {
        result.push(row);
      }
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    result.push(row);
  }

  return result;
}

/**
 * Intelligent WordPress Post Updater with Automatic Original Image Block Preservation
 */
async function updatePostWithPreservedImages({ postId, title, excerpt, contentHtml, referencesSection = '' }) {
  console.log(`\n==============================================`);
  console.log(`Processing Post Update for ID: ${postId}`);
  console.log(`Title: ${title}`);
  console.log(`==============================================`);

  // 1. Fetch original raw HTML from CSV backup
  const csvContent = fs.readFileSync('magentalab_all_posts_454.csv', 'utf8');
  const rows = parseCSV(csvContent);
  
  const targetRow = rows.find(r => r[0] === String(postId) || r[2]?.includes(String(postId)));
  let originalRawHtml = '';

  if (targetRow && targetRow.length >= 12) {
    originalRawHtml = targetRow[11] || '';
  }

  // 2. Extract all original <figure> or <img> blocks
  const imgBlockRegex = /<img[^>]+>/gi;
  const originalImageBlocks = originalRawHtml.match(imgBlockRegex) || [];
  console.log(`Found ${originalImageBlocks.length} original image blocks in CSV backup for Post ${postId}.`);

  // 3. Insert original image blocks after H2 headings in contentHtml in sequence
  let finalHtmlContent = contentHtml;

  if (originalImageBlocks.length > 0 && !contentHtml.includes('wp-image-')) {
    console.log('Integrating original image blocks into H2 sections in order...');
    
    const sectionRegex = /(<h2[^>]*>[\s\S]*?<\/h2>)/gi;
    const parts = contentHtml.split(sectionRegex);

    let imgIndex = 0;
    let assembledHtml = '';

    for (let i = 0; i < parts.length; i++) {
      assembledHtml += parts[i];
      // If this part is an H2 heading and we have remaining images, place next image right after heading
      if (/^<h2[^>]*>/i.test(parts[i]) && imgIndex < originalImageBlocks.length) {
        assembledHtml += `\n\n<p className="my-6">${originalImageBlocks[imgIndex]}</p>\n\n`;
        imgIndex++;
      }
    }

    // Append any remaining unused images at bottom
    while (imgIndex < originalImageBlocks.length) {
      assembledHtml += `\n\n<p className="my-6">${originalImageBlocks[imgIndex]}</p>`;
      imgIndex++;
    }

    finalHtmlContent = assembledHtml;
  }

  // 4. Append References Section if provided
  if (referencesSection && !finalHtmlContent.includes('Veterinary Evidence')) {
    finalHtmlContent += '\n\n' + referencesSection;
  }

  // 5. Update WordPress via REST API
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log('Sending update to WordPress REST API...');
  const response = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      title: title,
      excerpt: excerpt,
      content: finalHtmlContent
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`WP API Error (${response.status}): ${errText}`);
  }

  const updatedPost = await response.json();
  console.log(`✅ Successfully updated Post ID ${updatedPost.id}!`);

  // 6. Trigger Instant CDN Revalidation
  console.log('Triggering instant CDN revalidation...');
  const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
  const revalJson = await revalRes.json();
  console.log('Revalidate status:', revalJson);

  return updatedPost;
}

module.exports = { updatePostWithPreservedImages };
