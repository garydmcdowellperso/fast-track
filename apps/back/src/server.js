import "core-js/stable";
import "regenerator-runtime/runtime";
import "make-promises-safe";
import helmet from "fastify-helmet";
import fastify from "fastify";
import blipp from "fastify-blipp";
import swagger from "fastify-swagger";
import circuitBreaker from "fastify-circuit-breaker";
import oauthPlugin from "fastify-oauth2";
import middie from "middie";
import { Logtail } from "@logtail/node";

// Global config params
import config from "./config";
import app from "./plugins/app";
import stream from "./plugins/stream";

import dora4 from "./api/dora4";

import Rollbar from "rollbar";

const logtail = new Logtail("L58RXn8mZjZa7uEViwxaoy4B");

const singleton = fastify({
  logger: logtail,
  prettyPrint: true,
  exposeHeadRoutes: true,
});

singleton.register(require("fastify-cors"), {
  // put your options here
});

if (process.env.NODE_ENV !== "dev") {
  singleton.log.info(`Initialise rollbar for exceptions`);

  // Send errors to rollbar
  new Rollbar({
    accessToken: config.rollbar.token,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
}

singleton.register(middie);

// Libs
singleton.register(require("fastify-cookie"), {
  secret: "Dinosaur10!", // for cookies signature
  parseOptions: {}, // options for parsing cookies
});

singleton.register(oauthPlugin, {
  name: "googleOAuth2",
  scope: ["openid profile email"],
  credentials: {
    client: {
      id: "933256841958-27u37103pk4rkaqogir75gk57qs07lgh.apps.googleusercontent.com",
      secret: "ry6R_IOmADoNfXTySD-5nQIV",
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION,
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: "/login/google",
  // facebook redirect here after the user login
  callbackUri: `https://${config.fasttrack.hostname}/api/v1/login/google/callback`,
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
