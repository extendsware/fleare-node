// Import the client (CommonJS syntax)
const fleare = require("./dist").default;

async function main() {
  // Create a new client with connection pool of 5 connections
  const client = fleare.CreateClient("127.0.0.1", 9219, {
    poolSize: 10,
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
      for (let index = 0; index < 10; index++) {
        const res = await client.send("STATUS", []).then((res) => {});
        // console.log(`Response ${index}:`, res.server_status);
      }
    };

    for (var i = 0; i < 10; i++) {
      l.push(f());
    }

    await Promise.all(l);

    // Send commands - these will be round-robin distributed across connections
    // console.log("Sending command 1...");
    // for (let index = 0; index < 100000; index++) {
    //   const res = await client.send("STATUS", []).then((res) => {});
    //   // console.log(`Response ${index}:`, res.server_status);
    // }

    // console.log('Sending command 2...');
    // const response2 = await client.send('SET', ['user:123', JSON.stringify({ name: 'John' })]);
    // console.log('Response 2:', {
    //   status: response2.getStatus(),
    //   clientId: response2.getClientId()
    // });

    // console.log('Sending command 3...');
    // const response3 = await client.send('DELETE', ['user:123']);
    // console.log('Response 3:', response3.toObject());
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
