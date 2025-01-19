import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import db from "./db";
import morgan from "morgan";

import authRouter from "./routes/auth";
import workflowRouter from "./routes/workflow";
import { isAuthenticated } from "./middleware/isAuthenticated";
import { initializeKafka, producer } from "./producer";

const app: Express = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

// Routes
app.use("/auth", authRouter);
app.use("/api/workflow", isAuthenticated, workflowRouter);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Initialize database connection
    await db.$connect();
    console.log("Database connected");

    // Initialize Kafka producer
    await initializeKafka();
    console.log("Kafka producer connected");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  try {
    if (producer) await producer.disconnect();
    await db.$disconnect();
    console.log("All connections closed");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  try {
    if (producer) await producer.disconnect();
    await db.$disconnect();
    console.log("All connections closed");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
});
