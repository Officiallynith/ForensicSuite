import { useQuery } from "@tanstack/react-query";

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
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000,
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">DAFF - Loading...</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">DAFF</h1>
              <p className="text-gray-400 text-sm">Digital Automation Forensic Framework</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{dashboardData.user.name}</p>
            <p className="text-xs text-gray-400">{dashboardData.user.role}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Threats Detected</p>
                <p className="text-2xl font-bold text-red-400">{dashboardData.stats.threatsDetected}</p>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Evidence Files</p>
                <p className="text-2xl font-bold text-blue-400">{dashboardData.stats.evidenceFiles}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Cases</p>
                <p className="text-2xl font-bold text-green-400">{dashboardData.stats.activeInvestigations}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400">🔍</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Progress</p>
                <p className="text-2xl font-bold text-purple-400">{dashboardData.stats.aiProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400">🤖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/anomaly-detection" className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">🧠</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Anomaly Detection</h3>
                <p className="text-gray-400 text-sm">AI-powered current world threat analysis</p>
              </div>
            </div>
          </a>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Active Cases</h3>
                <p className="text-gray-400 text-sm">{dashboardData.activeCases.length} investigations running</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">🔔</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-gray-400 text-sm">{dashboardData.notifications.length} new alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">Database Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">AI Analysis Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">Threat Intelligence Active</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">DAFF Features</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <span>PostgreSQL Database Integration</span>
              <span className="text-green-400 text-sm">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <span>Current World Anomaly Detection</span>
              <span className="text-green-400 text-sm">✓ Available</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <span>AI-Powered Threat Analysis</span>
              <span className="text-green-400 text-sm">✓ Running</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <span>Real-time Forensic Framework</span>
              <span className="text-green-400 text-sm">✓ Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}