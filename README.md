### Fleare Node.js Client

The Node.js client for connecting to a Fleare server — a in-memory database system.

⚡ Simplify client communication with pooled connections, event-based lifecycle handling, and clean data operations.

---

#### Installation

```bash
npm install fleare
# or
yarn add fleare
````

---

#### Import Fleare


```ts
import fleare, { Options } from "fleare";
```

or
```js
const fleare = require("fleare-test").default;
```

#### Create a Client

```ts
const client = fleare.createClient("127.0.0.1", 9219, {
  poolSize: 10,
  username: "root",
  password: "root",
});
```

#### Connect to Fleare

```ts
client.connect().then(() => {
  console.log("✅ Connected to Fleare");
});
```

---

#### Event Listeners

Fleare client provides lifecycle events to help you monitor connection status:

```ts
client.on("connecting", () => {
  console.log("Client is connecting...");
});

client.on("connected", () => {
  console.log("Client connected successfully!");
});

client.on("disconnected", () => {
  console.log("Client disconnected.");
});

client.on("error", (err) => {
  console.error("Client error:", err.message);
});

client.on("close", () => {
  console.log("Client connection closed.");
});

client.on("stateChanged", (state) => {
  console.log("Client state changed to:", state);
});
```

---

#### Example Usage

A complete usage example including `connect`, `set`, and `close`:

```ts
import fleare from "fleare";

const client = fleare.createClient("127.0.0.1", 9219, {
  poolSize: 10,
  username: "root",
  password: "root",
});

async function main() {
  try {
    await client.connect();

    const res = await client.set("user:001", {
      name: "John",
      age: 30,
      id: 1,
    });

    console.log("Set Result:", res);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
    console.log("🔌 Connection closed.");
  }
}

main();
```

---

### For More Info

[Clients Documentation](https://fleare.com/docs/clients/setup)

---

#### License

MIT © [Fleare](https://fleare.com)
