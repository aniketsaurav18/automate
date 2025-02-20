const { Kafka } = require("kafkajs");

const ClientId = "my-app";
const Broker = process.env.KAFKA_BROKER || "localhost:9092";

const kafka = new Kafka({
  clientId: ClientId,
  brokers: [Broker],
});

let producer;
const message = JSON.stringify({ executionId: "0a844c2c-95c2-41d3-9f06-b4a5d807a93a", workflowId: "cm6xxo0gi0007iu46h3393k8l" });

async function produceDummyMessage() {
  try {
    // Create producer instance
    producer = kafka.producer();
    await producer.connect();
    console.log("Producer connected");
    await producer.send({
      topic: "execution",
      messages: [{ key: "keyyi", value: message }],
    });

    console.log("Message sent");
  } catch (error) {
    console.error("Error producing message:", error);
  } finally {
    // Always disconnect the producer once you're done
    await producer.disconnect();
    console.log("Producer disconnected");
  }
}

produceDummyMessage();

