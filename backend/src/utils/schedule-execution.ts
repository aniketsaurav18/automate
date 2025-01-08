import { Workflow } from "@prisma/client";
import db from "../db";

const convertTimetoUTC = (time: Date, timezoneOffset: string): Date => {
  try {
    const [sign, hours, minutes] = timezoneOffset
      .match(/([+-])(\d{2}):(\d{2})/)!
      .slice(1);
    const offsetMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const offsetInMilliseconds = offsetMinutes * 60 * 1000;
    return sign === "+"
      ? new Date(time.getTime() - offsetInMilliseconds)
      : new Date(time.getTime() + offsetInMilliseconds);
  } catch (error) {
    console.error("Error converting time to UTC:", error);
    throw new Error("Invalid timezone offset or time format.");
  }
};

export const HandleScheduleNextExecution = async (workflow: Workflow) => {
  try {
    const trigger = await db.trigger.findFirst({
      where: { workflow_id: workflow.id },
    });

    if (!trigger) {
      throw new Error(`Trigger not found for workflow ID: ${workflow.id}`);
    }

    if (trigger.webhook) {
      return false; // No need to process if it's a webhook trigger
    }

    if (trigger.fixed_time && trigger.timezone) {
      try {
        const fixedTime = convertTimetoUTC(
          new Date(trigger.fixed_time),
          trigger.timezone
        );
        await db.workflow.update({
          where: { id: workflow.id },
          data: { next_execution: fixedTime },
        });
      } catch (error) {
        console.error(
          "Error processing fixed time for workflow ID:",
          workflow.id,
          error
        );
        throw new Error("Error processing fixed time for the next execution.");
      }
    }
  } catch (error) {
    console.error(
      "Error handling schedule next execution for workflow ID:",
      workflow.id,
      error
    );
    throw new Error("Error handling schedule next execution.");
  }
};
