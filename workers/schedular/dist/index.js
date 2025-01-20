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
const kafkajs_1 = require("kafkajs");
const Broker = process.env.KAFKA_BROKER || "localhost:9092";
const GroupId = process.env.KAFKA_GROUP_ID || "my-group";
console.log(Broker);
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: [Broker],
});
const consumer = kafka.consumer({ groupId: GroupId });
const startConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield consumer.connect();
        console.log("Consumer connected");
        yield consumer.subscribe({
            topic: "create-execution",
            fromBeginning: true,
        });
        console.log("Subscribed to topic");
        yield consumer.run({
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
                console.log("Message recieved");
                console.log({
                    topic,
                    partition,
                    key: message.key ? message.key.toString() : "no key",
                    value: message.value ? message.value.toString() : "no value",
                });
            }),
        });
    }
    catch (error) {
        console.error("Error in Kafka consumer:", error);
    }
});
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Disconnecting Kafka consumer...");
        yield consumer.disconnect();
        console.log("Kafka consumer disconnected.");
    }
    catch (error) {
        console.error("Error during consumer disconnect:", error);
    }
    finally {
        process.exit();
    }
});
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
startConsumer();
