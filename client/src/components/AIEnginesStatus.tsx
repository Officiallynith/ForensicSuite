import { useQuery } from "@tanstack/react-query";
import { AiAnalysisJob } from "@shared/schema";

function getJobDisplayName(jobType: string): string {
  switch (jobType) {
    case "deepfake": return "Deepfake Detection";
    case "social_media": return "Social Media Analysis";
    case "network": return "Network Anomaly Detection";
    case "crypto": return "Crypto Transaction Analysis";
    default: return jobType;
  }
}

function getJobIcon(jobType: string): string {
  switch (jobType) {
    case "deepfake": return "fas fa-eye";
    case "social_media": return "fas fa-share-alt";
    case "network": return "fas fa-network-wired";
    case "crypto": return "fab fa-bitcoin";
    default: return "fas fa-cog";
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "running": return "bg-success";
    case "queued": return "bg-warning";
    case "completed": return "bg-primary";
    case "failed": return "bg-error";
    default: return "bg-dark-600";
  }
}

function formatJobStats(job: AiAnalysisJob): string {
  if (job.jobType === "network") {
    return `Processing: ${(job.itemsTotal / 1000000).toFixed(1)}M packets`;
  } else if (job.jobType === "social_media") {
    return `Processing: ${(job.itemsTotal / 1000).toFixed(1)}k posts`;
  } else if (job.jobType === "crypto") {
    return `Processing: ${(job.itemsTotal / 1000).toFixed(1)}k transactions`;
  } else {
    return `Processing: ${job.itemsTotal} files`;
  }
}

export function AIEnginesStatus() {
  const { data: aiJobs = [], isLoading } = useQuery<AiAnalysisJob[]>({
    queryKey: ["/api/ai-jobs"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-dark-900 rounded-xl border border-dark-800">
        <div className="p-6 border-b border-dark-800">
          <h3 className="text-lg font-semibold text-white">AI Analysis Engines</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-dark-800 rounded"></div>
                <div className="h-2 bg-dark-800 rounded"></div>
                <div className="h-3 bg-dark-800 rounded"></div>
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
        <h3 className="text-lg font-semibold text-white">AI Analysis Engines</h3>
      </div>

      <div className="p-6 space-y-4">
        {aiJobs.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-robot text-dark-600 text-3xl mb-4"></i>
            <p className="text-dark-400">No active AI analysis jobs</p>
          </div>
        ) : (
          aiJobs.map((job) => (
            <div key={job.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {getJobDisplayName(job.jobType)}
                </span>
                <span className={`w-2 h-2 ${getStatusColor(job.status)} rounded-full animate-pulse`}></span>
              </div>
              
              <div className="bg-dark-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    job.status === "running" ? "bg-success" :
                    job.status === "queued" ? "bg-warning" :
                    job.status === "completed" ? "bg-primary" : "bg-error"
                  }`}
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-dark-400">
                <span>{formatJobStats(job)}</span>
                <span>{job.progress}% complete</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
