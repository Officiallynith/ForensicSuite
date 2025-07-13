import { useQuery } from "@tanstack/react-query";
import { Evidence } from "@shared/schema";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const evidenceDate = new Date(date);
  const diffMs = now.getTime() - evidenceDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "< 1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

function getFileIcon(fileType: string): string {
  if (fileType.startsWith("image/")) return "fas fa-file-image";
  if (fileType.startsWith("video/")) return "fas fa-file-video";
  if (fileType.startsWith("audio/")) return "fas fa-file-audio";
  if (fileType.includes("pdf")) return "fas fa-file-pdf";
  if (fileType.includes("text")) return "fas fa-file-alt";
  if (fileType.includes("json")) return "fab fa-bitcoin"; // For crypto data
  if (fileType.includes("pcap")) return "fas fa-network-wired"; // For network data
  return "fas fa-file";
}

function getFileIconColor(fileType: string): string {
  if (fileType.startsWith("image/")) return "text-primary";
  if (fileType.startsWith("video/")) return "text-primary";
  if (fileType.includes("json")) return "text-accent";
  if (fileType.includes("pcap")) return "text-warning";
  return "text-dark-400";
}

function getRiskScoreColor(score: number): string {
  if (score >= 8) return "bg-error";
  if (score >= 6) return "bg-warning";
  if (score >= 4) return "bg-accent";
  return "bg-success";
}

function getAnalysisDescription(evidence: Evidence): string {
  if (evidence.aiAnalysisResults?.deepfake) {
    const result = evidence.aiAnalysisResults.deepfake;
    if (result.isDeepfake) {
      return `AI-generated content detected with ${Math.round(result.confidence * 100)}% confidence`;
    }
    return "Authentic content verified by AI analysis";
  }
  
  if (evidence.analysisStatus === "completed") {
    return "Analysis completed - no anomalies detected";
  } else if (evidence.analysisStatus === "processing") {
    return "AI analysis in progress...";
  } else if (evidence.analysisStatus === "failed") {
    return "Analysis failed - manual review required";
  }
  
  return "Pending AI analysis";
}

export function EvidenceList() {
  const { data: evidence = [], isLoading } = useQuery<Evidence[]>({
    queryKey: ["/api/evidence"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get recent evidence (last 5 items)
  const recentEvidence = evidence
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-dark-900 rounded-xl border border-dark-800">
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Evidence</h3>
            <div className="h-4 w-16 bg-dark-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-dark-800 rounded-lg">
                <div className="w-10 h-10 bg-dark-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-dark-700 rounded"></div>
                  <div className="h-3 bg-dark-700 rounded w-3/4"></div>
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
          <h3 className="text-lg font-semibold text-white">Recent Evidence</h3>
          <button className="text-primary hover:text-blue-400 text-sm transition-colors">
            View All <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <div className="p-6">
        {recentEvidence.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-folder-open text-dark-600 text-3xl mb-4"></i>
            <p className="text-dark-400">No evidence files uploaded</p>
            <button className="mt-4 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              <i className="fas fa-upload mr-2"></i>Upload Evidence
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEvidence.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`${getFileIcon(item.fileType)} ${getFileIconColor(item.fileType)}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white truncate">{item.filename}</h4>
                    <span className={`text-xs text-white px-2 py-1 rounded ${getRiskScoreColor(item.riskScore || 0)}`}>
                      Risk: {(item.riskScore || 0).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400 mt-1">{getAnalysisDescription(item)}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-dark-500">
                    <span>{formatFileSize(item.size)}</span>
                    <span>{formatTimeAgo(item.createdAt)}</span>
                    <span className={
                      item.analysisStatus === "completed" ? "text-success" :
                      item.analysisStatus === "processing" ? "text-warning" :
                      item.analysisStatus === "failed" ? "text-error" : "text-dark-400"
                    }>
                      {item.analysisStatus.charAt(0).toUpperCase() + item.analysisStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
