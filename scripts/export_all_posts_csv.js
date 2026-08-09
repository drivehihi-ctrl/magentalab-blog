const fs = require('fs');
const path = require('path');

const WP_API_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2/posts';

async function fetchAllPosts() {
  console.log('Fetching all posts from WordPress REST API...');
  let page = 1;
  let allPosts = [];
  let totalPages = 1;

  while (page <= totalPages) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`${WP_API_URL}?per_page=100&page=${page}&_fields=id,date,modified,slug,title,excerpt,content,categories,tags`);
    if (!res.ok) {
      console.error(`Failed to fetch page ${page}: ${res.statusText}`);
      break;
    }
    
    if (page === 1) {
      const totalHeader = res.headers.get('X-WP-TotalPages');
      if (totalHeader) totalPages = parseInt(totalHeader, 10);
      console.log(`Total WP API Pages: ${totalPages}`);
    }

    const posts = await res.json();
    allPosts = allPosts.concat(posts);
    page++;
  }

  console.log(`Total posts fetched from WP: ${allPosts.length}`);
  return allPosts;
}

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

function classifyLanguage(slug) {
  if (slug.endsWith('-en')) return 'EN';
  if (slug.endsWith('-ja')) return 'JA';
  return 'KO';
}

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

async function exportToCsv() {
  const posts = await fetchAllPosts();

  const headers = [
    'content_id',
    'language',
    'slug',
    'title',
    'date',
    'modified_date',
    'url',
    'categories',
    'tags',
    'excerpt_clean',
    'content_clean',
    'content_html_raw'
  ];

  const csvRows = [headers.join(',')];

  for (const post of posts) {
    const lang = classifyLanguage(post.slug);
    const titleText = cleanHtml(post.title?.rendered);
    const excerptClean = cleanHtml(post.excerpt?.rendered);
    const contentClean = cleanHtml(post.content?.rendered);
    const contentHtmlRaw = post.content?.rendered || '';
    const postUrl = lang === 'EN' 
      ? `https://www.magentalabblog.com/en/posts/${post.slug}` 
      : lang === 'JA' 
      ? `https://www.magentalabblog.com/ja/posts/${post.slug}` 
      : `https://www.magentalabblog.com/posts/${post.slug}`;

    const row = [
      escapeCsvField(post.id),
      escapeCsvField(lang),
      escapeCsvField(post.slug),
      escapeCsvField(titleText),
      escapeCsvField(post.date),
      escapeCsvField(post.modified),
      escapeCsvField(postUrl),
      escapeCsvField((post.categories || []).join(';')),
      escapeCsvField((post.tags || []).join(';')),
      escapeCsvField(excerptClean),
      escapeCsvField(contentClean),
      escapeCsvField(contentHtmlRaw)
    ];

    csvRows.join(',');
    csvRows.push(row.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\n'); // Add UTF-8 BOM for Excel compatibility

  const outputFileName = 'magentalab_all_posts_454.csv';
  const outputPath = path.join(process.cwd(), outputFileName);
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  console.log(`✅ CSV exported successfully to: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2)} MB`);
}

exportToCsv().catch(err => console.error('Error exporting CSV:', err));
