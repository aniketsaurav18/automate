import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/AppSidebar";
import Home from "@/screens/Home";

import { WorkflowCanvas } from "./screens/WorkflowCanvas";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./screens/Login";
import SignupPage from "./screens/Signup";
import Workflows from "./screens/Workflows";

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster />
      {/* Main content area: takes up the remaining space */}
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Home />}></Route>
        <Route path="/workflow" element={<Layout />}>
          <Route index element={<Workflows />} />
        </Route>
        <Route path="/workflow/:workflowId" element={<Layout />}>
          <Route index element={<WorkflowCanvas />} />
        </Route>
      </Routes>
    </Router>
  );
}
