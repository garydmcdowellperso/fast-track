import EventRepository from "../../../../src/services/dora4/repositories/EventRepository";
import EventRepositoryInMemory from "../../../../src/services/dora4/interface_adapters/storage/EventRepositoryInMemory";

const eventRepository = new EventRepository(new EventRepositoryInMemory());

import CreatePushGitlab from "../../../../src/services/dora4/use_cases/CreatePushGitlab";

import { push, mr } from "../../fixtures/gitlab";

describe("CreatePushGitlab use cases", () => {
  test("create push of code - ok", async () => {
    try {
      const event = await CreatePushGitlab(
        push.object_kind,
        push.event_name,
        push.before,
        push.after,
        push.ref,
        push.user_id,
        push.user_name,
        push.user_username,
        push.user_avatar,
        push.project_id,
        push.project,
        push.commits,
        push.total_commits_count,
        push.repository,
        { eventRepository }
      );

      expect(event).toEqual(null);
    } catch (e) {
      console.error("HERE", e);
    }
  });

  test("create mr - ok", async () => {
    const event = CreatePushGitlab(mr, { eventRepository });

    expect(event).toEqual(null);
  });
});
