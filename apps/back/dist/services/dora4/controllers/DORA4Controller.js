"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _CreatePushGitlab = _interopRequireDefault(require("../use_cases/CreatePushGitlab"));

var _CreateMergeRequestGitlab = _interopRequireDefault(require("../use_cases/CreateMergeRequestGitlab"));

var _FetchEventsByTicket = _interopRequireDefault(require("../use_cases/FetchEventsByTicket"));

var _FetchEventsByProject = _interopRequireDefault(require("../use_cases/FetchEventsByProject"));

var _FetchEventsByDate = _interopRequireDefault(require("../use_cases/FetchEventsByDate"));

var _CreateWorkStartedJira = _interopRequireDefault(require("../use_cases/CreateWorkStartedJira"));

var _CreateFailureRollbar = _interopRequireDefault(require("../use_cases/CreateFailureRollbar"));

var _EventRepository = _interopRequireDefault(require("../repositories/EventRepository"));

var _EventRepositoryMongo = _interopRequireDefault(require("../interface_adapters/storage/EventRepositoryMongo"));

var _TicketSerializer = _interopRequireDefault(require("../serializers/TicketSerializer"));

var _DeploymentFrequencySerializer = _interopRequireDefault(require("../serializers/DeploymentFrequencySerializer"));

var _ChangeRateFailureSerializer = _interopRequireDefault(require("../serializers/ChangeRateFailureSerializer"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

require("moment-duration-format");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var eventRepository = new _EventRepository["default"](new _EventRepositoryMongo["default"]());

async function recordRollBarError(inputs) {
  // Inputs
  var event_name = inputs.event_name,
      data = inputs.data; // Convert to generic event depending on data

  return (0, _CreateFailureRollbar["default"])(event_name, data, {
    eventRepository: eventRepository
  });
}

async function jiraWorkStarted(inputs) {
  // Inputs
  var timestamp = inputs.timestamp,
      webhookEvent = inputs.webhookEvent,
      user = inputs.user,
      issue = inputs.issue,
      changelog = inputs.changelog; // Convert to generic event depending on data

  return (0, _CreateWorkStartedJira["default"])(timestamp, webhookEvent, user, issue, changelog, {
    eventRepository: eventRepository
  });
}

async function gitlabPush(inputs) {
  // Inputs
  var object_kind = inputs.object_kind,
      event_name = inputs.event_name,
      before = inputs.before,
      after = inputs.after,
      ref = inputs.ref,
      user_id = inputs.user_id,
      user_name = inputs.user_name,
      user_username = inputs.user_username,
      user_avatar = inputs.user_avatar,
      project_id = inputs.project_id,
      project = inputs.project,
      commits = inputs.commits,
      total_commits_count = inputs.total_commits_count,
      repository = inputs.repository; // Convert to generic event depending on data

  return (0, _CreatePushGitlab["default"])(object_kind, event_name, before, after, ref, user_id, user_name, user_username, user_avatar, project_id, project, commits, total_commits_count, repository, {
    eventRepository: eventRepository
  });
}

async function gitlabMergeRequest(inputs) {
  // Inputs
  var object_kind = inputs.object_kind,
      event_type = inputs.event_type,
      user = inputs.user,
      project = inputs.project,
      object_attributes = inputs.object_attributes,
      labels = inputs.labels,
      changes = inputs.changes,
      repository = inputs.repository; // Convert to generic event depending on data

  return (0, _CreateMergeRequestGitlab["default"])(object_kind, event_type, user, project, object_attributes, labels, changes, repository, {
    eventRepository: eventRepository
  });
}

async function fetchByTicket(inputs) {
  // Inputs
  var ticket = inputs.ticket; // Reduce down the events

  var events = await (0, _FetchEventsByTicket["default"])(ticket, {
    eventRepository: eventRepository
  });
  var response = {
    version: events.length,
    ticket: ticket,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
    months: 0,
    project: "",
    author: []
  };
  var start = 0;
  var end = 0;
  var version = 0;
  var authors = [];

  var _iterator = _createForOfIteratorHelper(events),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var event = _step.value;

      if (event.type === "work_started" && start === 0) {
        start = _momentTimezone["default"].unix(event.creation_date);
        version += 1;
        authors.push(event.author);
      }

      if (event.type === "merged") {
        end = _momentTimezone["default"].unix(event.creation_date);
        version += 1;
        authors.push(event.author);
      }

      response.project = event.project;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  response.version = version;
  response.author = authors;

  if (end) {
    var diff = end.diff(start);
    console.log("diff", diff);
    response.seconds = _momentTimezone["default"].duration(diff).asSeconds();
    response.minutes = _momentTimezone["default"].duration(diff).asMinutes();
    response.hours = _momentTimezone["default"].duration(diff).asHours();
  }

  var ticketSerializer = new _TicketSerializer["default"]();
  return ticketSerializer.serialize(response);
}

async function fetchByProject(inputs) {
  // Inputs
  var project = inputs.project; // Reduce down the events

  var events = await (0, _FetchEventsByProject["default"])(project, {
    eventRepository: eventRepository
  });
  var response = [];
  var start = 0;
  var end = 0;
  var version = 0;
  var ticket = "";
  var currentTicket = "";
  var proj = {};
  var authors = [];

  var _iterator2 = _createForOfIteratorHelper(events),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var event = _step2.value;

      if (currentTicket === "") {
        start = 0;
        end = 0;
        version = 0;
        currentTicket = event.ticket;
        proj = {};
        ticket = "";
        authors = [];
      }

      if (event.ticket !== currentTicket) {
        if (end) {
          var _diff = end.diff(start);

          proj.seconds = _momentTimezone["default"].duration(_diff).asSeconds();
          proj.minutes = _momentTimezone["default"].duration(_diff).asMinutes();
          proj.hours = _momentTimezone["default"].duration(_diff).asHours();
          proj.version = version;
          proj.ticket = ticket;
          proj.project = project;
          proj.author = authors;
        }

        response.push(proj);
        start = 0;
        end = 0;
        version = 0;
        authors = [];
        currentTicket = event.ticket;
        proj = {};
      }

      if (event.type === "work_started" && start === 0) {
        start = _momentTimezone["default"].unix(event.creation_date);
        version += 1;
        ticket = event.ticket;
        authors.push(event.author);
      }

      if (event.type === "merged") {
        end = _momentTimezone["default"].unix(event.creation_date);
        version += 1;
        ticket = event.ticket;
        authors.push(event.author);
      }
    } // Always an overflow

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  if (end) {
    var diff = end.diff(start);
    proj.seconds = _momentTimezone["default"].duration(diff).asSeconds();
    proj.minutes = _momentTimezone["default"].duration(diff).asMinutes();
    proj.hours = _momentTimezone["default"].duration(diff).asHours();
    proj.version = version;
    proj.ticket = ticket;
    proj.project = project;
    proj.author = authors;
    response.push(proj);
  }

  var ticketSerializer = new _TicketSerializer["default"]();
  return ticketSerializer.serialize(response);
}

async function deploymentFrequency(inputs) {
  // Inputs
  var from = inputs.from,
      to = inputs.to; // Count up the events

  var events = await (0, _FetchEventsByDate["default"])(from, to, {
    eventRepository: eventRepository
  });
  var response = {
    from: from,
    to: to,
    total: 0,
    deployments: []
  };

  var _iterator3 = _createForOfIteratorHelper(events),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var event = _step3.value;

      if (event.type === "merged") {
        response.total += 1;
        response.deployments.push({
          date: _momentTimezone["default"].unix(event.creation_date).format("DD/MM/YYYY"),
          dateRaw: parseInt(event.creation_date),
          ticket: event.ticket,
          project: event.project
        });
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var dfSerializer = new _DeploymentFrequencySerializer["default"]();
  return dfSerializer.serialize(response);
}

async function changeRateFailure(inputs) {
  // Inputs
  var from = inputs.from,
      to = inputs.to; // Count up the events

  var events = await (0, _FetchEventsByDate["default"])(from, to, {
    eventRepository: eventRepository
  });
  var response = {
    from: from,
    to: to,
    total: 0,
    failures: []
  };

  var _iterator4 = _createForOfIteratorHelper(events),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var event = _step4.value;

      if (event.type === "failure") {
        response.total += 1;
        response.failures.push({
          date: _momentTimezone["default"].unix(event.creation_date).format("DD/MM/YYYY"),
          dateRaw: parseInt(event.creation_date),
          ticket: event.ticket,
          project: event.project
        });
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  var crfSerializer = new _ChangeRateFailureSerializer["default"]();
  return crfSerializer.serialize(response);
}

module.exports = {
  jiraWorkStarted: jiraWorkStarted,
  gitlabPush: gitlabPush,
  gitlabMergeRequest: gitlabMergeRequest,
  fetchByTicket: fetchByTicket,
  fetchByProject: fetchByProject,
  deploymentFrequency: deploymentFrequency,
  changeRateFailure: changeRateFailure,
  recordRollBarError: recordRollBarError
};