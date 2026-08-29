import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function directApply() {
  const { data } = await supabase.from('ai_revisions').select('*').eq('revision_id', 'rev_22a8d9a24d9d2f3e').single();
  
  const { url } = getWordPressWriteConfig(data.wordpress_id.toString());
  const headers = getWordPressWriteHeaders();
  
  const payload = {
    title: data.new_title,
    content: data.new_content,
    excerpt: data.new_excerpt,
    meta: {
      _ai_revision_id: data.revision_id,
      _ai_revision_status: 'applied',
      _ai_evidence: JSON.stringify(data.evidence || {}),
      _ai_ansim_summary: data.new_ansim_summary || ''
    }
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  
  if (res.ok) {
    console.log("WP updated successfully.");
    await supabase.from('ai_revisions').update({ status: 'applied', applied_at: new Date().toISOString() }).eq('revision_id', 'rev_22a8d9a24d9d2f3e');
    console.log("DB updated successfully.");
  } else {
    console.error("Failed:", await res.text());
  }
}

directApply();
