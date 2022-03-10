import DORA4Controller from "../../services/dora4/controllers/DORA4Controller";

const config = require("../../config");

const {
  changeRateFailureSchema,
  collaboratorSchema,
  dora4DeploymentSchema,
  dora4TicketSchema,
  teamSchema,
} = require("../schemas/dora4");

/**
 * Defines all the routes
 * @param  {Object}   fastify  The global fastify server object
 * @returns {Object} Different per route
 */
const routes = async (fastify) => {
  fastify.post(
    "/github",
    {
      config,
      schema: {
        description: "github integration",
        tags: ["api"],
      },
    },
    async (request) => {
      fastify.log.info("[src#api#github] Entering");

      fastify.log.info(
        {
          body: request.body,
        },
        "github"
      );

      const inputs = { ...request.body };

      if (request.body.ref) {
        await fastify.publish("github_push", request.body);
      }
      if (request.body.action === "opened") {
        await fastify.publish("github_pr", request.body);
      }

      return "ok";
    }
  );

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
        request.body.event_type === "new_item" ||
        request.body.event_type === "reactivated_item"
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
    "/getAllProjects",
    {
      config,
      schema: {
        description: "get all the projects",
        tags: ["api"],
        response: {
          200: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    async () => {
      fastify.log.info("[src#api#getAllProjects] Entering");

      // Fetch metrics by a ticket reference
      return DORA4Controller.fetchAllProjects();
    }
  );

  fastify.get(
    "/getAllTeams",
    {
      config,
      schema: {
        description: "get all the teams",
        tags: ["api"],
        response: {
          200: {
            type: "array",
            items: teamSchema,
          },
        },
      },
    },
    async () => {
      fastify.log.info("[src#api#getAllTeams] Entering");

      // Fetch metrics by a ticket reference
      return DORA4Controller.fetchAllTeams();
    }
  );

  fastify.delete(
    "/deleteTeam",
    {
      config,
      schema: {
        description: "removes a team",
        tags: ["api"],
        body: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        response: {
          200: {
            type: "array",
            items: teamSchema,
          },
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#deleteTeam] Entering");

      // Fetch metrics by a ticket reference
      await DORA4Controller.deleteTeam(request.body.id);

      return DORA4Controller.fetchAllTeams();
    }
  );

  fastify.get(
    "/getAllCollaborators",
    {
      config,
      schema: {
        description: "get all the collaborators",
        tags: ["api"],
        response: {
          200: {
            type: "array",
            items: collaboratorSchema,
          },
        },
      },
    },
    async () => {
      fastify.log.info("[src#api#getAllCollaborators] Entering");

      // Fetch metrics by a ticket reference
      return DORA4Controller.fetchAllCollaborators();
    }
  );

  fastify.get(
    "/getLeadTime",
    {
      config,
      schema: {
        description: "gets the lead time breakdown across a time period",
        tags: ["api"],
        querystring: {
          selectedProject: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#getLeadTime] Entering");

      fastify.log.info(
        {
          selectedProject: request.query.selectedProject,
          from: request.query.from,
          to: request.query.to,
        },
        "getLeadTime"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      return DORA4Controller.fetchLeadTime(inputs);
    }
  );

  fastify.get(
    "/getDeploymentFrequency",
    {
      config,
      schema: {
        description:
          "gets the deployment frequency breakdown across a time period",
        tags: ["api"],
        querystring: {
          selectedProject: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#getDeploymentFrequency] Entering");

      fastify.log.info(
        {
          selectedProject: request.query.selectedProject,
          from: request.query.from,
          to: request.query.to,
        },
        "getDeploymentFrequency"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      return DORA4Controller.fetchDeploymentFrequency(inputs);
    }
  );

  fastify.get(
    "/getChangeRateFailure",
    {
      config,
      schema: {
        description: "gets the change rate failure across a time period",
        tags: ["api"],
        querystring: {
          selectedProject: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#getChangeRateFailure] Entering");

      fastify.log.info(
        {
          selectedProject: request.query.selectedProject,
          from: request.query.from,
          to: request.query.to,
        },
        "getChangeRateFailure"
      );

      const inputs = { ...request.query };

      // Fetch metrics by a ticket reference
      return DORA4Controller.fetchChangeRateFailure(inputs);
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

  fastify.post(
    "/createTeam",
    {
      config,
      schema: {
        description: "creates a new team",
        tags: ["api"],
        body: {
          type: "object",
          properties: {
            selectedProjects: { type: "array", items: { type: "string" } },
            teamName: { type: "string" },
            teamCollaborators: {
              type: "array",
              items: collaboratorSchema,
            },
            teamColour: { type: "string" },
          },
        },
      },
    },
    async (request) => {
      fastify.log.info("[src#api#createTeam] Entering");

      const inputs = { ...request.body };

      // Fetch metrics by a ticket reference
      return DORA4Controller.createTeam(inputs);
    }
  );
};

module.exports = routes;
