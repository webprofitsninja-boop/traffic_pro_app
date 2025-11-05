import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { BillingPage } from "./components/BillingPage";
import { Login } from "./components/auth/Login";
// If the external ForgetPassword component is missing, use a simple placeholder component
// (or replace this with the correct import path to your real component)
const ForgetPassword: React.FC = () => {
  return React.createElement("div", null, "Forgot password page");
};

const SignUp: React.FC = () => {
  return React.createElement("div", null, "Sign up page");
};

import { CampaignAnalytics } from "./pages/CampaignAnalytics";
import LandingPage from "./components/LandingPage";
import OnboardingFlow from "./components/OnboardingFlow";
import { TeamManagement } from "./pages/TeamManagement";
import { PermissionsSettings } from "./pages/PermissionsSettings";

const AffectingDashboard: React.FC = () => {
  return React.createElement("div", null, "Affecting Dashboard");
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><CampaignAnalytics /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><AffectingDashboard /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
                <Route path="/permissions" element={<ProtectedRoute><PermissionsSettings /></ProtectedRoute>} />
                <Route path="/onboarding" element={<OnboardingFlow />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;