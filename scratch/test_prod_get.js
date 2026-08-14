async function testGet() {
  const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions');
  console.log("Status:", res.status);
  console.log("Allow header:", res.headers.get('allow'));
  const text = await res.text();
  console.log("Body:", text);
}

testGet();
