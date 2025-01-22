import { queryDB, QueryResultDB } from "./db";

export const processMessage = async (workflowId: string) => {
  const result: QueryResultDB = await queryDB(
    'SELECT * FROM "Trigger" WHERE workflow_id = $1 LIMIT 1',
    [workflowId]
  );
  if (result.result != "success") {
    console.error(result.errorMessage);
    return;
  }
  console.log(result.queryResult?.rows);
};

async function doquery() {
  await processMessage("cm5tq19430005iusuzvya3pv0");
}

doquery();
