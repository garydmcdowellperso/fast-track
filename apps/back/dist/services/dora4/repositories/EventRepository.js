"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EventRepository = /*#__PURE__*/function () {
  function EventRepository(repository) {
    (0, _classCallCheck2["default"])(this, EventRepository);
    this.repository = repository;
  }

  (0, _createClass2["default"])(EventRepository, [{
    key: "persist",
    value: function persist(clubEntity) {
      return this.repository.persist(clubEntity);
    }
  }, {
    key: "merge",
    value: function merge(clubEntity) {
      return this.repository.merge(clubEntity);
    }
  }, {
    key: "remove",
    value: function remove(clubId) {
      return this.repository.remove(clubId);
    }
  }, {
    key: "get",
    value: function get(leagueId, teamId) {
      return this.repository.get(leagueId, teamId);
    }
  }, {
    key: "getByDate",
    value: function getByDate(from, to) {
      return this.repository.getByDate(from, to);
    }
  }, {
    key: "getByProject",
    value: function getByProject(project) {
      return this.repository.getByProject(project);
    }
  }, {
    key: "getByTicket",
    value: function getByTicket(ticket) {
      return this.repository.getByTicket(ticket);
    }
  }, {
    key: "assign",
    value: function assign(fixtureEntity) {
      return this.repository.assign(fixtureEntity);
    }
  }, {
    key: "insert",
    value: function insert(eventEntity) {
      return this.repository.insert(eventEntity);
    }
  }, {
    key: "find",
    value: function find() {
      return this.repository.find();
    }
  }]);
  return EventRepository;
}();

var _default = EventRepository;
exports["default"] = _default;