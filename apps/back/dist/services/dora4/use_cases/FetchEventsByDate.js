"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

async function FetchEventsByDate(from, to, _ref) {
  var eventRepository = _ref.eventRepository;

  if (!from) {
    throw new Error("No from");
  }

  if (!to) {
    throw new Error("No to");
  }

  var newFrom = (0, _momentTimezone["default"])(from, "DD/MM/YYYY").startOf("day").unix();
  var newTo = (0, _momentTimezone["default"])(to, "DD/MM/YYYY").endOf("day").unix();
  return eventRepository.getByDate(newFrom.toString(10), newTo.toString(10));
}

var _default = FetchEventsByDate;
exports["default"] = _default;