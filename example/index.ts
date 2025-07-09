import fleare, {Options} from '../libs';

async function main() {
    
  const client = fleare.createClient("127.0.0.1", 9219, {
    poolSize: 2,
    // username: "root",
    // password: "root"
  });

  client.on("connecting", () => {
    console.log("Client is connecting...");
  });

  client.on("connected", () => {
    console.log("Client connected successfully!");
  });

  client.on("disconnected", () => {
    console.log("Client disconnected");
  });

  client.on("error", (err) => {
    console.error("Client error:", err.message);
  });

  client.on("close", () => {
    console.error("Client close:");
  });

  client.on("stateChanged", (state) => {
    console.log("Client state changed to:", state);
  });

  try {
    console.log("Connecting to server...");
    const res = await client.connect();

    const l = [];
    const f = async () => {
      for (let index = 0; index < 1; index++) {
        const res = await client.send("STATUS", []).then((res) => {});
        // console.log(`Response ${index}:`, res.server_status);
      }
    };

    for (var i = 0; i < 1; i++) {
      l.push(f());
    }

    await Promise.all(l);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();