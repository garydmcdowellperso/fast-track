"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

async function FetchEventsByTicket(ticket, _ref) {
  var eventRepository = _ref.eventRepository;

  if (!ticket) {
    throw new Error("No ticket");
  }

  return eventRepository.getByTicket(ticket);
}

var _default = FetchEventsByTicket;
exports["default"] = _default;