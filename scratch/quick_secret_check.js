require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET;
console.log("AI_CONTENT_API_SECRET length:", API_SECRET ? API_SECRET.length : 'NOT SET');
console.log("First/last chars:", API_SECRET ? `${API_SECRET[0]}...${API_SECRET[API_SECRET.length-1]}` : 'N/A');

// Quick test
fetch('https://www.magentalabblog.com/api/ai-content/revisions/review?status=pending_review', {
  headers: { 'Authorization': `Bearer ${API_SECRET}` }
}).then(async r => {
  console.log("HTTP Status:", r.status);
  console.log("Body snippet:", (await r.text()).slice(0, 80));
});
