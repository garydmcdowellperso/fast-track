"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _mongodb = require("mongodb");

var _config = _interopRequireDefault(require("../../../../config"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var EventRepositoryMongo = /*#__PURE__*/function () {
  function EventRepositoryMongo() {
    var _this = this;

    (0, _classCallCheck2["default"])(this, EventRepositoryMongo);
    var url = _config["default"].db.url;
    var client = new _mongodb.MongoClient(url);
    client.connect(function (err) {
      if (err) {
        console.log(err, "Error connecting to Mongo");
        throw new Error("Error connecting to Mongo");
      }

      _this.db = client.db(_config["default"].db.dbname);
      _this.collection = _this.db.collection("events");
      _this.sequences = _this.db.collection("sequences");
    });
  }

  (0, _createClass2["default"])(EventRepositoryMongo, [{
    key: "_getValueForNextSequence",
    value: async function _getValueForNextSequence() {
      var sequenceDoc = await this.sequences.findOneAndUpdate({
        _id: "events"
      }, {
        $inc: {
          sequence_value: 1
        }
      }, {
        returnOriginal: false
      });
      return sequenceDoc.value.sequence_value;
    }
  }, {
    key: "persist",
    value: async function persist(eventEntity) {
      var augmentedEntity = _objectSpread(_objectSpread({}, eventEntity), {}, {
        id: await this._getValueForNextSequence()
      });

      await this.collection.insertOne(augmentedEntity);
      return augmentedEntity;
    }
  }, {
    key: "merge",
    value: function merge(event) {
      return this.collection.replaceOne({
        id: event.id
      }, event);
    }
  }, {
    key: "remove",
    value: function remove(fixture) {
      return this.collection.replaceOne({
        id: fixture.id
      }, fixture);
    }
  }, {
    key: "get",
    value: function get(leagueId, teamId) {
      return this.collection.find({
        leagueId: leagueId,
        $or: [{
          "home.id": teamId
        }, {
          "away.id": teamId
        }]
      }).sort({
        date: 1
      }).toArray();
    }
  }, {
    key: "getByDate",
    value: function getByDate(from, to) {
      return this.collection.find({
        creation_date: {
          $gte: from,
          $lte: to
        }
      }).toArray();
    }
  }, {
    key: "getByProject",
    value: function getByProject(project) {
      return this.collection.find({
        project: project
      }).sort({
        project: 1,
        ticket: 1,
        creation_date: 1
      }).toArray();
    }
  }, {
    key: "getByTicket",
    value: function getByTicket(ticket) {
      return this.collection.find({
        ticket: ticket
      }).sort({
        creation_date: 1
      }).toArray();
    }
  }, {
    key: "assign",
    value: function assign(fixtureEntities) {
      var _this2 = this;

      var ff = fixtureEntities.map(async function (fixture) {
        var augmentedEntity = _objectSpread(_objectSpread({}, fixture), {}, {
          id: await _this2._getValueForNextSequence()
        });

        return augmentedEntity;
      });
      return Promise.all(ff);
    }
  }, {
    key: "insert",
    value: function insert(eventEntity) {
      return this.collection.insertOne(eventEntity);
    }
  }, {
    key: "find",
    value: function find() {
      return this.collection.find({
        deleted: false
      }).toArray();
    }
  }]);
  return EventRepositoryMongo;
}();

var _default = EventRepositoryMongo;
exports["default"] = _default;