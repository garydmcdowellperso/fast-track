const trueValue = "true";

const config = {
  fasttrack: {
    root: process.env.SIMPATICO_ROOT || "/root/simpatico",
    sudo: trueValue === process.env.SUDO || trueValue === "false",
    hostname:
      process.env.NODE_ENV === "dev"
        ? process.env.SIMPATICO_HOSTNAME ||
          "c6e0-2a01-e0a-838-5dd0-f548-1452-266f-7245.ngrok.io"
        : process.env.SIMPATICO_HOSTNAME || "premiersupremos.online",
  },
  server: {
    port: process.env.PORT || "5000",
    docPrefix: process.env.DOC_URL_PREFIX || "doc",
  },
  db: {
    dbname:
      process.env.NODE_ENV === "test"
        ? `${process.env.MONGO_DB_NAME || "ft"}_test`
        : process.env.MONGO_DB_NAME || "ft",
    url: process.env.MONGO_URL || "mongodb://localhost:27017/",
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "shhhhhh!",
    expiresIn: process.env.JWT_EXPIRES_IN || 86400,
    hostname: process.env.JWT_HOSTNAME || ".fasttrack.online",
  },
  rollbar: {
    token: process.env.ROLLBAR_TOKEN || "1c42bdb088e244bcbeed91506048503c",
  },
};

export default config;
