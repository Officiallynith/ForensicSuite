import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardColumns() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Introduction (Takes 1/3 of width on large screens) */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-xl border border-blue-500/30">
                <div className="text-center mb-6">
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    DAFF
                  </h1>
                  <p className="text-xl text-gray-300 mb-2">
                    Digital Automation Forensic Framework
                  </p>
                  <p className="text-sm text-gray-400">
                    Advanced AI-driven platform for comprehensive digital investigation
                  </p>
                </div>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-center text-white">
                      Academic Research Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
                      <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                        <span className="mr-2">👨‍🎓</span>
                        Student Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Name:</span>
                          <span className="text-white font-medium">Nithin H K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Department:</span>
                          <span className="text-white">Computer Science</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Project:</span>
                          <span className="text-white">DAFF Framework</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
                      <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                        <span className="mr-2">🏫</span>
                        Institution
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">University:</span>
                          <span className="text-white">JSS S&T University</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Location:</span>
                          <span className="text-white">Mysuru – 570 006</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Guide:</span>
                          <span className="text-white">Shwetha S</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Position:</span>
                          <span className="text-white">Assistant Professor</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 space-y-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                    <h4 className="text-sm font-semibold text-green-300 mb-2">Research Focus</h4>
                    <p className="text-xs text-gray-300">
                      Developing AI-powered forensic analysis tools for modern digital threats including 
                      deepfakes, cryptocurrency fraud, and social media manipulation.
                    </p>
                  </div>

                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-400/30">
                    <h4 className="text-sm font-semibold text-orange-300 mb-2">Innovation</h4>
                    <p className="text-xs text-gray-300">
                      Integrating machine learning with traditional forensic methods to create 
                      comprehensive automated analysis systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard (Takes 2/3 of width on large screens) */}
          <div className="xl:col-span-2">
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-4 text-white">System Dashboard</h2>
                  <p className="text-xl text-gray-400">
                    Real-time monitoring and analysis capabilities
                  </p>
                </div>

                {/* System Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                        Database Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                        PostgreSQL Connected
                      </Badge>
                      <p className="text-xs text-gray-400 mt-2">Real-time data storage active</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                        AI Analysis Engine
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                        GPT-4o Integration Active
                      </Badge>
                      <p className="text-xs text-gray-400 mt-2">Advanced AI analysis ready</p>
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
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                        Monitoring Active
                      </Badge>
                      <p className="text-xs text-gray-400 mt-2">Real-time threat detection</p>
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
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                        Systems Ready
                      </Badge>
                      <p className="text-xs text-gray-400 mt-2">Current world analysis ready</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <a 
                    href="/anomaly-detection" 
                    className="group block bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
                      <h3 className="text-xl font-bold mb-2">Anomaly Detection</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        AI-powered current world threat analysis
                      </p>
                    </div>
                  </a>

                  <a 
                    href="/automated-analysis" 
                    className="group block bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
                      <h3 className="text-xl font-bold mb-2">Automated Analysis</h3>
                      <p className="text-green-100 text-sm leading-relaxed">
                        Self-sufficient flagging system (+/-/=)
                      </p>
                    </div>
                  </a>

                  <a 
                    href="/reports" 
                    className="group block bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
                      <h3 className="text-xl font-bold mb-2">Forensic Reports</h3>
                      <p className="text-purple-100 text-sm leading-relaxed">
                        AI-powered comprehensive reports
                      </p>
                    </div>
                  </a>
                </div>

                <Separator className="bg-gray-700" />

                {/* Feature Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Core Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {[
                          "PostgreSQL Database Integration",
                          "Deepfake Detection & Analysis",
                          "Cryptocurrency Transaction Forensics",
                          "Social Media Manipulation Detection",
                          "Network Anomaly Analysis",
                          "AI-Generated Content Identification",
                          "Real-time Threat Intelligence",
                          "Automated Report Generation"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">{feature}</span>
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
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                          <h4 className="text-lg font-semibold text-blue-300 mb-2">DFF Documentation</h4>
                          <p className="text-sm text-gray-300 mb-3">
                            Comprehensive research documentation covering methodology and implementation.
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
                            Technical guide for expanding DAFF functionality with scalability optimization.
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

                {/* Quick Actions */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-center transition-colors">
                        <div className="text-2xl mb-2">📁</div>
                        <span className="text-sm font-medium">Upload Evidence</span>
                      </button>
                      
                      <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center transition-colors">
                        <div className="text-2xl mb-2">🔍</div>
                        <span className="text-sm font-medium">Start Analysis</span>
                      </button>
                      
                      <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center transition-colors">
                        <div className="text-2xl mb-2">📊</div>
                        <span className="text-sm font-medium">Generate Report</span>
                      </button>
                      
                      <button className="bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-center transition-colors">
                        <div className="text-2xl mb-2">⚠️</div>
                        <span className="text-sm font-medium">View Threats</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}