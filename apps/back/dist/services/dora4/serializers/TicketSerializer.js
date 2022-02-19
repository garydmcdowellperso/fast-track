"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _serializeSingleResult = function _serializeSingleResult(result) {
  return {
    id: result.id,
    version: result.version,
    ticket: result.ticket,
    project: result.project,
    author: result.author,
    leadTimeToProduction: {
      seconds: result.seconds,
      minutes: result.minutes,
      hours: result.hours,
      days: result.days,
      weeks: result.weeks,
      months: result.months
    }
  };
};

var TicketSerializer = /*#__PURE__*/function () {
  function TicketSerializer() {
    (0, _classCallCheck2["default"])(this, TicketSerializer);
  }

  (0, _createClass2["default"])(TicketSerializer, [{
    key: "serialize",
    value: function serialize(data) {
      if (!data) {
        throw new Error("Expect data to be not undefined nor null");
      }

      if (Array.isArray(data)) {
        return data.map(_serializeSingleResult);
      }

      return _serializeSingleResult(data);
    }
  }]);
  return TicketSerializer;
}();

var _default = TicketSerializer;
exports["default"] = _default;