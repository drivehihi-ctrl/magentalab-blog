require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 2459;
const title = "7 Things to Know When Reading a Pet Food Label: Carbohydrates, NFE, and Dry Matter Explained";

const excerpt = `1. Numbers such as crude protein and crude fat are useful, but they can be misleading when foods with very different moisture levels are compared directly.

2. Carbohydrate may not appear as a standard guaranteed nutrient on a pet food label. One way to estimate the carbohydrate-containing fraction is NFE, or nitrogen-free extract.

3. NFE and dry matter calculations are comparison tools. They do not tell you, by themselves, whether a food is nutritionally superior or whether it will prevent or treat a disease.

[Empathy]

Pet food labels are full of numbers, but that does not always make them easier to understand.

Instead of memorizing percentages, let’s learn how to compare those numbers on the same basis.`;

let userBodyHtml = `<p><strong>1.</strong> Numbers such as crude protein and crude fat are useful, but they can be misleading when foods with very different moisture levels are compared directly.</p>

<p><strong>2.</strong> Carbohydrate may not appear as a standard guaranteed nutrient on a pet food label. One way to estimate the carbohydrate-containing fraction is NFE, or nitrogen-free extract.</p>

<p><strong>3.</strong> NFE and dry matter calculations are comparison tools. They do not tell you, by themselves, whether a food is nutritionally superior or whether it will prevent or treat a disease.</p>

<h2>1. “Crude” protein does not mean poor-quality protein</h2>

<p>The word “crude” can sound negative, but on a pet food label it refers to the analytical method used to determine the amount of a nutrient.</p>

<p>Crude protein, crude fat, and crude fiber are analytical measurements used in the guaranteed analysis.</p>

<p>A food with 30% crude protein therefore does not automatically contain better-quality protein than a food with a lower number.</p>

<p>The guaranteed analysis helps us understand quantity. It does not tell us everything about digestibility, amino acid quality, or how well a particular animal will use those nutrients.</p>

<!-- IMAGE 1 -->

<h2>2. Why is carbohydrate often hard to find on the label?</h2>

<p>You may turn the package over and find protein, fat, fiber, and moisture — but no line that simply says “carbohydrate.”</p>

<p>That does not automatically mean the manufacturer is hiding it.</p>

<p>Labeling rules specify which nutrient guarantees must appear, and carbohydrate is not always one of the standard guaranteed nutrients.</p>

<p>Under the AAFCO model described for U.S. pet foods, the four basic nutritional guarantees are minimum crude protein, minimum crude fat, maximum crude fiber, and maximum moisture.</p>

<p>When carbohydrate information is not directly available, it may be estimated from other components.</p>

<h2>3. NFE is an estimate, not a direct carbohydrate measurement</h2>

<p>NFE stands for <strong>Nitrogen-Free Extract</strong>.</p>

<p>Ansim-i would describe it as the portion left after the major measured components are subtracted from the whole food.</p>

<p>A common conceptual formula is:</p>

<p><strong>NFE (%) ≈ 100 − moisture − crude protein − crude fat − crude fiber − ash</strong></p>

<p>The important word here is <strong>estimate</strong>.</p>

<p>NFE is not obtained by directly measuring one substance called “carbohydrate.” It is calculated by difference.</p>

<p>AAFCO also uses this approach when explaining how carbohydrate may be estimated for calorie calculations.</p>

<!-- IMAGE 2 -->

<h2>4. What if ash is not listed?</h2>

<p>This is where home calculations often become less precise.</p>

<p>Ash is needed for the usual NFE calculation, but not every product displays an ash guarantee.</p>

<p>If you insert an assumed ash percentage, the result becomes an estimate built on another estimate.</p>

<p>That does not make the number useless, but it changes how confidently it should be interpreted.</p>

<p><strong>Ansim-i would not treat a result such as 32.7% as if it were a laboratory-confirmed carbohydrate concentration.</strong></p>

<h2>5. Dry food and wet food should not be compared at face value</h2>

<p>A wet food may contain around three-quarters water, while a dry food contains much less.</p>

<p>That difference can make a wet food's protein percentage look dramatically lower on the package.</p>

<p>But the numbers are being expressed on an <strong>as-fed basis</strong>, meaning water is still included.</p>

<p>To compare foods with very different moisture levels, the nutrients can be converted to a <strong>dry matter (DM) basis</strong>.</p>

<p>The FDA specifically explains that meaningful comparisons between high-moisture and low-moisture pet foods require converting guaranteed analysis values to a moisture-free basis.</p>

<p><strong>Ansim-i thinks of it this way: comparing soup and a dry meal without accounting for the water can make the numbers look more different than the actual solids are.</strong></p>

<!-- IMAGE 3 -->

<h2>6. Does lower NFE automatically mean better food?</h2>

<p><strong>No.</strong></p>

<p>NFE can help describe one nutritional characteristic of a food, but it is not an overall quality score.</p>

<p>A complete diet also needs appropriate protein and fat, essential amino acids and fatty acids, vitamins, minerals, energy, and a nutrient profile appropriate for the animal's life stage.</p>

<p>There is also no single NFE percentage that functions as a universal health cutoff for every dog and cat.</p>

<p>This becomes even more important when a pet has a medical condition.</p>

<p><strong>A carbohydrate estimate alone should not be used to claim that a food will prevent, diagnose, or treat diabetes or another disease.</strong></p>

<h2>7. What should you actually check on a pet food label?</h2>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>What to check</th>
<th>What it tells you</th>
<th>What to remember</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Species and life stage</strong></td>
<td>Who the food is intended for</td>
<td>Growth and adult maintenance have different nutritional requirements.</td>
</tr>
<tr>
<td><strong>Nutritional adequacy</strong></td>
<td>Whether the food is intended to provide complete and balanced nutrition</td>
<td>Treats and supplements serve different purposes from a complete diet.</td>
</tr>
<tr>
<td><strong>Guaranteed analysis</strong></td>
<td>Basic protein, fat, fiber, and moisture information</td>
<td>Some guarantees are minimums and others are maximums.</td>
</tr>
<tr>
<td><strong>Moisture</strong></td>
<td>How much of the product is water</td>
<td>Especially important when comparing dry and wet foods.</td>
</tr>
<tr>
<td><strong>Calories</strong></td>
<td>The energy supplied by the food</td>
<td>Useful for feeding amount and body-weight management.</td>
</tr>
<tr>
<td><strong>NFE and DM</strong></td>
<td>Helpful for estimating carbohydrate and comparing foods on a common moisture basis</td>
<td>They are comparison tools, not treatment targets.</td>
</tr>
</tbody>
</table>
</div>

<h2>Three common mistakes when reading pet food labels</h2>

<p><strong>First: “Higher protein always means better food.”</strong></p>

<p>The amount matters, but one percentage does not describe the full nutritional quality of a diet.</p>

<p><strong>Second: “If carbohydrate is not listed, the company must be hiding it.”</strong></p>

<p>Whether carbohydrate appears directly depends on the labeling framework and the information the manufacturer chooses or is required to provide.</p>

<p><strong>Third: “A low NFE number means the food prevents disease.”</strong></p>

<p>NFE is an estimated nutritional value, not a disease-risk score.</p>

<h2>Ansim-i’s Research Note</h2>

<p>Once you start analyzing pet food labels, it is easy to get trapped in percentages.</p>

<p>Protein 32%. Fat 17%. NFE 28%. Then the same nutrients again on a dry matter basis.</p>

<p>Eventually, one useful question can disappear behind all the calculations:</p>

<p><strong>“Is this food nutritionally appropriate for my pet as a regular diet?”</strong></p>

<p>NFE and dry matter calculations can be genuinely useful.</p>

<p>They make comparisons easier when used for the right purpose.</p>

<p>But they should not become a score that decides whether an entire food is “good” or “bad.”</p>

<p><strong>Numbers help us compare food. Nutrition is the bigger picture around those numbers.</strong></p>`;

// Clean GPT reference tags if any
userBodyHtml = userBodyHtml.replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '');

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

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

async function run() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  // 1. Fetch current WP post to extract original <img> tags
  console.log(`Fetching current WP content for Post ID ${postId}...`);
  const getRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    headers: { 'Authorization': authHeader }
  });
  if (!getRes.ok) {
    throw new Error(`Failed to fetch post ${postId}: ${getRes.statusText}`);
  }
  const currentPost = await getRes.json();
  const currentHtml = currentPost.content.rendered || '';

  const originalImgs = currentHtml.match(/<img[^>]+>/gi) || [];
  console.log(`Extracted ${originalImgs.length} original <img> tags from WP.`);

  // 2. Replace <!-- IMAGE X --> comments with actual <img> tags
  let finalContent = userBodyHtml;
  for (let i = 1; i <= 10; i++) {
    const commentRegex = new RegExp(`<!--\\s*IMAGE ${i}[^>]*-->`, 'gi');
    if (i <= originalImgs.length) {
      const imgHtml = `<p class="my-6">${originalImgs[i - 1]}</p>`;
      finalContent = finalContent.replace(commentRegex, imgHtml);
    } else {
      finalContent = finalContent.replace(commentRegex, '');
    }
  }

  // 3. Update WordPress Post via REST API
  console.log(`Updating WordPress Post ID ${postId}...`);
  const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      title: title,
      excerpt: excerpt,
      content: finalContent
    })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`WP API Error (${updateRes.status}): ${errText}`);
  }

  const updatedPost = await updateRes.json();
  console.log(`✅ Successfully updated WP Post ID ${updatedPost.id}!`);
  console.log(`Title: ${updatedPost.title.rendered}`);
  console.log(`Slug: ${updatedPost.slug}`);

  // 4. Update local magentalab_all_posts_454.csv if exists
  const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
  if (fs.existsSync(csvPath)) {
    console.log('Updating magentalab_all_posts_454.csv...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(csvContent);
    let updatedCount = 0;

    const modifiedDateStr = new Date().toISOString().replace(/\.\d{3}Z$/, '');

    const updatedRows = rows.map((r, idx) => {
      if (idx === 0) return r; // Header row
      if (r[0] === String(postId)) {
        updatedCount++;
        r[3] = title;
        r[5] = modifiedDateStr;
        r[9] = cleanHtml(excerpt);
        r[10] = cleanHtml(finalContent);
        r[11] = finalContent;
      }
      return r;
    });

    if (updatedCount > 0) {
      const newCsvStr = updatedRows.map(row => row.map(escapeCsvField).join(',')).join('\n');
      fs.writeFileSync(csvPath, '\uFEFF' + newCsvStr, 'utf8');
      console.log(`✅ Updated ${updatedCount} row(s) in magentalab_all_posts_454.csv!`);
    } else {
      console.log('⚠️ Post 2459 not found in CSV to update.');
    }
  }

  // 5. Trigger Instant CDN Revalidation
  console.log('Triggering instant CDN revalidation...');
  try {
    const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
    const revalJson = await revalRes.json();
    console.log('Revalidate status:', revalJson);
  } catch (err) {
    console.log('Revalidation warning:', err.message);
  }

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 2459!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
