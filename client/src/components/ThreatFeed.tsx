import { useQuery } from "@tanstack/react-query";
import { Threat } from "@shared/schema";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "bg-error";
    case "high": return "bg-warning";
    case "medium": return "bg-accent";
    case "low": return "bg-success";
    default: return "bg-dark-600";
  }
}

function getSeverityDotColor(severity: string): string {
  switch (severity) {
    case "critical": return "bg-error";
    case "high": return "bg-warning";
    case "medium": return "bg-accent";
    case "low": return "bg-success";
    default: return "bg-dark-600";
  }
}

export function ThreatFeed() {
  const { data: threats = [], isLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats/recent"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-dark-900 rounded-xl border border-dark-800">
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Real-time Threat Intelligence</h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              <span className="text-sm text-dark-400">Loading...</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-dark-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-dark-900 rounded-xl border border-dark-800">
      <div className="p-6 border-b border-dark-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Real-time Threat Intelligence</h3>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <span className="text-sm text-dark-400">Live Feed</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
        {threats.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-shield-alt text-dark-600 text-3xl mb-4"></i>
            <p className="text-dark-400">No active threats detected</p>
          </div>
        ) : (
          threats.map((threat) => (
            <div
              key={threat.id}
              className="flex items-start space-x-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
            >
              <div className={`w-2 h-2 ${getSeverityDotColor(threat.severity)} rounded-full mt-2 flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white truncate">{threat.title}</h4>
                  <span className={`text-xs text-white px-2 py-1 rounded ${getSeverityColor(threat.severity)}`}>
                    {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-dark-400 mt-1">{threat.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-dark-500">
                  <span>{threat.source}</span>
                  <span>{formatTimeAgo(new Date(threat.createdAt))}</span>
                  <span>Confidence: {Math.round(threat.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
