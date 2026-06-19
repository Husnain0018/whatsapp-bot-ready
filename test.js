const axios = require("axios");

async function test() {
  try {
    const res = await axios.post(
      "https://danapani018.app.n8n.cloud/webhook/message",
      { hello: "world" },
      { timeout: 10000 }
    );

    console.log(res.status);
    console.log(res.data);
  } catch (e) {
    console.error(e);
  }
}

test();