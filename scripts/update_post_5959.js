require('dotenv').config({ path: '.env.local' });

const postId = 5959;
const title = "Dog Skin Problems Explained: Itching, Dandruff, Hair Loss, Pyoderma, Ringworm, and When to See a Vet";

const excerpt = `1. Itching, dandruff, redness, hair loss, odor, and crusting can look similar even when the underlying causes are very different. Allergies, parasites, bacterial or yeast overgrowth, dermatophytosis, and endocrine disease may all need to be considered.
2. Canine pyoderma is often secondary to another skin problem. Diagnosis may involve skin cytology, scrapings, fungal testing, or bacterial culture rather than choosing antibiotics or medicated shampoo from appearance alone.
3. Treatment depends on the diagnosis. Shampoo contact time, bathing frequency, antibiotics, antifungals, and allergy treatments should follow the product instructions and the veterinary plan for the individual dog.

[Empathy]
Watching your dog scratch through the night, lick the paws constantly, or develop patches of hair loss can make you want to find the fastest treatment possible.

I’m Ansim-i. Skin disease is frustrating because very different problems can look almost identical from the outside. The safest shortcut is actually not to guess.

Notice where the problem started, take photos, record how quickly it is spreading, and let the examination tell us whether we are dealing with allergy, infection, parasites, fungus, or something else.`;

const userBodyTemplate = `<p>A dog scratches constantly. Dandruff appears. The paws become red from licking. Then a bald patch or crust develops.</p>

<p>At first glance, it is tempting to call all of these problems “dermatitis.” But canine skin disease is more complicated because very different conditions can create very similar outward signs.</p>

<p>Allergies, fleas, mites, bacterial pyoderma, Malassezia overgrowth, dermatophytosis, endocrine disorders, immune-mediated disease, and other conditions can all affect the skin and coat.</p>

<p>The goal is therefore not simply to stop the itching. It is to identify what is driving the skin problem and treat that cause appropriately.</p>

<h2>Dog Skin Symptoms: What They Can Mean</h2>

<p>The same skin symptom can have several different causes. This table is designed to help pet parents organize observations—not diagnose a skin disease at home.</p>

<div class="table-responsive">
<table>
<thead>
<tr>
<th>What You Notice</th>
<th>Possible Causes</th>
<th>Veterinary Tests That May Help</th>
<th>What Pet Parents Should Avoid</th>
</tr>
</thead>

<tbody>
<tr>
<td><strong>Itching, licking, red skin</strong></td>
<td>Allergic dermatitis, fleas, mites, bacterial or yeast overgrowth, contact irritation and other inflammatory disorders</td>
<td>Skin examination, cytology, flea/parasite assessment, skin scraping, allergy-oriented workup when indicated</td>
<td>Do not assume every itchy dog needs antibiotics or antifungal medication.</td>
</tr>

<tr>
<td><strong>Pustules, crusts, circular scaling</strong></td>
<td>Superficial bacterial pyoderma is one possibility, but dermatophytosis and demodicosis can produce overlapping lesions.</td>
<td>Skin cytology, scraping, fungal examination or culture; bacterial culture in selected cases</td>
<td>Do not diagnose pyoderma only from photographs or lesion shape.</td>
</tr>

<tr>
<td><strong>Circular hair loss and scaling</strong></td>
<td>Dermatophytosis, demodicosis, bacterial folliculitis and other follicular disorders</td>
<td>Hair examination, fungal testing, Wood's lamp as a screening aid, skin scraping</td>
<td>Do not assume every circular bald patch is ringworm.</td>
</tr>

<tr>
<td><strong>Greasy skin, odor, recurrent itching</strong></td>
<td>Malassezia overgrowth, bacterial infection, allergy or underlying skin disease</td>
<td>Cytology and assessment for an underlying trigger</td>
<td>Do not repeatedly use medicated products without confirming what is being treated.</td>
</tr>

<tr>
<td><strong>Symmetrical hair loss with little itching</strong></td>
<td>Endocrine or other non-inflammatory disorders may need consideration.</td>
<td>Physical examination and laboratory testing selected by the veterinarian</td>
<td>Do not assume all hair loss is caused by allergy or infection.</td>
</tr>
</tbody>
</table>
</div>

<!-- EXISTING IMAGE 1 -->

<h2>1. Why Dog Skin Diseases Are Difficult to Diagnose by Appearance Alone</h2>

<p>Many canine skin diseases share the same basic signs:</p>

<ul>
<li>Itching</li>
<li>Redness</li>
<li>Hair loss</li>
<li>Dandruff or scaling</li>
<li>Crusting</li>
<li>Darkening of the skin</li>
<li>Odor</li>
<li>Repeated licking or chewing</li>
</ul>

<p>These symptoms tell us that something is affecting the skin, but they do not necessarily tell us what the cause is.</p>

<p>For example, bacterial folliculitis, demodicosis, and dermatophytosis can all produce follicular lesions and areas of hair loss.</p>

<p>Merck Veterinary Manual therefore describes diagnosis of pyoderma as involving characteristic skin lesions, confirmation of bacteria, and exclusion of other causes such as demodicosis and dermatophytosis.</p>

<h2>2. Canine Pyoderma: Often a Secondary Problem</h2>

<p>Pyoderma generally refers to bacterial inflammation or infection of the skin.</p>

<p>In dogs, superficial bacterial pyoderma is common, but it often develops because another problem has changed the skin environment or damaged the normal barrier.</p>

<p>Underlying triggers can include:</p>

<ul>
<li>Flea infestation</li>
<li>Atopic dermatitis</li>
<li>Food allergy</li>
<li>Demodicosis</li>
<li>Endocrine disease</li>
<li>Keratinization disorders</li>
<li>Skin folds or other anatomical factors</li>
<li>Trauma or chronic licking</li>
</ul>

<p>This is why repeatedly treating only the bacterial component without finding the underlying trigger can lead to recurrence.</p>

<!-- EXISTING IMAGE 2 -->

<h3>What Does Superficial Pyoderma Look Like?</h3>

<p>Possible lesions include follicular papules or pustules, crusts, scales, epidermal collarettes and multifocal areas of hair loss.</p>

<p>Itching can occur, but its intensity varies between dogs.</p>

<p>Deep pyoderma is different. Pain, swelling, ulceration, crusting, draining lesions, blood or pus, and marked discomfort can occur when deeper skin structures are involved.</p>

<h2>3. Why We Removed the “Leave Medicated Shampoo on for Exactly 10 Minutes” Rule</h2>

<p>The previous version of this article gave a fixed shampoo contact time as if it applied to every dog and every medicated product.</p>

<p>That is too broad.</p>

<p>Medicated shampoos contain different active ingredients and are used for different conditions. The appropriate bathing frequency and contact time therefore depend on the product, diagnosis, severity of disease, and veterinary plan.</p>

<p><strong>Follow the product label and the instructions given for your dog rather than applying one universal contact-time rule.</strong></p>

<p>The updated 2025 ISCAID guidance places substantial emphasis on topical antimicrobial therapy for surface and superficial bacterial pyoderma, helping reduce unnecessary systemic antimicrobial exposure.</p>

<!-- EXISTING IMAGE 3 -->

<h2>4. Does Pyoderma Always Require Oral Antibiotics?</h2>

<p>No.</p>

<p>This is one of the most important changes in modern canine pyoderma management.</p>

<p>Merck's current professional guidance states that topical therapy should generally be the sole antimicrobial treatment for surface and superficial pyoderma, including methicillin-resistant cases, while systemic antimicrobial therapy is reserved for situations in which it is clinically indicated.</p>

<p>This does not mean pet parents should stop an antibiotic that has already been prescribed.</p>

<p>Instead:</p>

<p><strong>Do not start, stop, extend, or change an antimicrobial medication without discussing it with the veterinarian responsible for the case.</strong></p>

<p>The choice between topical and systemic treatment depends on infection depth, lesion distribution, cytology, treatment response, bacterial resistance concerns, and the dog's overall condition.</p>

<h2>5. When Is Bacterial Culture Important?</h2>

<p>Not every first episode of superficial skin disease requires the same diagnostic tests.</p>

<p>However, bacterial culture and susceptibility testing become particularly important in situations such as recurrent infection, poor response to appropriate treatment, deeper infection, or concern about antimicrobial resistance.</p>

<p>Skin cytology is also extremely useful because it can demonstrate bacteria and inflammatory cells directly and can identify concurrent Malassezia organisms.</p>

<p>In other words, the question is not simply “Which antibiotic works for skin disease?” but:</p>

<p><strong>Is this actually bacterial disease, how deep is it, and what is driving it?</strong></p>

<!-- EXISTING IMAGE 4 -->

<h2>6. Circular Hair Loss Does Not Automatically Mean Ringworm</h2>

<p>A round patch of missing hair with scale or crust often makes pet parents think of ringworm immediately.</p>

<p>Dermatophytosis can certainly cause hair loss, scaling, crusting, redness and papules. But these appearances overlap with other canine skin disorders.</p>

<p>Veterinary testing may include:</p>

<ul>
<li>Examination of hairs and scales</li>
<li>Fungal culture</li>
<li>Fungal PCR in selected cases</li>
<li>Wood's lamp examination as a screening tool</li>
<li>Skin scrapings to assess for mites</li>
</ul>

<h3>Can a Wood's Lamp Diagnose Ringworm by Itself?</h3>

<p>No.</p>

<p>A Wood's lamp can help a veterinarian identify suspicious hairs for further examination, particularly with some <em>Microsporum canis</em> infections, but it should not be treated as a stand-alone test that proves or excludes dermatophytosis.</p>

<p>Merck describes direct hair and scale examination and fungal culture as commonly used diagnostic methods, with Wood's lamp examination used to locate suspect hairs.</p>

<h2>7. Is Ringworm Contagious to People?</h2>

<p>Dermatophytosis is a zoonotic disease, meaning transmission between animals and people can occur.</p>

<p>However, exposure does not guarantee that every person or animal in the household will develop disease.</p>

<p>If dermatophytosis is confirmed or strongly suspected, veterinary guidance may include treatment of the affected animal and environmental measures designed to reduce infectious material in the coat and surroundings.</p>

<p>People who develop suspicious skin lesions after contact with an affected pet should consult their own healthcare professional.</p>

<!-- EXISTING IMAGE 5 -->

<h2>8. Allergy Is One of the Most Common Reasons Dogs Keep Itching</h2>

<p>Allergic skin disease can predispose dogs to repeated bacterial and yeast overgrowth.</p>

<p>Potential allergic triggers include:</p>

<ul>
<li>Environmental allergens</li>
<li>Flea allergy</li>
<li>Food allergy</li>
</ul>

<p>Location and pattern can provide clues, but neither the owner nor a website can reliably diagnose the exact allergy from symptom location alone.</p>

<p>Dogs with allergic disease may lick or chew their paws, rub their face, develop recurrent ear disease, or experience repeated secondary skin infections.</p>

<h3>How Is Food Allergy Evaluated?</h3>

<p>Food allergy cannot be reliably diagnosed simply by listing ingredients commonly blamed online.</p>

<p>A veterinarian may recommend a structured elimination diet trial using an appropriate novel-protein or hydrolyzed diet, followed when appropriate by dietary challenge.</p>

<p>The exact diet, duration, treats, supplements and medications that may interfere with a trial should be discussed with the veterinary team.</p>

<p>This is why the previous instruction to “stop all treats and feed only hydrolyzed food for a fixed number of weeks” has been replaced with an individualized diagnostic approach.</p>

<h2>9. What About Malassezia Yeast?</h2>

<p><em>Malassezia</em> organisms normally occur on canine skin, but overgrowth can contribute to dermatitis in some dogs.</p>

<p>Common clues may include:</p>

<ul>
<li>Itching</li>
<li>Redness</li>
<li>Greasy skin</li>
<li>Scaling</li>
<li>Characteristic odor</li>
<li>Darkening or thickening of chronically affected skin</li>
</ul>

<p>Because bacterial and yeast overgrowth can occur together, cytology can help determine which organisms are present and guide treatment.</p>

<!-- EXISTING IMAGE 6 -->

<h2>10. Parasites Can Mimic Allergy and Infection</h2>

<p>Fleas and mites should remain on the differential list when a dog is itchy or losing hair.</p>

<p>Demodicosis can produce follicular inflammation, scaling and hair loss and may resemble bacterial folliculitis or dermatophytosis.</p>

<p>This is one reason skin scrapings and other basic dermatologic tests are valuable before repeatedly changing medication.</p>

<h2>11. When Hair Loss Is Not Very Itchy</h2>

<p>Not every skin problem causes intense scratching.</p>

<p>Symmetrical or progressive hair loss with relatively little inflammation can prompt veterinarians to consider noninfectious causes, including endocrine disorders and follicular diseases.</p>

<p>The veterinarian may decide that blood tests or other diagnostic procedures are needed based on age, breed, body condition and additional clinical signs.</p>

<p>A pattern of hair loss therefore provides a clue—not a diagnosis.</p>

<h2>12. What Can Pet Parents Safely Do at Home?</h2>

<p>Useful home care begins with observation rather than medication.</p>

<ul>
<li>Take clear photos of new lesions.</li>
<li>Record when itching or hair loss started.</li>
<li>Note whether the problem is spreading.</li>
<li>Record new foods, treats, shampoos or environmental exposures.</li>
<li>Check whether flea prevention is current.</li>
<li>Prevent excessive self-trauma when possible.</li>
<li>Use prescribed topical products exactly as instructed.</li>
</ul>

<p>Avoid repeatedly switching between human creams, leftover antibiotics, antifungals and medicated shampoos without knowing what condition is being treated.</p>

<!-- EXISTING IMAGE 7 -->

<h2>13. When Should a Dog With Skin Disease See a Veterinarian?</h2>

<p>Arrange veterinary assessment when:</p>

<ul>
<li>Itching is persistent or interferes with sleep</li>
<li>Hair loss continues to spread</li>
<li>Pustules, draining lesions, bleeding or ulceration develop</li>
<li>The skin becomes painful or markedly swollen</li>
<li>A strong odor or significant discharge develops</li>
<li>Ear disease repeatedly accompanies the skin problem</li>
<li>The same infection repeatedly returns</li>
<li>Other animals or people in the household develop suspicious lesions</li>
<li>Your dog becomes systemically unwell</li>
</ul>

<p>Deep, painful, rapidly progressive lesions deserve more prompt assessment than mild, stable dandruff.</p>

<h2>14. Ansim-i's Research Summary</h2>

<p><strong>Skin symptoms are clues, not diagnoses.</strong></p>

<p>An itchy red patch may represent allergy, parasites, bacterial infection, yeast overgrowth or another inflammatory problem. A circular bald patch may suggest dermatophytosis, but it does not prove it.</p>

<p>The safest strategy is therefore:</p>

<p><strong>Observe the pattern → perform appropriate dermatologic testing → identify the underlying trigger → choose treatment for the diagnosis.</strong></p>

<p>This approach is also important for antimicrobial stewardship. Antibiotics should not become the automatic answer to every itchy or crusted skin lesion.</p>

<h2>🔬 Veterinary Evidence &amp; References</h2>

<p><strong>Evidence Summary</strong></p>

<p>This article was reviewed against current veterinary dermatology references covering canine pyoderma, antimicrobial stewardship, dermatophytosis, cytology, culture and investigation of underlying skin disease.</p>

<h3>Primary Veterinary References</h3>

<ul>

<li>
<strong>International Society for Companion Animal Infectious Diseases (ISCAID)</strong> — 2025 Antimicrobial Use Guidelines for Canine Pyoderma
<br>
<a href="https://pubmed.ncbi.nlm.nih.gov/40338805/" target="_blank" rel="noopener noreferrer">View guideline record</a>
</li>

<li>
<strong>Merck Veterinary Manual</strong> — Pyoderma in Dogs and Cats
<br>
<a href="https://www.merckvetmanual.com/integumentary-system/pyoderma/pyoderma-in-dogs-and-cats" target="_blank" rel="noopener noreferrer">View veterinary reference</a>
</li>

<li>
<strong>American College of Veterinary Dermatology (ACVD)</strong> — Clinical Consensus Guidelines
<br>
<a href="https://acvd.org/about-us/clinical-consensus-guidelines/" target="_blank" rel="noopener noreferrer">View dermatology guidelines</a>
</li>

<li>
<strong>Merck Veterinary Manual</strong> — Dermatophytosis in Dogs and Cats
<br>
<a href="https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-dogs-and-cats" target="_blank" rel="noopener noreferrer">View veterinary reference</a>
</li>

</ul>

<h3>What These References Support in This Article</h3>

<ul>
<li>Canine pyoderma frequently occurs secondary to an underlying skin disorder.</li>
<li>Cytology is an important diagnostic tool for bacterial and Malassezia-associated skin disease.</li>
<li>Demodicosis and dermatophytosis may need to be excluded when follicular lesions are present.</li>
<li>Current antimicrobial guidance emphasizes topical therapy for many cases of surface and superficial pyoderma.</li>
<li>Systemic antimicrobial therapy should be selected according to clinical indication rather than automatically used for every superficial infection.</li>
<li>Dermatophytosis can cause hair loss, scale and crusting and is zoonotic.</li>
<li>Wood's lamp examination is a screening aid rather than a stand-alone definitive diagnosis of dermatophytosis.</li>
</ul>

<h3>Veterinary Caution</h3>

<p>The appearance of a skin lesion alone is often insufficient to determine its cause. Treatment—including medicated shampoo, antimicrobial medication, antifungal therapy, antiparasitic treatment or allergy management—should be selected according to the diagnosis and individual patient.</p>

<p>Contact time and frequency for medicated shampoos vary by formulation and veterinary treatment plan. This article therefore does not provide one universal shampoo contact time or antibiotic duration.</p>

<p><strong>Evidence level:</strong> Current veterinary infectious-disease guideline, veterinary dermatology consensus guidance and peer-reviewed veterinary reference material</p>

<p><em>*Evidence level is classified according to Magentalab's internal evidence framework.</em></p>

<p><strong>Content review and editing:</strong> Magentalab Research Team</p>`;

async function processPost5959() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  // 1. Fetch current WP post to extract original <img> tags
  console.log(`Fetching current WP content for Post ID ${postId}...`);
  const getRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    headers: { 'Authorization': authHeader }
  });
  const currentPost = await getRes.json();
  const currentHtml = currentPost.content.rendered;

  const originalImgs = currentHtml.match(/<img[^>]+>/gi) || [];
  console.log(`Extracted ${originalImgs.length} original <img> tags from WP.`);

  // 2. Replace <!-- EXISTING IMAGE X --> with actual original <img> tags
  let finalContent = userBodyTemplate;
  for (let i = 1; i <= 10; i++) {
    const commentRegex = new RegExp(`<!--\\s*EXISTING IMAGE ${i}\\s*-->`, 'gi');
    if (i <= originalImgs.length) {
      const imgHtml = `<p className="my-6">${originalImgs[i - 1]}</p>`;
      finalContent = finalContent.replace(commentRegex, imgHtml);
    } else {
      finalContent = finalContent.replace(commentRegex, '');
    }
  }

  // 3. Update WordPress Post
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
  console.log(`✅ Successfully updated Post ID ${updatedPost.id}!`);
  console.log(`New Title: ${updatedPost.title.rendered}`);
  console.log(`Live Link: https://www.magentalabblog.com/en/posts/${updatedPost.slug}`);

  // 4. Trigger Instant Revalidation
  console.log('Triggering instant CDN revalidation...');
  const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
  const revalJson = await revalRes.json();
  console.log('Revalidate status:', revalJson);
}

processPost5959().catch(err => console.error(err));
