import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { applyOneRevision } from '@/lib/apply-revision';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function forceApply() {
  console.log("Applying...");
  const liveResult = await applyOneRevision('rev_22a8d9a24d9d2f3e', { source: 'manual_force', dryRun: false });
  console.log(liveResult);
  
  if (liveResult.success) {
    const { error } = await supabase
      .from('ai_revisions')
      .update({ status: 'applied' })
      .eq('revision_id', 'rev_22a8d9a24d9d2f3e');
    console.log("DB update error:", error);
  }
}
forceApply();
