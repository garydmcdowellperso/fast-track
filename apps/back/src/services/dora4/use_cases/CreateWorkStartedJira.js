import Event from "../entities/Event";

import moment from "moment-timezone";

async function CreateWorkStartedJira(
  timestamp,
  webhookEvent,
  user,
  issue,
  changelog,
  { eventRepository }
) {
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
  }

  // Create a generic event to capture this Jira ticket

  const event = new Event(
    "work_started",
    {
      timestamp,
      webhookEvent,
      user,
      issue,
      changelog,
    },
    moment().format("X"),
    issue.key,
    null,
    null,
    user.displayName
  );

  await eventRepository.persist(event);

  return event;
}

export default CreateWorkStartedJira;
