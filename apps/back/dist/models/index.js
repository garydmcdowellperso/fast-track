"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fastifyPlugin = _interopRequireDefault(require("fastify-plugin"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _fastifyMongodb = _interopRequireDefault(require("fastify-mongodb"));

var _config = _interopRequireDefault(require("../config"));

_momentTimezone["default"].tz.setDefault("Etc/UTC");

var modelPlugin = (0, _fastifyPlugin["default"])(async function (fastify) {
  fastify.register(_fastifyMongodb["default"], {
    // force to close the mongodb connection when app stopped
    // the default value is false
    url: "".concat(_config["default"].db.url).concat(_config["default"].db.name)
  });
  fastify.decorate("countEvents", async function () {
    var result;

    try {
      var db = fastify.mongo.client.db(_config["default"].db.dbname);
      var collection = db.collection("events");
      result = await collection.countDocuments({});
    } catch (err) {
      /* istanbul ignore next */
      fastify.log.error({
        err: err
      }, "Error on collection read");
    }

    return result;
  });
  fastify.decorate("createEvent", async function (type, req, payload) {
    var insertedId = null;

    try {
      var db = fastify.mongo.client.db(_config["default"].db.dbname);
      var ip = req.headers && req.headers["x-forwarded-for"] || req.connection && req.connection.remoteAddress;
      var event = {
        type: type,
        metadata: {
          // eslint-disable-next-line no-underscore-dangle
          createdBy: req.user && req.user._id.toString(),
          createdAt: (0, _momentTimezone["default"])().toDate(),
          ip: ip
        },
        payload: payload
      };
      var collection = db.collection("events");
      insertedId = await collection.insertOne(event);
    } catch (err) {
      /* istanbul ignore next */
      fastify.log.error({
        err: err
      }, "Error on createEvent");
    }

    return insertedId;
  });
});
var _default = modelPlugin;
exports["default"] = _default;