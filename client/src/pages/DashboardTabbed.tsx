import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DashboardTabbed() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const IntroductionContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          DAFF
        </h1>
        <p className="text-3xl text-gray-300 mb-4 font-light">
          Digital Automation Forensic Framework
        </p>
        <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
          Advanced AI-driven platform for comprehensive anomaly detection and digital investigation
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-6 text-white">
              Academic Research Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-500/20 p-6 rounded-xl border border-blue-400/40">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
                    <span className="mr-3 text-2xl">👨‍🎓</span>
                    Student Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Name:</span>
                      <span className="text-white font-semibold">Nithin H K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Department:</span>
                      <span className="text-white">Computer Science</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Project:</span>
                      <span className="text-white">DAFF Framework</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-purple-500/20 p-6 rounded-xl border border-purple-400/40">
                  <h3 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">
                    <span className="mr-3 text-2xl">🏫</span>
                    Institution Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Institution:</span>
                      <span className="text-white">JSS Mahavidyapeetha</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">University:</span>
                      <span className="text-white">JSS Science & Technology</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Location:</span>
                      <span className="text-white">Mysuru – 570 006</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Guide:</span>
                      <span className="text-white">Shwetha S, Assistant Professor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-gray-300 leading-relaxed">
                  DAFF represents a cutting-edge approach to digital forensics, combining artificial intelligence 
                  with traditional investigative methods to provide comprehensive anomaly detection and threat analysis.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                  <h4 className="text-lg font-semibold text-green-300 mb-2">Research Goals</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Develop AI-powered anomaly detection systems</li>
                    <li>• Create comprehensive forensic analysis tools</li>
                    <li>• Implement real-time threat intelligence</li>
                    <li>• Build scalable forensic framework</li>
                  </ul>
                </div>
                
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-400/30">
                  <h4 className="text-lg font-semibold text-orange-300 mb-2">Technical Innovation</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Machine learning integration</li>
                    <li>• Cross-platform compatibility</li>
                    <li>• Real-time processing capabilities</li>
                    <li>• Advanced reporting systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">System Dashboard</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Real-time monitoring and analysis capabilities for digital forensic investigations
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-400 font-medium">PostgreSQL Connected</p>
            <p className="text-xs text-gray-400 mt-1">Real-time data storage active</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
              AI Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-400 font-medium">Analysis Online</p>
            <p className="text-xs text-gray-400 mt-1">GPT-4o integration active</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
              Threat Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-400 font-medium">Monitoring Active</p>
            <p className="text-xs text-gray-400 mt-1">Real-time threat detection</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-400 font-medium">Systems Ready</p>
            <p className="text-xs text-gray-400 mt-1">Current world analysis ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <a 
          href="/anomaly-detection" 
          className="group block bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
            <h3 className="text-2xl font-bold mb-3">Anomaly Detection</h3>
            <p className="text-blue-100 leading-relaxed">
              AI-powered current world threat analysis with real-time monitoring capabilities
            </p>
          </div>
        </a>

        <a 
          href="/automated-analysis" 
          className="group block bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 className="text-2xl font-bold mb-3">Automated Analysis</h3>
            <p className="text-green-100 leading-relaxed">
              Self-sufficient flagging system with positive, negative, and suspicious classification
            </p>
          </div>
        </a>

        <a 
          href="/reports" 
          className="group block bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
            <h3 className="text-2xl font-bold mb-3">Forensic Reports</h3>
            <p className="text-purple-100 leading-relaxed">
              AI-powered comprehensive report generation with detailed analysis and insights
            </p>
          </div>
        </a>
      </div>

      <Separator className="bg-gray-700" />

      {/* DAFF Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Core Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                "PostgreSQL Database Integration",
                "Deepfake Detection & Analysis",
                "Cryptocurrency Transaction Forensics",
                "Social Media Manipulation Detection",
                "Network Anomaly Analysis",
                "AI-Generated Content Identification",
                "Real-time Threat Intelligence"
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Academic Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                <h4 className="text-lg font-semibold text-blue-300 mb-2">DFF Documentation</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Comprehensive research documentation covering methodology, goals, and implementation strategies.
                </p>
                <a 
                  href="/dff-documentation" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  View Documentation
                </a>
              </div>

              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-400/30">
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Enhancement Plan</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Technical implementation guide for expanding DAFF functionality with scalability optimization.
                </p>
                <a 
                  href="/enhancement-plan" 
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  View Enhancement Plan
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800 border border-gray-700">
              <TabsTrigger 
                value="introduction" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Introduction
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="introduction" className="space-y-8">
            <IntroductionContent />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <DashboardContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}