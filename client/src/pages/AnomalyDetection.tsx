import { useState, useCallback } from "react";
import { Upload, Brain, AlertTriangle, CheckCircle, XCircle, Eye, Shield, Zap, Coins } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AnalysisResult {
  type: string;
  result: any;
  timestamp: string;
}

export default function AnomalyDetection() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<string>("deepfake");
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} ready for analysis`,
      });
    }
  }, [toast]);

  const runAnalysis = useCallback(async (analysisType: string) => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file before running analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setActiveAnalysis(analysisType);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('analysisType', analysisType);

      const response = await apiRequest('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const newResult: AnalysisResult = {
        type: analysisType,
        result: response.result,
        timestamp: new Date().toISOString(),
      };

      setAnalysisResults(prev => [newResult, ...prev]);
      
      toast({
        title: "Analysis completed",
        description: `${analysisType} analysis finished successfully`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedFile, toast]);

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'deepfake': return <Eye className="h-5 w-5" />;
      case 'crypto': return <Coins className="h-5 w-5" />;
      case 'social': return <Shield className="h-5 w-5" />;
      case 'network': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const formatResult = (type: string, result: any) => {
    switch (type) {
      case 'deepfake':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Deepfake Detection</span>
              <Badge variant={result.isDeepfake ? "destructive" : "secondary"}>
                {result.isDeepfake ? "FAKE" : "AUTHENTIC"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <span className="font-medium">{result.confidence}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Score:</span>
              <span className={`font-medium ${getRiskColor(result.riskScore)}`}>
                {result.riskScore}/100
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.details}</p>
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Cryptocurrency Analysis</span>
              <Badge variant={result.riskScore > 50 ? "destructive" : "secondary"}>
                {result.riskScore > 50 ? "HIGH RISK" : "LOW RISK"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Suspicious Transactions:</span>
              <span className="font-medium">{result.suspiciousTxCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Laundering Probability:</span>
              <span className={`font-medium ${getRiskColor(result.launderingProbability)}`}>
                {result.launderingProbability}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.details}</p>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Social Media Analysis</span>
              <Badge variant={result.riskLevel === 'high' ? "destructive" : result.riskLevel === 'medium' ? "default" : "secondary"}>
                {result.riskLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Manipulation Score:</span>
              <span className={`font-medium ${getRiskColor(result.manipulationScore)}`}>
                {result.manipulationScore}/100
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Suspicious Patterns:</span>
              {result.suspiciousPatterns.map((pattern: string, index: number) => (
                <Badge key={index} variant="outline" className="mr-1 mb-1">
                  {pattern}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{result.details}</p>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Network Anomaly Detection</span>
              <Badge variant={result.anomalyDetected ? "destructive" : "secondary"}>
                {result.anomalyDetected ? "ANOMALY DETECTED" : "NORMAL"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Threat Level:</span>
              <span className={`font-medium ${result.threatLevel === 'high' ? 'text-red-500' : result.threatLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                {result.threatLevel.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Suspicious Connections:</span>
              <span className="font-medium">{result.suspiciousConnections}</span>
            </div>
            <p className="text-sm text-muted-foreground">{result.details}</p>
          </div>
        );

      default:
        return <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Current World Anomaly Detection
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced AI-powered detection for modern digital threats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Evidence Upload
            </CardTitle>
            <CardDescription>
              Upload files for anomaly detection analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,.txt,.json,.pcap,.csv"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Images, videos, network captures, transaction data
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">{uploadedFile.name}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => runAnalysis('deepfake')}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full"
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                Deepfake
              </Button>
              <Button
                onClick={() => runAnalysis('crypto')}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full"
                variant="outline"
              >
                <Coins className="h-4 w-4 mr-2" />
                Crypto
              </Button>
              <Button
                onClick={() => runAnalysis('social')}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full"
                variant="outline"
              >
                <Shield className="h-4 w-4 mr-2" />
                Social
              </Button>
              <Button
                onClick={() => runAnalysis('network')}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Network
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing {activeAnalysis}...</span>
                </div>
                <Progress value={45} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              Real-time anomaly detection results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No analysis results yet. Upload a file and run analysis to see results.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analysisResults.map((result, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getAnalysisIcon(result.type)}
                          <span className="font-medium capitalize">{result.type} Analysis</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {formatResult(result.type, result.result)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detection Modules Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Modules</CardTitle>
          <CardDescription>
            Current world anomaly detection capabilities powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deepfake" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deepfake">Deepfake Detection</TabsTrigger>
              <TabsTrigger value="crypto">Crypto Analysis</TabsTrigger>
              <TabsTrigger value="social">Social Engineering</TabsTrigger>
              <TabsTrigger value="network">Network Anomalies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deepfake" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Deepfake & AI-Generated Media Detection</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced neural network analysis to detect AI-generated images, videos, and audio content. 
                Identifies manipulation artifacts, inconsistencies in facial features, and synthetic media patterns.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-600">Face Swap</div>
                  <div className="text-sm text-gray-600">Detection</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-600">Voice Clone</div>
                  <div className="text-sm text-gray-600">Analysis</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-600">Synthetic</div>
                  <div className="text-sm text-gray-600">Content</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-600">Manipulation</div>
                  <div className="text-sm text-gray-600">Artifacts</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">Cryptocurrency Transaction Analysis</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Blockchain forensics and cryptocurrency transaction analysis for money laundering detection, 
                suspicious activity identification, and wallet clustering analysis.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="font-semibold text-yellow-600">Money</div>
                  <div className="text-sm text-gray-600">Laundering</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="font-semibold text-yellow-600">Wallet</div>
                  <div className="text-sm text-gray-600">Clustering</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="font-semibold text-yellow-600">Chain</div>
                  <div className="text-sm text-gray-600">Analysis</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="font-semibold text-yellow-600">Risk</div>
                  <div className="text-sm text-gray-600">Scoring</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Social Media Manipulation Detection</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered analysis of social media content to identify manipulation campaigns, bot networks, 
                fake accounts, and coordinated inauthentic behavior.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-semibold text-green-600">Bot</div>
                  <div className="text-sm text-gray-600">Networks</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-semibold text-green-600">Fake</div>
                  <div className="text-sm text-gray-600">Accounts</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-semibold text-green-600">Coordinated</div>
                  <div className="text-sm text-gray-600">Behavior</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-semibold text-green-600">Sentiment</div>
                  <div className="text-sm text-gray-600">Manipulation</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Network Anomaly Detection</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time network traffic analysis for IoT device compromise detection, unusual communication patterns, 
                and advanced persistent threat identification.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-600">IoT</div>
                  <div className="text-sm text-gray-600">Compromise</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-600">APT</div>
                  <div className="text-sm text-gray-600">Detection</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-600">Traffic</div>
                  <div className="text-sm text-gray-600">Analysis</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-600">Behavioral</div>
                  <div className="text-sm text-gray-600">Anomalies</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}