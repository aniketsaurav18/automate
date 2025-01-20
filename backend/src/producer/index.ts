import { Kafka, Producer } from "kafkajs";

let producer: Producer;

export const initializeKafka = async (): Promise<void> => {
  const kafka = new Kafka({
    clientId: process.env.PRODUCER_CREATE_EXECUTION_TOPIC,
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_HOST_PORT}`],
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

export const PRODUCER_KEY = "create-execution";

export { producer };
