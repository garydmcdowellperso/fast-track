import TransferRepository from "../../../../src/services/transfer/repositories/TransferRepository";
import TransferRepositoryInMemory from "../../../../src/services/transfer/interface_adapters/storage/TransferRepositoryInMemory";
import ClubRepository from "../../../../src/services/club/repositories/ClubRepository";
import ClubRepositoryInMemory from "../../../../src/services/club/interface_adapters/storage/ClubRepositoryInMemory";
import PlayerRepository from "../../../../src/services/player/repositories/PlayerRepository";
import PlayerRepositoryInMemory from "../../../../src/services/player/interface_adapters/storage/PlayerRepositoryInMemory";

import MakeOffer from "../../../../src/services/transfer/use_cases/MakeOffer";

// Fake repositories
const transferRepository = new TransferRepository(
  new TransferRepositoryInMemory()
);
const clubRepository = new ClubRepository(new ClubRepositoryInMemory());
const playerRepository = new PlayerRepository(new PlayerRepositoryInMemory());

import { club1, club2 } from "../../fixtures/clubs";
import { player1 } from "../../fixtures/players";

let storedClub1;
let storedClub2;
let storedPlayer1;
const initializePSDatabase = async () => {
  storedClub1 = await clubRepository.persist(club1);
  storedClub2 = await clubRepository.persist(club2);
  storedPlayer1 = await playerRepository.persist(player1);
};

const initializeTransfers = async () => {
  await transferRepository.removeAll();
};

describe("Transfer MakeOffer use cases", () => {
  beforeAll(async () => {
    await initializePSDatabase();
  });

  beforeEach(async () => {
    await initializeTransfers();
  });

  test("Can MakeOffer ok", async () => {
    const offer = await MakeOffer(
      1,
      storedClub1,
      storedClub2,
      storedPlayer1,
      "Transfer",
      200000,
      "1628287200",
      { transferRepository }
    );

    expect(offer).toEqual({
      id: offer.id,
      leagueId: 1,
      buyingClub: storedClub1,
      owningClub: storedClub2,
      player: storedPlayer1,
      offerType: "Transfer",
      created_at: "1628287200",
      offer: 200000,
      status: "open",
    });
  });

  test("Can MakeOffer nok - No leagueId", async () => {
    try {
      await MakeOffer(
        null,
        storedClub1,
        storedClub2,
        storedPlayer1,
        "Transfer",
        200000,
        "1628287200",
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No leagueId");
    }
  });

  test("Can MakeOffer nok - No buyingClub", async () => {
    try {
      await MakeOffer(
        1,
        null,
        storedClub2,
        storedPlayer1,
        "Transfer",
        200000,
        "1628287200",
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No buyingClub");
    }
  });

  test("Can MakeOffer nok - No created_at", async () => {
    try {
      await MakeOffer(
        1,
        storedClub1,
        storedClub2,
        storedPlayer1,
        "Transfer",
        200000,
        null,
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No created_at");
    }
  });

  test("Can MakeOffer nok - No owningClub", async () => {
    try {
      await MakeOffer(
        1,
        storedClub1,
        null,
        storedPlayer1,
        "Transfer",
        200000,
        "1628287200",
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No owningClub");
    }
  });

  test("Can MakeOffer nok - No player", async () => {
    try {
      await MakeOffer(
        1,
        storedClub1,
        storedClub2,
        null,
        "Transfer",
        200000,
        "1628287200",
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No player");
    }
  });

  test("Can MakeOffer nok - No offerType", async () => {
    try {
      await MakeOffer(
        1,
        storedClub1,
        storedClub2,
        storedPlayer1,
        null,
        200000,
        "1628287200",
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No offerType");
    }
  });

  test("Can MakeOffer nok - No offer", async () => {
    try {
      await MakeOffer(
        1,
        storedClub1,
        storedClub2,
        storedPlayer1,
        "Transfer",
        null,
        "1628287200",
        { transferRepository }
      );
    } catch (error) {
      expect(error.message).toBe("No offer");
    }
  });
});
