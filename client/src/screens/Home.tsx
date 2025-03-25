"use client";

import { useUser } from "@/providers/user-provider";
import { useState, useEffect } from "react";
import { Activity, Layers, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import History from "./History";

const WorkflowStatistics = () => {
  const { user } = useUser();
  const [workflowStats, setWorkflowStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    pendingExecutions: 0,
    executedWorkflows: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflowStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workflow/stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch workflow stats");
        }
        const data = await response.json();
        setWorkflowStats(data.data);
      } catch (error: any) {
        console.error("Error fetching workflow stats:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkflowStats();
    }
  }, [user]);

  const stats = [
    {
      title: "Total Workflows",
      value: workflowStats.totalWorkflows,
      icon: Layers,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-500 dark:text-blue-300",
    },
    {
      title: "Active Workflows",
      value: workflowStats.activeWorkflows,
      icon: Activity,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-500 dark:text-green-300",
    },
    {
      title: "Pending Executions",
      value: workflowStats.pendingExecutions,
      icon: Clock,
      color: "bg-amber-100 dark:bg-amber-900",
      iconColor: "text-amber-500 dark:text-amber-300",
    },
    {
      title: "Executed Workflows",
      value: workflowStats.executedWorkflows,
      icon: CheckCircle,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-500 dark:text-purple-300",
    },
  ];

  return (
    <div className="h-screen">
      <section className="py-8 md:py-12 bg-gray-50 dark:bg-neutral-800 transition-colors">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Workflow Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col h-full">
                    <div className={`p-4 ${stat.color}`}>
                      <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                    </div>
                    <div className="p-5 bg-white dark:bg-gray-800 flex-1">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {stat.title}
                      </h3>
                      {isLoading ? (
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <History />
    </div>
  );
};

export default WorkflowStatistics;
