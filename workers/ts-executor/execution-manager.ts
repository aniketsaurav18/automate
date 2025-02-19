import Execution from "./executors";

class ExecutionManager {
  private queue: Execution[] = [];
  private activeExecutions: Set<Execution> = new Set();
  private maxConcurrentExecutions: number;

  constructor(maxConcurrentExecutions: number) {
    this.maxConcurrentExecutions = maxConcurrentExecutions;
  }

  public async addExecution(execution: Execution): Promise<void> {
    this.queue.push(execution);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    while (
      this.queue.length > 0 &&
      this.activeExecutions.size < this.maxConcurrentExecutions
    ) {
      const execution = this.queue.shift();
      if (!execution) continue;

      this.activeExecutions.add(execution);
      console.log(`Starting execution: ${execution["executionId"]}`);

      this.waitForCompletion(execution)
        .then(() => {
          console.log(`Execution finished: ${execution["executionId"]}`);
          this.activeExecutions.delete(execution);
          this.processQueue(); // Start next execution when a slot is free
        })
        .catch((error) => console.error("Execution error:", error));
    }
  }

  private async waitForCompletion(execution: Execution): Promise<void> {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!execution.isRunning) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  }

  public hasAvailableSlots(): boolean {
    return this.activeExecutions.size < this.maxConcurrentExecutions;
  }

  public async waitForSlot(): Promise<void> {
    while (!this.hasAvailableSlots()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

export default ExecutionManager;
