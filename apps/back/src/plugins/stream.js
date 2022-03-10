import fp from "fastify-plugin";
import kafkajs from "kafkajs";

const streamPlugin = fp(async (fastify) => {
  let producer;
  try {
    fastify.log.info("Connecting to kafka");
    const connection = new kafkajs.Kafka({
      clientId: "fasttrack",
      brokers: ["localhost:9092"],
    });

    if (connection) {
      producer = connection.producer();

      await producer.connect();
      fastify.log.info("Producer connected");
    }
  } catch (e) {
    console.log("error connecting to kafka", e);
  }

  fastify.decorate("publish", async (type, msg) => {
    if (!producer) {
      // Swallow message
      return;
    }

    return producer.send({
      topic: "fast-track", // the topic created before
      messages: [
        //we send the message and the user who sent it
        { value: JSON.stringify({ type, payload: msg }) },
      ],
    });
  });
});

export default streamPlugin;
