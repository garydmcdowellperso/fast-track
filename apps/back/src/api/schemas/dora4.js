const leadTimeToProduction = {
  type: "object",
  properties: {
    seconds: { type: "number" },
    minutes: { type: "number" },
    hours: { type: "number" },
    days: { type: "number" },
    weeks: { type: "number" },
    months: { type: "number" },
  },
};

const dora4TicketSchema = {
  type: "object",
  properties: {
    version: { type: "number" },
    ticket: { type: "string" },
    project: { type: "string" },
    author: {
      type: "array",
      items: { author: { type: "string" }, avatar: { type: "string" } },
    },
    leadTimeToProduction: leadTimeToProduction,
  },
};

const deployments = {
  type: "array",
  items: {
    type: "object",
    properties: {
      date: { type: "string" },
      dateRaw: { type: "number" },
      ticket: { type: "string" },
      project: { type: "string" },
    },
  },
};

const dora4DeploymentSchema = {
  type: "object",
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    total: { type: "number" },
    deployments: deployments,
  },
};

const failures = {
  type: "array",
  items: {
    type: "object",
    properties: {
      date: { type: "string" },
      dateRaw: { type: "number" },
      ticket: { type: "string" },
      project: { type: "string" },
    },
  },
};

const changeRateFailureSchema = {
  type: "object",
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    total: { type: "number" },
    failures: failures,
  },
};

const collaboratorSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    identifier: { type: "string" },
    identifierType: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    fullName: { type: "string" },
    avatarUrl: { type: "string" },
    creation_date: { type: "string" },
  },
};

const teamSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    teamName: { type: "string" },
    selectedProjects: {
      type: "array",
      items: { type: "string" },
    },
    teamCollaborators: {
      type: "array",
      items: collaboratorSchema,
    },
    teamColour: { type: "string" },
    creation_date: { type: "string" },
  },
};

module.exports = {
  dora4TicketSchema,
  leadTimeToProduction,
  dora4DeploymentSchema,
  changeRateFailureSchema,
  collaboratorSchema,
  teamSchema,
};
