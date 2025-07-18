import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Terminal, 
  BookOpen, 
  ArrowRight, 
  Shield, 
  Brain, 
  Zap,
  Users,
  Award,
  MapPin,
  User,
  GraduationCap
} from "lucide-react";

export default function Introduction() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            DAFF
          </h1>
          <p className="text-4xl text-gray-200 mb-6 font-light">
            Digital Automation Forensic Framework
          </p>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Advanced AI-driven platform for comprehensive digital investigation, anomaly detection, and forensic analysis
          </p>
          
          {/* Quick Access Buttons */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button 
              onClick={() => setLocation('/tools')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg flex items-center space-x-2"
            >
              <Terminal className="w-6 h-6" />
              <span>Launch Tools Interface</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              onClick={() => setLocation('/academic')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg flex items-center space-x-2"
            >
              <BookOpen className="w-6 h-6" />
              <span>Academic Dashboard</span>
            </Button>
          </div>
        </div>



        {/* Project Overview Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Project Overview</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive digital forensic framework leveraging artificial intelligence for automated threat analysis and investigation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Core Features */}
            <Card className="bg-gray-800/50 border-gray-600 hover:border-blue-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Advanced machine learning algorithms for intelligent threat detection and analysis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600 hover:border-green-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Protection</h3>
                <p className="text-gray-300 text-sm">
                  Continuous monitoring and automated response to security threats
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Automated Processing</h3>
                <p className="text-gray-300 text-sm">
                  Self-sufficient flagging system with minimal human oversight required
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600 hover:border-yellow-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Terminal className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Professional Interface</h3>
                <p className="text-gray-300 text-sm">
                  Tools-inspired interface designed for forensic professionals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Stack Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Technology Stack</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Modern, scalable technologies ensuring robust performance and security
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React 18+", category: "Frontend" },
              { name: "TypeScript", category: "Language" },
              { name: "PostgreSQL", category: "Database" },
              { name: "OpenAI GPT-4o", category: "AI Engine" },
              { name: "Node.js", category: "Backend" },
              { name: "WebSockets", category: "Real-time" },
              { name: "Tailwind CSS", category: "Styling" },
              { name: "Drizzle ORM", category: "Data Layer" }
            ].map((tech, index) => (
              <div key={index} className="bg-gray-800/30 p-4 rounded-lg border border-gray-600 text-center">
                <div className="text-white font-semibold">{tech.name}</div>
                <div className="text-gray-400 text-sm">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Framework Features */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Framework Capabilities</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive digital forensic analysis with advanced automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">Analysis Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Anomaly Detection with Current World Threats</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Automated Evidence Processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">AI-Powered Threat Classification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Comprehensive Forensic Reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Network Traffic Analysis</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">System Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Real-time Security Monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Professional Tools Interface</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Multi-platform Deployment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Scalable Architecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">✓</Badge>
                  <span className="text-gray-200">Comprehensive API Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Explore DAFF?</h3>
            <p className="text-xl text-blue-100 mb-6">
              Experience the next generation of digital forensic analysis
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setLocation('/tools')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Launch Tools Interface
              </Button>
              <Button 
                onClick={() => setLocation('/academic')}
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                View Academic Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}