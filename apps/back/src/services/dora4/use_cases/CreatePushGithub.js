import Event from "../entities/Event";

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
  { eventRepository }
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

  // Create a generic event to capture this Gitlab Push

  const refs = ref.split("/");

  let event;
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
      moment().format("X"),
      ref,
      refs[2],
      repository.name,
      pusher.name
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
      moment().format("X"),
      ref,
      ticket,
      repository.name,
      pusher.name
    );
  }

  await eventRepository.persist(event);

  return event;
}

export default CreatePushGithub;
