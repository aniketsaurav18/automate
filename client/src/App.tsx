import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/AppSidebar";
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
import LandingPage from "@/screens/Landing";
import WorkflowStatistics from "./screens/Home";
import History from "./screens/History";

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
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/home" element={<Layout />}>
          <Route index element={<WorkflowStatistics />} />
        </Route>
        <Route path="/workflow" element={<Layout />}>
          <Route index element={<Workflows />} />
        </Route>
        <Route path="/workflow/:workflowId" element={<Layout />}>
          <Route index element={<WorkflowCanvas />} />
        </Route>
        <Route path="/history" element={<Layout />}>
          <Route index element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}
