import { pool, getExecutionByStatus } from "./db";
import { produceMessage } from "./producer";

// export const executionSchedularFn = async () => {
//   try {
//     const executions = await getExecutionByStatus("pending");
//     console.log(executions);
//   } catch (e: any) {
//     console.error(e);
//   }
// };

export async function executionSchedularFn() {
  let client;
  try {
    // Fetch the executions
    client = await pool.connect();
    await client.query("BEGIN");
    const selectQuery = `
        SELECT *
        FROM "Execution"
        WHERE execution_time >= NOW()
          AND execution_time < NOW() + INTERVAL '1 minute'
          AND status = 'pending'
        FOR UPDATE SKIP LOCKED
      `;
    const { rows: executions } = await client.query(selectQuery);
    await client.query("COMMIT");

    // Process each execution individually.
    for (const execution of executions) {
      const execClient = await pool.connect();
      try {
        await execClient.query("BEGIN");

        const messagePayload = {
          executionId: execution.id,
          workflowId: execution.workflow_id,
        };
        await produceMessage("schedular", JSON.stringify(messagePayload));

        // Update the status only if Kafka send was successful.
        const updateQuery = `
            UPDATE "Execution"
            SET status = 'queued'
            WHERE id = $1
          `;
        await execClient.query(updateQuery, [execution.id]);

        await execClient.query("COMMIT");
      } catch (error) {
        await execClient.query("ROLLBACK");
        console.error(`Error processing execution ${execution.id}:`, error);
      } finally {
        execClient.release();
      }
    }
  } catch (error) {
    console.error("Error during batch processing:", error);
  } finally {
    if (client) {
      client.release();
    }
  }
}
