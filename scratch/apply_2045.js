const secret = 'Aj+acYw51bnozMMwPwJjJjn51CrVWlzO1zhcaMOfULRIhRzc4fbsyFGVZxHKN5Hn';
const url = 'https://www.magentalabblog.com/api/mcp';

async function apply() {
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'magentalab_apply_revision',
      arguments: {
        revision_id: 'rev_22a8d9a24d9d2f3e',
        confirm: true,
        live_apply_confirm: true
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${secret}`
      },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${text}`);
  } catch (e) {
    console.error(e);
  }
}

apply();
