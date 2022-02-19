"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var trueValue = "true";
var config = {
  simpatico: {
    root: process.env.SIMPATICO_ROOT || "/root/simpatico",
    sudo: trueValue === process.env.SUDO || trueValue === "false",
    hostname: process.env.NODE_ENV === "dev" ? process.env.SIMPATICO_HOSTNAME || "c6e0-2a01-e0a-838-5dd0-f548-1452-266f-7245.ngrok.io" : process.env.SIMPATICO_HOSTNAME || "premiersupremos.online"
  },
  brain: {
    hostname: process.env.NODE_ENV === "dev" ? process.env.SIMPATICO_HOSTNAME || "c6e0-2a01-e0a-838-5dd0-f548-1452-266f-7245.ngrok.io" : process.env.SIMPATICO_HOSTNAME || "premiersupremos.online"
  },
  server: {
    port: process.env.PORT || "5000",
    docPrefix: process.env.DOC_URL_PREFIX || "doc"
  },
  db: {
    dbname: process.env.NODE_ENV === "test" ? "".concat(process.env.MONGO_DB_NAME || "ps", "_test") : process.env.MONGO_DB_NAME || "ps",
    url: process.env.MONGO_URL || "mongodb://localhost:27017/"
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "shhhhhh!",
    expiresIn: process.env.JWT_EXPIRES_IN || 86400,
    hostname: process.env.JWT_HOSTNAME || ".premiersupremos.online"
  },
  push: {
    appId: process.env.PUSH_APP_ID || "1213642",
    key: process.env.PUSH_APP_KEY || "c9e301167f184ed87cbc",
    secret: process.env.PUSH_APP_SECRET || "dc49f92ca2d484c86774"
  },
  email: {
    password: process.env.SENDGRID_PASSWORD || "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"
  },
  stream: {
    host: process.env.STREAM_HOST || "localhost",
    username: process.env.STREAM_USERNAME || "guest",
    password: process.env.STREAM_PASSWORD || "guest"
  },
  rollbar: {
    token: process.env.ROLLBAR_TOKEN || "1c42bdb088e244bcbeed91506048503c"
  }
};
var _default = config;
exports["default"] = _default;