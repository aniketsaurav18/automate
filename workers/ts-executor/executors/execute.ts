import { executeHttpJob } from "./http-executor";
import { JobDBSchema } from "../../../backend/src/schema";

export const exeuteJob = (job: JobDBSchema) => {
  const jobType = job.app;

  switch (jobType) {
    case "http":
      return executeHttpJob(job.data as any);
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
    default:
      throw new Error(`Unsupported job type: ${jobType}`);
  }
};
