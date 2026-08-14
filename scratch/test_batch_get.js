async function testBatchGet() {
  const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions/batch');
  console.log("GET Status:", res.status);
}

testBatchGet();
