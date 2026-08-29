import { getPostBySlug } from '../lib/wp';

getPostBySlug("why-cats-rub-face-on-wall-id287", { noCache: true })
  .then(p => {
    if (p) {
      console.log('ID:', p.id);
      console.log('TITLE:', p.title.rendered);
    } else {
      console.log('Post not found');
    }
  })
  .catch(console.error);
