import { supabaseAdmin } from '../lib/supabase-admin';

async function run() {
  await supabaseAdmin.from('ai_revisions').update({ status: 'rejected' }).eq('wordpress_id', 2167);
  console.log('Done!');
}
run();
