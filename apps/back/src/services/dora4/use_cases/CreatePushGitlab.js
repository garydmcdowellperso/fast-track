import Event from "../entities/Event";
import Contributor from "../entities/Contributor";
import Project from "../entities/Project";

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
  hashValue,
  { eventRepository, contributorRepository, projectRepository }
) {
  if (!object_kind) {
    throw new Error("No object_kind");
  }
  if (!event_name) {
    throw new Error("No event_name");
  }
  if (!before) {
    throw new Error("No before");
  }
  if (!after) {
    throw new Error("No after");
  }
  if (!hashValue) {
    throw new Error("No hashValue");
  }

  let event = null;
  // Idempotent, don't reprocess is we have this already
  event = await eventRepository.getByHash(hashValue);

  if (!event) {
    // Check if this is a new contributor
    let ic = await contributorRepository.getByIdentifier(user_id, "gitlab");

    if (!ic) {
      const names = user_name.split(" ");
      const contributor = new Contributor(
        user_id,
        "gitlab",
        names[0],
        names[1],
        user_name,
        user_avatar,
        moment().format("X")
      );

      await contributorRepository.persist(contributor);

      ic = contributor;
    }

    // Create a generic event to capture this Gitlab Push

    const refs = ref.split("/");

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
        hashValue,
        moment().format("X"),
        ref,
        refs[2],
        project.name,
        ic
      );
    }

    let ticket = "";
    if (refs[2] === "main") {
      // Merged from which branch ?
      for (const commit of commits) {
        if (commit.title.includes("Merge")) {
          // Split it apart
          const parts = commit.title.split(" ");
          ticket = parts[2];
          ticket = ticket.replace(/['"]+/g, "");
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
        hashValue,
        moment().format("X"),
        ref,
        ticket,
        project.name,
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
          oe.project = project.name;

          await eventRepository.merge(oe);
        }
      }

      // Possible this is a new project
      const oldProject = await projectRepository.getByName(project.name);
      if (!oldProject) {
        const newProject = new Project(project.name, moment().format("X"));

        await projectRepository.persist(newProject);
      }
    }
  }
  return event;
}

export default CreatePushGitlab;
