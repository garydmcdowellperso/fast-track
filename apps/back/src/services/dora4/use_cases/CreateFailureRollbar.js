import Event from "../entities/Event";

import moment from "moment-timezone";

async function CreateFailureRollbar(event_type, data, { eventRepository }) {
  if (!event_type) {
    throw new Error("No event_type");
  }
  if (!data) {
    throw new Error("No data");
  }

  // Create a generic event to capture this error and link to a ticket
  const project = data.url.split("/");
  console.log("project", project);
  const event = new Event(
    "failure",
    {
      event_type,
      data,
    },
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

  return event;
}

export default CreateFailureRollbar;
