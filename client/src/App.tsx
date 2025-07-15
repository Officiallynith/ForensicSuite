import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/DashboardNew";
import AnomalyDetection from "@/pages/AnomalyDetection";
import AutomatedAnalysis from "@/pages/AutomatedAnalysis";
import DFFDocumentation from "@/pages/DFFDocumentation";
import EnhancementPlan from "@/pages/EnhancementPlan";
import ForensicReports from "@/pages/ForensicReports";
import NetworkStorageAutomation from "@/pages/NetworkStorageAutomation";
import DAFFvsDFFComparison from "@/pages/DAFFvsDFFComparison";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/anomaly-detection" component={AnomalyDetection} />
      <Route path="/automated-analysis" component={AutomatedAnalysis} />
      <Route path="/dff-documentation" component={DFFDocumentation} />
      <Route path="/enhancement-plan" component={EnhancementPlan} />
      <Route path="/ai-analysis" component={AnomalyDetection} />
      <Route path="/deepfake" component={AnomalyDetection} />
      <Route path="/crypto" component={AnomalyDetection} />
      <Route path="/social-media" component={AnomalyDetection} />
      <Route path="/network" component={AnomalyDetection} />
      {/* Other modules coming soon */}
      <Route path="/investigation" component={() => <div className="p-8 text-white">Investigation module coming soon...</div>} />
      <Route path="/threats" component={() => <div className="p-8 text-white">Threats module coming soon...</div>} />
      <Route path="/files" component={() => <div className="p-8 text-white">File Browser module coming soon...</div>} />
      <Route path="/upload" component={() => <div className="p-8 text-white">Upload Evidence module coming soon...</div>} />
      <Route path="/cases" component={() => <div className="p-8 text-white">Case Management module coming soon...</div>} />
      <Route path="/analytics" component={() => <div className="p-8 text-white">Analytics module coming soon...</div>} />
      <Route path="/reports" component={ForensicReports} />
      <Route path="/network-storage-automation" component={NetworkStorageAutomation} />
      <Route path="/daff-vs-dff" component={DAFFvsDFFComparison} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
