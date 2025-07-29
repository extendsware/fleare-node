import fleare from "fleare-test";
// const fleare = require("fleare-test").default;

async function main() {
  const client = fleare.createClient("127.0.0.1", 9219, {
    poolSize: 10,
    // username: "root",
    // password: "root",
  });

  try {
    await client.connect();

    const res = await client.get("user:001");

    console.log("Set Result:", res);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
    console.log("🔌 Connection closed.");
  }
}

main();
