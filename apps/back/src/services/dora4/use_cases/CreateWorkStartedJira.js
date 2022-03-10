import Event from "../entities/Event";
import Contributor from "../entities/Contributor";

import moment from "moment-timezone";

async function CreateWorkStartedJira(
  timestamp,
  webhookEvent,
  user,
  issue,
  changelog,
  hashValue,
  { eventRepository, contributorRepository }
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
  if (!hashValue) {
    throw new Error("No hashValue");
  }

  let event = null;
  // Idempotent, don't reprocess is we have this already
  event = await eventRepository.getByHash(hashValue);

  if (!event) {
    // Check if this is a new contributor
    let ic = await contributorRepository.getByIdentifier(
      user.accountId,
      "jira"
    );

    if (!ic) {
      const names = user.displayName.split(" ");
      const contributor = new Contributor(
        user.accountId,
        "jira",
        names[0],
        names[1],
        user.displayName,
        user.avatarUrls["16x16"],
        moment().format("X")
      );
      ic = await contributorRepository.persist(contributor);
    }

    // Create a generic event to capture this Jira ticket
    event = new Event(
      "work_started",
      {
        timestamp,
        webhookEvent,
        user,
        issue,
        changelog,
      },
      hashValue,
      moment().format("X"),
      null,
      issue.key,
      null,
      ic
    );

    await eventRepository.persist(event);
  }

  return event;
}

export default CreateWorkStartedJira;
