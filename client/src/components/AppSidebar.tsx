import {
  Home,
  Search,
  Settings,
  Workflow,
  History,
  LogIn,
  UserPlus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useUser } from "@/providers/user-provider";
import { ModeToggle } from "./mode-toggle";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Workflows",
    url: "/workflow",
    icon: Workflow,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { isAuthenticated, user } = useUser();

  return (
    <Sidebar className="bg-backgroud dark:bg-zinc-900">
      <SidebarContent className="border-none">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2 py-4 mb-4">
            <span className="text-lg text-neutral-800 dark:text-neutral-100 font-bold">
              Automate
            </span>
            <ModeToggle />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="">
        {isAuthenticated && user ? (
          <NavUser user={user} />
        ) : (
          <>
            <Separator />
            <div className="flex flex-col space-y-2 mb-2">
              <Button
                variant="outline"
                className="w-full justify-start dark:bg-neutral-800"
                asChild
              >
                <a href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start dark:bg-neutral-800"
                asChild
              >
                <a href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </a>
              </Button>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
