import { Router, Request, Response } from "express";
import { triggerWorkflowByWebhookController } from "../controller/webhook/webhook";

const webhookRouter = Router();

webhookRouter.post("trigger/:workflowId", triggerWorkflowByWebhookController);

export default webhookRouter;
