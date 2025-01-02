import {
  Filter,
  Folder,
  CloudLightningIcon as Lightning,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/user-provider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { WorkflowType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  addWorkflows,
  updateWorkflowActiveStatus,
} from "@/store/slice/workflow";

// Custom purple theme
const purpleTheme = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-purple-100 text-purple-900 hover:bg-purple-200",
  muted: "text-purple-600",
  border: "border-purple-200",
};

export default function Workflows() {
  const { user, userStateLoading } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const workflows = useAppSelector((state) => state.workflow.workflows);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userStateLoading || !user?.token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workflow/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          console.log(data.data);
          dispatch(addWorkflows(data.data as WorkflowType[]));
        } else {
          toast({
            title: "Error",
            description: data.message ?? "Unexpected error happened.",
          });
        }
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Error",
          description: "An unexpected error happened.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userStateLoading]);

  const handleCreateNewWorkflow = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workflow/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Error creating workflows.");
      }
      const data = await res.json();
      console.log(data);
      if (data.success) {
        navigate(`${data.workflowData.id}?mode=create`);
      }
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err.message ?? "An unexpected error happened.",
      });
    }
  };

  const convertDate = (date: Date): string => {
    const d = new Date(date).toLocaleDateString();
    const t = d.split("/");
    return `${t[0]}-${t[1]}-${t[2]}`;
  };

  const activateWorkflow = async (workflowId: string): Promise<void> => {
    if (workflowId === "") {
      return;
    }
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workflow/${workflowId}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        dispatch(updateWorkflowActiveStatus({ id: workflowId, active: true }));
        toast({
          title: "Success",
          description: data.message ?? "Workflow activated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message ?? "An unexpected error happened.",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Error",
        description: e.message ?? "An unexpected error happened.",
      });
    }
  };

  const deactivateWorkflow = async (workflowId: string) => {
    if (workflowId === "") {
      return false;
    }
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workflow/${workflowId}/deactivate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        dispatch(updateWorkflowActiveStatus({ id: workflowId, active: false }));
        toast({
          title: "Success",
          description: data.message ?? "Workflow deactivated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message ?? "An unexpected error happened.",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Error",
        description: e.message ?? "An unexpected error happened.",
      });
    }
  };

  return (
    <div className="p-6 dark:bg-neutral-800 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Workflows</h1>
          <Tabs defaultValue="zaps">
            {/* <TabsList className={purpleTheme.border}>
              <TabsTrigger
                value="zaps"
                className={cn("flex items-center gap-2", purpleTheme.secondary)}
              >
                <Lightning className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger
                value="folders"
                className={cn("flex items-center gap-2", purpleTheme.secondary)}
              >
                <Folder className="h-4 w-4" />
                Folders
              </TabsTrigger>
            </TabsList> */}
          </Tabs>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={purpleTheme.secondary}>
                All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Zaps</DropdownMenuItem>
              <DropdownMenuItem>My Zaps</DropdownMenuItem>
              <DropdownMenuItem>Shared Zaps</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 dark:bg-purple-800 dark:text-white",
              purpleTheme.secondary
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className={purpleTheme.muted}>
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button
            className={cn(
              "flex items-center gap-2 dark:bg-purple-800 dark:text-white",
              purpleTheme.primary
            )}
            onClick={handleCreateNewWorkflow}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            className="pl-8 dark:border-neutral-500"
          />
        </div>
      </div>
      <Table>
        <TableHeader className="dark:border-gray-400">
          <TableRow className="px-0 [&>*]:px-0">
            <TableHead>Name</TableHead>
            <TableHead>Apps</TableHead>
            <TableHead>Last modified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&>*]:dark:border-gray-400">
          {loading || userStateLoading ? ( // Show loader if loading or user state is loading
            <TableRow className="">
              <TableCell colSpan={5} className="text-center p-4">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600"></div>
                  <span className="ml-3">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : workflows.length > 0 ? (
            workflows.map((workflow: WorkflowType) => (
              <TableRow
                key={workflow.id}
                className="align-middle dark:border-gray-400"
              >
                <TableCell className="p-0">
                  <div className="flex flex-row gap-1">
                    <Lightning className="h-4 w-4 text-muted-foreground" />
                    <span
                      className="hover:text-purple-900 cursor-pointer hover:underline"
                      onClick={() => {
                        navigate(`${workflow.id}?mode=edit`);
                      }}
                    >
                      {workflow.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="gap-0 p-0">
                  <div className="flex gap-1">
                    {workflow.apps.length == 0
                      ? "Not Configured"
                      : workflow.apps.map((app: string, index: number) => {
                          const Icon: React.ComponentType<{
                            className?: string;
                          }> = Mail;
                          return (
                            <div
                              key={index}
                              className="flex h-6 w-6 items-center justify-center rounded border bg-purple-100 dark:bg-gray-100 dark:text-purple-700"
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                          );
                        })}
                  </div>
                </TableCell>
                <TableCell className="gap-0 p-0">
                  {convertDate(workflow.updated_at)}
                </TableCell>
                <TableCell className="gap-0 p-0">
                  <Switch
                    checked={workflow.active}
                    onCheckedChange={(checked: boolean) => {
                      if (!checked) {
                        deactivateWorkflow(workflow.id);
                      } else {
                        activateWorkflow(workflow.id);
                      }
                    }}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300 data-[state=unchecked]:dark:bg-neutral-400 [&>*]:bg-white"
                  />
                </TableCell>

                <TableCell className="gap-0 p-0">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
