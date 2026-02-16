import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import Discover from "./pages/Discover";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Conversations from "./pages/Conversations";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileCompletionWizard from "./pages/ProfileCompletionWizard";
import Shortlist from "./pages/Shortlist";
import Preview from "./pages/Preview";
import CandidateDetail from "./pages/CandidateDetail";
import ConversationDetail from "./pages/ConversationDetail";
import Settings from "./pages/Settings";
import SafetyPrivacy from "./pages/SafetyPrivacy";
import Notifications from "./pages/Notifications";
import AccountSecurity from "./pages/AccountSecurity";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<ProtectedRoute requireUser><Onboarding /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><ResponsiveLayout><Admin /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/discover" element={<ProtectedRoute requireUser><ResponsiveLayout><Discover /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute requireUser><ResponsiveLayout><Resources /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/resources/:slug" element={<ProtectedRoute requireUser><ResponsiveLayout><ResourceDetail /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/conversations" element={<ProtectedRoute requireUser><ResponsiveLayout><Conversations /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute requireUser><ResponsiveLayout><Profile /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute requireUser><ResponsiveLayout><ProfileEdit /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/profile/completion-wizard" element={<ProtectedRoute requireUser><ResponsiveLayout><ProfileCompletionWizard /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/profile/shortlist" element={<ProtectedRoute requireUser><ResponsiveLayout><Shortlist /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/profile/preview" element={<ProtectedRoute requireUser><ResponsiveLayout><CandidateDetail /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/preview" element={<ProtectedRoute requireUser><ResponsiveLayout><Preview /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/candidate/:id" element={<ProtectedRoute requireUser><ResponsiveLayout><CandidateDetail /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/conversation/:id" element={<ProtectedRoute requireUser><ResponsiveLayout><ConversationDetail /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute requireUser><ResponsiveLayout><Settings /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/settings/safety-privacy" element={<ProtectedRoute requireUser><ResponsiveLayout><SafetyPrivacy /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/settings/notifications" element={<ProtectedRoute requireUser><ResponsiveLayout><Notifications /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/settings/account-security" element={<ProtectedRoute requireUser><ResponsiveLayout><AccountSecurity /></ResponsiveLayout></ProtectedRoute>} />
                <Route path="/terms" element={<ResponsiveLayout><Terms /></ResponsiveLayout>} />
                <Route path="/privacy" element={<ResponsiveLayout><Privacy /></ResponsiveLayout>} />
                <Route path="/help" element={<ResponsiveLayout><Help /></ResponsiveLayout>} />
                <Route path="/about" element={<ResponsiveLayout><About /></ResponsiveLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
