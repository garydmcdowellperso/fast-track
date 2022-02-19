import {
  manageInjury,
  findSub,
} from "../../../../src/services/engine/use_cases/PlayFixture";

import { fixture1 } from "../../fixtures/fixtures";

describe("PlayFixture use cases", () => {
  let scores;
  beforeEach(async () => {
    scores = {
      home: 0,
      away: 0,
    };
  });

  test("findSub nok", async () => {
    const { selected, sub } = findSub(fixture1.away.team, 1);

    expect(selected).toEqual(null);
    expect(sub).toEqual(0);
  });

  test("findSub ok", async () => {
    const { selected, sub } = findSub(fixture1.home.team, 1);

    expect(selected).not.toEqual(null);
    expect(sub).not.toEqual(0);
  });

  test("manageInjury ok", async () => {
    let events = [];
    const { home } = manageInjury(fixture1, events, scores, true, 1);

    if (home) {
      expect(events.length).toEqual(2);
    } else {
      expect(events.length).toEqual(1);
    }
  });
});
