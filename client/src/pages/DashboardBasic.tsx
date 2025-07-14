export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Academic Header Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-blue-400 mb-6">
              DAFF: Digital Automation Forensic Framework
            </h1>
            
            <div className="border-t border-gray-600 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-400">Submitted by</h3>
                  <div className="space-y-1">
                    <p className="text-xl font-medium">Nithin H K</p>
                    <p className="text-gray-300">JSS Mahavidyapeetha</p>
                    <p className="text-gray-300">JSS Science and Technology University</p>
                    <p className="text-gray-300">Mysuru – 570 006</p>
                    <p className="text-blue-300 font-medium">DEPARTMENT OF COMPUTER SCIENCE</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-400">Guided by</h3>
                  <div className="space-y-1">
                    <p className="text-xl font-medium">Shwetha S</p>
                    <p className="text-gray-300">Assistant Professor</p>
                    <p className="text-gray-300">Department of Computer Science</p>
                    <p className="text-gray-300">JSS Science and Technology University</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4 mt-6">
              <p className="text-gray-400 text-sm">
                An advanced digital forensics framework with current world anomaly detection capabilities
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          System Overview
        </h2>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>PostgreSQL Database Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>AI Analysis Engine Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Threat Intelligence Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Current World Anomaly Detection Ready</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a 
            href="/anomaly-detection" 
            className="block bg-blue-600 hover:bg-blue-700 p-6 rounded-lg text-center transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">🧠 Anomaly Detection</h3>
            <p className="text-blue-100">AI-powered current world threat analysis</p>
          </a>

          <a 
            href="/automated-analysis" 
            className="block bg-green-600 hover:bg-green-700 p-6 rounded-lg text-center transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">🤖 Automated Analysis</h3>
            <p className="text-green-100">Self-sufficient flagging system (+/-/=)</p>
          </a>

          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">📊 Case Management</h3>
            <p className="text-gray-300">Investigation tracking and evidence management</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">DAFF Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>PostgreSQL Database Integration</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Deepfake Detection & Analysis</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Cryptocurrency Transaction Forensics</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Social Media Manipulation Detection</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Network Anomaly Analysis</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>AI-Generated Content Identification</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Real-time Threat Intelligence</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}