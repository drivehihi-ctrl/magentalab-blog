import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

fetch('https://www.magentalabblog.com/api/mcp', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json, text/event-stream',
    'Authorization': 'Bearer ' + process.env.AI_CONTENT_API_SECRET 
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'test',
    method: 'tools/list'
  })
}).then(r => r.json()).then(d => {
    if (d.result && d.result.tools) {
        const tools = d.result.tools.map(t => t.name);
        console.log('Production Tools available (Count:', tools.length, '):', tools);
    } else {
        console.log('Production Error:', JSON.stringify(d, null, 2));
    }
});
