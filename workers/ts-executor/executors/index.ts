import { exeuteJob } from "./execute";
import { JobDBSchema } from "../../../backend/src/schema";
import { markExecutionFailed, updateJobResult } from "../db/functions";

const MAX_RETRIES_PER_JOB = 3;
const RETRY_DELAY_MS = 1000; // 1 second delay between retries

class Execution {
  private executionId: string;
  private queue: JobDBSchema[] = [];
  private isProcessing: boolean = false;
  private status: "running" | "completed" | "failed" = "running";
  private currentJobIndex = 0;
  private currentJobRetries = 0;

  constructor(executionId: string) {
    this.executionId = executionId;
    console.log(`[Execution ${this.executionId}] Created execution instance.`);
  }

  public addJob(job: JobDBSchema): void {
    console.log(
      `[Execution ${this.executionId}] Adding job with step_no: ${job.step_no}`
    );
    this.queue.push(job);
    this.processQueue();
  }

  public addJobs(jobs: JobDBSchema[]): void {
    console.log(`[Execution ${this.executionId}] Adding ${jobs.length} jobs.`);
    this.queue.push(...jobs);
    this.processQueue();
  }

  private async delay(ms: number): Promise<void> {
    console.log(`[Execution ${this.executionId}] Delaying for ${ms}ms.`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) {
      console.log(
        `[Execution ${this.executionId}] Process queue already running.`
      );
      return;
    }
    if (this.queue.length === 0) {
      console.log(`[Execution ${this.executionId}] No jobs in queue.`);
      return;
    }

    console.log(
      `[Execution ${this.executionId}] Starting processing of ${this.queue.length} job(s).`
    );
    this.isProcessing = true;

    while (this.queue.length > 0 && this.status === "running") {
      const job = this.queue[0];
      console.log(
        `[Execution ${this.executionId}] Processing job at index ${this.currentJobIndex} with step_no: ${job.step_no} (Retry: ${this.currentJobRetries}/${MAX_RETRIES_PER_JOB}).`
      );

      try {
        const result = await exeuteJob(job);
        console.log(
          `[Execution ${this.executionId}] Job execution result for step_no ${
            job.step_no
          }: ${JSON.stringify(result)}.`
        );

        if (result?.success === true) {
          const res = {
            step_no: job.step_no,
            ...result,
          };

          const jobResult = await updateJobResult(this.executionId, res);
          console.log(
            `[Execution ${this.executionId}] Updated job result for step_no ${
              job.step_no
            }: ${JSON.stringify(jobResult)}.`
          );

          if (jobResult.completed) {
            console.log(
              `[Execution ${this.executionId}] Execution completed at step_no ${job.step_no}.`
            );
            this.isProcessing = false;
            this.status = "completed";
            break;
          }

          // Reset retry count for next job
          this.currentJobRetries = 0;
          console.log(
            `[Execution ${this.executionId}] Job at step_no ${job.step_no} processed successfully. Moving to next job.`
          );
          this.queue.shift();
          this.currentJobIndex++;
        } else {
          this.currentJobRetries++;
          console.warn(
            `[Execution ${this.executionId}] Job at step_no ${job.step_no} did not succeed. Retry ${this.currentJobRetries}/${MAX_RETRIES_PER_JOB}.`
          );

          if (this.currentJobRetries >= MAX_RETRIES_PER_JOB) {
            console.error(
              `[Execution ${this.executionId}] Maximum retries reached for job at step_no ${job.step_no}. Marking execution as failed.`
            );
            this.status = "failed";
            await markExecutionFailed(
              this.executionId,
              `Job failed after ${MAX_RETRIES_PER_JOB} retries. Step: ${job.step_no}`
            );
            break;
          }

          await this.delay(RETRY_DELAY_MS);
          console.log(
            `[Execution ${this.executionId}] Retrying job at step_no ${job.step_no}.`
          );
          continue; // Retry the same job
        }
      } catch (error) {
        this.currentJobRetries++;
        console.error(
          `[Execution ${this.executionId}] Error processing job at step_no ${
            job.step_no
          }: ${error instanceof Error ? error.message : error}. Retry ${
            this.currentJobRetries
          }/${MAX_RETRIES_PER_JOB}.`
        );

        if (this.currentJobRetries >= MAX_RETRIES_PER_JOB) {
          console.error(
            `[Execution ${this.executionId}] Maximum retries reached after error for job at step_no ${job.step_no}. Marking execution as failed.`
          );
          this.status = "failed";
          await markExecutionFailed(
            this.executionId,
            error instanceof Error ? error.message : "Unknown error occurred"
          );
          break;
        }

        await this.delay(RETRY_DELAY_MS);
        console.log(
          `[Execution ${this.executionId}] Retrying job at step_no ${job.step_no} after error.`
        );
        continue; // Retry the same job
      }
    }

    this.isProcessing = false;
    console.log(
      `[Execution ${this.executionId}] Exiting processQueue. Final status: ${this.status}.`
    );
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
    console.log(
      `[Execution ${this.executionId}] Clearing job queue and resetting counters.`
    );
    this.queue = [];
    this.currentJobIndex = 0;
    this.currentJobRetries = 0;
  }

  public async stop(): Promise<void> {
    console.log(`[Execution ${this.executionId}] Stopping execution manually.`);
    this.status = "failed";
    await markExecutionFailed(this.executionId, "Execution stopped manually");
    this.clearQueue();
  }
}

export default Execution;
