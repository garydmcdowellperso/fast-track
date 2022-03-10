import Event from "../entities/Event";
import Contributor from "../entities/Contributor";

import moment from "moment-timezone";

async function CreatePullRequestGithub(
  action,
  number,
  pull_request,
  repository,
  sender,
  hashValue,
  { eventRepository, contributorRepository }
) {
  if (!action) {
    throw new Error("No action");
  }
  if (!number) {
    throw new Error("No number");
  }
  if (!pull_request) {
    throw new Error("No pull_request");
  }
  if (!repository) {
    throw new Error("No repository");
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
        pull_request.head.user.login,
        sender.avatar_url,
        moment().format("X")
      );
      ic = await contributorRepository.persist(contributor);
    }

    event = new Event(
      "github_pr",
      {
        action,
        number,
        pull_request,
        repository,
        sender,
      },
      hashValue,
      moment().format("X"),
      pull_request.head.ref,
      pull_request.head.ref,
      pull_request.head.repo.name,
      contributor
    );

    await eventRepository.persist(event);
  }
  return event;
}

export default CreatePullRequestGithub;
