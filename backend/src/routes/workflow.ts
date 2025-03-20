import { Router, Request, Response } from "express";
import {
  activateWorkflowController,
  createNewWorkflowController,
  createWorkflowController,
  deactivateWorkflowController,
  deleteWorkflwoController,
  getAllWorkflowDataController,
  getWorkflowDataController,
  updateWorkflowController,
} from "../controller/workflow/workflow";

const workflowRouter = Router();

workflowRouter.post("/new", createNewWorkflowController);

workflowRouter.get("/all", getAllWorkflowDataController);

workflowRouter.get("/:id", getWorkflowDataController);

workflowRouter.post("/:id", createWorkflowController);

workflowRouter.put("/:id", updateWorkflowController);

workflowRouter.delete("/:id", deleteWorkflwoController);

workflowRouter.put("/:id/activate", activateWorkflowController);

workflowRouter.put("/:id/deactivate", deactivateWorkflowController);

export default workflowRouter;
