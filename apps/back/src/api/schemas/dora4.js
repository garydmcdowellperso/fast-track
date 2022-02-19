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
    author: { type: "array", items: { type: "string" } },
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

module.exports = {
  dora4TicketSchema,
  leadTimeToProduction,
  dora4DeploymentSchema,
  changeRateFailureSchema,
};
