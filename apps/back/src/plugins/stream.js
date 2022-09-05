import fp from "fastify-plugin";
import kafkajs from "kafkajs";

import DORA4Controller from "../services/dora4/controllers/DORA4Controller";

const streamPlugin = fp(async (fastify) => {
  try {
    fastify.log.info("Connecting to kafka");
    const connection = new kafkajs.Kafka({
      clientId: "fasttrack",
      brokers: ["localhost:9092"],
    });

    const consumer = connection.consumer({ groupId: "back" });
    await consumer.connect();

    await consumer.subscribe({ topic: "jira" });
    await consumer.subscribe({ topic: "github" });
    await consumer.subscribe({ topic: "rollbar" });
    await consumer.subscribe({ topic: "gitlab" });

    consumer.run({
      eachMessage: async ({ topic, message }) => {
        const formattedMessage = JSON.parse(message.value.toString());
        switch (topic) {
          case "jira":
            console.log("Jira message received", formattedMessage);
            if (
              formattedMessage.webhookEvent === "jira:issue_updated" &&
              formattedMessage.changelog.items[0].toString === "In Progress"
            ) {
              await DORA4Controller.jiraWorkStarted(formattedMessage);
            }
            break;
          case "github":
            console.log("github message received", formattedMessage);

            if (formattedMessage.ref) {
              await DORA4Controller.githubPullRequest(formattedMessage);
              await fastify.publish("github_push", request.body);
            }
            if (formattedMessage.action === "opened") {
              await DORA4Controller.githubPush(formattedMessage);
            }
            break;
          case "rolbar":
            console.log("rollbar message received", formattedMessage);

            if (
              formattedMessage.event_type === "new_item" ||
              formattedMessage.event_type === "reactivated_item"
            ) {
              await DORA4Controller.recordRollBarError(inputs);
            }
            break;
          case "gitlab":
            console.log("gitlab message received", formattedMessage);

            if (formattedMessage.object_kind === "push") {
              await DORA4Controller.gitlabPush(formattedMessage);
            }
            if (formattedMessage.object_kind === "merge_request") {
              await DORA4Controller.gitlabMergeRequest(formattedMessage);
            }
            break;
          default:
            console.log("unknown, discarding");
            break;
        }
      },
    });
    /*
      consumer.run({
        eachMessage: async ({ message }) => {
          const formattedMessage = JSON.parse(message.value.toString());

          console.log("github message received", formattedMessage);

          if (formattedMessage.ref) {
            await DORA4Controller.githubPullRequest(formattedMessage);
            await fastify.publish("github_push", request.body);
          }
          if (formattedMessage.action === "opened") {
            await DORA4Controller.githubPush(formattedMessage);
          }
        },
      });
    });

    consumer.subscribe({ topic: "rollbar" }).then(() => {
      consumer.run({
        eachMessage: async ({ message }) => {
          const formattedMessage = JSON.parse(message.value.toString());

          console.log("rollbar message received", formattedMessage);

          if (
            formattedMessage.event_type === "new_item" ||
            formattedMessage.event_type === "reactivated_item"
          ) {
            await DORA4Controller.recordRollBarError(inputs);
          }
        },
      });
    });

    consumer.subscribe({ topic: "gitlab" }).then(() => {
      consumer.run({
        eachMessage: async ({ message }) => {
          const formattedMessage = JSON.parse(message.value.toString());

          console.log("gitlab message received", formattedMessage);

          if (formattedMessage.object_kind === "push") {
            await DORA4Controller.gitlabPush(inputs);
          }
          if (formattedMessage.object_kind === "merge_request") {
            await DORA4Controller.gitlabMergeRequest(inputs);
          }
        },
      });
    });
    */
  } catch (e) {
    console.log("error connecting to kafka", e);
  }
});

export default streamPlugin;
