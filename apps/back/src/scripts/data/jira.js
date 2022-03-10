const jira1 = {
  timestamp: 1645293233435.0,
  webhookEvent: "jira:issue_updated",
  user: {
    self: "https://premiersupremos.atlassian.net/rest/api/2/user?accountId=70121%3A76a0abc1-ee3d-4da0-beaa-8e79c2584bee",
    accountId: "70121:76a0abc1-ee3d-4da0-beaa-8e79c2584bee",
    avatarUrls: {
      "48x48":
        "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
      "24x24":
        "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
      "16x16":
        "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
      "32x32":
        "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
    },
    displayName: "Gary McDowell",
    active: true,
    timeZone: "Europe/Paris",
    accountType: "atlassian",
  },
  issue: {
    id: "10002",
    self: "https://premiersupremos.atlassian.net/rest/api/2/10002",
    key: "TEST-1",
    fields: {
      statuscategorychangedate: "2022-02-19T18:53:53.423+0100",
      issuetype: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/issuetype/10001",
        id: "10001",
        description: "Functionality or a feature expressed as a user goal.",
        iconUrl:
          "https://premiersupremos.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium",
        name: "Story",
        subtask: false,
        avatarId: 10315,
        hierarchyLevel: 0,
      },
      timespent: null,
      project: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/project/10000",
        id: "10000",
        key: "TEST",
        name: "premiersupremos",
        projectTypeKey: "software",
        simplified: false,
        avatarUrls: {
          "48x48":
            "https://premiersupremos.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10418",
          "24x24":
            "https://premiersupremos.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10418?size=small",
          "16x16":
            "https://premiersupremos.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10418?size=xsmall",
          "32x32":
            "https://premiersupremos.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10418?size=medium",
        },
      },
      fixVersions: [],
      aggregatetimespent: null,
      resolution: null,
      customfield_10028: null,
      resolutiondate: null,
      workratio: -1,
      issuerestriction: {
        issuerestrictions: {},
        shouldDisplay: false,
      },
      watches: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/issue/PREM-3/watchers",
        watchCount: 1,
        isWatching: true,
      },
      lastViewed: null,
      created: "2022-02-19T18:53:49.169+0100",
      customfield_10020: null,
      customfield_10021: null,
      customfield_10022: null,
      priority: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/priority/3",
        iconUrl:
          "https://premiersupremos.atlassian.net/images/icons/priorities/medium.svg",
        name: "Medium",
        id: "3",
      },
      customfield_10023: null,
      customfield_10024: null,
      customfield_10025: null,
      labels: [],
      customfield_10016: null,
      customfield_10017: null,
      customfield_10018: {
        hasEpicLinkFieldDependency: false,
        showField: false,
        nonEditableReason: {
          reason: "PLUGIN_LICENSE_ERROR",
          message: "The Parent Link is only available to Jira Premium users.",
        },
      },
      customfield_10019: "0|i0000f:",
      timeestimate: null,
      aggregatetimeoriginalestimate: null,
      versions: [],
      issuelinks: [],
      assignee: null,
      updated: "2022-02-19T18:53:53.423+0100",
      status: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/status/3",
        description:
          "This issue is being actively worked on at the moment by the assignee.",
        iconUrl:
          "https://premiersupremos.atlassian.net/images/icons/statuses/inprogress.png",
        name: "In Progress",
        id: "3",
        statusCategory: {
          self: "https://premiersupremos.atlassian.net/rest/api/2/statuscategory/4",
          id: 4,
          key: "indeterminate",
          colorName: "yellow",
          name: "In Progress",
        },
      },
      components: [],
      timeoriginalestimate: null,
      description: null,
      customfield_10010: null,
      customfield_10014: null,
      customfield_10015: null,
      timetracking: {},
      customfield_10005: null,
      customfield_10006: null,
      security: null,
      customfield_10007: null,
      customfield_10008: null,
      customfield_10009: null,
      aggregatetimeestimate: null,
      attachment: [],
      summary: "Another test",
      creator: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/user?accountId=70121%3A76a0abc1-ee3d-4da0-beaa-8e79c2584bee",
        accountId: "70121:76a0abc1-ee3d-4da0-beaa-8e79c2584bee",
        avatarUrls: {
          "48x48":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
          "24x24":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
          "16x16":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
          "32x32":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
        },
        displayName: "Gary McDowell",
        active: true,
        timeZone: "Europe/Paris",
        accountType: "atlassian",
      },
      subtasks: [],
      reporter: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/user?accountId=70121%3A76a0abc1-ee3d-4da0-beaa-8e79c2584bee",
        accountId: "70121:76a0abc1-ee3d-4da0-beaa-8e79c2584bee",
        avatarUrls: {
          "48x48":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
          "24x24":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
          "16x16":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
          "32x32":
            "https://secure.gravatar.com/avatar/594dbb61889d6b384067a043058b15f0?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FGM-6.png",
        },
        displayName: "Gary McDowell",
        active: true,
        timeZone: "Europe/Paris",
        accountType: "atlassian",
      },
      customfield_10000: "{}",
      aggregateprogress: {
        progress: 0,
        total: 0,
      },
      customfield_10001: null,
      customfield_10002: null,
      customfield_10003: null,
      customfield_10004: null,
      environment: null,
      duedate: null,
      progress: {
        progress: 0,
        total: 0,
      },
      votes: {
        self: "https://premiersupremos.atlassian.net/rest/api/2/issue/PREM-3/votes",
        votes: 0,
        hasVoted: false,
      },
    },
  },
  changelog: {
    id: "10014",
    items: [
      {
        field: "status",
        fieldtype: "jira",
        fieldId: "status",
        from: "10001",
        fromString: "Selected for Development",
        to: "3",
        toString: "In Progress",
      },
    ],
  },
};

module.exports = {
  jira1,
};
