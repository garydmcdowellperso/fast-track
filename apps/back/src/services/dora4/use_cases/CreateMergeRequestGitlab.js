import Event from "../entities/Event";
import Contributor from "../entities/Contributor";

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
  hashValue,
  { eventRepository, contributorRepository }
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
  if (!hashValue) {
    throw new Error("No hashValue");
  }

  let event = null;
  // Idempotent, don't reprocess is we have this already
  event = await eventRepository.getByHash(hashValue);

  if (!event) {
    // Check if this is a new contributor
    let ic = await contributorRepository.getByIdentifier(user.id, "gitlab");

    if (!ic) {
      const names = user.name.split(" ");
      const contributor = new Contributor(
        user.id,
        "gitlab",
        names[0],
        names[1],
        user.username,
        user.avatar_url,
        moment().format("X")
      );
      ic = await contributorRepository.persist(contributor);
    }

    // Create a generic event to capture this Gitlab Push

    const ref = `refs/heads/${object_attributes.source_branch}`;
    const refs = ref.split("/");

    event = new Event(
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
      hashValue,
      moment().format("X"),
      ref,
      refs[2],
      project.name,
      ic
    );

    await eventRepository.persist(event);
  }

  return event;
}

export default CreateMergeRequestGitlab;
