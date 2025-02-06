import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";

import { initializeKafka, producer } from "./producer";
import { checkDbConnection } from "./db";
import { executionSchedularFn } from "./schedular";

(async () => {
  try {
    // Checking db connection
    await checkDbConnection();
    console.log("Database connected");

    // Initialize Kafka producer
    await initializeKafka();
    console.log("Kafka producer connected");

    executionSchedularFn();

    // initilize the cron job
    cron.schedule("* * * * *", executionSchedularFn);
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
})();

const gracefulShutdown = async () => {
  try {
    console.log("Disconnecting Kafka consumer...");
    await producer.disconnect();
    console.log("Kafka consumer disconnected.");
  } catch (error) {
    console.error("Error during producer disconnect:", error);
  } finally {
    process.exit();
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
