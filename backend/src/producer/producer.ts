import { producer } from "./index";

export const produceMessage = async (key: string, message: string) => {
    await producer.send({
        topic: process.env.PRODUCER_CREATE_EXECUTION_TOPIC ?? "topic",
        messages: [
            { key: key, value: message },
        ],
    })
};
