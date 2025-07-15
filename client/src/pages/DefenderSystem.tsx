import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Scan, Zap, Activity, Settings, History } from "lucide-react";

export default function DefenderSystem() {
  const [systemStatus, setSystemStatus] = useState({
    realTimeProtection: true,
    virusDefinitions: "Current",
    lastScan: "2 minutes ago",
    threatsDetected: 0,
    systemHealth: 98,
    scanProgress: 0,
    isScanning: false
  });

  const [recentThreats, setRecentThreats] = useState([
    {
      id: 1,
      type: "Malware",
      name: "Trojan.Win32.Suspicious",
      severity: "High",
      status: "Quarantined",
      timestamp: "2025-01-15 14:30:22",
      action: "Automatic removal",
      location: "C:\\Users\\Downloads\\suspicious_file.exe"
    },
    {
      id: 2,
      type: "Phishing",
      name: "Suspicious Email Link",
      severity: "Medium",
      status: "Blocked",
      timestamp: "2025-01-15 14:15:10",
      action: "Web protection blocked",
      location: "Chrome Browser"
    },
    {
      id: 3,
      type: "Ransomware",
      name: "Crypto.Ransomware.Variant",
      severity: "Critical",
      status: "Prevented",
      timestamp: "2025-01-15 13:45:33",
      action: "Behavioral analysis blocked",
      location: "C:\\Windows\\Temp\\encrypted.tmp"
    }
  ]);

  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      type: "Quick Scan",
      duration: "3 minutes",
      filesScanned: 12547,
      threatsFound: 0,
      timestamp: "2025-01-15 14:00:00",
      status: "Completed"
    },
    {
      id: 2,
      type: "Full System Scan",
      duration: "1 hour 23 minutes",
      filesScanned: 456789,
      threatsFound: 2,
      timestamp: "2025-01-15 08:30:00",
      status: "Completed"
    },
    {
      id: 3,
      type: "Custom Scan",
      duration: "15 minutes",
      filesScanned: 8934,
      threatsFound: 1,
      timestamp: "2025-01-15 07:15:00",
      status: "Completed"
    }
  ]);

  const [realTimeEvents, setRealTimeEvents] = useState([
    { time: "14:35:12", event: "File system monitor: No threats detected", type: "info" },
    { time: "14:35:08", event: "Network monitor: Suspicious connection blocked", type: "warning" },
    { time: "14:35:03", event: "Registry monitor: Legitimate change detected", type: "info" },
    { time: "14:34:58", event: "Process monitor: New application started", type: "info" },
    { time: "14:34:45", event: "Web protection: Malicious URL blocked", type: "warning" }
  ]);

  const startQuickScan = () => {
    setSystemStatus(prev => ({ ...prev, isScanning: true, scanProgress: 0 }));
    
    const interval = setInterval(() => {
      setSystemStatus(prev => {
        const newProgress = prev.scanProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, scanProgress: 100, isScanning: false, lastScan: "Just now" };
        }
        return { ...prev, scanProgress: newProgress };
      });
    }, 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "quarantined":
      case "blocked":
      case "prevented":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "detected":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "active":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  useEffect(() => {
    // Simulate real-time event updates
    const interval = setInterval(() => {
      const events = [
        { event: "File system monitor: No threats detected", type: "info" },
        { event: "Network monitor: Traffic analyzed", type: "info" },
        { event: "Registry monitor: System integrity verified", type: "info" },
        { event: "Process monitor: Applications running normally", type: "info" },
        { event: "Web protection: Safe browsing active", type: "info" }
      ];
      
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const currentTime = new Date().toLocaleTimeString();
      
      setRealTimeEvents(prev => [
        { time: currentTime, ...randomEvent },
        ...prev.slice(0, 4)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            DAFF Security Defender
          </h1>
          <p className="text-xl text-gray-400">
            Real-time threat detection and proactive system protection
          </p>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-3 text-green-400" />
                Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  {systemStatus.realTimeProtection ? "Active" : "Inactive"}
                </Badge>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Real-time protection enabled</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-3 text-blue-400" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-300">{systemStatus.systemHealth}%</span>
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <Progress value={systemStatus.systemHealth} className="w-full" />
                <p className="text-sm text-gray-400">Excellent performance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
                Threats Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-300">{recentThreats.length}</span>
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-sm text-gray-400 mt-2">All threats neutralized</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Scan className="w-5 h-5 mr-3 text-purple-400" />
                Last Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300">{systemStatus.lastScan}</span>
                <Scan className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Definitions: {systemStatus.virusDefinitions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Scanning Section */}
        {systemStatus.isScanning && (
          <Alert className="mb-8 bg-blue-900/20 border-blue-700">
            <Scan className="h-4 w-4 animate-spin" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Quick scan in progress...</span>
                <span className="text-sm font-medium">{systemStatus.scanProgress}%</span>
              </div>
              <Progress value={systemStatus.scanProgress} className="w-full mt-2" />
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="scan" className="data-[state=active]:bg-blue-600">
              Scan Options
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-blue-600">
              Threat History
            </TabsTrigger>
            <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
              Real-time Monitor
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Protection Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <h4 className="font-medium text-green-300">Real-time File Protection</h4>
                          <p className="text-xs text-gray-400">Scanning all file operations</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-400/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-blue-300">Web Protection</h4>
                          <p className="text-xs text-gray-400">Blocking malicious websites</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-400/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="font-medium text-purple-300">Behavioral Analysis</h4>
                          <p className="text-xs text-gray-400">Detecting suspicious behavior</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-400/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <div>
                          <h4 className="font-medium text-orange-300">Network Monitor</h4>
                          <p className="text-xs text-gray-400">Analyzing network traffic</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">CPU Usage</span>
                        <span className="text-sm font-medium text-green-400">12%</span>
                      </div>
                      <Progress value={12} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Memory Usage</span>
                        <span className="text-sm font-medium text-blue-400">8%</span>
                      </div>
                      <Progress value={8} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Disk I/O</span>
                        <span className="text-sm font-medium text-purple-400">5%</span>
                      </div>
                      <Progress value={5} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Network Activity</span>
                        <span className="text-sm font-medium text-orange-400">15%</span>
                      </div>
                      <Progress value={15} className="w-full" />
                    </div>

                    <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-400/30">
                      <h4 className="text-sm font-semibold text-green-300 mb-2">Performance Status</h4>
                      <p className="text-xs text-gray-300">
                        System running optimally with minimal resource usage. All protection modules active.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Zap className="w-5 h-5 mr-3 text-blue-400" />
                    Quick Scan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Scans most common locations where threats are typically found. Fast and efficient.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">~5 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Coverage:</span>
                      <span className="text-white">System files, memory</span>
                    </div>
                  </div>
                  <Button 
                    onClick={startQuickScan}
                    disabled={systemStatus.isScanning}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {systemStatus.isScanning ? "Scanning..." : "Start Quick Scan"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Scan className="w-5 h-5 mr-3 text-green-400" />
                    Full System Scan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Comprehensive scan of all files and folders on your system. Thorough protection.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">~1-2 hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Coverage:</span>
                      <span className="text-white">Entire system</span>
                    </div>
                  </div>
                  <Button 
                    disabled={systemStatus.isScanning}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Start Full Scan
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Settings className="w-5 h-5 mr-3 text-purple-400" />
                    Custom Scan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Choose specific folders or drives to scan. Customize your security approach.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">Variable</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Coverage:</span>
                      <span className="text-white">User-defined</span>
                    </div>
                  </div>
                  <Button 
                    disabled={systemStatus.isScanning}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Configure Scan
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <History className="w-6 h-6 mr-3" />
                  Scan History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Scan className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{scan.type}</h4>
                          <p className="text-sm text-gray-400">{scan.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">Duration: {scan.duration}</p>
                        <p className="text-sm text-gray-400">{scan.filesScanned.toLocaleString()} files scanned</p>
                        <p className="text-sm text-yellow-400">{scan.threatsFound} threats found</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-8 mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Recent Threat Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentThreats.map((threat) => (
                    <div key={threat.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <h4 className="font-medium text-white">{threat.name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge className={getStatusColor(threat.status)}>
                            {threat.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Type: <span className="text-white">{threat.type}</span></p>
                          <p className="text-gray-400">Action: <span className="text-white">{threat.action}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-400">Time: <span className="text-white">{threat.timestamp}</span></p>
                          <p className="text-gray-400">Location: <span className="text-white">{threat.location}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-8 mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Activity className="w-6 h-6 mr-3" />
                  Real-time Protection Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 font-medium">Real-time Protection Active</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Online</Badge>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Live Activity Feed</h4>
                    <div className="bg-gray-700/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      {realTimeEvents.map((event, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              event.type === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                            }`}></div>
                            <span className="text-sm text-gray-300">{event.event}</span>
                          </div>
                          <span className="text-xs text-gray-500">{event.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Protection Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Real-time Protection</h4>
                        <p className="text-sm text-gray-400">Continuous monitoring of file system</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Automatic Updates</h4>
                        <p className="text-sm text-gray-400">Keep virus definitions current</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Behavioral Analysis</h4>
                        <p className="text-sm text-gray-400">Detect suspicious behavior patterns</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Network Protection</h4>
                        <p className="text-sm text-gray-400">Monitor network traffic for threats</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">System Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                      <h4 className="font-medium text-blue-300 mb-2">DAFF Integration</h4>
                      <p className="text-sm text-gray-300">
                        Integrated with Digital Automation Forensic Framework for enhanced threat analysis
                      </p>
                    </div>

                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                      <h4 className="font-medium text-green-300 mb-2">Local Processing</h4>
                      <p className="text-sm text-gray-300">
                        All scanning and analysis performed locally to protect privacy
                      </p>
                    </div>

                    <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-400/30">
                      <h4 className="font-medium text-purple-300 mb-2">Performance Optimized</h4>
                      <p className="text-sm text-gray-300">
                        Minimal resource usage while maintaining comprehensive protection
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}