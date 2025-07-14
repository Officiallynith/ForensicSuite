import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { StatusCards } from "@/components/StatusCards";
import { ThreatFeed } from "@/components/ThreatFeed";
import { AIEnginesStatus } from "@/components/AIEnginesStatus";
import { EvidenceList } from "@/components/EvidenceList";
import { CasesList } from "@/components/CasesList";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  stats: {
    threatsDetected: number;
    evidenceFiles: number;
    activeInvestigations: number;
    aiProgress: number;
  };
  activeCases: any[];
  user: {
    name: string;
    role: string;
  };
  notifications: any[];
}

export default function Dashboard() {
  const { toast } = useToast();
  const { data: dashboardData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // WebSocket for real-time updates (temporarily disabled to fix crashes)
  // const { lastMessage, isConnected } = useWebSocket();

  // Temporarily disabled WebSocket message handling to fix crashes
  /*
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'threats_updated':
          refetch();
          break;
        case 'case_created':
          toast({
            title: "New Case Created",
            description: `Case "${lastMessage.data?.name}" has been created.`,
          });
          refetch();
          break;
        case 'evidence_analyzed':
          toast({
            title: "Evidence Analysis Complete",
            description: `AI analysis completed for "${lastMessage.data?.filename}".`,
          });
          refetch();
          break;
        default:
          break;
      }
    }
  }, [lastMessage, refetch, toast]);
  */

  if (isLoading || !dashboardData) {
    return (
      <div className="flex h-screen overflow-hidden bg-dark-950">
        <div className="flex-shrink-0 w-64 bg-dark-900 border-r border-dark-800">
          <div className="flex items-center p-4 border-b border-dark-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-sm"></i>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">DAFF</h1>
                <p className="text-xs text-dark-400">v2.0.1-AI</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-dark-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-dark-900 border-b border-dark-800 px-6 py-4">
            <div className="animate-pulse">
              <div className="h-6 bg-dark-800 rounded w-1/3"></div>
            </div>
          </div>
          
          <main className="flex-1 overflow-auto bg-dark-950 p-6">
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-dark-900 rounded-xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-dark-900 rounded-xl"></div>
                <div className="h-96 bg-dark-900 rounded-xl"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const activeCaseName = dashboardData.activeCases.length > 0 
    ? dashboardData.activeCases[0].name 
    : "No Active Case";

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 text-dark-300">
      <Sidebar 
        activeCases={dashboardData.stats.activeInvestigations}
        threatCount={dashboardData.stats.threatsDetected}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          activeCaseName={activeCaseName}
          userName={dashboardData.user.name}
          userRole={dashboardData.user.role}
          notificationCount={dashboardData.notifications.length}
        />
        
        <main className="flex-1 overflow-auto bg-dark-950 p-6">
          {/* Connection status indicator */}
          {!isConnected && (
            <div className="mb-4 bg-warning/20 border border-warning/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <span className="text-sm">Real-time connection lost. Attempting to reconnect...</span>
              </div>
            </div>
          )}
          
          <StatusCards {...dashboardData.stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ThreatFeed />
            <AIEnginesStatus />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EvidenceList />
            <CasesList />
          </div>
        </main>
      </div>
    </div>
  );
}
