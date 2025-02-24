import {
  ChevronsLeftRightEllipsis,
  Webhook,
  CalendarCheck,
  Mail,
} from "lucide-react";
import { HttpForm } from "@/jobs/http/HttpConfigForm";
import { ScheduleConfig } from "@/jobs/schedule/scheduleConfig";
import { WebhookJobConfiguration } from "./webhook/WebHookConfig";
import { createElement } from "react";
import { EmailComposer } from "./email/EmailConfiguration";
import { JobDataType } from "@/types";

export type SupportedAppsType = Pick<JobDataType, "key">;

export interface JobConfigType {
  id: number;
  app: SupportedAppsType["key"];
  name: string;
  description: string;
  icon: (className?: string) => JSX.Element;
  configForm: React.ComponentType<any>;
  trigger: boolean;
}

export const JobCongiguration: JobConfigType[] = [
  {
    id: 1,
    app: "http",
    name: "HTTP",
    description: "Send an HTTP request to a URL",
    icon: (className?: string) =>
      createElement(ChevronsLeftRightEllipsis, {
        className: className ? className : "w-4 h-4",
      }),
    configForm: HttpForm,
    trigger: false,
  },
  {
    id: 2,
    app: "webhook",
    name: "Webhook",
    description: "Create a webhook as a trigger",
    icon: (className?: string) =>
      createElement(Webhook, { className: className }),
    configForm: WebhookJobConfiguration,
    trigger: true,
  },
  {
    id: 3,
    app: "schedule",
    name: "Schedule",
    description: "Schedule a job to run at a specific time",
    icon: (className?: string) =>
      createElement(CalendarCheck, { className: className }),
    configForm: ScheduleConfig,
    trigger: true,
  },
  {
    id: 4,
    app: "email",
    name: "Email",
    description: "Send a e-mail through our email service.",
    icon: (className?: string) => createElement(Mail, { className: className }),
    configForm: EmailComposer,
    trigger: false,
  },
];

// export interface Schedule {
//   type: "fixed" | "interval";
//   fixedTime?: {
//     dateTime: string; // ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss±hh:mm
//   };
//   interval?: {
//     unit: "minute" | "hour" | "day" | "week" | "month";
//     value: number;
//   };
// }

// type HttpMethods =
//   | "GET"
//   | "POST"
//   | "PUT"
//   | "PATCH"
//   | "DELETE"
//   | "OPTIONS"
//   | "HEAD";

// export interface HttpJob {
//   key: "http";
//   input: {
//     url: string;
//     method: HttpMethods;
//     headers: Record<string, string>;
//     parameters: Record<string, string>;
//     body: string;
//   };
//   output?: {
//     statusCode: number;
//     headers: Record<string, string>;
//     body: string;
//   };
// }

// export interface WebhookJob {
//   key: "webhook";
//   input: {
//     webhookUrl: string;
//   };
//   output?: Array<{
//     data: string;
//     type: "json" | "string" | "number" | "boolean";
//   }>;
// }

// export interface ScheduleJob {
//   key: "schedule";
//   schedule: Schedule;
// }

// export type JobData = HttpJob | WebhookJob | ScheduleJob;

// export interface Job {
//   workflowId: string;
//   type: "trigger" | "action";
//   step: number;
//   name: string;
//   descripton?: string;
//   app: "http" | "webhook" | "schedule";
//   data: JobData;
// }

// export interface TypeWorkFlow {
//   workflowId: string;
//   name: string;
//   jobs: Job[];
// }
