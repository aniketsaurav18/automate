import { exeuteJob } from "./execute";
import { JobDBSchema } from "../../../backend/src/schema";
import { markExecutionFailed, updateJobResult } from "../db/functions";

const MAX_RETRIES_PER_JOB = 3;
const RETRY_DELAY_MS = 1000; // 1 second delay between retries

class Execution {
  //   private workflowId: string;
  private executionId: string;
  private queue: JobDBSchema[] = [];
  private isProcessing: boolean = false;
  private status: "running" | "completed" | "failed" = "running";
  private currentJobIndex = 0;
  private currentJobRetries = 0;

  constructor(executionId: string) {
    this.executionId = executionId;
  }

  public addJob(job: JobDBSchema): void {
    this.queue.push(job);
    this.processQueue();
  }

  public addJobs(jobs: JobDBSchema[]): void {
    this.queue.push(...jobs);
    this.processQueue();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && this.status === "running") {
      const job = this.queue[0];
      try {
        const result = await exeuteJob(job);

        if (result?.success === true) {
          const res = {
            step_no: job.step_no,
            ...result,
          };

          const jobResult = await updateJobResult(this.executionId, res);

          if (jobResult.completed) {
            this.isProcessing = false;
            this.status = "completed";
            break;
          }

          // Reset retry count for next job
          this.currentJobRetries = 0;
          this.queue.shift();
          this.currentJobIndex++;
        } else {
          this.currentJobRetries++;

          if (this.currentJobRetries >= MAX_RETRIES_PER_JOB) {
            this.status = "failed";
            await markExecutionFailed(
              this.executionId,
              `Job failed after ${MAX_RETRIES_PER_JOB} retries. Step: ${job.step_no}`
            );
            break;
          }

          // Add delay before retry
          await this.delay(RETRY_DELAY_MS);
          continue; // Retry the same job
        }
      } catch (error) {
        this.currentJobRetries++;

        if (this.currentJobRetries >= MAX_RETRIES_PER_JOB) {
          this.status = "failed";
          await markExecutionFailed(
            this.executionId,
            error instanceof Error ? error.message : "Unknown error occurred"
          );
          break;
        }

        // Add delay before retry
        await this.delay(RETRY_DELAY_MS);
        continue; // Retry the same job
      }
    }

    this.isProcessing = false;
  }

  public get pendingJobs(): number {
    return this.queue.length;
  }

  public get currentStatus(): string {
    return this.status;
  }

  public get isRunning(): boolean {
    return this.isProcessing;
  }

  public clearQueue(): void {
    this.queue = [];
    this.currentJobIndex = 0;
    this.currentJobRetries = 0;
  }

  public async stop(): Promise<void> {
    this.status = "failed";
    await markExecutionFailed(this.executionId, "Execution stopped manually");
    this.clearQueue();
  }
}

export default Execution;
