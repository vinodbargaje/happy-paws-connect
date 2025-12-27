import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Register from "./pages/Register";
import RegisterOwner from "./pages/RegisterOwner";
import RegisterCaregiver from "./pages/RegisterCaregiver";
import Login from "./pages/Login";
import CaregiverProfile from "./pages/CaregiverProfile";
import OwnerDashboard from "./pages/OwnerDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/owner" element={<RegisterOwner />} />
              <Route path="/register/caregiver" element={<RegisterCaregiver />} />
              <Route path="/login" element={<Login />} />
              <Route path="/caregiver/:id" element={<CaregiverProfile />} />
              <Route 
                path="/dashboard/owner" 
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/caregiver" 
                element={
                  <ProtectedRoute allowedRoles={['caregiver']}>
                    <CaregiverDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
