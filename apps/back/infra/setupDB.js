const MongoClient = require("mongodb").MongoClient;

const collections = [
  "sequences",
  "events",
  "contributors",
  "projects",
  "teams",
];

async function run() {
  let client, uri, url;
  const myArgs = process.argv.slice(2);

  if (myArgs.length === 0) {
    throw "Must provide platform";
  }

  if (myArgs[0] === "prod") {
    uri = "mongodb://admin:XXXXXXX@163.172.182.203:27017";
  } else {
    uri = "mongodb://localhost:27017";
  }

  client = new MongoClient(uri);

  await client.connect();

  try {
    await client.connect();
    const database = client.db("ft");

    for (const col of collections) {
      await database.createCollection(col);
    }

    // Reset sequences
    const collectionSequences = database.collection("sequences");

    await collectionSequences.insertOne({
      _id: "events",
      sequence_value: 1,
    });
    await collectionSequences.insertOne({
      _id: "teams",
      sequence_value: 1,
    });
    await collectionSequences.insertOne({
      _id: "projects",
      sequence_value: 1,
    });
    await collectionSequences.insertOne({
      _id: "contributors",
      sequence_value: 1,
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
