import { Workflow } from "@prisma/client";
import db from "../db";

const convertTimetoUTC = (time: Date, timezoneOffset: string): Date => {
  try {
    const match = timezoneOffset.match(/([+-])(\d{2}):(\d{2})/);
    if (!match) throw new Error("Invalid timezone offset format.");

    const [sign, hours, minutes] = match.slice(1);
    const offsetMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const offsetInMilliseconds = offsetMinutes * 60 * 1000;

    return sign === "+"
      ? new Date(time.getTime() - offsetInMilliseconds)
      : new Date(time.getTime() + offsetInMilliseconds);
  } catch (error) {
    console.error("Error in convertTimetoUTC:", error);
    throw new Error(
      "Failed to convert time to UTC. Check timezone offset or time format."
    );
  }
};

const getIntervalNextExecutionTime = (
  intervalUnit: string,
  intervalValue: number
): Date => {
  try {
    const currentTime = new Date();
    let fixedTime: Date;

    switch (intervalUnit) {
      case "min":
        fixedTime = new Date(currentTime.getTime() + intervalValue * 60 * 1000);
        break;
      case "hour":
        fixedTime = new Date(
          currentTime.getTime() + intervalValue * 60 * 60 * 1000
        );
        break;
      case "day":
        fixedTime = new Date(
          currentTime.getTime() + intervalValue * 24 * 60 * 60 * 1000
        );
        break;
      case "week":
        fixedTime = new Date(
          currentTime.getTime() + intervalValue * 7 * 24 * 60 * 60 * 1000
        );
        break;
      case "month":
        // Approximating a month as 30 days
        fixedTime = new Date(
          currentTime.getTime() + intervalValue * 30 * 24 * 60 * 60 * 1000
        );
        break;
      default:
        throw new Error(`Invalid interval unit: ${intervalUnit}`);
    }
    return fixedTime;
  } catch (error) {
    console.error("Error in getIntervalNextExecutionTime:", error);
    throw new Error(
      "Failed to calculate the next execution time for the interval."
    );
  }
};

const handleCreateExecution = async (workflowId: string, fixedTime: Date) => {
  try {
    await db.$transaction(async (prisma) => {
      await prisma.execution.create({
        data: {
          workflow_id: workflowId,
          execution_time: fixedTime,
          status: "pending",
        },
      });
      await prisma.workflow.update({
        where: { id: workflowId },
        data: { next_execution: fixedTime },
      });
    });
  } catch (error) {
    console.error(
      "Error in handleCreateExecution for workflow ID:",
      workflowId,
      error
    );
    throw new Error("Failed to create execution for the workflow.");
  }
};

export const HandleScheduleNextExecution = async (workflow: Workflow) => {
  try {
    const trigger = await db.trigger.findFirst({
      where: { workflow_id: workflow.id },
    });

    if (!trigger) {
      console.error(`Trigger not found for workflow ID: ${workflow.id}`);
      throw new Error(`Trigger not found for workflow ID: ${workflow.id}`);
    }

    if (trigger.type === "webhook") {
      console.log(`Skipping webhook trigger for workflow ID: ${workflow.id}`);
      return false; // No further processing needed for webhook triggers
    }

    if (trigger.type === "fixed" && trigger.fixed_time && trigger.timezone) {
      const fixedTime = convertTimetoUTC(
        new Date(trigger.fixed_time),
        trigger.timezone
      );
      await handleCreateExecution(workflow.id, fixedTime);
    } else if (
      trigger.type === "interval" &&
      trigger.interval_type &&
      typeof trigger.interval_unit === "number"
    ) {
      const fixedTime = getIntervalNextExecutionTime(
        trigger.interval_type,
        trigger.interval_unit
      );
      await handleCreateExecution(workflow.id, fixedTime);
    } else {
      console.error(
        "Invalid trigger configuration for workflow ID:",
        workflow.id
      );
      throw new Error("Invalid trigger configuration.");
    }
  } catch (error) {
    console.error(
      "Error handling schedule next execution for workflow ID:",
      workflow.id,
      error
    );
    throw new Error(
      `Failed to handle the next execution for workflow ID: ${workflow.id}`
    );
  }
};
