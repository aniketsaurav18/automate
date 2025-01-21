import { queryDB, QueryResultDB } from "./db";

export const processMessage = (workflowId: string) => {
  const result: QueryResultDB = queryDB(
    "SELECT * FROM 'Trigger' WHERE workflow_id = $1",
    [workflowId]
  );
};
