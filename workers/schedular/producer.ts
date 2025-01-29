import { Kafka, Producer } from "kafkajs";

let producer: Producer;

export const PRODUCER_KEY = "create-execution";
const Broker = process.env.KAFKA_BROKER || "localhost:9092";
const GroupId = process.env.KAFKA_GROUP_ID || "my-group";
const ClientId = process.env.KAFKA_CLIENT_ID || "my-app";

export const initializeKafka = async (): Promise<void> => {
  const kafka = new Kafka({
    clientId: ClientId,
    brokers: [Broker],
  });

  producer = kafka.producer();

  try {
    await producer.connect();
    console.log("Kafka producer connected");
  } catch (error) {
    console.error("Failed to connect Kafka producer:", error);
    throw error;
  }
};

export const produceMessage = async (key: string, message: string) => {
  await producer.send({
    topic: process.env.PRODUCER_CREATE_EXECUTION_TOPIC ?? "topic",
    messages: [{ key: key, value: message }],
  });
};

export { producer };
