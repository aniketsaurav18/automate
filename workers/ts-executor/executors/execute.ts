import { HttpExecutor } from "./http-executor";
import { JobDBSchema } from "../../../backend/src/schema";
import { EmailExecutors } from "./email-executor";

export const exeuteJob = (job: JobDBSchema) => {
  const jobType = job.app;

  switch (jobType) {
    case "webhook":
      return {
        key: "webhook",
        success: true,
        result: "Webhook got triggered successfully.",
      };
    case "schedule":
      return {
        key: "schedule",
        success: true,
        result: "workflow got triggered successfully.",
      };
    case "email":
      return EmailExecutors(job.data as any);
    case "http":
      return HttpExecutor(job.data as any);
    default:
      throw new Error(`Unsupported job type: ${jobType}`);
  }
};
