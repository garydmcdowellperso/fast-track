import { MongoClient } from "mongodb";

import config from "../../../../config";

class ContributorRepositoryMongo {
  constructor() {
    const { url } = config.db;

    const client = new MongoClient(url);

    client.connect((err) => {
      if (err) {
        console.log(err, "Error connecting to Mongo");
        throw new Error("Error connecting to Mongo");
      }
      this.db = client.db(config.db.dbname);
      this.collection = this.db.collection("contributors");
      this.sequences = this.db.collection("sequences");
    });
  }

  async _getValueForNextSequence() {
    const sequenceDoc = await this.sequences.findOneAndUpdate(
      { _id: "contributors" },
      { $inc: { sequence_value: 1 } },
      { returnOriginal: false }
    );

    return sequenceDoc.value.sequence_value;
  }

  async persist(icEntity) {
    const augmentedEntity = {
      ...icEntity,
      id: await this._getValueForNextSequence(),
    };

    await this.collection.insertOne(augmentedEntity);

    return augmentedEntity;
  }

  merge(icEntity) {
    return this.collection.replaceOne({ id: icEntity.id }, icEntity);
  }

  getByIdentifier(identifier, identifierType) {
    return this.collection.findOne({ identifier, identifierType });
  }

  find() {
    return this.collection.find({}).toArray();
  }
}

export default ContributorRepositoryMongo;
