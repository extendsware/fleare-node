import fleare, { Options } from "../libs";

async function main() {
  const client = fleare.createClient("127.0.0.1", 9219, {
    poolSize: 2,
    // username: "root",
    // password: "root",
  });

  // client.on("connecting", () => {
  //   console.log("Client is connecting...");
  // });

//   client.on("connected", () => {
//     console.log("Client connected successfully!");
//   });

//   client.on("disconnected", () => {
//     console.log("Client disconnected");
//   });

//   client.on("error", (err) => {
//     console.error("Client error:", err.message);
//   });

  // client.on("close", () => {
  //   console.error("Client close:");
  // });

  // client.on("stateChanged", (state) => {
  //   console.log("Client state changed to:", state);
  // });

  try {
    console.log("Connecting to server...");
    const com = await client.connect();

    const l = [];
    const f = async () => {
      for (let index = 0; index < 1; index++) {
        // const res = await client.jsonSet("users:001", {"name":"John","age":30,"hobbies":["reading","hiking"]});
        // await client.jsonSetRef("orders:OD001", {"orderId":"orders:OD001","details":"This order is for a new laptop.","status":"pending"}, {"userId":"users:001"});
        // const res1 = await client.jsonGet("orders:OD001", "_userId", "userId");
        // console.log(res1);

        await client.jsonSet("user:001", {"name":"John","age":30,"hobbies":["reading","hiking"]});
      const res = await client.jsonAdd("user:001", "hobbies", ["reading","hiking"]);
      console.log(res);
      }
    };

    const t = async (n: any): Promise<void>=> {
        return new Promise((resolve, rejects) =>{
            setTimeout(()=>{
                console.log(n);
                resolve()
            }, 1000)
        })
    }

    for (var i = 0; i < 1; i++) {
      //  t(i)
      l.push(f())
    }

    await Promise.all(l);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
