import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, FileText, Download, Clock, TrendingUp, Shield, Brain } from "lucide-react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ReportPreview {
  caseId: number;
  caseName: string;
  evidenceCount: number;
  threatCount: number;
  avgRiskScore: number;
  lastActivity: number | null;
  readyForReport: boolean;
}

interface ForensicReport {
  id: string;
  caseId: number;
  title: string;
  executiveSummary: string;
  findings: ReportFinding[];
  evidenceAnalysis: EvidenceAnalysis[];
  threatAssessment: ThreatAssessment;
  recommendations: string[];
  technicalDetails: TechnicalDetails;
  timeline: TimelineEvent[];
  riskScore: number;
  confidence: number;
  generatedAt: string;
  generatedBy: string;
}

interface ReportFinding {
  category: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  title: string;
  description: string;
  evidence: string[];
  impact: string;
  mitigation: string;
}

interface EvidenceAnalysis {
  evidenceId: number;
  filename: string;
  analysisType: string;
  results: any;
  significance: string;
  aiInsights: string;
}

interface ThreatAssessment {
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  threatActors: string[];
  attackVectors: string[];
  indicators: string[];
  timeline: string;
}

interface TechnicalDetails {
  methodology: string[];
  toolsUsed: string[];
  dataProcessed: {
    totalFiles: number;
    totalSize: string;
    fileTypes: Record<string, number>;
  };
  analysisMetrics: {
    processingTime: number;
    aiAnalysisCount: number;
    anomaliesDetected: number;
  };
}

interface TimelineEvent {
  timestamp: string;
  event: string;
  source: string;
  significance: 'critical' | 'high' | 'medium' | 'low';
}

export default function ForensicReports() {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [generatedReport, setGeneratedReport] = useState<ForensicReport | null>(null);

  // Get available cases
  const { data: cases = [] } = useQuery({
    queryKey: ['/api/cases'],
  });

  // Get report preview for selected case
  const { data: preview, isLoading: previewLoading } = useQuery({
    queryKey: ['/api/reports/preview', selectedCaseId],
    enabled: !!selectedCaseId,
  });

  // Report generation mutation
  const generateReportMutation = useMutation({
    mutationFn: async (caseId: number) => {
      return apiRequest(`/api/reports/generate/${caseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: (data) => {
      setGeneratedReport(data);
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
  });

  // Report status query
  const { data: reportStatus } = useQuery({
    queryKey: ['/api/reports/status'],
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'low': return <FileText className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Forensic Report Generation</h1>
            <p className="text-gray-400 mt-2">AI-powered comprehensive forensic analysis reports</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* System Status */}
        {reportStatus && (
          <Card className="bg-gray-800 border-gray-600 mb-8">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Report Generation Engine Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-400">System Status</p>
                  <Badge className={reportStatus.system === 'operational' ? 'bg-green-500' : 'bg-red-500'}>
                    {reportStatus.system}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">AI Insights</p>
                  <Badge className={reportStatus.aiInsights === 'enabled' ? 'bg-green-500' : 'bg-red-500'}>
                    {reportStatus.aiInsights}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Export Formats</p>
                  <p className="text-sm">{reportStatus.exportFormats?.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Capabilities</p>
                  <p className="text-sm">{reportStatus.capabilities?.length || 0} features</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!generatedReport ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Case Selection */}
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle>Select Case for Report Generation</CardTitle>
                <CardDescription>Choose an investigation case to generate a comprehensive forensic report</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {cases.map((case_: any) => (
                      <div
                        key={case_.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCaseId === case_.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedCaseId(case_.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{case_.name}</h3>
                            <p className="text-sm text-gray-400">{case_.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{case_.status}</Badge>
                              <Badge variant="outline">{case_.priority} priority</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Created</p>
                            <p className="text-sm">{new Date(case_.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  {selectedCaseId ? 'Analysis preview for selected case' : 'Select a case to view preview'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previewLoading && selectedCaseId && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {preview && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">{preview.caseName}</h3>
                      <p className="text-sm text-gray-400">Case ID: {preview.caseId}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Evidence Files</p>
                        <p className="text-2xl font-bold text-blue-400">{preview.evidenceCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Threats Detected</p>
                        <p className="text-2xl font-bold text-red-400">{preview.threatCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Avg Risk Score</p>
                        <p className="text-2xl font-bold text-yellow-400">{preview.avgRiskScore.toFixed(1)}/10</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Last Activity</p>
                        <p className="text-sm">
                          {preview.lastActivity
                            ? new Date(preview.lastActivity).toLocaleDateString()
                            : 'No activity'
                          }
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${preview.readyForReport ? 'text-green-400' : 'text-red-400'}`}>
                          {preview.readyForReport ? 'Ready for report generation' : 'Insufficient data for report'}
                        </p>
                      </div>
                      <Button
                        onClick={() => generateReportMutation.mutate(preview.caseId)}
                        disabled={!preview.readyForReport || generateReportMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {generateReportMutation.isPending ? 'Generating...' : 'Generate Report'}
                      </Button>
                    </div>

                    {generateReportMutation.isPending && (
                      <div className="mt-4">
                        <Progress value={33} className="w-full" />
                        <p className="text-sm text-gray-400 mt-2">Analyzing evidence and generating AI insights...</p>
                      </div>
                    )}
                  </div>
                )}

                {!selectedCaseId && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a case to view report preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Generated Report Display */
          <div className="space-y-6">
            {/* Report Header */}
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{generatedReport.title}</CardTitle>
                    <CardDescription>
                      Report ID: {generatedReport.id} • Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setGeneratedReport(null)}
                      variant="outline"
                      className="bg-gray-700 border-gray-600"
                    >
                      Generate New
                    </Button>
                    <Button
                      onClick={() => window.open(`/api/reports/export/${generatedReport.id}/pdf`)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Risk Score:</span>
                    <Badge className={getRiskBadgeColor(
                      generatedReport.riskScore >= 8 ? 'critical' :
                      generatedReport.riskScore >= 6 ? 'high' :
                      generatedReport.riskScore >= 4 ? 'medium' : 'low'
                    )}>
                      {generatedReport.riskScore.toFixed(1)}/10
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Confidence:</span>
                    <Badge variant="outline">
                      {(generatedReport.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Generated by:</span>
                    <span className="text-sm">{generatedReport.generatedBy}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Report Content Tabs */}
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-800">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="threats">Threats</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{generatedReport.executiveSummary}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle>Threat Assessment Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Overall Risk</p>
                        <Badge className={getRiskBadgeColor(generatedReport.threatAssessment.overallRisk)}>
                          {generatedReport.threatAssessment.overallRisk.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Attack Vectors</p>
                        <p className="text-sm">{generatedReport.threatAssessment.attackVectors.length} identified</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Indicators</p>
                        <p className="text-sm">{generatedReport.threatAssessment.indicators.length} found</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Timeline</p>
                        <p className="text-sm">{generatedReport.threatAssessment.timeline}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4">
                {generatedReport.findings.map((finding, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(finding.category)}
                        <CardTitle className="text-lg">{finding.title}</CardTitle>
                        <Badge className={getRiskBadgeColor(finding.category)}>
                          {finding.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-300">Description</h4>
                        <p className="text-sm text-gray-400">{finding.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-300">Impact</h4>
                        <p className="text-sm text-gray-400">{finding.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-300">Mitigation</h4>
                        <p className="text-sm text-gray-400">{finding.mitigation}</p>
                      </div>
                      {finding.evidence.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300">Supporting Evidence</h4>
                          <ul className="text-sm text-gray-400 list-disc list-inside">
                            {finding.evidence.map((evidence, i) => (
                              <li key={i}>{evidence}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4">
                {generatedReport.evidenceAnalysis.map((analysis, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle>{analysis.filename}</CardTitle>
                      <CardDescription>
                        Analysis Type: {analysis.analysisType} • Significance: {analysis.significance}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-300">AI Insights</h4>
                          <p className="text-sm text-gray-400">{analysis.aiInsights}</p>
                        </div>
                        {analysis.results && Object.keys(analysis.results).length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-300">Analysis Results</h4>
                            <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                              {JSON.stringify(analysis.results, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="threats" className="space-y-4">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle>Threat Assessment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-300">Threat Actors</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedReport.threatAssessment.threatActors.map((actor, index) => (
                          <Badge key={index} variant="outline">{actor}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300">Attack Vectors</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedReport.threatAssessment.attackVectors.map((vector, index) => (
                          <Badge key={index} variant="outline">{vector}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300">Indicators of Compromise</h4>
                      <ul className="text-sm text-gray-400 list-disc list-inside mt-2">
                        {generatedReport.threatAssessment.indicators.map((indicator, index) => (
                          <li key={index}>{indicator}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle>Security Recommendations</CardTitle>
                    <CardDescription>Actionable steps to improve security posture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {generatedReport.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-300">{recommendation}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle>Analysis Methodology</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {generatedReport.technicalDetails.methodology.map((method, index) => (
                          <li key={index}>• {method}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle>Tools Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {generatedReport.technicalDetails.toolsUsed.map((tool, index) => (
                          <li key={index}>• {tool}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle>Data Processed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-400">Total Files:</span>
                        <span className="ml-2 text-sm">{generatedReport.technicalDetails.dataProcessed.totalFiles}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Total Size:</span>
                        <span className="ml-2 text-sm">{generatedReport.technicalDetails.dataProcessed.totalSize}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">File Types:</span>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(generatedReport.technicalDetails.dataProcessed.fileTypes).map(([type, count]) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}: {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle>Analysis Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-400">Processing Time:</span>
                        <span className="ml-2 text-sm">{generatedReport.technicalDetails.analysisMetrics.processingTime}ms</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">AI Analyses:</span>
                        <span className="ml-2 text-sm">{generatedReport.technicalDetails.analysisMetrics.aiAnalysisCount}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Anomalies Detected:</span>
                        <span className="ml-2 text-sm">{generatedReport.technicalDetails.analysisMetrics.anomaliesDetected}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline */}
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle>Investigation Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generatedReport.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{event.event}</p>
                              <Badge className={getRiskBadgeColor(event.significance)} variant="outline">
                                {event.significance}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-400">
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                              <span className="text-xs text-gray-500">•</span>
                              <p className="text-xs text-gray-400">{event.source}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}