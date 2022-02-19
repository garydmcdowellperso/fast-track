import TransferRepository from "../../../../src/services/transfer/repositories/TransferRepository";
import TransferRepositoryInMemory from "../../../../src/services/transfer/interface_adapters/storage/TransferRepositoryInMemory";
import TransferHistoryRepository from "../../../../src/services/transfer/repositories/TransferHistoryRepository";
import TransferHistoryRepositoryInMemory from "../../../../src/services/transfer/interface_adapters/storage/TransferHistoryRepositoryInMemory";
import ClubRepository from "../../../../src/services/club/repositories/ClubRepository";
import ClubRepositoryInMemory from "../../../../src/services/club/interface_adapters/storage/ClubRepositoryInMemory";
import PlayerRepository from "../../../../src/services/player/repositories/PlayerRepository";
import PlayerRepositoryInMemory from "../../../../src/services/player/interface_adapters/storage/PlayerRepositoryInMemory";

import MakeOffer from "../../../../src/services/transfer/use_cases/MakeOffer";
import AcceptTransfer from "../../../../src/services/transfer/use_cases/AcceptTransfer";

// Fake repositories
const transferRepository = new TransferRepository(
  new TransferRepositoryInMemory()
);
const transferHistoryRepository = new TransferHistoryRepository(
  new TransferHistoryRepositoryInMemory()
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

describe("Transfer AcceptTransfer use cases", () => {
  beforeAll(async () => {
    await initializePSDatabase();
  });

  beforeEach(async () => {
    await initializeTransfers();
  });

  test("Can AcceptTransfer ok", async () => {
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

    // Now accept
    const acceptOffer = await AcceptTransfer(offer.id, 1, "1628287200", {
      transferRepository,
      transferHistoryRepository,
    });

    expect(acceptOffer).toEqual({
      id: offer.id,
      leagueId: 1,
      buyingClub: storedClub1,
      owningClub: storedClub2,
      player: storedPlayer1,
      offerType: "Transfer",
      created_at: "1628287200",
      offer: 200000,
      status: "done",
      accepted_at: "1628287200",
    });
  });

  test("Can MakeOffer nok - No transferId", async () => {
    try {
      await AcceptTransfer(null, 1, "1628287200", {
        transferRepository,
        transferHistoryRepository,
      });
    } catch (error) {
      expect(error.message).toBe("No transferId");
    }
  });

  test("Can MakeOffer nok - No leagueId", async () => {
    try {
      await AcceptTransfer(2, null, "1628287200", {
        transferRepository,
        transferHistoryRepository,
      });
    } catch (error) {
      expect(error.message).toBe("No leagueId");
    }
  });

  test("Can MakeOffer nok - No accepted_at", async () => {
    try {
      await AcceptTransfer(2, 1, null, {
        transferRepository,
        transferHistoryRepository,
      });
    } catch (error) {
      expect(error.message).toBe("No accepted_at");
    }
  });

  test("Can MakeOffer nok - No transfer", async () => {
    try {
      await AcceptTransfer(2, 1, "1628287200", {
        transferRepository,
        transferHistoryRepository,
      });
    } catch (error) {
      expect(error.message).toBe("No transfer");
    }
  });
});
