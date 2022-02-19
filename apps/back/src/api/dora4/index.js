import DORA4Controller from "../../services/dora4/controllers/DORA4Controller";

const config = require("../../config");

const {
  dora4TicketSchema,
  dora4DeploymentSchema,
  changeRateFailureSchema,
} = require("../schemas/dora4");

/**
 * Defines all the routes
 * @param  {Object}   fastify  The global fastify server object
 * @returns {Object} Different per route
 */
const routes = async (fastify) => {
  fastify.post(
    "/rollBar",
    {
      config,
      schema: {
        description: "rollbar integration",
        tags: ["api"],
      },
    },
    async (request) => {
      fastify.log.info("[src#api#rollBar] Entering");

      fastify.log.info(
        {
          body: request.body,
        },
        "rollBar"
      );

      const inputs = { ...request.body };

      if (
        request.body.event_name === "new_item" ||
        request.body.event_name === "reactivated_item"
      ) {
        await DORA4Controller.recordRollBarError(inputs);
      }

      return "ok";
    }
  );

  fastify.post(
    "/jira",
    {
      config,
      schema: {
        description: "jira integration",
        tags: ["api"],
      },
    },
    async (request) => {
      fastify.log.info("[src#api#jira] Entering");

      fastify.log.info(
        {
          body: request.body,
        },
        "jira"
      );

      const inputs = { ...request.body };

      if (
        request.body.webhookEvent === "jira:issue_updated" &&
        request.body.changelog.items[0].toString === "In Progress"
      ) {
        await DORA4Controller.jiraWorkStarted(inputs);
      }

      return "ok";
    }
  );

  fastify.post(
    "/gitlab",
    {
      config,
      schema: {
        description: "gitlab integration",
        tags: ["api"],
      },
    },
    async (request) => {
      fastify.log.info("[src#api#gitlab] Entering");

      fastify.log.info(
        {
          body: request.body,
        },
        "gitlab"
      );

      const inputs = { ...request.body };

      // An event is received from gitlab, create a generic DORA4 event
      if (request.body.object_kind === "push") {
        await DORA4Controller.gitlabPush(inputs);
      }
      if (request.body.object_kind === "merge_request") {
        await DORA4Controller.gitlabMergeRequest(inputs);
      }

      return "ok";
    }
  );

  fastify.get(
    "/ticketInformation",
    {
      config,
      schema: {
        description: "get all information for a ticket",
        tags: ["api"],
        querystring: {
          ticket: { type: "string" },
        },
        response: {
          200: dora4TicketSchema,
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#ticketInformation] Entering");

      fastify.log.info(
        {
          ticket: request.query.ticket,
        },
        "ticketInformation"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      const dora4 = await DORA4Controller.fetchByTicket(inputs);

      return dora4;
    }
  );

  fastify.get(
    "/projectInformation",
    {
      config,
      schema: {
        description: "get all ticket information by project",
        tags: ["api"],
        querystring: {
          project: { type: "string" },
        },
        response: {
          200: {
            type: "array",
            items: dora4TicketSchema,
          },
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#projectInformation] Entering");

      fastify.log.info(
        {
          project: request.query.project,
        },
        "projectInformation"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      const dora4 = await DORA4Controller.fetchByProject(inputs);

      return dora4;
    }
  );

  fastify.get(
    "/deploymentFrequency",
    {
      config,
      schema: {
        description: "get deployment frequency for a period",
        tags: ["api"],
        querystring: {
          from: { type: "string" },
          to: { type: "string" },
        },
        response: {
          200: dora4DeploymentSchema,
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#deploymentFrequency] Entering");

      fastify.log.info(
        {
          from: request.query.from,
          to: request.query.to,
        },
        "deploymentFrequency"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      const dora4 = await DORA4Controller.deploymentFrequency(inputs);

      return dora4;
    }
  );

  fastify.get(
    "/changeRateFailure",
    {
      config,
      schema: {
        description: "gets the change rate failure",
        tags: ["api"],
        querystring: {
          from: { type: "string" },
          to: { type: "string" },
        },
        response: {
          200: changeRateFailureSchema,
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#changeRateFailure] Entering");

      fastify.log.info(
        {
          from: request.query.from,
          to: request.query.to,
        },
        "changeRateFailure"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      const dora4 = await DORA4Controller.changeRateFailure(inputs);

      return dora4;
    }
  );
};

module.exports = routes;
