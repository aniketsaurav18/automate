"use client";

import { createElement, useEffect, useState, type FC } from "react";
import { Plus, MoreVertical, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigureStepModal } from "./ConfigureStepModal";
import { JobCongiguration } from "@/jobs/job-config";
import type { JobType, WorkflowType } from "@/types";

const Tail = ({
  onClick,
  showPlus = false,
}: {
  onClick: () => void;
  showPlus?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-0.5 h-6 bg-slate-500 dark:bg-blue-200"></div>
      {showPlus && (
        <Button
          variant="outline"
          size="icon"
          className="!rounded-full border-2 border-blue-500 bg-white hover:bg-blue-50"
          onClick={onClick}
        >
          <Plus className="h-4 w-4 text-blue-500" />
        </Button>
      )}
    </div>
  );
};

interface StepCardProps {
  data: Steps;
  showPlus?: boolean;
  addStep: () => void;
  stepNumber: number;
  workflowId: string;
}

const StepCard: FC<StepCardProps> = ({
  data,
  showPlus,
  addStep,
  stepNumber,
  workflowId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="w-full mb-2 border-none shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer rounded-lg overflow-hidden"
        onClick={handleCardClick}
      >
        <div
          className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white"
          id="step-card"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full shadow-sm dark:text-black">
              {data.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {data.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {data.isConfigured && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600 dark:hover:bg-zinc-300"
              onClick={(e) => {
                e.stopPropagation();
                console.log("More options clicked");
              }}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <Tail onClick={addStep} showPlus={showPlus} />
      <ConfigureStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${data.title}`}
        trigger={data.type === "trigger"}
        stepNumber={stepNumber}
        workflowId={workflowId}
      />
    </>
  );
};

interface Steps {
  title: string;
  type: "trigger" | "action";
  icon: any;
  stepNumber: number;
  job?: JobType;
  isConfigured: boolean;
}

interface JobCardProps {
  workflow: WorkflowType;
}

export function JobCard({ workflow }: JobCardProps) {
  const [steps, setSteps] = useState<Steps[]>([]);

  const createStep = (
    type: "trigger" | "action",
    stepNumber: number,
    isConfigured = false
  ): Steps => ({
    title: `Add a new ${type}`,
    type,
    stepNumber,
    icon: createElement(Zap, { className: "h-4 w-4" }),
    isConfigured,
  });

  const addStep = () => {
    setSteps((prevSteps) => {
      const newStepNumber = prevSteps.length + 1;
      console.log("newStepNumber", newStepNumber);
      return [...prevSteps, createStep("action", newStepNumber)];
    });
  };

  useEffect(() => {
    if (!workflow.jobs || workflow.jobs.length === 0) {
      setSteps([createStep("trigger", 1), createStep("action", 2)]);
      return;
    }

    console.log("workflow-jobcard-job::", workflow);

    const mappedSteps: Steps[] = workflow.jobs.map((job) => ({
      title: job.name ? job.name : job.app,
      type: job.type,
      stepNumber: job.step_no,
      icon:
        JobCongiguration.find((j) => j.app === job.app)?.icon("h-4 w-4") ||
        createElement(Zap, { className: "h-4 w-4" }),
      job,
      isConfigured: true,
    }));

    if (mappedSteps.length === 1) {
      mappedSteps.push(createStep("action", mappedSteps.length + 1));
    }
    console.log("mappedSteps::", mappedSteps);
    setSteps(mappedSteps);
  }, [workflow]);

  return (
    <div className="w-[400px] p-4 rounded-xl">
      {steps.map((step, index) => (
        <StepCard
          key={index}
          data={step}
          showPlus={index === steps.length - 1}
          addStep={addStep}
          stepNumber={step.stepNumber}
          workflowId={workflow.id}
        />
      ))}
    </div>
  );
}
