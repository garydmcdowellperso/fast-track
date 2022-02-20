import Event from "../entities/Event";

import moment from "moment-timezone";

async function CreatePullRequestGithub(
  action,
  number,
  pull_request,
  repository,
  sender,
  { eventRepository }
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

  const event = new Event(
    "github_pr",
    {
      action,
      number,
      pull_request,
      repository,
      sender,
    },
    moment().format("X"),
    pull_request.head.ref,
    pull_request.head.ref,
    pull_request.head.repo.name,
    pull_request.head.user.login
  );

  await eventRepository.persist(event);

  return event;
}

export default CreatePullRequestGithub;
