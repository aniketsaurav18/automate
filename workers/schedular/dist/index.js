"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_cron_1 = __importDefault(require("node-cron"));
const producer_1 = require("./producer");
const db_1 = require("./db");
const schedular_1 = require("./schedular");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Checking db connection
        yield (0, db_1.checkDbConnection)();
        console.log("Database connected");
        // Initialize Kafka producer
        yield (0, producer_1.initializeKafka)();
        console.log("Kafka producer connected");
        // initilize the cron job
        node_cron_1.default.schedule("* * * * *", schedular_1.executionSchedularFn);
    }
    catch (error) {
        console.error("Application startup failed:", error);
        process.exit(1);
    }
}))();
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Disconnecting Kafka consumer...");
        yield producer_1.producer.disconnect();
        console.log("Kafka consumer disconnected.");
    }
    catch (error) {
        console.error("Error during producer disconnect:", error);
    }
    finally {
        process.exit();
    }
});
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
