import CreatePushGitlab from "../use_cases/CreatePushGitlab";
import CreatePushGithub from "../use_cases/CreatePushGithub";
import CreateMergeRequestGitlab from "../use_cases/CreateMergeRequestGitlab";
import CreatePullRequestGithub from "../use_cases/CreatePullRequestGithub";
import FetchEventsByTicket from "../use_cases/FetchEventsByTicket";
import FetchEventsByProject from "../use_cases/FetchEventsByProject";
import FetchEventsByDate from "../use_cases/FetchEventsByDate";
import FetchEventsByProjectAndDate from "../use_cases/FetchEventsByProjectAndDate";
import FetchAllTeams from "../use_cases/FetchAllTeams";
import FetchAllCollaborators from "../use_cases/FetchAllCollaborators";
import FetchAllEvents from "../use_cases/FetchAllEvents";
import CreateWorkStartedJira from "../use_cases/CreateWorkStartedJira";
import CreateFailureRollbar from "../use_cases/CreateFailureRollbar";
import CreateTeam from "../use_cases/CreateTeam";
import DeleteTeamById from "../use_cases/DeleteTeamById";

import EventRepository from "../repositories/EventRepository";
import EventRepositoryMongo from "../interface_adapters/storage/EventRepositoryMongo";
const eventRepository = new EventRepository(new EventRepositoryMongo());

import TeamRepository from "../repositories/TeamRepository";
import TeamRepositoryMongo from "../interface_adapters/storage/TeamRepositoryMongo";
const teamRepository = new TeamRepository(new TeamRepositoryMongo());

import ContributorRepository from "../repositories/ContributorRepository";
import ContributorRepositoryMongo from "../interface_adapters/storage/ContributorRepositoryMongo";
const contributorRepository = new ContributorRepository(
  new ContributorRepositoryMongo()
);

import ProjectRepository from "../repositories/ProjectRepository";
import ProjectRepositoryMongo from "../interface_adapters/storage/ProjectRepositoryMongo";
const projectRepository = new ProjectRepository(new ProjectRepositoryMongo());

import TicketSerializer from "../serializers/TicketSerializer";
import DeploymentFrequencySerializer from "../serializers/DeploymentFrequencySerializer";
import ChangeRateFailureSerializer from "../serializers/ChangeRateFailureSerializer";

import moment from "moment-timezone";
import "moment-duration-format";
import hash from "object-hash";

async function recordRollBarError(inputs) {
  // Inputs
  const { event_type, data } = inputs;

  // HashValue for idempotency of the event
  const hashValue = hash({
    event_type,
    data,
  });

  // Convert to generic event depending on data

  return CreateFailureRollbar(event_type, data, hashValue, {
    eventRepository,
  });
}

async function jiraWorkStarted(inputs) {
  // Inputs
  const { timestamp, webhookEvent, user, issue, changelog } = inputs;

  // HashValue for idempotency of the event
  const hashValue = hash({
    timestamp,
    webhookEvent,
    user,
    issue,
    changelog,
  });

  // Convert to generic event depending on data
  return CreateWorkStartedJira(
    timestamp,
    webhookEvent,
    user,
    issue,
    changelog,
    hashValue,
    {
      eventRepository,
      contributorRepository,
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

  // HashValue for idempotency of the event
  const hashValue = hash({
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
  });

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
    hashValue,
    {
      eventRepository,
      contributorRepository,
      projectRepository,
    }
  );
}

async function githubPush(inputs) {
  // Inputs
  const {
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
  } = inputs;

  // HashValue for idempotency of the event
  const hashValue = hash({
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
  });

  // Convert to generic event depending on data

  return CreatePushGithub(
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
    {
      eventRepository,
      contributorRepository,
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

  // HashValue for idempotency of the event
  const hashValue = hash({
    object_kind,
    event_type,
    user,
    project,
    object_attributes,
    labels,
    changes,
    repository,
  });

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
    hashValue,
    {
      eventRepository,
      contributorRepository,
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
      authors.push({
        author: event.author.fullName,
        avatar: event.author.avatarUrl,
      });
    }
    if (event.type === "merged") {
      end = moment.unix(event.creation_date);
      version += 1;
      ticket = event.ticket;
      authors.push({
        author: event.author.fullName,
        avatar: event.author.avatarUrl,
      });
    }
  }

  // Always an overflow
  if (end) {
    const diff = end.diff(start);

    proj.seconds = moment.duration(diff).asSeconds();
    proj.minutes = moment.duration(diff).asMinutes();
    proj.hours = moment.duration(diff).asHours();
  }
  proj.version = version;
  proj.ticket = ticket;
  proj.project = project;
  proj.author = authors;

  response.push(proj);

  const ticketSerializer = new TicketSerializer();
  return ticketSerializer.serialize(response);
}

async function deploymentFrequency(inputs) {
  // Inputs
  const { from, to } = inputs;

  // Count up the events
  const events = await FetchEventsByDate(from, to, {
    eventRepository,
  });

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

async function githubPullRequest(inputs) {
  // Inputs
  const { action, number, pull_request, repository, sender } = inputs;

  // HashValue for idempotency of the event
  const hashValue = hash({
    action,
    number,
    pull_request,
    repository,
    sender,
  });

  // Convert to generic event depending on data

  return CreatePullRequestGithub(
    action,
    number,
    pull_request,
    repository,
    sender,
    hashValue,
    {
      eventRepository,
      contributorRepository,
    }
  );
}

async function fetchAllProjects() {
  const events = await FetchAllEvents({ eventRepository });

  const projects = [];
  for (const event of events) {
    if (event.project) {
      if (!projects.includes(event.project)) {
        projects.push(event.project);
      }
    }
  }

  return projects;
}

async function fetchAllTeams() {
  return FetchAllTeams({ teamRepository });
}

async function fetchAllCollaborators() {
  return FetchAllCollaborators({ contributorRepository });
}

async function createTeam(inputs) {
  const { teamName, selectedProjects, teamCollaborators, teamColour } = inputs;

  return CreateTeam(teamName, selectedProjects, teamCollaborators, teamColour, {
    teamRepository,
  });
}

async function fetchLeadTime(inputs) {
  const { selectedProject, from, to } = inputs;

  const events = await FetchEventsByProjectAndDate(selectedProject, from, to, {
    eventRepository,
  });

  const response = [];

  let start = 0;
  let end = 0;
  let version = 0;
  let ticket = "";
  let currentTicket = "";
  let proj = {};
  let authors = [];
  let projy = "";

  for (const event of events) {
    if (currentTicket === "") {
      start = 0;
      end = 0;
      version = 0;
      currentTicket = event.ticket;
      proj = {};
      ticket = "";
      authors = [];
      projy = event.project;
    }

    if (event.ticket !== currentTicket) {
      if (end) {
        const diff = end.diff(start);

        proj.seconds = moment.duration(diff).asSeconds();
        proj.minutes = moment.duration(diff).asMinutes();
        proj.hours = moment.duration(diff).asHours();
        proj.version = version;
        proj.ticket = ticket;
        proj.project = projy;
        proj.author = authors;
        proj.date = end.format("DD/MM/YYYY");
        console.log("end", proj.date);
      }

      response.push(proj);

      start = 0;
      end = 0;
      version = 0;
      authors = [];
      currentTicket = event.ticket;
      projy = "";
    }

    if (event.type === "work_started" && start === 0) {
      start = moment.unix(event.creation_date);
      version += 1;
      ticket = event.ticket;
      authors.push({
        author: event.author.fullName,
        avatar: event.author.avatarUrl,
      });
    }
    if (event.type === "merged") {
      end = moment.unix(event.creation_date);
      version += 1;
      ticket = event.ticket;
      authors.push({
        author: event.author.fullName,
        avatar: event.author.avatarUrl,
      });
    }
  }

  // Always an overflow
  if (end) {
    const diff = end.diff(start);

    proj.seconds = moment.duration(diff).asSeconds();
    proj.minutes = moment.duration(diff).asMinutes();
    proj.hours = moment.duration(diff).asHours();
    proj.date = end.format("DD/MM/YYYY");
    console.log("end", proj.date);
  }
  proj.version = version;
  proj.ticket = ticket;
  proj.project = projy;
  proj.author = authors;

  response.push(proj);

  // Transform for the graphing ;-)

  const final = [];

  // Fill out graph with date range
  const period = moment(to, "DD/MM/YYYY").diff(
    moment(from, "DD/MM/YYYY"),
    "days"
  );
  for (let x = 0; x <= period; x += 1) {
    final.push({
      name: moment(from, "DD/MM/YYYY").add(x, "days").format("DD/MM/YYYY"),
      count: 0,
      leadTime: 0,
    });
  }

  for (const resp of response) {
    const exists = final.findIndex((el) => {
      return el.name === resp.date;
    });

    if (exists > -1) {
      final[exists].count += 1;
      final[exists].leadTime += Math.ceil(resp.hours / final[exists].count);
    }
  }

  return final;
}

async function fetchDeploymentFrequency(inputs) {
  // Inputs
  const { selectedProject, from, to } = inputs;

  const events = await FetchEventsByProjectAndDate(selectedProject, from, to, {
    eventRepository,
  });

  const response = [];

  // Fill out graph with date range
  const period = moment(to, "DD/MM/YYYY").diff(
    moment(from, "DD/MM/YYYY"),
    "days"
  );
  for (let x = 0; x <= period; x += 1) {
    response.push({
      name: moment(from, "DD/MM/YYYY").add(x, "days").format("DD/MM/YYYY"),
      deployments: 0,
    });
  }

  for (const event of events) {
    if (event.type === "merged") {
      const exists = response.findIndex((el) => {
        return (
          el.name === moment.unix(event.creation_date).format("DD/MM/YYYY")
        );
      });

      if (exists > -1) {
        response[exists].deployments += 1;
      }
    }
  }

  return response;
}

async function fetchChangeRateFailure(inputs) {
  // Inputs
  const { selectedProject, from, to } = inputs;

  const events = await FetchEventsByProjectAndDate(selectedProject, from, to, {
    eventRepository,
  });
  console.log("HERE", events);

  const response = [];

  // Fill out graph with date range
  const period = moment(to, "DD/MM/YYYY").diff(
    moment(from, "DD/MM/YYYY"),
    "days"
  );
  for (let x = 0; x <= period; x += 1) {
    response.push({
      name: moment(from, "DD/MM/YYYY").add(x, "days").format("DD/MM/YYYY"),
      failures: 0,
    });
  }

  for (const event of events) {
    if (event.type === "failure") {
      const exists = response.findIndex((el) => {
        return (
          el.name === moment.unix(event.creation_date).format("DD/MM/YYYY")
        );
      });

      console.log("exists", exists, event);
      if (exists > -1) {
        response[exists].failures += 1;
      }
    }
  }

  return response;
}

async function deleteTeam(id) {
  return DeleteTeamById(id, {
    teamRepository,
  });
}

module.exports = {
  changeRateFailure,
  createTeam,
  deploymentFrequency,
  fetchByTicket,
  fetchByProject,
  fetchAllProjects,
  fetchAllTeams,
  fetchAllCollaborators,
  githubPush,
  githubPullRequest,
  gitlabPush,
  gitlabMergeRequest,
  jiraWorkStarted,
  recordRollBarError,
  fetchLeadTime,
  fetchDeploymentFrequency,
  deleteTeam,
  fetchChangeRateFailure,
};
