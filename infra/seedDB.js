const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");

const { jira1 } = require("./data/jira");
const { gitlab_commit, merged, merge_request } = require("./data/gitlab");
const { failure } = require("./data/rollbar");

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
    url = "";
  } else {
    uri = "mongodb://localhost:27017";
    url = "http://localhost:4000";
  }

  client = new MongoClient(uri);

  await client.connect();

  try {
    await client.connect();
    const database = client.db("ft");

    for (const col of collections) {
      await database.collection(col).deleteMany({});
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

    await axios.post(`${url}/v1/jira`, jira1);
    setTimeout(async () => {
      await axios.post(`${url}/v1/gitlab`, gitlab_commit);
    }, 1000);
    setTimeout(async () => {
      await axios.post(`${url}/v1/gitlab`, merge_request);
    }, 2000);
    setTimeout(async () => {
      await axios.post(`${url}/v1/gitlab`, merged);
    }, 3000);
    setTimeout(async () => {
      await axios.post(`${url}/v1/rollBar`, failure);
    }, 4000);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
