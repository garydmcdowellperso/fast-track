import TransferRepository from "../../../../src/services/transfer/repositories/TransferRepository";
import TransferRepositoryInMemory from "../../../../src/services/transfer/interface_adapters/storage/TransferRepositoryInMemory";
import ClubRepository from "../../../../src/services/club/repositories/ClubRepository";
import ClubRepositoryInMemory from "../../../../src/services/club/interface_adapters/storage/ClubRepositoryInMemory";
import PlayerRepository from "../../../../src/services/player/repositories/PlayerRepository";
import PlayerRepositoryInMemory from "../../../../src/services/player/interface_adapters/storage/PlayerRepositoryInMemory";

import MakeOffer from "../../../../src/services/transfer/use_cases/MakeOffer";
import FetchTransferByID from "../../../../src/services/transfer/use_cases/FetchTransferByID";

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

describe("Transfer FetchTransferByID use cases", () => {
  beforeAll(async () => {
    await initializePSDatabase();
  });

  beforeEach(async () => {
    await initializeTransfers();
  });

  test("Can FetchTransferByID ok", async () => {
    // First make an offer
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

    // Now reject it
    const fetchOffer = await FetchTransferByID(2, 1, { transferRepository });

    expect(fetchOffer).toEqual({
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

  test("Can FetchTransferByID nok - No id", async () => {
    try {
      await FetchTransferByID(null, 1, { transferRepository });
    } catch (error) {
      expect(error.message).toBe("No id");
    }
  });

  test("Can FetchTransferByID nok - No leagueId", async () => {
    try {
      await FetchTransferByID(2, null, { transferRepository });
    } catch (error) {
      expect(error.message).toBe("No leagueId");
    }
  });
});
