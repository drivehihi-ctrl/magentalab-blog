const url = 'https://www.magentalabblog.com/ja/posts/dog-licking-paws-causes-ja';
fetch(url).then(r => r.text()).then(html => {
  const matchRobots = html.match(/<meta[^>]*name="robots"[^>]*>/i);
  const matchCanonical = html.match(/<link[^>]*rel="canonical"[^>]*>/i);
  const matchHreflang = html.match(/<link[^>]*rel="alternate"[^>]*hreflang=[^>]*>/gi);
  console.log('Robots:', matchRobots ? matchRobots[0] : 'None');
  console.log('Canonical:', matchCanonical ? matchCanonical[0] : 'None');
  console.log('Hreflangs:', matchHreflang);
}).catch(console.error);
