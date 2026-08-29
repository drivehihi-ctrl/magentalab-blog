import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getPost } from '@/lib/wp';
import { canonicalizeContent } from '@/lib/services/verification-helpers';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data } = await supabase.from('ai_revisions').select('*').eq('revision_id', 'rev_22a8d9a24d9d2f3e').single();
  const wpPost = await getPost(data.wordpress_id.toString(), { noCache: true });
  
  const expected = canonicalizeContent(data.new_content);
  const actual = canonicalizeContent(wpPost.content.rendered);
  
  console.log("EXPECTED LENGTH:", expected.length);
  console.log("ACTUAL LENGTH:", actual.length);
  
  // Find first difference
  let diffIdx = -1;
  for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
    if (expected[i] !== actual[i]) {
      diffIdx = i;
      break;
    }
  }
  
  if (diffIdx !== -1) {
    console.log("DIFF AT INDEX:", diffIdx);
    console.log("EXPECTED SUBSTR:", expected.substring(Math.max(0, diffIdx - 20), diffIdx + 40));
    console.log("ACTUAL SUBSTR:", actual.substring(Math.max(0, diffIdx - 20), diffIdx + 40));
  } else {
    console.log("MATCH!");
  }
}

test();
