const kafkajs = require("kafkajs");

(async () => {
  try {
    const kafka = new kafkajs.Kafka({
      clientId: "chat-app",
      brokers: ["163.172.182.203:9092"],
    });

    const consumer = kafka.consumer({ groupId: "2" }); // we need a unique groupId I'll explain down

    consumer.connect().then(() =>
      consumer.subscribe({ topic: "observability" }).then(() =>
        consumer.run({
          eachMessage: async ({ message }) => {
            const formattedValue = JSON.parse(message.value.toString()); // everything comes as a buffer
            console.log("Hello", formattedValue);
          },
        })
      )
    );
  } catch (e) {
    // Deal with the fact the chain failed
    console.log("error", e);
  }
})();
