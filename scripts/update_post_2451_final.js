require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 2451;
const title = "Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs";

const excerpt = `1. Managing a diabetic dog is less about chasing one “perfect” blood glucose number and more about keeping meals, insulin, daily observations, and veterinary monitoring working together.

2. Insulin timing and dose should follow your dog’s individual veterinary plan. If appetite suddenly changes, vomiting occurs, or your dog seems unusually weak, do not improvise the insulin schedule on your own—contact your veterinary team.

3. Blood glucose curves are useful because they show how glucose changes over time, but they are only one part of the picture. Water intake, urination, appetite, body weight, energy, and signs of hypoglycemia matter too.

[Empathy]

The first few days after hearing “your dog has diabetes” can feel overwhelming. Suddenly, meals have a schedule, syringes appear in the refrigerator, and every sleepy moment can make you wonder, “Is the blood sugar too low?”

I’m Ansim-i. Here’s the good news: you do not need to become a veterinary endocrinologist overnight.

Think of diabetes management as learning your dog’s daily rhythm. Meals, insulin, water, bathroom habits, weight, and energy all leave little clues. Once you know what to watch, those clues become much easier to understand.`;

const userBodyHtml = `<p>When your dog is first diagnosed with diabetes, the word <strong>“insulin”</strong> can suddenly make everyday life feel much more complicated.</p>

<p>You may find yourself looking at the clock before every meal, checking how much food was eaten, watching the water bowl, and wondering whether every sleepy moment means the blood sugar is too low.</p>

<p><strong>🔎 Ansim-i explains:</strong> Let’s make this much simpler.</p>

<p>Managing canine diabetes is not a contest to produce one perfect blood glucose number. The real goal is to help your dog feel well while avoiding both poorly controlled diabetes and clinically important hypoglycemia.</p>

<p>That means we need to look at the <strong>whole dog</strong>—not only the glucose meter.</p>

<h2>1. Think of diabetes management as a daily rhythm</h2>

<p>Imagine four pieces moving together:</p>

<p><strong>meal → insulin → daily activity → monitoring</strong></p>

<p>If those pieces remain reasonably consistent, your veterinarian can understand how your dog is responding to treatment much more clearly.</p>

<p>If one suddenly changes—for example, your dog refuses dinner, vomits, becomes unusually inactive, or starts drinking much more water—the meaning of the glucose readings can change too.</p>

<p>This is why insulin treatment should be based on an individual veterinary plan rather than a universal rule copied from another dog.</p>

<!-- IMAGE 1 -->

<h2>2. “When exactly should I give the insulin?”</h2>

<p>This is probably one of the first questions every pet parent asks.</p>

<p>The easiest way to understand it is this:</p>

<p><strong>Your dog needs a repeatable routine, but there is no single internet clock that fits every diabetic dog.</strong></p>

<p>The type of insulin, dosing interval, meal schedule, appetite, other diseases, and the way your dog responds to treatment all influence the plan.</p>

<p>So if your veterinarian has given you a meal-and-insulin schedule, that schedule should take priority over a general article like this one.</p>

<p><strong>🔎 Ansim-i’s simple rule:</strong> consistency is helpful; improvising the insulin dose is not.</p>

<p>If your dog eats much less than usual, refuses food, vomits, or seems suddenly unwell, do not try to solve the problem by independently increasing, decreasing, delaying, or doubling insulin. Contact your veterinary team and explain what happened.</p>

<h2>3. What should I watch at home besides blood glucose?</h2>

<p>Here is where pet parents are incredibly valuable.</p>

<p>Your veterinarian may see your dog for twenty or thirty minutes. You see your dog every day.</p>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>What You Notice</th>
<th>Why It Matters</th>
<th>What to Record</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Water intake</strong></td>
<td>Excessive thirst may return when diabetes is not well controlled.</td>
<td>Is the water bowl emptying faster than usual?</td>
</tr>
<tr>
<td><strong>Urination</strong></td>
<td>Increased urination often accompanies increased thirst.</td>
<td>More frequent trips outside, larger urine volume, accidents?</td>
</tr>
<tr>
<td><strong>Appetite</strong></td>
<td>Changes in appetite can affect the normal treatment routine and may signal illness.</td>
<td>Ate normally, ate less, refused food, vomited?</td>
</tr>
<tr>
<td><strong>Body weight</strong></td>
<td>Unintended weight loss can be an important sign of poor diabetic control.</td>
<td>Record weight consistently using the same scale when possible.</td>
</tr>
<tr>
<td><strong>Energy and behavior</strong></td>
<td>Weakness, unusual sleepiness, confusion, or tremors deserve attention.</td>
<td>What happened, when, and for how long?</td>
</tr>
</tbody>
</table>
</div>

<p><strong>🔎 Ansim-i explains:</strong> Think of these observations as your dog’s “daily data.”</p>

<p>A single glucose reading is one number. Your dog’s drinking, urination, appetite, weight, and behavior tell the story around that number.</p>

<!-- IMAGE 2 -->

<h2>4. What is a blood glucose curve?</h2>

<p>A blood glucose curve sounds technical, but the basic idea is quite easy.</p>

<p>A single blood glucose measurement is like taking <strong>one photograph</strong> of your dog’s day.</p>

<p>A glucose curve is more like watching a <strong>short movie</strong>.</p>

<p>By looking at glucose values over time, the veterinary team can estimate how low the glucose goes during the insulin cycle, how long the insulin appears to be working, and how much the glucose changes during that period.</p>

<p>The lowest point is often called the <strong>nadir</strong>.</p>

<p>But here is the part Ansim-i really wants you to remember:</p>

<p><strong>The nadir is not a “change the insulin yourself” number.</strong></p>

<p>Blood glucose curves are interpreted together with clinical signs, appetite, body weight, insulin type, treatment history, and whether hypoglycemia has occurred.</p>

<p>The American Animal Hospital Association’s diabetes management guidelines emphasize monitoring the patient as a whole rather than adjusting therapy from an isolated glucose value alone.</p>

<!-- IMAGE 3 -->

<h2>5. “My dog looks fine. Why do we still need monitoring?”</h2>

<p>Because diabetes can change gradually.</p>

<p>A dog may look fairly normal while thirst, urination, body weight, or glucose patterns are beginning to shift.</p>

<p>Monitoring helps your veterinary team notice those trends before they become much larger problems.</p>

<p>Home glucose monitoring can be useful for many diabetic pets, and some veterinary teams may recommend blood glucose curves or continuous glucose monitoring systems.</p>

<p>Which method is appropriate depends on the individual dog and the monitoring plan your veterinarian has chosen.</p>

<h2>6. What does hypoglycemia look like?</h2>

<p><strong>Hypoglycemia means the blood glucose has fallen too low.</strong></p>

<p>Instead of memorizing a long emergency checklist, picture how your dog might look.</p>

<p>At first, something may simply feel “off.” Your dog may seem unusually weak, sleepy, restless, or less coordinated than normal.</p>

<p>If the problem becomes more serious, you may see trembling, disorientation, difficulty standing, collapse, or seizures.</p>

<p><strong>🔎 Ansim-i’s important point:</strong> if you suspect hypoglycemia, this is not the moment to experiment with insulin adjustments or a home remedy you saw in an image online.</p>

<p>Contact your veterinarian or an emergency veterinary hospital promptly and follow the emergency plan provided for your individual dog.</p>

<p>If your dog has reduced consciousness, cannot swallow normally, is collapsing, or is having a seizure, do not force food or liquid into the mouth.</p>

<p>This Magentalab page intentionally does not provide a universal “honey, syrup, or sugar-water dose,” because the safest response depends on the dog’s condition and ability to swallow.</p>

<h2>7. What if my dog does not eat the usual meal?</h2>

<p>This situation worries many pet parents because food and insulin are closely linked in everyday diabetic management.</p>

<p>The wrong approach is to create a new insulin rule on the spot.</p>

<p>The useful approach is to collect the information your veterinarian needs:</p>

<p>How much did your dog eat? Was there vomiting? Is your dog alert? Has anything else changed? What insulin and treatment schedule is normally used?</p>

<p>Then contact your veterinary team for instructions that fit your dog’s treatment plan.</p>

<h2>8. Does a diabetic dog need a special high-fiber diet?</h2>

<p>Sometimes—but this needs a little more explanation.</p>

<p>For dogs with diabetes, the most useful diet is one that is <strong>complete and balanced, palatable, appropriate for body condition, and fed consistently</strong>.</p>

<p>Some diabetic dogs, particularly overweight dogs, may benefit from diets with increased soluble and insoluble fiber because these diets can help with calorie control and post-meal glucose management.</p>

<p>But “more fiber is always better” is not a rule.</p>

<p>An underweight diabetic dog has a very different nutritional goal from an obese diabetic dog.</p>

<p><strong>🔎 Ansim-i explains:</strong> the food bowl is part of the treatment plan, but there is no single magic percentage printed on the bag that manages diabetes by itself.</p>

<!-- IMAGE 4 -->

<h2>9. What about NFE and carbohydrate calculations?</h2>

<p>The original version of this article spent a large amount of time calculating NFE, an estimate of carbohydrate by difference from the guaranteed analysis.</p>

<p>That calculation can be useful when comparing pet foods, but it should not be treated as a stand-alone diabetes treatment target.</p>

<p>A specific NFE percentage does not tell you how much insulin your dog needs, and it does not replace an individualized nutrition plan.</p>

<p>For that reason, Magentalab 2.0 separates the detailed NFE calculation into its own nutrition guide rather than mixing it into insulin management.</p>

<p><strong>→ Internal link after revision: Pet Food Carbohydrates and NFE Calculation Guide</strong></p>

<!-- IMAGE 5 -->

<h2>10. A stable routine often tells us more than a “perfect” day</h2>

<p>Diabetes management works best when your veterinary team can recognize patterns.</p>

<p>Regular meal timing, consistent portions, an appropriate activity routine, and good home records make those patterns much easier to interpret.</p>

<p>That does not mean every day must be identical.</p>

<p>Dogs get upset stomachs. Families travel. Appetite changes. Exercise varies.</p>

<p>The goal is not perfection.</p>

<p><strong>The goal is to notice meaningful changes and communicate them.</strong></p>

<!-- IMAGE 6 -->

<h2>11. What should you bring to a diabetes recheck?</h2>

<p>Instead of arriving with only one glucose number, bring the story of the last several days.</p>

<p>A simple record of appetite, insulin administration as prescribed, drinking and urination, body weight, unusual weakness or trembling, vomiting, exercise changes, and any glucose data requested by your veterinarian can be extremely helpful.</p>

<p>Photos or short videos of unusual behavior may also help your veterinary team understand what happened at home.</p>

<!-- IMAGE 7 -->

<h2>12. Ansim-i’s Research Summary</h2>

<p>If this article feels much simpler than the old “insulin timing + glucose number + carbohydrate percentage” version, that is intentional.</p>

<p>Canine diabetes is not managed by one clock, one glucose value, or one food number.</p>

<p><strong>It is managed by patterns.</strong></p>

<p>Meals, insulin, thirst, urination, appetite, weight, energy, and glucose monitoring all provide pieces of information.</p>

<p>Your job as a pet parent is not to calculate the perfect insulin dose yourself.</p>

<p>Your job is to know your dog’s normal routine, notice when that routine changes, record useful information, and work with your veterinary team.</p>

<p>That is the kind of diabetes data Ansim-i wants Magentalab to help you organize.</p>`;

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

const originalImgs = [
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2372" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/1-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2373" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/2-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2374" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/3-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2375" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/4-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2376" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/5-12.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2378" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/7.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`,
  `<img loading="lazy" decoding="async" class="alignnone size-large wp-image-2377" src="http://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-1024x572.jpeg" alt="Canine Diabetes Management: Insulin Routine, Glucose Curves, Meals, and Hypoglycemia Signs" width="1024" height="572" srcset="https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-1024x572.jpeg 1024w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-300x167.jpeg 300w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13-768x429.jpeg 768w, https://magentalab.mycafe24.com/wp-content/uploads/2026/07/6-13.jpeg 1376w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />`
];

  // 2. Replace <!-- IMAGE X --> comments with actual <img> tags
  let finalContent = userBodyHtml;
  for (let i = 1; i <= 7; i++) {
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

  // 4. Update local magentalab_all_posts_454.csv
  const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
  if (fs.existsSync(csvPath)) {
    console.log('Updating magentalab_all_posts_454.csv...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(csvContent);
    let updatedCount = 0;

    const modifiedDateStr = new Date().toISOString().replace(/\.\d{3}Z$/, '');

    const updatedRows = rows.map((r, idx) => {
      if (idx === 0) return r; // Header row
      if (r[0] === String(postId) || r[2] === 'dog_diabetes_diet_insulin-en') {
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
      console.log('⚠️ Post 2451 not found in CSV to update.');
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

  console.log('\n🎉 ALL DONE SUCCESSFUL!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
