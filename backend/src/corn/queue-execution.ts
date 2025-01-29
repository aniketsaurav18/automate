import { producer } from "../producer";
import db from "../db";

const kafkaKey = process.env.KAFKA_PRODUCER_KEY ?? "backend-service";
const kafkaTopic = process.env.PRODUCER_CREATE_EXECUTION_TOPIC ?? "topic";

export async function queueExecution() {
  try {
    const executions = await db.execution.findMany({
      where: {
        execution_time: {
          gte: new Date(),
        },
        status: "pending",
      },
    });
    const executionIds = executions.map((e) => {
      return {
        key: kafkaKey,
        value: e.id,
      };
    });
    producer.send({
      topic: kafkaTopic,
      messages: executionIds,
    });
  } catch (e) {
    console.error(e);
  }
}
