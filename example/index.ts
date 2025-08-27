import fleare, { Options } from "../libs";

async function main() {
  const client = fleare.createClient("127.0.0.1", 9219, {
    poolSize: 1,
    username: "root",
    password: "root",
  });


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
    await client.connect();

    // const subClient = client.createSubClient();
    // const pubClient = client.createPubClient();

    // subClient.on("ready", (err) => {
    //   console.log("subClient ready:", err);
    // });

    // pubClient.on("ready", (err) => {
    //   console.log("Publisher ready:", err);
    // });

    // await subClient.connect();
    // await pubClient.connect();



    // subClient.subscribe("topic1", (message) => {
    //   console.log("topic1", message, message.action);
    // });

    //  // Example of subscribing to a topic
    // await subClient.subscribe("topic2", (message) => {
    //   console.log("topic2", message);
    // });

    //  await subClient.subscribe("topic3", (message) => {
    //   console.log("topic3", message);
    // });

    // await subClient.subscribe("topic4", (message) => {
    //   console.log("topic4", message);
    // });

    // await subClient.subscribe("topic5", (message) => {
    //   console.log("topic5", message);
    // });

    // await pubClient.publish("topic1", {"user": {"name": "John", "role": "admin", "age": 30}, "action": "login"});
    // await pubClient.publish("topic3", "Hello, Fleare3!");

    // await subClient.unsubscribe("topic4");

    await client.listPush("extends:DM:1b9e5c1e-733a1a36", {"content":{"contentText":"Hello"},"conversationId":"1b9e5c1e-733a1a36","dateTime":"2025-08-24T06:51:50.953Z","fromUserId":"733a1a36-5f29-4056-aa1a-be371cbc313f","msgId":"1b9e5c1e-733a1a36/2dc67f8d-0c89-4b5a-8644-ffa85d3f6ef2","msgType":"DIRECT_MESSAGE","seen":false,"sendStatus":"SENT","toUserId":"1b9e5c1e-fd93-454a-9383-66d8785246e8","workspaceId":"extends"});
    const res = await client.listGet("extends:DM:1b9e5c1e-733a1a36");
    console.log(res);
    

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
