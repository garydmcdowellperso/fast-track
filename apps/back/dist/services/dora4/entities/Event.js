"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var Event = function Event(type, data, creation_date, branch, ticket, project, author) {
  var id = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  (0, _classCallCheck2["default"])(this, Event);
  this.type = type;
  this.data = data;
  this.branch = branch;
  this.ticket = ticket;
  this.project = project;
  this.author = author;
  this.id = id;
  this.creation_date = creation_date;
};

var _default = Event;
exports["default"] = _default;