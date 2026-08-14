require('dotenv').config({ path: '.env.local' });

async function check() {
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://localhost:3000/api/search?q=test');
      console.log(`Server status: ${res.status}`);
      if (res.status === 200) {
        console.log("Server ready!");
        return;
      }
    } catch (e) {
      console.log("Waiting for server:", e.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
}

check();
