import { getPost } from '../lib/wp';

getPost("2269", { noCache: true })
  .then(p => {
    if (p) {
      console.log('TITLE:', p.title.rendered);
    } else {
      console.log('Post not found');
    }
  })
  .catch(console.error);
