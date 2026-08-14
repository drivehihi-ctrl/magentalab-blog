require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function rejectOldRevisions() {
  const idsToReject = [
    'rev_5bc17d4206d3ec7d',
    'rev_022615d48249382b',
    'rev_f19c1ee8a66bce29',
    'rev_75a9db5be9f00e3f',
    'rev_05be504512409b61'
  ];

  for (const id of idsToReject) {
    console.log(`Rejecting ${id}...`);
    const { data, error } = await supabase
      .from('ai_revisions')
      .update({ status: 'rejected' })
      .eq('revision_id', id);
      
    if (error) {
      console.error(`Failed to reject ${id}:`, error);
    } else {
      console.log(`Successfully rejected ${id}`);
    }
  }
}

rejectOldRevisions().catch(console.error);
