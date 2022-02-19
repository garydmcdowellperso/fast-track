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
    from: result.from,
    to: result.to,
    total: result.total,
    failures: result.failures
  };
};

var ChangeRateFailureSerializer = /*#__PURE__*/function () {
  function ChangeRateFailureSerializer() {
    (0, _classCallCheck2["default"])(this, ChangeRateFailureSerializer);
  }

  (0, _createClass2["default"])(ChangeRateFailureSerializer, [{
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
  return ChangeRateFailureSerializer;
}();

var _default = ChangeRateFailureSerializer;
exports["default"] = _default;