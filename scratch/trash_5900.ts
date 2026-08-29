import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';

dotenv.config({ path: '.env.local' });

async function trashPost(id) {
  const { url } = getWordPressWriteConfig(id);
  const headers = getWordPressWriteHeaders();
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ status: 'trash' })
  });
  
  if (res.ok) {
    console.log(`Post ${id} moved to trash successfully.`);
  } else {
    console.error(`Failed to trash post ${id}:`, await res.text());
  }
}

trashPost('5900');
