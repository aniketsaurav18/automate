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
Object.defineProperty(exports, "__esModule", { value: true });
exports.producer = exports.produceMessage = exports.initializeKafka = exports.PRODUCER_KEY = void 0;
const kafkajs_1 = require("kafkajs");
let producer;
exports.PRODUCER_KEY = "create-execution";
const Broker = process.env.KAFKA_BROKER || "localhost:9092";
const GroupId = process.env.KAFKA_GROUP_ID || "my-group";
const ClientId = process.env.KAFKA_CLIENT_ID || "my-app";
const initializeKafka = () => __awaiter(void 0, void 0, void 0, function* () {
    const kafka = new kafkajs_1.Kafka({
        clientId: ClientId,
        brokers: [Broker],
    });
    exports.producer = producer = kafka.producer();
    try {
        yield producer.connect();
        console.log("Kafka producer connected");
    }
    catch (error) {
        console.error("Failed to connect Kafka producer:", error);
        throw error;
    }
});
exports.initializeKafka = initializeKafka;
const produceMessage = (key, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield producer.send({
        topic: (_a = process.env.PRODUCER_CREATE_EXECUTION_TOPIC) !== null && _a !== void 0 ? _a : "topic",
        messages: [
            { key: key, value: message },
        ],
    });
});
exports.produceMessage = produceMessage;
