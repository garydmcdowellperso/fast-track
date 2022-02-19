import Event from "../entities/Event";

import moment from "moment-timezone";

async function CreateMergeRequestGitlab(
  object_kind,
  event_type,
  user,
  project,
  object_attributes,
  labels,
  changes,
  repository,
  { eventRepository }
) {
  if (!object_kind) {
    throw new Error("No leagueId");
  }
  if (!event_type) {
    throw new Error("No created_at");
  }
  if (!user) {
    throw new Error("No updated_at");
  }
  if (!project) {
    throw new Error("No clubs");
  }

  // Create a generic event to capture this Gitlab Push

  const ref = `refs/heads/${object_attributes.source_branch}`;
  const refs = ref.split("/");

  const event = new Event(
    "gitlab_mr",
    {
      object_kind,
      event_type,
      user,
      project,
      object_attributes,
      labels,
      changes,
      repository,
    },
    moment().format("X"),
    ref,
    refs[2],
    project.name,
    user.username
  );

  await eventRepository.persist(event);

  return event;
}

export default CreateMergeRequestGitlab;
