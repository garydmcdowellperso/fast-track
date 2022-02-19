import UserRepository from "../../../../src/services/iam/repositories/UserRepository";
import UserRepositoryInMemory from "../../../../src/services/iam/interface_adapters/storage/UserRepositoryInMemory";
import CreateOrLogin from "../../../../src/services/iam/use_cases/CreateOrLogin";

import AccessTokenManager from "../../../../src/services/iam/security/AccessTokenManager";
import JwtAccessTokenManager from "../../../../src/services/iam/interface_adapters/security/JwtAccessTokenManager";

const accessTokenManager = new AccessTokenManager(new JwtAccessTokenManager());
const userRepository = new UserRepository(new UserRepositoryInMemory());

describe("Iam use cases", () => {
  test("Can CreateOrLogin ok", async () => {
    const firstName = "A";
    const lastName = "Test";
    const email = "A.Test@gmail.com";
    const password = "2345678";

    const token = await CreateOrLogin(firstName, lastName, email, password, {
      userRepository,
      accessTokenManager,
    });

    expect(token).toBeDefined();
  });
});
