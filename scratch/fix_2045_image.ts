import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { applyOneRevision } from '@/lib/apply-revision';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix2045Image() {
  const { data } = await supabase.from('ai_revisions').select('*').eq('revision_id', 'rev_22a8d9a24d9d2f3e').single();
  
  let content = data.new_content;
  
  // Find the wp:image block
  const imgBlockRegex = /<!-- wp:image {"align":"center"} -->\n<figure class="wp-block-image aligncenter"><img src="PLACEHOLDER" alt="([^"]+)" \/><\/figure>\n<!-- \/wp:image -->/g;
  
  content = content.replace(imgBlockRegex, (match, altText) => {
    return `<p>[이미지 1]<br>alt 태그: ${altText}<br>이미지 프롬프트: Hyper-realistic 3D render style, photorealistic appearance. A brown dachshund wearing round-rimmed glasses and holding a small gold magnifying glass looks as if he is wearing a white lab coat. He is a researcher, and his name is Ansim. He is calmly observing a dog resting beside its owner on a shaded Korean neighborhood walking path after exercise, focusing on the dog’s tongue color, gum color, chest movement and breathing posture, realistic fur, natural daylight, detailed scene, educational and trustworthy veterinary research mood.</p>`;
  });
  
  // Update DB
  await supabase.from('ai_revisions').update({ new_content: content }).eq('revision_id', 'rev_22a8d9a24d9d2f3e');
  console.log("DB updated with raw text for image.");
}

fix2045Image();
