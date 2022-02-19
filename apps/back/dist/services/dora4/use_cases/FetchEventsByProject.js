"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

async function FetchEventsByProject(project, _ref) {
  var eventRepository = _ref.eventRepository;

  if (!project) {
    throw new Error("No project");
  }

  return eventRepository.getByProject(project);
}

var _default = FetchEventsByProject;
exports["default"] = _default;