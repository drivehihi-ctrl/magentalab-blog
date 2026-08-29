const secret = 'Aj+acYw51bnozMMwPwJjJjn51CrVWlzO1zhcaMOfULRIhRzc4fbsyFGVZxHKN5Hn';
const url = 'https://www.magentalabblog.com/api/mcp';

async function test() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${secret}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });
    
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${text}`);
  } catch (e) {
    console.error(e);
  }
}

test();
