const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/workers/workers');
    console.log(`Returned ${res.data.length} workers.`);
  } catch(e) {
    console.error(e.message);
  }
}
test();
