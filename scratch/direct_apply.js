const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const wpUrl = process.env.WORDPRESS_API_URL || 'https://magentalab.mycafe24.com/wp-json';
const wpUser = process.env.WORDPRESS_API_USERNAME;
const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
const auth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
const authorization = `Basic ${auth}`;

async function directApply() {
  const { data } = await supabase.from('ai_revisions').select('*').eq('revision_id', 'rev_22a8d9a24d9d2f3e').single();
  
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
  
  const res = await fetch(`${wpUrl}/wp/v2/posts/${data.wordpress_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization,
      'X-Authorization': authorization,
      'x-http-authorization': authorization,
      'User-Agent': 'MagentaLab-AI-Content/1.0',
    },
    body: JSON.stringify(payload)
  });
  
  if (res.ok) {
    console.log("WP updated successfully.");
    console.log("DB updated successfully.");
  } else {
    console.error("Failed:", await res.text());
  }
}

directApply();
