import { MongoClient } from "mongodb";

import config from "../../../../config";

class ProjectRepositoryMongo {
  constructor() {
    const { url } = config.db;

    const client = new MongoClient(url);

    client.connect((err) => {
      if (err) {
        console.log(err, "Error connecting to Mongo");
        throw new Error("Error connecting to Mongo");
      }
      this.db = client.db(config.db.dbname);
      this.collection = this.db.collection("projects");
      this.sequences = this.db.collection("sequences");
    });
  }

  async _getValueForNextSequence() {
    const sequenceDoc = await this.sequences.findOneAndUpdate(
      { _id: "projects" },
      { $inc: { sequence_value: 1 } },
      { returnOriginal: false }
    );

    return sequenceDoc.value.sequence_value;
  }

  async persist(projectEntity) {
    const augmentedEntity = {
      ...projectEntity,
      id: await this._getValueForNextSequence(),
    };

    await this.collection.insertOne(augmentedEntity);

    return augmentedEntity;
  }

  merge(project) {
    return this.collection.replaceOne({ id: project.id }, project);
  }

  getByName(name) {
    return this.collection.findOne({ projectName: name });
  }

  find() {
    return this.collection.find({}).toArray();
  }
}

export default ProjectRepositoryMongo;
