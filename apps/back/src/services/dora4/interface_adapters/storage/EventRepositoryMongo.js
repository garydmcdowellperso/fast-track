import { MongoClient } from "mongodb";

import config from "../../../../config";

class EventRepositoryMongo {
  constructor() {
    const { url } = config.db;

    const client = new MongoClient(url);

    client.connect((err) => {
      if (err) {
        console.log(err, "Error connecting to Mongo");
        throw new Error("Error connecting to Mongo");
      }
      this.db = client.db(config.db.dbname);
      this.collection = this.db.collection("events");
      this.sequences = this.db.collection("sequences");
    });
  }

  async _getValueForNextSequence() {
    const sequenceDoc = await this.sequences.findOneAndUpdate(
      { _id: "events" },
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

  remove(fixture) {
    return this.collection.replaceOne({ id: fixture.id }, fixture);
  }

  get(leagueId, teamId) {
    return this.collection
      .find({ leagueId, $or: [{ "home.id": teamId }, { "away.id": teamId }] })
      .sort({ date: 1 })
      .toArray();
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

  assign(fixtureEntities) {
    const ff = fixtureEntities.map(async (fixture) => {
      const augmentedEntity = {
        ...fixture,
        id: await this._getValueForNextSequence(),
      };
      return augmentedEntity;
    });
    return Promise.all(ff);
  }

  insert(eventEntity) {
    return this.collection.insertOne(eventEntity);
  }

  find() {
    return this.collection.find({ deleted: false }).toArray();
  }
}

export default EventRepositoryMongo;
