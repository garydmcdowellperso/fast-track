"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Event = _interopRequireDefault(require("../entities/Event"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

async function CreateWorkStartedJira(timestamp, webhookEvent, user, issue, changelog, _ref) {
  var eventRepository = _ref.eventRepository;

  if (!timestamp) {
    throw new Error("No timestamp");
  }

  if (!webhookEvent) {
    throw new Error("No webhookEvent");
  }

  if (!user) {
    throw new Error("No user");
  }

  if (!issue) {
    throw new Error("No issue");
  }

  if (!changelog) {
    throw new Error("No changelog");
  } // Create a generic event to capture this Jira ticket


  var event = new _Event["default"]("work_started", {
    timestamp: timestamp,
    webhookEvent: webhookEvent,
    user: user,
    issue: issue,
    changelog: changelog
  }, (0, _momentTimezone["default"])().format("X"), issue.key, null, null, user.displayName);
  await eventRepository.persist(event);
  return event;
}

var _default = CreateWorkStartedJira;
exports["default"] = _default;