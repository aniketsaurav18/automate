export * from "./jobSchema";
export * from "./workflowSchema";
import {z} from "zod"
import { WorkflowSchema } from "./workflowSchema";
import { HttpJobSchema, JobDataSchema, ScheduleSchema, WebhookJobSchema } from "./jobSchema";

export type WorkflowSchema = z.infer<typeof WorkflowSchema>
export type JobSchema = z.infer<typeof JobDataSchema>

// exporting all job data schema
export type HttpJobSchema = z.infer<typeof HttpJobSchema>
export type WebhookJobSchema = z.infer<typeof WebhookJobSchema>
export type ScheduleSchema = z.infer<typeof ScheduleSchema>