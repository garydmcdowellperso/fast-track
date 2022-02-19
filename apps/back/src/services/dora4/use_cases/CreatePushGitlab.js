import Event from "../entities/Event";

import moment from "moment-timezone";

async function CreatePushGitlab(
  object_kind,
  event_name,
  before,
  after,
  ref,
  user_id,
  user_name,
  user_username,
  user_avatar,
  project_id,
  project,
  commits,
  total_commits_count,
  repository,
  { eventRepository }
) {
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
  }

  // Create a generic event to capture this Gitlab Push

  const refs = ref.split("/");

  let event;
  if (refs[2] !== "main") {
    event = new Event(
      "gitlab_push",
      {
        object_kind,
        event_name,
        before,
        after,
        ref,
        user_id,
        user_name,
        user_username,
        user_avatar,
        project_id,
        project,
        commits,
        total_commits_count,
        repository,
      },
      moment().format("X"),
      ref,
      refs[2],
      project.name,
      user_username
    );
  }

  let ticket = "";
  if (refs[2] === "main") {
    // Merged from which branch ?
    for (const commit of commits) {
      if (commit.title.includes("Merge")) {
        // Split it apart
        const parts = commit.title.split(" ");
        console.log("parts", parts);
        ticket = parts[2];
        ticket = ticket.replace(/['"]+/g, "");
        console.log("ticket", ticket);
      }
    }

    event = new Event(
      "merged",
      {
        object_kind,
        event_name,
        before,
        after,
        ref,
        user_id,
        user_name,
        user_username,
        user_avatar,
        project_id,
        project,
        commits,
        total_commits_count,
        repository,
      },
      moment().format("X"),
      ref,
      ticket,
      project.name,
      user_username
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
        oe.project = project.name;

        await eventRepository.merge(oe);
      }
    }
  }

  return event;
}

export default CreatePushGitlab;
