import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix2045Html() {
  const { data } = await supabase.from('ai_revisions').select('*').eq('revision_id', 'rev_22a8d9a24d9d2f3e').single();
  
  let content = data.new_content;
  
  // Replace the paragraph we added earlier
  const regex = /<p>(\[이미지 1\])<br>alt 태그: (.*?)<br>이미지 프롬프트: (.*?)<\/p>/g;
  
  content = content.replace(regex, (match, imgLabel, alt, prompt) => {
    return `<!-- wp:html -->\n<div style="display:none;" class="ai-image-prompt">\n${imgLabel}<br>\nalt 태그: ${alt}<br>\n이미지 프롬프트: ${prompt}\n</div>\n<!-- /wp:html -->`;
  });
  
  await supabase.from('ai_revisions').update({ new_content: content }).eq('revision_id', 'rev_22a8d9a24d9d2f3e');
  console.log("DB updated with wp:html block.");
}

fix2045Html();
