import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getPost } from '@/lib/wp';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const wpPost = await getPost('2045', { noCache: true });
  
  const { data, error } = await supabase
    .from('ai_revisions')
    .update({ source_modified_at: wpPost.modified })
    .eq('revision_id', 'rev_22a8d9a24d9d2f3e');
    
  if (error) console.error(error);
  else console.log('Successfully updated source_modified_at');
}
fix();
