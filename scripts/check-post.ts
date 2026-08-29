import { getPost } from '../lib/wp';

async function run() {
  try {
    const post = await getPost('2167', { noCache: true });
    if (!post) {
      console.log('Post not found');
      return;
    }
    console.log('Status:', post.status);
    console.log('Slug:', post.slug);
    console.log('Link:', post.link);
  } catch (e) {
    console.error(e);
  }
}

run();
