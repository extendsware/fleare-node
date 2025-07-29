import fleare, { Options } from "../libs";

async function main() {
  const client = fleare.createClient("127.0.0.1", 9219, {
    poolSize: 10,
    // username: "root",
    // password: "root",
  });

  // client.on("connecting", () => {
  //   console.log("Client is connecting...");
  // });

  // client.on("connected", () => {
  //   console.log("Client connected successfully!");
  // });

  // client.on("disconnected", () => {
  //   console.log("Client disconnected");
  // });

  // client.on("error", (err) => {
  //   console.error("Client error:", err.message);
  // });

  // client.on("close", () => {
  //   console.error("Client close:");
  // });

  // client.on("stateChanged", (state) => {
  //   console.log("Client state changed to:", state);
  // });

  try {
    console.log("Connecting to server...");
    const com = await client.connect();

    const promises = [];
    const func = async (n: number) => {
      // const res = await client.set(`user:${n}`, {
      //   name: "John",
      //   age: 30,
      //   id: n,
      // });
      const res = await client.get(`user:${n}`);
      // console.log(n, res.id);
    };

    for (var i = 0; i < 10000; i++) {
      promises.push(func(i));
    }

    const startTime = Date.now();
    await Promise.all(promises);
    const endTime = Date.now();
    console.log(`Execution time: ${endTime - startTime}ms`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
