import { useEffect, useState } from "react";
import { ZapCard } from "./JobCard";
import { TopBar } from "./Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { TypeWorkFlow } from "@/jobs/job-config";
import { v4 as uuidv4 } from "uuid";
import { addWorkflow } from "@/store/slice/workflow";

export function Canvas() {
  const { workflowId } = useParams();
  const workflows = useAppSelector((state) => state.workflow.workflows);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [workflow, setWorkflow] = useState<TypeWorkFlow | null>(null);

  useEffect(() => {
    if (workflowId) {
      const workflow = workflows.find(
        (workflow) => workflow.workflowId === workflowId
      );
      if (workflow) {
        setWorkflow(workflow);
      } else {
        const udid = uuidv4();
        dispatch(addWorkflow({ jobs: [], workflowId: udid }));
        setWorkflow({ jobs: [], workflowId: udid });
      }
    } else {
      navigate("/workflows");
    }
  }, [workflowId]);

  return (
    <>
      <TopBar />
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-300 dark:bg-zinc-800">
        {workflow && (
          <ZapCard jobs={workflow.jobs} workflowId={workflow.workflowId} />
        )}
      </div>
    </>
  );
}
