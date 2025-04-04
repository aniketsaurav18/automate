export * from "./jobSchema";
export * from "./workflowSchema";
import { Job } from "@prisma/client";
import { z } from "zod";
import { WorkflowSchema } from "./workflowSchema";
import {
  EmailJobSchema,
  HttpJobSchema,
  JobDataSchema,
  ScheduleSchema,
  WebhookJobSchema,
} from "./jobSchema";

export type WorkflowSchema = z.infer<typeof WorkflowSchema>;
export type JobSchema = z.infer<typeof JobDataSchema>;
export type JobDBSchema = Job;

// exporting all job data schema
export type HttpJobSchema = z.infer<typeof HttpJobSchema>;
export type WebhookJobSchema = z.infer<typeof WebhookJobSchema>;
export type ScheduleSchema = z.infer<typeof ScheduleSchema>;
export type EmailJobSchemaType = z.infer<typeof EmailJobSchema>;
