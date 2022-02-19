import fp from "fastify-plugin";
import moment from "moment";
import EventController from "../services/event/controllers/EventController";
const eventPlugin = fp(async fastify => {
  fastify.decorate("event", async (request, reply, payload) => {
    try {
      const timestamp = moment().format("X");
      EventController.createEvent({
        request: {
          route: request.context.config.url,
          user: request.user,
          date: timestamp,
          payload: request.body ? request.body : request.query
        },
        response: {
          status: reply.statusCode,
          payload: payload
        }
      });
    } catch (e) {// We do NOT want to crash the server if we cannot log, end of, lord don't slow me down
    }
  });
});
export default eventPlugin;