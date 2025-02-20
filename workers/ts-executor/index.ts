import dotenv from "dotenv";
dotenv.config();
import { Kafka, EachMessagePayload } from "kafkajs";
import Execution from "./executors"; 
import ExecutionManager from "./execution-manager"; 
import { getAllJobDataformWorkflowId } from "./db/functions";

const CONSUMER_TOPIC = process.env.KAFKA_CONSUMER_TOPIC || "execution";
const MAX_CONCURRENT_EXECUTIONS = 5; // Max 5 executions at a time

const kafka = new Kafka({
  clientId: "example-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "example-group" });
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

        const workflowId = message.value?.toString();
        if (!workflowId) return;

        console.log(workflowId)
        return;

        // console.log(`Received Workflow ID: ${workflowId}`);

        // // Fetch job data for the workflow
        // const jobData = await getAllJobDataformWorkflowId(workflowId);
        // if (!jobData.length) {
        //   console.log(`No jobs found for Workflow ID: ${workflowId}`);
        //   return;
        // }

        // // Create a new execution
        // const execution = new Execution(workflowId);
        // execution.addJobs(jobData);

        // // Add execution to manager (runs in parallel with limit)
        // executionManager.addExecution(execution);
      },
    });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}

// Start consumer
runConsumer().catch((error) => console.error("Fatal Error:", error));
