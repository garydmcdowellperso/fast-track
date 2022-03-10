import Event from "../entities/Event";

import moment from "moment-timezone";

async function CreateFailureRollbar(
  event_type,
  data,
  hashValue,
  { eventRepository }
) {
  if (!event_type) {
    throw new Error("No event_type");
  }
  if (!data) {
    throw new Error("No data");
  }
  if (!hashValue) {
    throw new Error("No hashValue");
  }

  let event = null;
  // Idempotent, don't reprocess is we have this already
  event = await eventRepository.getByHash(hashValue);

  if (!event) {
    // Create a generic event to capture this error and link to a ticket
    const project = data.url.split("/");
    event = new Event(
      "failure",
      {
        event_type,
        data,
      },
      hashValue,
      moment().format("X"),
      null,
      null,
      project[4],
      null
    );

    // Find the last release to link to this error
    const oldEvents = await eventRepository.getByProject(project[4]);
    for (const oe of oldEvents) {
      if (oe.type === "merged") {
        event.ticket = oe.ticket;
        event.branch = oe.branch;
        event.author = oe.author;
      }
    }

    await eventRepository.persist(event);
  }

  return event;
}

export default CreateFailureRollbar;
