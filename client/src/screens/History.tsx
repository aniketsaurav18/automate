"use client";

import { useUser } from "@/providers/user-provider";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

const statusColors = {
  failed: "bg-destructive text-destructive-foreground",
  pending: "bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white",
  success: "bg-green-500 dark:bg-green-600 text-white",
};

const statusIcons = {
  failed: <AlertCircle className="h-4 w-4 mr-1" />,
  pending: <Clock className="h-4 w-4 mr-1" />,
  success: <CheckCircle className="h-4 w-4 mr-1" />,
};

interface ResultItem {
  key: string;
  result?: string;
  output?: {
    body?: string;
    headers?: Record<string, string>;
    statusCode?: number;
  };
  step_no: number;
  success: boolean;
}

interface HistoryItem {
  id: string;
  workflow_id: string;
  status: keyof typeof statusColors;
  execution_time: string;
  results: ResultItem[];
  job_count: number;
  total_job_executed: number;
  created_at: string;
  finished_at?: string;
  error?: string;
  job_index: number;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workflow/history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setHistory(data.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  const formatResultValue = (result: ResultItem) => {
    if (result.result) {
      return result.result;
    }

    if (result.output) {
      if (typeof result.output.body === "string") {
        try {
          // Try to parse and prettify JSON
          const parsed = JSON.parse(result.output.body);
          return JSON.stringify(parsed, null, 2);
        } catch {
          // If not valid JSON, return as is
          return result.output.body;
        }
      }
      return JSON.stringify(result.output, null, 2);
    }

    return "No result data";
  };

  return (
    <div className=" w-full p-3 sm:p-6 dark:bg-neutral-800 dark:text-foreground">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">
        Workflow History
      </h1>

      <div className="grid gap-4 p-4">
        {history && history.length > 0 ? (
          history.map((item) => (
            <Card
              key={item.id}
              className="shadow-md dark:bg-card dark:border-gray-700 transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-base sm:text-lg dark:text-white truncate">
                    {isMobile ? (
                      <span className="font-mono">
                        {item.workflow_id.substring(0, 10)}...
                      </span>
                    ) : (
                      <span className="font-mono">{item.workflow_id}</span>
                    )}
                  </CardTitle>
                  <Badge
                    className={`px-2 py-1 text-xs flex items-center justify-center rounded-full ${
                      statusColors[item.status] ||
                      "bg-gray-500 dark:bg-gray-600"
                    }`}
                  >
                    {statusIcons[item.status]}
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Executed {formatDistanceToNow(new Date(item.execution_time))}{" "}
                  ago
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                      <span className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                        View Details
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-muted-foreground">Job Count:</p>
                            <p className="font-medium">{item.job_count}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Executed:</p>
                            <p className="font-medium">
                              {item.total_job_executed}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created:</p>
                            <p className="font-medium">
                              {format(new Date(item.created_at), "PPpp")}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Finished:</p>
                            <p className="font-medium">
                              {item.finished_at
                                ? format(new Date(item.finished_at), "PPpp")
                                : "Not finished"}
                            </p>
                          </div>
                        </div>

                        {item.error && (
                          <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20 dark:bg-destructive/20">
                            <p className="text-destructive flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" /> Error:{" "}
                              {item.error}
                            </p>
                          </div>
                        )}

                        {item.results && item.results.length > 0 && (
                          <div className="mt-3">
                            <p className="font-medium mb-2">Results:</p>
                            <Tabs defaultValue="table" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="table">
                                  Table View
                                </TabsTrigger>
                                <TabsTrigger value="raw">Raw Data</TabsTrigger>
                              </TabsList>
                              <TabsContent value="table" className="mt-2">
                                <div className="rounded border dark:border-gray-700 overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                          Step
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                          Type
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                      {item.results.map((result) => (
                                        <tr
                                          key={`${result.step_no}-${result.key}`}
                                        >
                                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                                            {result.step_no}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                                            {result.key}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                                            <Badge
                                              className={
                                                result.success
                                                  ? "bg-green-500 dark:bg-green-600 text-white"
                                                  : "bg-destructive text-destructive-foreground"
                                              }
                                            >
                                              {result.success
                                                ? "Success"
                                                : "Failed"}
                                            </Badge>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </TabsContent>
                              <TabsContent value="raw" className="mt-2">
                                <Accordion type="multiple" className="w-full">
                                  {item.results.map((result, idx) => (
                                    <AccordionItem
                                      key={idx}
                                      value={`step-${result.step_no}`}
                                      className="border-b dark:border-gray-700"
                                    >
                                      <AccordionTrigger className="py-2 text-xs hover:no-underline">
                                        <div className="flex items-center justify-between w-full">
                                          <span>
                                            Step {result.step_no}: {result.key}
                                          </span>
                                          <Badge
                                            className={
                                              result.success
                                                ? "bg-green-500 dark:bg-green-600 text-white"
                                                : "bg-destructive text-destructive-foreground"
                                            }
                                          >
                                            {result.success
                                              ? "Success"
                                              : "Failed"}
                                          </Badge>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                          {formatResultValue(result)}
                                        </pre>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">No history available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
