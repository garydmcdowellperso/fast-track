import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import config from "../config";
const authPlugin = fp(async fastify => {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const token = request.cookies.simpatico;

      if (!token) {
        const error = new Error();
        error.message = "Unauthorized";
        error.statusCode = 401;
        error.error = "Unauthorized";
        throw error;
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      request.user = decoded;
    } catch (err) {
      reply.send(err);
    }
  });
  fastify.decorate("authenticateAdmin", async (request, reply) => {
    try {
      const token = request.cookies.simpatico;
      const decoded = jwt.verify(token, config.jwt.secret);

      if (!decoded.role.includes("administrator")) {
        reply.code(401).send("Unauthorised");
      } else {
        request.user = decoded;
      }
    } catch (err) {
      reply.send(err);
    }
  });
});
export default authPlugin;