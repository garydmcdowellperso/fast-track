import Event from "../entities/Event";
import Contributor from "../entities/Contributor";

import moment from "moment-timezone";

async function CreatePushGithub(
  ref,
  before,
  after,
  repository,
  pusher,
  sender,
  created,
  deleted,
  forced,
  base_ref,
  compare,
  commits,
  head_commit,
  hashValue,
  { eventRepository, contributorRepository }
) {
  if (!ref) {
    throw new Error("No ref");
  }
  if (!before) {
    throw new Error("No before");
  }
  if (!after) {
    throw new Error("No after");
  }
  if (!repository) {
    throw new Error("No repository");
  }
  if (!pusher) {
    throw new Error("No pusher");
  }
  if (!hashValue) {
    throw new Error("No hashValue");
  }

  let event = null;
  // Idempotent, don't reprocess is we have this already
  event = await eventRepository.getByHash(hashValue);

  if (!event) {
    // Check if this is a new contributor
    let ic = await contributorRepository.getByIdentifier(sender.id, "github");

    if (!ic) {
      const contributor = new Contributor(
        sender.id,
        "github",
        "",
        "",
        pusher.name,
        sender.avatar_url,
        moment().format("X")
      );
      await contributorRepository.persist(contributor);

      ic = contributor;
    }

    // Create a generic event to capture this Gitlab Push

    const refs = ref.split("/");

    if (refs[2] !== "main") {
      event = new Event(
        "github_push",
        {
          ref,
          before,
          after,
          repository,
          pusher,
          sender,
          created,
          deleted,
          forced,
          base_ref,
          compare,
          commits,
          head_commit,
        },
        hashValue,
        moment().format("X"),
        ref,
        refs[2],
        repository.name,
        ic
      );
    }

    let ticket = "";
    if (refs[2] === "main") {
      // Merged from which branch ?
      for (const commit of commits) {
        if (commit.message.includes("Merge")) {
          // Split it apart
          const parts = commit.message.split("/");
          ticket = parts[1];
          ticket = ticket.substring(0, ticket.indexOf("\n"));
        }
      }

      event = new Event(
        "merged",
        {
          ref,
          before,
          after,
          repository,
          pusher,
          sender,
          created,
          deleted,
          forced,
          base_ref,
          compare,
          commits,
          head_commit,
        },
        hashValue,
        moment().format("X"),
        ref,
        ticket,
        repository.name,
        ic
      );
    }

    await eventRepository.persist(event);

    // Update any previous events with the info we now have
    if (refs[2] !== "main") {
      const oldEvents = await eventRepository.getByTicket(refs[2]);

      for (const oe of oldEvents) {
        if (oe.type === "work_started") {
          delete oe._id;
          oe.branch = ref;
          oe.ticket = refs[2];
          oe.project = repository.name;

          await eventRepository.merge(oe);
        }
      }
    }
  }
  return event;
}

export default CreatePushGithub;
