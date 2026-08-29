import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getPost } from '@/lib/wp';

dotenv.config({ path: '.env.local' });

async function check() {
  const wpPost = await getPost('2045', { noCache: true });
  console.log("Status:", wpPost.status);
  console.log("Link:", wpPost.link);
  console.log("Content includes 이미지 1:", wpPost.content.rendered.includes('이미지 1'));
  console.log("Content includes PLACEHOLDER:", wpPost.content.rendered.includes('PLACEHOLDER'));
}

check();
