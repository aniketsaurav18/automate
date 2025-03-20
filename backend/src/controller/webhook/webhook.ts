import { Request, Response } from "express";
import db from "../../db";
import { produceMessage } from "../../producer/producer";

export const triggerWorkflowByWebhookController = async (
  req: Request,
  res: Response
) => {
  const { workflowId } = req.params;
  const webhookData = req.body;

  try {
    // 0. Validate the request
    const trigger = db.trigger.findFirst({
      where: {
        workflow_id: workflowId,
        type: "webhook",
      },
    });
    if (!trigger) {
      res.status(400).json({ error: "Webhook trigger not found" });
      return;
    }
    // 1. Create a new execution in the database
    const execution = await db.execution.create({
      data: {
        workflow_id: workflowId,
        execution_time: new Date(),
        status: "pending",
        job_count: 0,
      },
    });

    // 2. Get all jobs for the given workflow ID
    const workflowJobs = await db.job.findMany({
      where: {
        workflow_id: workflowId,
      },
    });

    // 3. Update the execution entry with the correct job_count
    await db.execution.update({
      where: {
        id: execution.id,
      },
      data: {
        job_count: workflowJobs.length,
      },
    });

    // 4. Publish a message to Kafka to trigger the execution
    const message = {
      workflowId: workflowId,
      executionId: execution.id,
    };

    await produceMessage("create-execution", JSON.stringify(message));

    res.status(200).json({
      message: "Workflow triggered successfully",
      executionId: execution.id,
    });
  } catch (error) {
    console.error("Error triggering workflow:", error);
    res.status(500).json({ error: "Failed to trigger workflow" });
  }
};
