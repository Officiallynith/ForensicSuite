import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";

export default function NetworkStorageAutomation() {
  const [automationStatus, setAutomationStatus] = useState({
    networkMonitoring: 85,
    storageAnalysis: 92,
    threatDetection: 78,
    dataProcessing: 95
  });

  const automationTools = [
    {
      category: "Network Analysis",
      tools: [
        {
          name: "Suricata + ELK Stack",
          status: "active",
          description: "Real-time intrusion detection and comprehensive logging",
          automation: 90,
          features: ["Real-time monitoring", "ML anomaly detection", "Automated alerting"]
        },
        {
          name: "Zeek Protocol Analyzer",
          status: "configured",
          description: "Deep protocol analysis and metadata extraction",
          automation: 85,
          features: ["Protocol analysis", "Custom scripting", "Forensic logging"]
        }
      ]
    },
    {
      category: "Storage Management",
      tools: [
        {
          name: "MinIO + Apache Kafka",
          status: "active",
          description: "High-performance object storage with event-driven processing",
          automation: 95,
          features: ["S3 compatibility", "Event streaming", "Distributed architecture"]
        },
        {
          name: "Elasticsearch + FileBeat",
          status: "active",
          description: "Powerful search and analytics for evidence management",
          automation: 88,
          features: ["Real-time indexing", "Advanced search", "Log correlation"]
        }
      ]
    },
    {
      category: "AI/ML Integration",
      tools: [
        {
          name: "TensorFlow Serving",
          status: "active",
          description: "Production-ready model serving for automated analysis",
          automation: 82,
          features: ["Model deployment", "High-performance inference", "A/B testing"]
        },
        {
          name: "ONNX Runtime",
          status: "configured",
          description: "Cross-platform model execution and optimization",
          automation: 75,
          features: ["Model compatibility", "Performance optimization", "GPU acceleration"]
        }
      ]
    }
  ];

  const implementationPhases = [
    {
      phase: "Phase 1: Foundation Setup",
      duration: "Weeks 1-4",
      progress: 100,
      status: "completed",
      milestones: [
        "Infrastructure assessment and planning",
        "Core automation framework installation",
        "Integration testing and validation"
      ]
    },
    {
      phase: "Phase 2: Network Automation",
      duration: "Weeks 5-8",
      progress: 85,
      status: "in-progress",
      milestones: [
        "Network monitoring automation deployment",
        "Anomaly detection integration",
        "Threat intelligence correlation"
      ]
    },
    {
      phase: "Phase 3: Storage Automation",
      duration: "Weeks 9-12",
      progress: 45,
      status: "in-progress",
      milestones: [
        "Evidence processing automation",
        "Data lifecycle management",
        "Search and discovery automation"
      ]
    },
    {
      phase: "Phase 4: Integration & Optimization",
      duration: "Weeks 13-16",
      progress: 15,
      status: "planned",
      milestones: [
        "End-to-end workflow automation",
        "Performance optimization",
        "User training and documentation"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "configured":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <Zap className="w-4 h-4 text-blue-400" />;
      case "planned":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "configured":
      case "in-progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "planned":
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
      default:
        return "bg-red-500/20 text-red-300 border-red-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Network & Storage Automation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive automation plan for seamless network and storage analysis within the DAFF framework
          </p>
        </div>

        {/* Real-time Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Network Monitoring
                <CheckCircle className="w-5 h-5 text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={automationStatus.networkMonitoring} className="w-full" />
                <p className="text-sm text-gray-400">{automationStatus.networkMonitoring}% Automated</p>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  Real-time Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Storage Analysis
                <CheckCircle className="w-5 h-5 text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={automationStatus.storageAnalysis} className="w-full" />
                <p className="text-sm text-gray-400">{automationStatus.storageAnalysis}% Automated</p>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  Fully Operational
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Threat Detection
                <Zap className="w-5 h-5 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={automationStatus.threatDetection} className="w-full" />
                <p className="text-sm text-gray-400">{automationStatus.threatDetection}% Automated</p>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                  In Progress
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Data Processing
                <CheckCircle className="w-5 h-5 text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={automationStatus.dataProcessing} className="w-full" />
                <p className="text-sm text-gray-400">{automationStatus.dataProcessing}% Automated</p>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  Optimized
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
            <TabsTrigger value="tools" className="data-[state=active]:bg-blue-600">
              Automation Tools
            </TabsTrigger>
            <TabsTrigger value="implementation" className="data-[state=active]:bg-blue-600">
              Implementation
            </TabsTrigger>
            <TabsTrigger value="benefits" className="data-[state=active]:bg-blue-600">
              Expected Benefits
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-8 mt-8">
            {automationTools.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">{category.category}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <Card key={toolIndex} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{tool.name}</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(tool.status)}
                            <Badge className={getStatusColor(tool.status)}>
                              {tool.status}
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">{tool.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Automation Level</span>
                            <span className="text-sm font-medium">{tool.automation}%</span>
                          </div>
                          <Progress value={tool.automation} className="w-full" />
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-300">Key Features:</h4>
                          <ul className="space-y-1">
                            {tool.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center space-x-2 text-xs text-gray-400">
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="implementation" className="space-y-8 mt-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Implementation Timeline</h3>
              {implementationPhases.map((phase, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{phase.phase}</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(phase.status)}
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Duration: {phase.duration}</span>
                      <span className="text-sm font-medium">{phase.progress}% Complete</span>
                    </div>
                    
                    <Progress value={phase.progress} className="w-full" />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300">Milestones:</h4>
                      <ul className="space-y-2">
                        {phase.milestones.map((milestone, milestoneIndex) => (
                          <li key={milestoneIndex} className="flex items-center space-x-3 text-sm text-gray-400">
                            {phase.progress > (milestoneIndex + 1) * (100 / phase.milestones.length) ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : phase.status === "in-progress" && milestoneIndex === 0 ? (
                              <Zap className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-500" />
                            )}
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Quantitative Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">75% Faster Processing</h4>
                      <p className="text-sm text-gray-300">Significant reduction in evidence processing time through automation</p>
                    </div>
                    
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">40% Cost Savings</h4>
                      <p className="text-sm text-gray-300">Reduced manual labor costs within the first year</p>
                    </div>
                    
                    <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-400/30">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">90% Error Reduction</h4>
                      <p className="text-sm text-gray-300">Significant decrease in human error rates</p>
                    </div>
                    
                    <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-400/30">
                      <h4 className="text-lg font-semibold text-orange-300 mb-2">300% Capacity Increase</h4>
                      <p className="text-sm text-gray-300">Enhanced concurrent case handling capability</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Qualitative Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-400/30">
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2">24/7 Operations</h4>
                      <p className="text-sm text-gray-300">Continuous monitoring and processing without human intervention</p>
                    </div>
                    
                    <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-400/30">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-2">Improved Consistency</h4>
                      <p className="text-sm text-gray-300">Standardized processing procedures across all cases</p>
                    </div>
                    
                    <div className="bg-pink-500/10 p-4 rounded-lg border border-pink-400/30">
                      <h4 className="text-lg font-semibold text-pink-300 mb-2">Enhanced Collaboration</h4>
                      <p className="text-sm text-gray-300">Better information sharing and case coordination</p>
                    </div>
                    
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-400/30">
                      <h4 className="text-lg font-semibold text-yellow-300 mb-2">Faster Response</h4>
                      <p className="text-sm text-gray-300">Rapid identification and response to critical threats</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">System Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Evidence Processing Throughput</span>
                      <span className="text-green-400 font-semibold">47 cases/hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">System Uptime</span>
                      <span className="text-green-400 font-semibold">99.97%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Response Time</span>
                      <span className="text-blue-400 font-semibold">2.3 seconds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Resource Utilization</span>
                      <span className="text-yellow-400 font-semibold">73% optimal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">False Positive Rate</span>
                      <span className="text-green-400 font-semibold">3.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Detection Accuracy</span>
                      <span className="text-green-400 font-semibold">94.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Data Integrity Success</span>
                      <span className="text-green-400 font-semibold">99.98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">User Satisfaction</span>
                      <span className="text-blue-400 font-semibold">4.6/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Real-time Automation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30 text-center">
                    <div className="text-3xl mb-2">🟢</div>
                    <h4 className="text-lg font-semibold text-green-300 mb-1">Network Monitoring</h4>
                    <p className="text-sm text-gray-300">All systems operational</p>
                  </div>
                  
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30 text-center">
                    <div className="text-3xl mb-2">🔵</div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-1">Storage Processing</h4>
                    <p className="text-sm text-gray-300">Processing 12 new files</p>
                  </div>
                  
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-400/30 text-center">
                    <div className="text-3xl mb-2">🟣</div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-1">AI Analysis</h4>
                    <p className="text-sm text-gray-300">3 models running inference</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-800 border-gray-700 inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Implement Full Automation?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl">
                Transform your digital forensic capabilities with comprehensive network and storage automation. 
                Reduce processing time by 75% while improving accuracy and scaling your operations.
              </p>
              <div className="space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Implementation
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Download Full Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}