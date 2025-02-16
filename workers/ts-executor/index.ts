import dotenv from "dotenv";
dotenv.config();
import { Kafka, EachMessagePayload } from "kafkajs";
import { getAllJobDataformWorkflowId } from "./db";

const CONSUMER_TOPIC =
  (process.env.KAFKA_CONSUMER_TOPIC as string) || "execution";

// Kafka configuration
const kafka = new Kafka({
  clientId: "example-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "example-group" });

async function runConsumer() {
  try {
    await consumer.connect();

    await consumer.subscribe({ topic: CONSUMER_TOPIC, fromBeginning: true });
    console.log(`Subscribed to topic: ${CONSUMER_TOPIC}`);

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const key = message.key?.toString();
        const value = message.value?.toString();
        const headers = message.headers;

        console.log(`\n--- Message Received ---`);
        console.log(`Topic: ${topic}`);
        console.log(`Partition: ${partition}`);
        console.log(`Key: ${key}`);
        console.log(`Value: ${value}`);
        console.log(`Headers: ${JSON.stringify(headers)}`);
      },
    });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}

//Start the consumer
runConsumer().catch((error) => console.error("Fatal Error:", error));

// console.log(getAllJobDataformWorkflowId("cm6nwwvgz0003iuqr8c634bfc"));
