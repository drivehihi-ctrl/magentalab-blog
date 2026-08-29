import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import { normalizeText } from '@/lib/services/verification-helpers';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data } = await supabase.from('ai_revisions').select('*').eq('revision_id', 'rev_22a8d9a24d9d2f3e').single();
  
  const { url } = getWordPressWriteConfig(data.wordpress_id.toString());
  const headers = getWordPressWriteHeaders();
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content: data.new_content })
  });
  
  const wpPost = await res.json();
  const expected = data.new_content;
  const actual = wpPost.content.rendered;
  
  const normExpected = normalizeText(expected);
  const normActual = normalizeText(actual);
  
  console.log("normExpected length:", normExpected.length);
  console.log("normActual length:", normActual.length);
  console.log("includes:", normActual.includes(normExpected));
  
  if (!normActual.includes(normExpected)) {
    // Find where they diverge
    let diffIdx = -1;
    let expectedIdx = 0;
    
    // Simple naive diff
    for(let i=0; i<normActual.length; i++) {
       if (normActual[i] === normExpected[expectedIdx]) {
           expectedIdx++;
       } else if (expectedIdx > 100) {
           console.log("Diverged after match length", expectedIdx);
           console.log("Expected next:", normExpected.substring(expectedIdx, expectedIdx + 50));
           console.log("Actual next:", normActual.substring(i, i + 50));
           break;
       }
    }
  }
}

test();
