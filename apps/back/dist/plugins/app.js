"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fastifyPlugin = _interopRequireDefault(require("fastify-plugin"));

var appPlugin = (0, _fastifyPlugin["default"])(async function (fastify) {
  var health;
  fastify.decorate("getHealth", async function () {
    return health;
  });
  fastify.decorate("setHealth", async function (_health) {
    health = _health;
  });
});
var _default = appPlugin;
exports["default"] = _default;