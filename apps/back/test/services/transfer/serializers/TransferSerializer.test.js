import TransferSerializer from "../../../../src/services/transfer/serializers/TransferSerializer";

import { player1 } from "../../fixtures/players";

let transferSerializer;

describe("Transfer serializers", () => {
  beforeEach(async () => {
    transferSerializer = new TransferSerializer();
  });

  test("Can Serialize a transfer ok", async () => {
    const newPlayer = { ...player1 };
    newPlayer.id = 1;

    const data = {
      id: 1,
      leagueId: 1,
      buyingClub: 1,
      owningClub: 47,
      player: newPlayer,
      offerType: "Transfer",
      created_at: 1628380800,
      offer: 23040000,
      status: "done",
      lastOffer: 24960000,
      accepted_at: "1636848000",
    };

    const serializedResponse = transferSerializer.serialize(data);

    expect(serializedResponse).toEqual({
      id: 1,
      leagueId: 1,
      buyingClub: 1,
      owningClub: 47,
      player: newPlayer,
      offerType: "Transfer",
      created_at: 1628380800,
      offer: 23040000,
      status: "done",
      lastOffer: 24960000,
      accepted_at: "1636848000",
    });
  });
});
