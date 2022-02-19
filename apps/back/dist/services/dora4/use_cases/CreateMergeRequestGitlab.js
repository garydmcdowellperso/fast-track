"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Event = _interopRequireDefault(require("../entities/Event"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

async function CreateMergeRequestGitlab(object_kind, event_type, user, project, object_attributes, labels, changes, repository, _ref) {
  var eventRepository = _ref.eventRepository;

  if (!object_kind) {
    throw new Error("No leagueId");
  }

  if (!event_type) {
    throw new Error("No created_at");
  }

  if (!user) {
    throw new Error("No updated_at");
  }

  if (!project) {
    throw new Error("No clubs");
  } // Create a generic event to capture this Gitlab Push


  var ref = "refs/heads/".concat(object_attributes.source_branch);
  var refs = ref.split("/");
  var event = new _Event["default"]("gitlab_mr", {
    object_kind: object_kind,
    event_type: event_type,
    user: user,
    project: project,
    object_attributes: object_attributes,
    labels: labels,
    changes: changes,
    repository: repository
  }, (0, _momentTimezone["default"])().format("X"), ref, refs[2], project.name, user.username);
  await eventRepository.persist(event);
  return event;
}

var _default = CreateMergeRequestGitlab;
exports["default"] = _default;