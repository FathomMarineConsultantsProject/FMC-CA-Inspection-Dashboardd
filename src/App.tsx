import React from "react"; // React import zaroori hai TypeScript ke liye
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Register from "./pages/Register";
// --- PAGES ---
import Login from "./pages/Login";
import AdminLayout from "./components/layout/AdminLayout";
import ClientLayout from "./components/layout/ClientLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminSurveyors from "./pages/admin/AdminSurveyors";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminAssignSurveyor from "./pages/admin/AdminAssignSurveyor";
import AdminPreparation from "./pages/admin/AdminPreparation";
import AdminOverview from "./pages/admin/AdminOverview";
import ClientRequests from "./pages/client/ClientRequests";
import CreateRequest from "./pages/client/CreateRequest";
import NotFound from "./pages/NotFound";

// Is line ko change karein
import SurveyorResponse from "./pages/admin/SurveyorResponse"; 

const queryClient = new QueryClient();

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: 'admin' | 'client' }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/client'} replace />;
  }
  
  return <>{children}</>;
};

// --- ROUTES COMPONENT ---
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Login / Root Logic */}
      <Route path="/" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'admin' ? '/admin' : '/client'} replace />
          : <Login />
      } />
<Route path="/register" element={<Register />} />

      {/* 🟢 PUBLIC ROUTE: Surveyor response page (Login ki zaroorat nahi) */}
      <Route path="/surveyor-enquiry/:token" element={<SurveyorResponse />} />

      {/* 🔴 ADMIN ROUTES (Protected) */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="surveyors" element={<AdminSurveyors />} />
        <Route path="create" element={<AdminAssignSurveyor />} />
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="preparation" element={<AdminPreparation />} />
        <Route path="overview" element={<AdminOverview />} />
      </Route>

      {/* 🔵 CLIENT ROUTES (Protected) */}
      <Route path="/client" element={<ProtectedRoute role="client"><ClientLayout /></ProtectedRoute>}>
        <Route index element={<ClientRequests />} />
        <Route path="new" element={<CreateRequest />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;