import CreatePushGitlab from "../use_cases/CreatePushGitlab";
import CreateMergeRequestGitlab from "../use_cases/CreateMergeRequestGitlab";
import FetchEventsByTicket from "../use_cases/FetchEventsByTicket";
import FetchEventsByProject from "../use_cases/FetchEventsByProject";
import FetchEventsByDate from "../use_cases/FetchEventsByDate";
import CreateWorkStartedJira from "../use_cases/CreateWorkStartedJira";
import CreateFailureRollbar from "../use_cases/CreateFailureRollbar";

import EventRepository from "../repositories/EventRepository";
import EventRepositoryMongo from "../interface_adapters/storage/EventRepositoryMongo";

const eventRepository = new EventRepository(new EventRepositoryMongo());

import TicketSerializer from "../serializers/TicketSerializer";
import DeploymentFrequencySerializer from "../serializers/DeploymentFrequencySerializer";
import ChangeRateFailureSerializer from "../serializers/ChangeRateFailureSerializer";

import moment from "moment-timezone";
import "moment-duration-format";

async function recordRollBarError(inputs) {
  // Inputs
  const { event_name, data } = inputs;

  // Convert to generic event depending on data

  return CreateFailureRollbar(event_name, data, {
    eventRepository,
  });
}

async function jiraWorkStarted(inputs) {
  // Inputs
  const { timestamp, webhookEvent, user, issue, changelog } = inputs;

  // Convert to generic event depending on data

  return CreateWorkStartedJira(
    timestamp,
    webhookEvent,
    user,
    issue,
    changelog,
    {
      eventRepository,
    }
  );
}

async function gitlabPush(inputs) {
  // Inputs
  const {
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
  } = inputs;

  // Convert to generic event depending on data

  return CreatePushGitlab(
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
    {
      eventRepository,
    }
  );
}

async function gitlabMergeRequest(inputs) {
  // Inputs
  const {
    object_kind,
    event_type,
    user,
    project,
    object_attributes,
    labels,
    changes,
    repository,
  } = inputs;

  // Convert to generic event depending on data

  return CreateMergeRequestGitlab(
    object_kind,
    event_type,
    user,
    project,
    object_attributes,
    labels,
    changes,
    repository,
    {
      eventRepository,
    }
  );
}

async function fetchByTicket(inputs) {
  // Inputs
  const { ticket } = inputs;

  // Reduce down the events

  const events = await FetchEventsByTicket(ticket, { eventRepository });

  const response = {
    version: events.length,
    ticket: ticket,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
    months: 0,
    project: "",
    author: [],
  };

  let start = 0;
  let end = 0;
  let version = 0;
  let authors = [];

  for (const event of events) {
    if (event.type === "work_started" && start === 0) {
      start = moment.unix(event.creation_date);
      version += 1;
      authors.push(event.author);
    }
    if (event.type === "merged") {
      end = moment.unix(event.creation_date);
      version += 1;
      authors.push(event.author);
    }
    response.project = event.project;
  }
  response.version = version;
  response.author = authors;

  if (end) {
    const diff = end.diff(start);
    console.log("diff", diff);

    response.seconds = moment.duration(diff).asSeconds();
    response.minutes = moment.duration(diff).asMinutes();
    response.hours = moment.duration(diff).asHours();
  }

  const ticketSerializer = new TicketSerializer();
  return ticketSerializer.serialize(response);
}

async function fetchByProject(inputs) {
  // Inputs
  const { project } = inputs;

  // Reduce down the events

  const events = await FetchEventsByProject(project, { eventRepository });

  const response = [];

  let start = 0;
  let end = 0;
  let version = 0;
  let ticket = "";
  let currentTicket = "";
  let proj = {};
  let authors = [];

  for (const event of events) {
    if (currentTicket === "") {
      start = 0;
      end = 0;
      version = 0;
      currentTicket = event.ticket;
      proj = {};
      ticket = "";
      authors = [];
    }

    if (event.ticket !== currentTicket) {
      if (end) {
        const diff = end.diff(start);

        proj.seconds = moment.duration(diff).asSeconds();
        proj.minutes = moment.duration(diff).asMinutes();
        proj.hours = moment.duration(diff).asHours();
        proj.version = version;
        proj.ticket = ticket;
        proj.project = project;
        proj.author = authors;
      }

      response.push(proj);

      start = 0;
      end = 0;
      version = 0;
      authors = [];
      currentTicket = event.ticket;
      proj = {};
    }

    if (event.type === "work_started" && start === 0) {
      start = moment.unix(event.creation_date);
      version += 1;
      ticket = event.ticket;
      authors.push(event.author);
    }
    if (event.type === "merged") {
      end = moment.unix(event.creation_date);
      version += 1;
      ticket = event.ticket;
      authors.push(event.author);
    }
  }

  // Always an overflow
  if (end) {
    const diff = end.diff(start);

    proj.seconds = moment.duration(diff).asSeconds();
    proj.minutes = moment.duration(diff).asMinutes();
    proj.hours = moment.duration(diff).asHours();
    proj.version = version;
    proj.ticket = ticket;
    proj.project = project;
    proj.author = authors;

    response.push(proj);
  }

  const ticketSerializer = new TicketSerializer();
  return ticketSerializer.serialize(response);
}

async function deploymentFrequency(inputs) {
  // Inputs
  const { from, to } = inputs;

  // Count up the events
  const events = await FetchEventsByDate(from, to, { eventRepository });

  const response = {
    from,
    to,
    total: 0,
    deployments: [],
  };

  for (const event of events) {
    if (event.type === "merged") {
      response.total += 1;

      response.deployments.push({
        date: moment.unix(event.creation_date).format("DD/MM/YYYY"),
        dateRaw: parseInt(event.creation_date),
        ticket: event.ticket,
        project: event.project,
      });
    }
  }

  const dfSerializer = new DeploymentFrequencySerializer();
  return dfSerializer.serialize(response);
}

async function changeRateFailure(inputs) {
  // Inputs
  const { from, to } = inputs;

  // Count up the events
  const events = await FetchEventsByDate(from, to, { eventRepository });

  const response = {
    from,
    to,
    total: 0,
    failures: [],
  };

  for (const event of events) {
    if (event.type === "failure") {
      response.total += 1;

      response.failures.push({
        date: moment.unix(event.creation_date).format("DD/MM/YYYY"),
        dateRaw: parseInt(event.creation_date),
        ticket: event.ticket,
        project: event.project,
      });
    }
  }

  const crfSerializer = new ChangeRateFailureSerializer();
  return crfSerializer.serialize(response);
}

module.exports = {
  jiraWorkStarted,
  gitlabPush,
  gitlabMergeRequest,
  fetchByTicket,
  fetchByProject,
  deploymentFrequency,
  changeRateFailure,
  recordRollBarError,
};
