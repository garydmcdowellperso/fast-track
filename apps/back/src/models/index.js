import fp from "fastify-plugin";
import moment from "moment-timezone";
import fastifymongodb from "fastify-mongodb";

import config from "../config";

moment.tz.setDefault("Etc/UTC");

const modelPlugin = fp(async (fastify) => {
  fastify.register(fastifymongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    url: `${config.db.url}${config.db.name}`,
  });

  fastify.decorate("countEvents", async () => {
    let result;
    try {
      const db = fastify.mongo.client.db(config.db.dbname);

      const collection = db.collection("events");

      result = await collection.countDocuments({});
    } catch (err) {
      /* istanbul ignore next */
      fastify.log.error({ err }, "Error on collection read");
    }

    return result;
  });

  fastify.decorate("createEvent", async (type, req, payload) => {
    let insertedId = null;
    try {
      const db = fastify.mongo.client.db(config.db.dbname);

      const ip =
        (req.headers && req.headers["x-forwarded-for"]) ||
        (req.connection && req.connection.remoteAddress);

      const event = {
        type,
        metadata: {
          // eslint-disable-next-line no-underscore-dangle
          createdBy: req.user && req.user._id.toString(),
          createdAt: moment().toDate(),
          ip,
        },
        payload,
      };

      const collection = db.collection("events");

      insertedId = await collection.insertOne(event);
    } catch (err) {
      /* istanbul ignore next */
      fastify.log.error({ err }, "Error on createEvent");
    }

    return insertedId;
  });
});

export default modelPlugin;
