import { BaseScheduleSchema } from "../../schema";
import { JobCreateDataType } from "./schema";
import { IntervalType, Job, Prisma } from "@prisma/client";

const handleWebhookTriggerCreation = async (
  workflowId: string,
  prisma: Prisma.TransactionClient
) => {
  await prisma.trigger.upsert({
    where: {
      workflow_id: workflowId,
    },
    create: {
      type: "webhook",
      workflow_id: workflowId,
    },
    update: {
      type: "webhook",
      workflow_id: workflowId,
    },
  });
};

const handleScheduledTriggerCreating = async (
  job: Job,
  prisma: Prisma.TransactionClient
) => {
  const scheduleData = BaseScheduleSchema.safeParse(job.data);

  if (!scheduleData.success) {
    throw new Error("Invalid schedule data");
  }

  const { type, fixedTime, interval } = scheduleData.data;

  if (type === "fixed") {
    await prisma.trigger.create({
      data: {
        type: "fixed",
        fixed_time: fixedTime?.dateTime,
        timezone: fixedTime?.timeZoneOffset,
        workflow_id: job.workflow_id,
      },
    });
  } else if (type === "interval") {
    await prisma.trigger.upsert({
      where: {
        workflow_id: job.workflow_id,
      },
      create: {
        type: "interval",
        workflow_id: job.workflow_id,
        interval_type: interval?.unit as IntervalType,
        interval_unit: interval?.value,
      },
      update: {
        type: "interval",
        workflow_id: job.workflow_id,
        interval_type: interval?.unit as IntervalType,
        interval_unit: interval?.value,
      },
    });
  }
};

export const createTriggerForWorkflow = async (
  job: JobCreateDataType,
  prisma: Prisma.TransactionClient
) => {
  const triggerJob = await prisma.job.findFirst({
    where: {
      workflow_id: job.workflow_id,
      step_no: 1,
    },
  });
  console.log("triggerJob", triggerJob);
  if (!triggerJob) {
    throw new Error("Trigger job not found.");
  }

  if (triggerJob.app === "webhook") {
    await handleWebhookTriggerCreation(triggerJob.workflow_id, prisma);
  } else if (triggerJob.app === "schedule") {
    await handleScheduledTriggerCreating(triggerJob, prisma);
  } else {
    throw new Error("Unsupported trigger type");
  }
};
