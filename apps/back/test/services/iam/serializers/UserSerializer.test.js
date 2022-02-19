import UserSerializer from "../../../../src/services/iam/serializers/UserSerializer";

import { user1 } from "../../fixtures/users";

let userSerializer;

describe("User serializers", () => {
  beforeEach(async () => {
    userSerializer = new UserSerializer();
  });

  test("Can Serialize a user ok", async () => {
    const newUser = { ...user1 };
    newUser.id = 1;

    const serializedResponse = userSerializer.serialize(newUser);

    expect(serializedResponse).toEqual(newUser);
  });
});
