const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");

const { jira1 } = require("./data/jira");
const { gitlab_commit, merged, merge_request } = require("./data/gitlab");
const { failure } = require("./data/rollbar");

const collections = ["events", "contributors", "projects", "teams"];

async function run() {
  let client, uri, url;
  const myArgs = process.argv.slice(2);

  if (myArgs.length === 0) {
    throw "Must provide platform";
  }

  if (myArgs[0] === "prod") {
    uri = "mongodb://admin:e7VBgeJ3PH86JcGx@163.172.182.203:27017";
    url = "";
  } else {
    uri = "mongodb://localhost:27017";
    url = "https://ed73-90-243-155-90.ngrok.io";
  }

  client = new MongoClient(uri);

  await client.connect();

  try {
    await client.connect();
    const database = client.db("ft");

    for (const col of collections) {
      await database.collection(col).deleteMany({});
    }

    await axios.post(`${url}/v1/jira`, jira1);
    await axios.post(`${url}/v1/gitlab`, gitlab_commit);
    await axios.post(`${url}/v1/gitlab`, gitlab_commit);
    await axios.post(`${url}/v1/gitlab`, merge_request);
    await axios.post(`${url}/v1/gitlab`, merged);
    await axios.post(`${url}/v1/rollBar`, failure);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
