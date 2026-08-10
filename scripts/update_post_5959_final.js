require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const postId = 5959;
const title = "7 Signs of Dog Skin Disease to Check First: Itching, Dandruff, Red Skin, Hair Loss, and More";

const excerpt = `1. An itchy dog does not automatically have “an allergy.” Fleas and mites, bacterial or yeast overgrowth, fungal disease, allergic skin disease, and some systemic disorders can create overlapping skin signs.

2. Before trying to name the disease, look at what you can actually see: where your dog scratches, whether the skin is red, whether there is an unusual odor, hair loss, scaling, crusts, or repeated ear and paw problems.

3. Skin problems often cannot be identified reliably from appearance alone. When itching keeps returning, veterinarians may use the history, lesion pattern, cytology, skin scrapings, parasite checks, and other tests to narrow down the cause.

[Empathy]

When your dog keeps scratching, it is hard not to stare at the skin and wonder, “What disease is this?”

But skin disease is rarely a picture-matching game.

Before memorizing disease names, let’s look at the clues your dog’s skin is actually giving you.`;

let userBodyHtml = `<p>Every dog scratches once in a while.</p>

<p>But if your dog wakes up to scratch, licks the same paw over and over, or chews one area until the coat becomes wet or thin, that is different.</p>

<p>To us, all of these problems may simply look like “itchy skin.” The cause, however, may be very different from one dog to another.</p>

<p>Allergic skin disease is one possibility. Fleas or mites, bacterial or yeast overgrowth, fungal infections, disorders affecting the skin itself, and sometimes systemic disease may also affect the skin and coat.</p>

<p><strong>Ansim-i will make this a little easier.</strong></p>

<p>The skin is visible, which means we can notice changes quickly. But different diseases can also create <strong>very similar-looking skin changes.</strong></p>

<p>So rather than trying to guess a diagnosis immediately, start with the signs you can observe.</p>

<h2>1. Your dog keeps scratching, licking, or chewing</h2>

<p>Itching is one of the easiest skin changes for a pet parent to notice.</p>

<p>Your dog may scratch behind the ears, lick the paws repeatedly, or chew at the belly, sides, or legs.</p>

<p>But the useful information is not simply <strong>“my dog is itchy.”</strong></p>

<p><strong>Where is the itching? When did it begin? Is it seasonal? How intense is it? Has anything helped before?</strong></p>

<p>These details matter because the pattern of itching can help a veterinary team decide what possibilities should be investigated first.</p>

<p>AAHA specifically recommends collecting a detailed history that includes the degree of pruritus, seasonality, age of onset and progression, ectoparasite prevention, and response to previous therapies when evaluating dogs with suspected allergic skin disease.</p>

<!-- IMAGE 1 -->

<h2>2. The skin looks red</h2>

<p>If you part the coat and notice that the skin looks redder than usual, inflammation may be present.</p>

<p>Redness is often easy to notice around the paws, armpits, groin, skin folds, and ears.</p>

<p>But <strong>red skin is a sign, not a diagnosis.</strong></p>

<p>Allergic inflammation may cause redness. Repeated scratching can damage the skin. Bacteria or yeast may then increase on already inflamed skin and make the area look even worse.</p>

<p>That is why “red skin” should not automatically be translated into “allergy.”</p>

<h2>3. Dandruff or scaling has increased</h2>

<p>White flakes on a dark coat often make people think the skin is simply dry.</p>

<p>Dryness can contribute to scaling, but dandruff and scale may also appear with inflammation, infections, dermatophyte disease, or disorders of skin turnover and oil production.</p>

<p><strong>Ansim-i would not look at the flakes alone.</strong></p>

<p>Check the skin around them. Is there redness? Hair loss? Crusting? An unusual smell? Does the coat feel unusually greasy?</p>

<p>The combination of signs is often more useful than one symptom by itself.</p>

<!-- IMAGE 2 -->

<h2>4. The skin smells different than usual</h2>

<p>Dogs naturally have their own body odor.</p>

<p>But if one area develops a stronger or unfamiliar smell, especially together with redness, greasiness, or itching, the skin environment may have changed.</p>

<p>Bacterial or yeast overgrowth can be associated with odor and inflammation.</p>

<p>In dogs with allergic skin disease, these secondary infections can occur alongside the underlying allergy and may intensify itching. AAHA therefore recommends looking for and treating secondary bacterial and yeast infections as part of the diagnostic and management process.</p>

<h2>5. Hair is thinning or falling out</h2>

<p>Hair loss does not always happen for the same reason.</p>

<p>Some dogs lose hair because they scratch, lick, or chew until the hairs break.</p>

<p>Others may develop coat thinning with relatively little itching.</p>

<p>That difference matters.</p>

<p><strong>Ansim-i would ask one question first: did the itching come before the hair loss, or did the hair loss appear without much itching?</strong></p>

<p>The sequence, distribution, and presence or absence of inflammation can help determine what needs to be investigated.</p>

<!-- IMAGE 3 -->

<h2>6. You see crusts, moist patches, or small bumps</h2>

<p>You may feel small crusts under the coat, notice tiny raised lesions, or find an area that has become moist and irritated.</p>

<p>These changes can occur with several skin disorders, including bacterial skin disease, so a photograph alone usually cannot establish the cause.</p>

<p>Repeated licking and scratching can also turn a small irritated area into a much larger lesion surprisingly quickly.</p>

<p>That is why it helps to pay attention not only to the size of a lesion, but also to <strong>how quickly it is changing.</strong></p>

<h2>7. The ears and paws keep becoming a problem too</h2>

<p>The ears and paws can be important clues in dogs with recurring skin disease.</p>

<p>Some dogs begin by licking between the toes or repeatedly scratching the ears before obvious lesions appear elsewhere.</p>

<p>Red paws, saliva staining, recurrent ear inflammation, or repeated ear infections can occur in dogs with allergic disease.</p>

<p>But the distribution alone does not prove atopic dermatitis.</p>

<p>AAHA states that atopy is a diagnosis of exclusion, and ICADA likewise recommends ruling out other diseases with similar or overlapping signs before diagnosing canine atopic dermatitis.</p>

<!-- IMAGE 4 -->

<h2>So what actually causes skin disease in dogs?</h2>

<p>At this point, you may be thinking, “All right, but which disease does my dog have?”</p>

<p>Ansim-i finds it easier to first think in <strong>groups of possible causes</strong> rather than memorizing a long list of disease names.</p>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>Possible cause</th>
<th>What you may notice</th>
<th>Why it needs to be distinguished</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Allergic skin disease</strong></td>
<td>Recurring itch, paw licking, ear problems, inflammation of the face, belly, or armpits</td>
<td>Environmental allergy, flea allergy, and food-related allergic disease can overlap in appearance.</td>
</tr>
<tr>
<td><strong>Fleas, mites, and other ectoparasites</strong></td>
<td>Itching, hair loss, crusting, lesions concentrated in particular areas</td>
<td>Parasite type and prevention history affect the diagnostic approach.</td>
</tr>
<tr>
<td><strong>Bacterial or yeast-associated dermatitis</strong></td>
<td>Redness, odor, greasy skin, crusts, itching</td>
<td>These may be primary problems or secondary complications of another skin disease.</td>
</tr>
<tr>
<td><strong>Fungal skin disease</strong></td>
<td>Hair loss, scale, crusts, redness in variable patterns</td>
<td>Dermatophyte infection may require specific testing for confirmation.</td>
</tr>
<tr>
<td><strong>Systemic and other skin disorders</strong></td>
<td>Coat changes, less-itchy hair loss, pigment changes, or other body-wide signs</td>
<td>Some endocrine and systemic disorders cannot be solved by treating the skin alone.</td>
</tr>
</tbody>
</table>
</div>

<p>There is one important point here.</p>

<p><strong>Finding bacteria or yeast on the skin does not always mean they were the original problem.</strong></p>

<p>An underlying allergy, parasite problem, or another disorder may first disrupt the skin, allowing secondary infection to develop afterward.</p>

<h2>“It looks like an allergy. Should I just change the food?”</h2>

<p>Food is often the first thing pet parents suspect when a dog is itchy.</p>

<p>But itching alone cannot tell us that food is the cause.</p>

<p>Environmental allergy, flea allergy, parasites, and secondary infection can produce similar signs.</p>

<p>AAHA notes that history and physical examination alone cannot reliably distinguish atopy from food allergy. A properly conducted diet trial may therefore become part of the diagnostic process when food allergy is being considered.</p>

<p><strong>In other words, “my dog improved after I changed foods” and “food allergy has been diagnosed” are not necessarily the same thing.</strong></p>

<!-- IMAGE 5 -->

<h2>What does a veterinarian actually check?</h2>

<p>It is easy to imagine a skin appointment as someone simply looking at the rash and naming it.</p>

<p>Recurring itchy skin usually requires a more systematic approach.</p>

<p>AAHA recommends first obtaining a detailed history and performing a complete physical examination. A minimum dermatologic database may then include <strong>skin cytology, flea combing, skin scrapings, and ear cytology when ear disease is present.</strong></p>

<p>Depending on what those findings suggest, further testing may be needed.</p>

<p><strong>Ansim-i would describe skin diagnosis as a process of narrowing down possibilities, not matching a rash to a photograph.</strong></p>

<h2>Will frequent bathing fix a skin problem?</h2>

<p>Bathing can be useful in the management of some skin diseases, including allergic skin disease.</p>

<p>But there is no single shampoo or bathing schedule that is right for every itchy dog.</p>

<p>Management varies according to the diagnosis, presence of infection, skin barrier condition, and individual response. ICADA also describes bathing and coat care as parts of a broader, multifaceted management plan for canine atopic dermatitis rather than a stand-alone cure.</p>

<p>For that reason, this article does not give one universal “bathe every X days” rule.</p>

<h2>When should you stop watching and get veterinary help?</h2>

<p>An occasional scratch is different from itching that keeps a dog awake or causes repeated chewing and self-trauma.</p>

<p>Veterinary evaluation becomes more important if the skin is rapidly worsening, lesions are spreading, there is bleeding or discharge, the area is very painful, or recurrent ear and skin problems keep returning.</p>

<p>Sudden facial swelling or skin changes accompanied by breathing difficulty or other acute systemic signs require prompt veterinary attention.</p>

<p>Loss of appetite, marked lethargy, or unexplained body-weight changes together with skin problems also deserve a broader medical evaluation.</p>

<!-- IMAGE 6 -->

<h2>Ansim-i’s simple skin diary</h2>

<p>Most of your dog’s skin story happens at home, not in the examination room.</p>

<p>That makes your observations surprisingly valuable.</p>

<p>Write down when the itching began, which body areas are affected, whether it changes with the season, what parasite prevention has been used, and how the dog responded to previous treatments.</p>

<p>These are also among the history details emphasized in the AAHA approach to itchy dogs.</p>

<p>Taking photographs from a similar angle and under similar lighting every few days can also make changes easier to see.</p>

<p><strong>With skin disease, the timeline can sometimes tell us more than a single photograph.</strong></p>

<h2>Ansim-i’s Research Note</h2>

<p>Search for dog skin disease online and you will often see shortcuts such as “paw licking means allergy” or “dandruff means dry skin.”</p>

<p>Real skin disease is usually less tidy than that.</p>

<p><strong>The same itch can come from allergies, parasites, infection, or more than one problem at the same time.</strong></p>

<p>In allergic dogs, secondary bacterial or yeast infections and ear disease may also appear and make the original itch worse.</p>

<p>That is why Ansim-i does not want you to memorize a list of skin diseases.</p>

<p>Instead, start with three questions: <strong>Where is the change? When did it begin? How has it changed over time?</strong></p>

<p>Those observations can turn a vague “skin problem” into useful information for finding the cause.</p>`;

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
      console.log('⚠️ Post 5959 not found in CSV to update.');
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

  console.log('\n🎉 ALL DONE SUCCESSFUL FOR POST 5959!');
}

run().catch(err => {
  console.error('❌ Error executing update script:', err);
  process.exit(1);
});
