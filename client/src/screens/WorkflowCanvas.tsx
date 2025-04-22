import { useEffect, useState } from "react";
import { JobCard } from "../components/JobCard";
import { TopBar } from "../components/Topbar";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/providers/user-provider";
import { updateActiveWorkflow } from "@/store/slice/workflow/workflowState";
import { setActiveWorkflowTitle } from "@/store/slice/workflow";

function WorkflowCanvas() {
  const { user, userStateLoading } = useUser();
  const { toast } = useToast();
  const { workflowId } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<string>("edit");
  const workflow = useAppSelector((state) => state.workflow.activeWorkflow);
  const dispatch = useAppDispatch();
  const workflowTitle = workflow?.name ?? "Untitled Wrokflow";
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userStateLoading) {
      return;
    }
    if (!user) {
      return;
    }
    const fetchWorkflow = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workflow/${workflowId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "content-type": "application/json",
            },
          }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (!data.success) {
          return;
        }
        console.log(data);
        dispatch(updateActiveWorkflow(data.data));
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchWorkflow();
  }, [workflowId, userStateLoading, user]);

  useEffect(() => {
    setMode(searchParams.get("mode") ?? "edit");
  }, [searchParams]);

  const saveWorkflowAction = async () => {
    if (mode === "create") {
      await saveWorkflow();
    } else if (mode === "edit") {
      await updateWorkflowData();
    } else {
      toast({
        title: "Error",
        description: "Invalid Request.",
      });
    }
  };

  const setWorkflowTitle = (title: string) => {
    if (!workflow) {
      return;
    }
    dispatch(setActiveWorkflowTitle(title));
  };
  const saveWorkflow = async () => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please signin in order to save workflow.",
      });
      return;
    }
    try {
      setSaveLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workflow/${workflowId}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(workflow),
        }
      );
      const data = await res.json();
      console.log("recieved data workflow::", data);
      if (!data.success) {
        toast({
          title: "Error",
          description: data.message
            ? (data.message as string)
            : "An unexpected error occurred",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Your workflow has been saved successfully.",
      });
    } catch (err: any) {
      console.log(err.message ? err.message : err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const updateWorkflowData = async () => {
    try {
      console.log("workflow::", workflow);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workflow/${workflowId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(workflow),
        }
      );
      if (!res.ok) {
        throw new Error("Workflow Could not be saved.");
      }
      const data = await res.json();
      if (!data.success) {
        return;
      }
      console.log(data);
      dispatch(updateActiveWorkflow(data.data));
      toast({
        title: "Success",
        description: "Your workflow has been saved successfully.",
      });
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <>
      <TopBar
        workflowTitle={workflowTitle}
        setWorkflowTitle={setWorkflowTitle}
        saveWorkflowFn={saveWorkflowAction}
        saveLoading={saveLoading}
      />
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-300 dark:bg-zinc-800">
        {workflow && <JobCard workflow={workflow} />}
      </div>
    </>
  );
}

export default WorkflowCanvas;
