import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/AppSidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load all route components
const LandingPage = lazy(() => import("@/screens/Landing"));
const LoginPage = lazy(() => import("@/screens/Login"));
const SignupPage = lazy(() => import("@/screens/Signup"));
const Workflows = lazy(() => import("@/screens/Workflows"));
const WorkflowStatistics = lazy(() => import("@/screens/Home"));
const WorkflowCanvas = lazy(() => import("@/screens/WorkflowCanvas"));
const History = lazy(() => import("@/screens/History"));

// Create a separate loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster />
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LandingPage />} />

          {/* All authenticated routes */}
          <Route element={<Layout />}>
            <Route path="/home" element={<WorkflowStatistics />} />
            <Route path="/workflow" element={<Workflows />} />
            <Route path="/workflow/:workflowId" element={<WorkflowCanvas />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
