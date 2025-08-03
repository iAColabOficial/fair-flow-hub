import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import AssignRolesPage from "./pages/AssignRolesPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Module Pages
import ProjectList from "./pages/projects/ProjectList";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectEdit from "./pages/projects/ProjectEdit";
import EvaluatorDashboard from "./pages/evaluation/EvaluatorDashboard";
import EvaluateProject from "./pages/evaluation/EvaluateProject";
import MyEvaluations from "./pages/evaluation/MyEvaluations";
import AvailabilityManagement from "./pages/evaluation/AvailabilityManagement";
import PaymentManagement from "./pages/finance/PaymentManagement";
import SystemReports from "./pages/admin/SystemReports";
import ScheduleManagement from "./pages/admin/ScheduleManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/assign-roles" element={
              <ProtectedRoute>
                <AssignRolesPage />
              </ProtectedRoute>
            } />
            
            {/* Module Routes */}
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            } />
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } />
            <Route path="/projects/:id/edit" element={
              <ProtectedRoute>
                <ProjectEdit />
              </ProtectedRoute>
            } />
            
            <Route path="/evaluation" element={
              <ProtectedRoute>
                <EvaluatorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/evaluation/evaluate/:id" element={
              <ProtectedRoute>
                <EvaluateProject />
              </ProtectedRoute>
            } />
            <Route path="/evaluation/my" element={
              <ProtectedRoute>
                <MyEvaluations />
              </ProtectedRoute>
            } />
            <Route path="/evaluation/availability" element={
              <ProtectedRoute>
                <AvailabilityManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/finance" element={
              <ProtectedRoute>
                <PaymentManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <SystemReports />
              </ProtectedRoute>
            } />
            <Route path="/admin/schedule" element={
              <ProtectedRoute>
                <ScheduleManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/communication" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
