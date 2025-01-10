import { Request, Response } from "express";
import db from "../../db";
import { Job } from "@prisma/client";
import {
  JobCreateDataType,
  WorkflowCreateSchema,
  WorkflowResponseSchema,
} from "./schema";
import { z } from "zod";
import { WorkflowResponseType } from "../../types";
import { HandleScheduleNextExecution } from "../../utils/schedule-execution";
import { createTriggerforWorkflow } from "./helper";

// Controller function for creating a new workflow
export const createNewWorkflowController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Invalid request.",
    });
  }
  try {
    const data = await db.workflow.create({
      data: {
        owner_id: userId as string,
        name: "Untitled Workflow",
      },
      include: {
        jobs: true,
      },
    });

    const safeData = WorkflowCreateSchema.parse(data);

    res.status(200).json({
      success: true,
      message: "Workflow created",
      data: safeData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Failed to create workflow",
    });
  }
};

/*
 *
 * batch job save inside a workflow.
 * POST /workflow/:id
 */
export const createWorkflowController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedBody = WorkflowCreateSchema.parse(req.body);

    const userId = req.user?.id;
    const id = req.params.id;
    const { name, description, jobs } = parsedBody;

    const result = await db.$transaction(async (prisma) => {
      const dbWorkflow = await prisma.workflow.findFirst({
        where: {
          id: id,
          owner_id: userId,
        },
      });

      if (!dbWorkflow) {
        throw new Error("Workflow does not exist.");
      }

      let updatedWorkflow = dbWorkflow;

      if (name !== dbWorkflow.name || description !== dbWorkflow.description) {
        updatedWorkflow = await prisma.workflow.update({
          where: { id: id },
          data: {
            name: name,
            description: description,
          },
        });
      }

      // Create new jobs associated with the workflow
      if (jobs) {
        await prisma.job.createMany({
          data: jobs.map((job: JobCreateDataType) => ({
            ...job,
            workflow_id: dbWorkflow.id,
          })),
        });
      }
      
      await createTriggerforWorkflow(jobs[0], prisma)
      // Return the updated workflow with jobs
      return prisma.workflow.findFirst({
        where: { id: id, owner_id: userId },
        include: { jobs: true },
      });
    });

    const safeData = WorkflowCreateSchema.parse(result);

    res.status(201).json({
      success: true,
      message: "Workflow and jobs created successfully.",
      data: safeData,
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      // Zod validation error
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: e.errors,
      });
    } else if (e.message === "Workflow does not exist.") {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    } else {
      console.error(e);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  }
};


/*
* Get all workflows without the job data.
* GET /all
*/
export const getAllWorkflowDataController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const query = req.query;
    if (!userId) {
      res.status(403).json({ message: "Unauthorized request", success: false });
      return;
    }
    const skip = query.skip ? parseInt(query.skip as string, 10) : null;
    const take = query.take ? parseInt(query.take as string, 10) : null;

    console.log(skip, take);

    const data = await db.workflow.findMany({
      where: {
        owner_id: userId,
      },
      ...(skip != null && { skip }),
      ...(take != null && { take }),
      orderBy: {
        updated_at: "desc",
      },
      include: {
        jobs: true,
      },
    });

    const safeParseData: WorkflowResponseType[] = [];

    for (const d of data) {
      let p = WorkflowResponseSchema.parse(d);
      safeParseData.push(p);
    }

    console.log(safeParseData);

    res.status(200).json({
      success: true,
      data: safeParseData,
    });
    
    return;
  } catch (err: any) {
    console.error("Error fetching workflows:", err.message || err);
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred while fetching workflows.",
    });
  }
};

// workflow/:id
export const getWorkflowDataController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userid = req.user?.id;
  const workflowId = req.params.id;
  try {
    const data = await db.workflow.findFirst({
      where: {
        owner_id: userid,
        id: workflowId,
      },
      include: {
        jobs: true,
      },
    });
    if (!data) {
      res.status(404).json({
        success: false,
        message: "Resources not found.",
      });
      return;
    }
    const safeData = WorkflowResponseSchema.parse(data);
    console.log(safeData);
    res.status(200).json({
      success: true,
      data: safeData,
    });
    return;
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "An unexpected error has occured.",
    });
  }
};

// PUT /api/workflow/:id
export const updateWorkflowController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  const userId = req.user?.id;

  console.log(req.body);

  if (!userId) {
    res.status(403).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    console.log(req.body.jobs[0].data);
    console.log(req.body.jobs[1].data);
    const parsedBody = WorkflowCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      console.log(parsedBody.error.issues[0]);
      return;
    }
    const { name, description, jobs } = parsedBody.data;
    const data = await db.$transaction(async (prisma) => {
      // Update Workflow
      const workflow = await prisma.workflow.update({
        where: {
          id: id,
          owner_id: userId,
        },
        data: {
          name: name,
          description: description,
          updated_at: new Date(),
        },
        include: {
          jobs: true,
        },
      });

      // Handle job upsert and deletion
      let updatedJobs: Job[] = [];

      if (Array.isArray(jobs)) {
        for (const job of jobs) {
          const jobData = await prisma.job.upsert({
            where: {
              id: job.id,
            },
            create: {
              workflow_id: id,
              name: job.name,
              description: job.description,
              app: job.app,
              type: job.type,
              step_no: job.step_no,
              data: job.data,
              created_at: new Date(),
              updated_at: new Date(),
            },
            update: {
              name: job.name,
              description: job.description,
              step_no: job.step_no,
              app: job.app,
              type: job.type,
              data: job.data,
              updated_at: new Date(),
            },
          });
          updatedJobs.push(jobData);
        }
      }

      // Delete jobs that are not included in the request
      const incomingJobIds = updatedJobs
        .map((job: Job) => job.id)
        .filter(Boolean);
      await prisma.job.deleteMany({
        where: {
          workflow_id: id,
          id: { notIn: incomingJobIds },
        },
      });

      return prisma.workflow.findFirst({
        where: { id: id, owner_id: userId },
        include: { jobs: true },
      });
    });

    const safeData = WorkflowResponseSchema.parse(data);

    res.status(200).json({
      success: true,
      data: safeData,
    });
    return;
  } catch (err: any) {
    console.error("Error updating workflow:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating workflow." });
    return;
  }
};

// PUT /:id/activate
export const activateWorkflowController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const workflowId = req.params.id;
  try {
    const workflow = db.workflow.findFirst({
      where: {
        id: workflowId,
        owner_id: userId,
      },
    });
    if (!workflow) {
      res.status(404).json({
        success: false,
        message: "No workflow found.",
      });
      return;
    }
    const data = db.workflow.update({
      where: {
        id: workflowId,
        owner_id: userId,
      },
      data: {
        active: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: workflowId,
        active: (await data).active,
      },
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Unexpected Error has happened.",
    });
    return;
  }
};

// PUT /:id/deactivate
export const deactivateWorkflowController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const workflowId = req.params.id;
  try {
    const workflow = db.workflow.findFirst({
      where: {
        id: workflowId,
        owner_id: userId,
      },
    });
    if (!workflow) {
      res.status(404).json({
        success: false,
        message: "No workflow found.",
      });
      return;
    }
    const data = db.workflow.update({
      where: {
        id: workflowId,
        owner_id: userId,
      },
      data: {
        active: false,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: workflowId,
        active: (await data).active,
      },
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Unexpected Error has happened.",
    });
    return;
  }
};
