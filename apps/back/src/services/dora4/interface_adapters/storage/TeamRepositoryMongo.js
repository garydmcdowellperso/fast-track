import { MongoClient } from "mongodb";

import config from "../../../../config";

class TeamRepositoryMongo {
  constructor() {
    const { url } = config.db;

    const client = new MongoClient(url);

    client.connect((err) => {
      if (err) {
        console.log(err, "Error connecting to Mongo");
        throw new Error("Error connecting to Mongo");
      }
      this.db = client.db(config.db.dbname);
      this.collection = this.db.collection("teams");
      this.sequences = this.db.collection("sequences");
    });
  }

  async _getValueForNextSequence() {
    const sequenceDoc = await this.sequences.findOneAndUpdate(
      { _id: "teams" },
      { $inc: { sequence_value: 1 } },
      { returnOriginal: false }
    );

    return sequenceDoc.value.sequence_value;
  }

  async persist(eventEntity) {
    const augmentedEntity = {
      ...eventEntity,
      id: await this._getValueForNextSequence(),
    };

    await this.collection.insertOne(augmentedEntity);

    return augmentedEntity;
  }

  merge(event) {
    return this.collection.replaceOne({ id: event.id }, event);
  }

  getByDate(from, to) {
    return this.collection
      .find({ creation_date: { $gte: from, $lte: to } })
      .toArray();
  }

  getByProject(project) {
    return this.collection
      .find({ project })
      .sort({ project: 1, ticket: 1, creation_date: 1 })
      .toArray();
  }

  getByTicket(ticket) {
    return this.collection
      .find({ ticket })
      .sort({ creation_date: 1 })
      .toArray();
  }

  insert(eventEntity) {
    return this.collection.insertOne(eventEntity);
  }

  remove(id) {
    return this.collection.deleteOne({ id });
  }

  find() {
    return this.collection.find({}).toArray();
  }
}

export default TeamRepositoryMongo;
