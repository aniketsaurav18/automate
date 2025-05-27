import dotenv from "dotenv";
dotenv.config();
import { Kafka, EachMessagePayload } from "kafkajs";
import Execution from "./executors";
import ExecutionManager from "./execution-manager";
import { checkDbConnection, getAllJobDataformWorkflowId } from "./db/functions";

const CONSUMER_TOPIC = process.env.KAFKA_CONSUMER_TOPIC || "execution";
const MAX_CONCURRENT_EXECUTIONS = 5; // Max 5 executions at a time

const kafka = new Kafka({
  clientId: `${process.env.KAFKA_CLIENT_ID}`,
  brokers: [`${process.env.KAFKA_BROKERCONNECT}`],
});

const consumer = kafka.consumer({ groupId: `${process.env.KAFKA_GROUP_ID}` });
const executionManager = new ExecutionManager(MAX_CONCURRENT_EXECUTIONS); // Execution manager with 5 slots

async function runConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: CONSUMER_TOPIC, fromBeginning: true });

    console.log(`Subscribed to topic: ${CONSUMER_TOPIC}`);

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        if (!executionManager.hasAvailableSlots()) {
          console.log("Waiting for a free execution slot...");
          await executionManager.waitForSlot();
        }

        const data = message.value?.toString();
        if (!data) return;
        const workflowId = JSON.parse(data).workflowId;
        const executionId = JSON.parse(data).executionId;
        console.log(workflowId);
        console.log(executionId);

        // Fetch job data for the workflow
        const jobData = await getAllJobDataformWorkflowId(workflowId);
        if (!jobData.length) {
          console.log(`No jobs found for Workflow ID: ${workflowId}`);
          return;
        }

        // Create a new execution
        const execution = new Execution(executionId);
        execution.addJobs(jobData);

        // Add execution to manager (runs in parallel with limit)
        executionManager.addExecution(execution);
      },
    });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}

async function checkKafkaConnection() {
  const admin = kafka.admin();
  await admin.connect();
  await admin.listTopics();
  await admin.disconnect();
}

// Start consumer
async function main() {
  await checkDbConnection();
  console.log("Database connected successfully");
  await checkKafkaConnection();
  console.log("Kafka connected successfully");
  await runConsumer();
}

main().catch((error) => console.error("Fatal Error:", error));
