import fp from "fastify-plugin";

const appPlugin = fp(async (fastify) => {
  let health;
  fastify.decorate("getHealth", async () => health);

  fastify.decorate("setHealth", async (_health) => {
    health = _health;
  });
});

export default appPlugin;
