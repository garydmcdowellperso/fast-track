import "core-js/stable";
import "regenerator-runtime/runtime";
import "make-promises-safe";
import helmet from "fastify-helmet";
import fastify from "fastify";
import blipp from "fastify-blipp";
import swagger from "fastify-swagger";
import circuitBreaker from "fastify-circuit-breaker";
import middie from "middie";

// Global config params
import config from "./config";
import app from "./plugins/app";
import stream from "./plugins/stream";

import dora4 from "./api/dora4";

const singleton = fastify({
  logger: true,
  prettyPrint: true,
  exposeHeadRoutes: true,
});

singleton.register(require("fastify-cors"), {
  // put your options here
});

singleton.register(middie);

// Libs
singleton.register(require("fastify-cookie"), {
  secret: "Dinosaur10!", // for cookies signature
  parseOptions: {}, // options for parsing cookies
});

// Print routes
singleton.register(blipp);

// Security
singleton.register(helmet, {
  hidePoweredBy: true,
  noCache: true,
});

// Plugins
singleton.register(app);
singleton.register(stream);

// Swagger doc
singleton.register(swagger, {
  routePrefix: config.server.docPrefix,
  swagger: {
    info: {
      title: "api",
      description: "API Gateway Fast Track",
      version: "1.0.0",
    },
    host: `localhost:${config.server.port}`,
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "api", description: "fast track related end-points" }],
  },
  exposeRoute: true,
});

// Circuit breaker for async calls that can fail
singleton.register(circuitBreaker, {
  threshold: 3, // default 5
  timeout: 5000, // default 10000
  resetTimeout: 5000, // default 10000
});

// Routes
singleton.register(dora4, { prefix: "/v1" });

// Hook it all together
const start = async () => {
  try {
    await singleton.listen(config.server.port, "0.0.0.0"); // This loads our plugins
    singleton.log.info(
      `server listening on ${singleton.server.address().port}`
    );

    // Output Routes
    singleton.blipp();

    // Generate swagger docs
    singleton.swagger();

    // App ok
    singleton.setHealth("ok");
  } catch (err) {
    /* istanbul ignore next */
    singleton.log.error({ err }, "server error");
    /* istanbul ignore next */
    process.exit(1);
  }
};

start();

export default singleton;
