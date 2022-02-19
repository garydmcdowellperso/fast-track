"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Event = _interopRequireDefault(require("../entities/Event"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

async function CreatePushGitlab(object_kind, event_name, before, after, ref, user_id, user_name, user_username, user_avatar, project_id, project, commits, total_commits_count, repository, _ref) {
  var eventRepository = _ref.eventRepository;

  if (!object_kind) {
    throw new Error("No leagueId");
  }

  if (!event_name) {
    throw new Error("No created_at");
  }

  if (!before) {
    throw new Error("No updated_at");
  }

  if (!after) {
    throw new Error("No clubs");
  } // Create a generic event to capture this Gitlab Push


  var refs = ref.split("/");
  var event;

  if (refs[2] !== "main") {
    event = new _Event["default"]("gitlab_push", {
      object_kind: object_kind,
      event_name: event_name,
      before: before,
      after: after,
      ref: ref,
      user_id: user_id,
      user_name: user_name,
      user_username: user_username,
      user_avatar: user_avatar,
      project_id: project_id,
      project: project,
      commits: commits,
      total_commits_count: total_commits_count,
      repository: repository
    }, (0, _momentTimezone["default"])().format("X"), ref, refs[2], project.name, user_username);
  }

  var ticket = "";

  if (refs[2] === "main") {
    // Merged from which branch ?
    var _iterator = _createForOfIteratorHelper(commits),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var commit = _step.value;

        if (commit.title.includes("Merge")) {
          // Split it apart
          var parts = commit.title.split(" ");
          console.log("parts", parts);
          ticket = parts[2];
          ticket = ticket.replace(/['"]+/g, "");
          console.log("ticket", ticket);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    event = new _Event["default"]("merged", {
      object_kind: object_kind,
      event_name: event_name,
      before: before,
      after: after,
      ref: ref,
      user_id: user_id,
      user_name: user_name,
      user_username: user_username,
      user_avatar: user_avatar,
      project_id: project_id,
      project: project,
      commits: commits,
      total_commits_count: total_commits_count,
      repository: repository
    }, (0, _momentTimezone["default"])().format("X"), ref, ticket, project.name, user_username);
  }

  await eventRepository.persist(event); // Update any previous events with the info we now have

  if (refs[2] !== "main") {
    var oldEvents = await eventRepository.getByTicket(refs[2]);

    var _iterator2 = _createForOfIteratorHelper(oldEvents),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var oe = _step2.value;

        if (oe.type === "work_started") {
          delete oe._id;
          oe.branch = ref;
          oe.ticket = refs[2];
          oe.project = project.name;
          await eventRepository.merge(oe);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return event;
}

var _default = CreatePushGitlab;
exports["default"] = _default;