import { useQuery } from "@tanstack/react-query";
import { Case } from "@shared/schema";

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const caseDate = new Date(date);
  const diffMs = now.getTime() - caseDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Updated 1 hour ago";
  if (diffHours < 24) return `Updated ${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical": return "border-error";
    case "high": return "border-warning";
    case "medium": return "border-accent";
    case "low": return "border-success";
    default: return "border-dark-600";
  }
}

function getPriorityBadgeColor(priority: string): string {
  switch (priority) {
    case "critical": return "bg-error";
    case "high": return "bg-warning";
    case "medium": return "bg-accent";
    case "low": return "bg-success";
    default: return "bg-dark-600";
  }
}

function getProgressBarColor(priority: string): string {
  switch (priority) {
    case "critical": return "bg-error";
    case "high": return "bg-warning";
    case "medium": return "bg-accent";
    case "low": return "bg-success";
    default: return "bg-primary";
  }
}

export function CasesList() {
  const { data: allCases = [], isLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Filter active cases
  const activeCases = allCases.filter(c => c.status === "active");

  if (isLoading) {
    return (
      <div className="bg-dark-900 rounded-xl border border-dark-800">
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Active Cases</h3>
            <div className="h-8 w-24 bg-dark-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-dark-800 rounded-lg border-l-4 border-dark-700">
                <div className="space-y-3">
                  <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                  <div className="h-3 bg-dark-700 rounded"></div>
                  <div className="h-2 bg-dark-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 rounded-xl border border-dark-800">
      <div className="p-6 border-b border-dark-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Active Cases</h3>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <i className="fas fa-plus mr-2"></i>New Case
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeCases.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-folder-plus text-dark-600 text-3xl mb-4"></i>
            <p className="text-dark-400">No active cases</p>
            <button className="mt-4 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              <i className="fas fa-plus mr-2"></i>Create New Case
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className={`p-4 bg-dark-800 rounded-lg border-l-4 ${getPriorityColor(caseItem.priority)} hover:bg-dark-700 transition-colors cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">{caseItem.name}</h4>
                  <span className={`text-xs text-white px-2 py-1 rounded ${getPriorityBadgeColor(caseItem.priority)}`}>
                    {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-dark-400 mt-2">{caseItem.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-dark-500">
                    <span>Assigned: {caseItem.assignedTo}</span>
                  </div>
                  <div className="text-xs text-dark-500">
                    <span>{formatTimeAgo(caseItem.lastActivity)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex-1 bg-dark-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressBarColor(caseItem.priority)}`}
                      style={{ width: `${caseItem.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-dark-400">{caseItem.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
