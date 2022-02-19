"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _DORA4Controller = _interopRequireDefault(require("../../services/dora4/controllers/DORA4Controller"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var config = require("../../config");

var _require = require("../schemas/dora4"),
    dora4TicketSchema = _require.dora4TicketSchema,
    dora4DeploymentSchema = _require.dora4DeploymentSchema,
    changeRateFailureSchema = _require.changeRateFailureSchema;
/**
 * Defines all the routes
 * @param  {Object}   fastify  The global fastify server object
 * @returns {Object} Different per route
 */


var routes = async function routes(fastify) {
  fastify.post("/rollBar", {
    config: config,
    schema: {
      description: "rollbar integration",
      tags: ["api"]
    }
  }, async function (request) {
    fastify.log.info("[src#api#rollBar] Entering");
    fastify.log.info({
      body: request.body
    }, "rollBar");

    var inputs = _objectSpread({}, request.body);

    if (request.body.event_name === "new_item" || request.body.event_name === "reactivated_item") {
      await _DORA4Controller["default"].recordRollBarError(inputs);
    }

    return "ok";
  });
  fastify.post("/jira", {
    config: config,
    schema: {
      description: "jira integration",
      tags: ["api"]
    }
  }, async function (request) {
    fastify.log.info("[src#api#jira] Entering");
    fastify.log.info({
      body: request.body
    }, "jira");

    var inputs = _objectSpread({}, request.body);

    if (request.body.webhookEvent === "jira:issue_updated" && request.body.changelog.items[0].toString === "In Progress") {
      await _DORA4Controller["default"].jiraWorkStarted(inputs);
    }

    return "ok";
  });
  fastify.post("/gitlab", {
    config: config,
    schema: {
      description: "gitlab integration",
      tags: ["api"]
    }
  }, async function (request) {
    fastify.log.info("[src#api#gitlab] Entering");
    fastify.log.info({
      body: request.body
    }, "gitlab");

    var inputs = _objectSpread({}, request.body); // An event is received from gitlab, create a generic DORA4 event


    if (request.body.object_kind === "push") {
      await _DORA4Controller["default"].gitlabPush(inputs);
    }

    if (request.body.object_kind === "merge_request") {
      await _DORA4Controller["default"].gitlabMergeRequest(inputs);
    }

    return "ok";
  });
  fastify.get("/ticketInformation", {
    config: config,
    schema: {
      description: "get all information for a ticket",
      tags: ["api"],
      querystring: {
        ticket: {
          type: "string"
        }
      },
      response: {
        200: dora4TicketSchema
      }
    }
  }, async function (request) {
    fastify.log.info("[src#api#ticketInformation] Entering");
    fastify.log.info({
      ticket: request.query.ticket
    }, "ticketInformation");

    var inputs = _objectSpread({}, request.query); // Fetch metrics by a ticket reference


    var dora4 = await _DORA4Controller["default"].fetchByTicket(inputs);
    return dora4;
  });
  fastify.get("/projectInformation", {
    config: config,
    schema: {
      description: "get all ticket information by project",
      tags: ["api"],
      querystring: {
        project: {
          type: "string"
        }
      },
      response: {
        200: {
          type: "array",
          items: dora4TicketSchema
        }
      }
    }
  }, async function (request) {
    fastify.log.info("[src#api#projectInformation] Entering");
    fastify.log.info({
      project: request.query.project
    }, "projectInformation");

    var inputs = _objectSpread({}, request.query); // Fetch metrics by a ticket reference


    var dora4 = await _DORA4Controller["default"].fetchByProject(inputs);
    return dora4;
  });
  fastify.get("/deploymentFrequency", {
    config: config,
    schema: {
      description: "get deployment frequency for a period",
      tags: ["api"],
      querystring: {
        from: {
          type: "string"
        },
        to: {
          type: "string"
        }
      },
      response: {
        200: dora4DeploymentSchema
      }
    }
  }, async function (request) {
    fastify.log.info("[src#api#deploymentFrequency] Entering");
    fastify.log.info({
      from: request.query.from,
      to: request.query.to
    }, "deploymentFrequency");

    var inputs = _objectSpread({}, request.query); // Fetch metrics by a ticket reference


    var dora4 = await _DORA4Controller["default"].deploymentFrequency(inputs);
    return dora4;
  });
  fastify.get("/changeRateFailure", {
    config: config,
    schema: {
      description: "gets the change rate failure",
      tags: ["api"],
      querystring: {
        from: {
          type: "string"
        },
        to: {
          type: "string"
        }
      },
      response: {
        200: changeRateFailureSchema
      }
    }
  }, async function (request) {
    fastify.log.info("[src#api#changeRateFailure] Entering");
    fastify.log.info({
      from: request.query.from,
      to: request.query.to
    }, "changeRateFailure");

    var inputs = _objectSpread({}, request.query); // Fetch metrics by a ticket reference


    var dora4 = await _DORA4Controller["default"].changeRateFailure(inputs);
    return dora4;
  });
};

module.exports = routes;