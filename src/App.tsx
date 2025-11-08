import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { BillingPage } from "./components/BillingPage";

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
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/analytics" element={<CampaignAnalytics />} />
                <Route path="/dashboard" element={<AffectingDashboard />} />
                <Route path="/team" element={<TeamManagement />} />
                <Route path="/permissions" element={<PermissionsSettings />} />
                <Route path="/onboarding" element={<OnboardingFlow />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl">Demo Mode Active - <a href="/" className="text-purple-400 underline ml-2">Go to Dashboard</a></div>} />
                <Route path="/signup" element={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl">Demo Mode Active - <a href="/" className="text-purple-400 underline ml-2">Go to Dashboard</a></div>} />
                <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl">Demo Mode Active - <a href="/" className="text-purple-400 underline ml-2">Go to Dashboard</a></div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;