import fp from "fastify-plugin";
import kafkajs from "kafkajs";
import ObservabilityController from "../services/observability/controllers/ObservabilityController";
const streamPlugin = fp(async fastify => {
  let producer;

  try {
    const connection = new kafkajs.Kafka({
      clientId: "ps",
      brokers: ["glider-01.srvs.cloudkafka.com:9094", "glider-02.srvs.cloudkafka.com:9094", "glider-03.srvs.cloudkafka.com:9094"],
      ssl: true,
      sasl: {
        mechanism: "scram-sha-512",
        // scram-sha-256 or scram-sha-512
        username: "0adqcug9",
        password: "cNuFHNAKfMm9_-kmZiKBo576qjsGaTek"
      }
    });

    if (connection) {
      producer = connection.producer();
      await producer.connect();
      const consumer = connection.consumer({
        groupId: "1"
      });
      await consumer.connect();
      consumer.subscribe({
        topic: "0adqcug9-observability"
      }).then(() => {
        consumer.run({
          eachMessage: async ({
            message
          }) => {
            const formattedMessage = JSON.parse(message.value.toString()); // everything comes as a buffer

            switch (formattedMessage.type) {
              case "event":
                ObservabilityController.publishEvent(formattedMessage.payload);
                break;

              case "connection":
                ObservabilityController.publishConnection(formattedMessage.payload);
                break;

              case "newaccount":
                ObservabilityController.publishNewAccount(formattedMessage.payload);
                break;

              case "invitation":
                ObservabilityController.publishInvitation(formattedMessage.payload);
                break;

              default:
                console.log("unknown");
            }
          }
        });
      });
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
      topic: "0adqcug9-observability",
      // the topic created before
      messages: [//we send the message and the user who sent it
      {
        value: JSON.stringify({
          type,
          payload: msg
        })
      }]
    });
  });
});
export default streamPlugin;