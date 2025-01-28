import { AxiosRequestConfig } from "axios";
import { HttpJobSchema } from "../../../backend/src/schema";
import { executeHttpRequest } from "./common";

// Function to execute an HTTP job
async function executeHttpJob(job: HttpJobSchema) {
  const { input } = job;

  try {
    // Build URL and add parameters
    const url = new URL(input.url);
    Object.entries(input.parameters).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });

    const config: AxiosRequestConfig = {
      method: input.method,
      url: url.toString(),
      headers: input.headers,
      data: ["POST", "PUT", "PATCH"].includes(input.method) ? input.body : undefined,
    };

    const response = await executeHttpRequest(config);

    const result = {
      statusCode: response.status,
      headers: response.headers,
      body: typeof response.data === "string" ? response.data : JSON.stringify(response.data),
    };

    return {
      key: job.key,
      output: result,
    };
  } catch (error: any) {
    return {
      key: job.key,
      output: {
        statusCode: error.response?.status || 500,
        headers: error.response?.headers || {},
        body: error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message || "Unknown error occurred",
      },
    };
  }
}
