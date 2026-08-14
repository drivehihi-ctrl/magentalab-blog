import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

fetch('http://localhost:3000/api/mcp', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json, text/event-stream',
    'Authorization': 'Bearer ' + process.env.AI_CONTENT_API_SECRET 
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'test',
    method: 'tools/call',
    params: { name: 'magentalab_get_review_queue', arguments: { status: 'pending_review' } }
  })
}).then(r => r.json()).then(d => {
    const arr = JSON.parse(d.result.content[0].text);
    console.log("Found for 5800:", arr.filter(a => a.wordpress_id === 5800));
});
