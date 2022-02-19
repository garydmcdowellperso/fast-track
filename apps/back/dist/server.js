"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

require("make-promises-safe");

var _fastifyHelmet = _interopRequireDefault(require("fastify-helmet"));

var _fastify = _interopRequireDefault(require("fastify"));

var _fastifyBlipp = _interopRequireDefault(require("fastify-blipp"));

var _fastifyHttpClient = _interopRequireDefault(require("fastify-http-client"));

var _fastifySwagger = _interopRequireDefault(require("fastify-swagger"));

var _fastifyCircuitBreaker = _interopRequireDefault(require("fastify-circuit-breaker"));

var _fastifyOauth = _interopRequireDefault(require("fastify-oauth2"));

var _middie = _interopRequireDefault(require("middie"));

var _node = require("@logtail/node");

var _config = _interopRequireDefault(require("./config"));

var _app = _interopRequireDefault(require("./plugins/app"));

var _dora = _interopRequireDefault(require("./api/dora4"));

var _rollbar = _interopRequireDefault(require("rollbar"));

// Global config params
var logtail = new _node.Logtail("L58RXn8mZjZa7uEViwxaoy4B");
var singleton = (0, _fastify["default"])({
  logger: logtail,
  prettyPrint: true,
  exposeHeadRoutes: true
});

if (process.env.NODE_ENV !== "dev") {
  singleton.log.info("Initialise rollbar for exceptions"); // Send errors to rollbar

  new _rollbar["default"]({
    accessToken: _config["default"].rollbar.token,
    captureUncaught: true,
    captureUnhandledRejections: true
  });
}

singleton.register(_middie["default"]); // Libs

singleton.register(require("fastify-cookie"), {
  secret: "Dinosaur10!",
  // for cookies signature
  parseOptions: {} // options for parsing cookies

});
singleton.register(_fastifyOauth["default"], {
  name: "googleOAuth2",
  scope: ["openid profile email"],
  credentials: {
    client: {
      id: "933256841958-27u37103pk4rkaqogir75gk57qs07lgh.apps.googleusercontent.com",
      secret: "ry6R_IOmADoNfXTySD-5nQIV"
    },
    auth: _fastifyOauth["default"].GOOGLE_CONFIGURATION
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: "/login/google",
  // facebook redirect here after the user login
  callbackUri: "https://".concat(_config["default"].simpatico.hostname, "/api/v1/login/google/callback")
}); // Print routes

singleton.register(_fastifyBlipp["default"]); // Security

singleton.register(_fastifyHelmet["default"], {
  hidePoweredBy: true,
  noCache: true
}); // Plugins

singleton.register(_app["default"]); // Swagger doc

singleton.register(_fastifySwagger["default"], {
  routePrefix: _config["default"].server.docPrefix,
  swagger: {
    info: {
      title: "api",
      description: "API Gateway Fast Track",
      version: "1.0.0"
    },
    host: "localhost:".concat(_config["default"].server.port),
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{
      name: "api",
      description: "simpatico related end-points"
    }]
  },
  exposeRoute: true
}); // Circuit breaker for async calls that can fail

singleton.register(_fastifyCircuitBreaker["default"], {
  threshold: 3,
  // default 5
  timeout: 5000,
  // default 10000
  resetTimeout: 5000 // default 10000

}); // Routes

singleton.register(_dora["default"], {
  prefix: "/v1"
}); // Hook it all together

var start = async function start() {
  try {
    await singleton.listen(_config["default"].server.port, "0.0.0.0"); // This loads our plugins

    singleton.log.info("server listening on ".concat(singleton.server.address().port)); // Output Routes

    singleton.blipp(); // Generate swagger docs

    singleton.swagger(); // App ok

    singleton.setHealth("ok");
  } catch (err) {
    /* istanbul ignore next */
    singleton.log.error({
      err: err
    }, "server error");
    /* istanbul ignore next */

    process.exit(1);
  }
};

start();
var _default = singleton;
exports["default"] = _default;