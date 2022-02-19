"use strict";

var leadTimeToProduction = {
  type: "object",
  properties: {
    seconds: {
      type: "number"
    },
    minutes: {
      type: "number"
    },
    hours: {
      type: "number"
    },
    days: {
      type: "number"
    },
    weeks: {
      type: "number"
    },
    months: {
      type: "number"
    }
  }
};
var dora4TicketSchema = {
  type: "object",
  properties: {
    version: {
      type: "number"
    },
    ticket: {
      type: "string"
    },
    project: {
      type: "string"
    },
    author: {
      type: "array",
      items: {
        type: "string"
      }
    },
    leadTimeToProduction: leadTimeToProduction
  }
};
var deployments = {
  type: "array",
  items: {
    type: "object",
    properties: {
      date: {
        type: "string"
      },
      dateRaw: {
        type: "number"
      },
      ticket: {
        type: "string"
      },
      project: {
        type: "string"
      }
    }
  }
};
var dora4DeploymentSchema = {
  type: "object",
  properties: {
    from: {
      type: "string"
    },
    to: {
      type: "string"
    },
    total: {
      type: "number"
    },
    deployments: deployments
  }
};
var failures = {
  type: "array",
  items: {
    type: "object",
    properties: {
      date: {
        type: "string"
      },
      dateRaw: {
        type: "number"
      },
      ticket: {
        type: "string"
      },
      project: {
        type: "string"
      }
    }
  }
};
var changeRateFailureSchema = {
  type: "object",
  properties: {
    from: {
      type: "string"
    },
    to: {
      type: "string"
    },
    total: {
      type: "number"
    },
    failures: failures
  }
};
module.exports = {
  dora4TicketSchema: dora4TicketSchema,
  leadTimeToProduction: leadTimeToProduction,
  dora4DeploymentSchema: dora4DeploymentSchema,
  changeRateFailureSchema: changeRateFailureSchema
};