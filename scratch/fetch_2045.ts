import { config } from 'dotenv';
config({ path: '.env.local' });
import { getPost } from '../lib/wordpress';

async function fetchPost() {
  const post = await getPost(2045);
  console.log(JSON.stringify(post, null, 2));
}

fetchPost();
