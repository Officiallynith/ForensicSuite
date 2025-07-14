import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AnalysisResult {
  flag: '+' | '-' | '=';
  confidence: number;
  reasoning: string;
  category: string;
  timestamp: string;
  processingTime: number;
}

export default function AutomatedAnalysis() {
  const [inputType, setInputType] = useState<'file' | 'text' | 'network' | 'transaction' | 'media'>('text');
  const [inputData, setInputData] = useState('');
  const [results, setResults] = useState<AnalysisResult[]>([]);

  // Get system status
  const { data: systemStatus } = useQuery({
    queryKey: ['/api/auto-analysis/status'],
    refetchInterval: 10000
  });

  // Single analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiRequest('/api/auto-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return response;
    },
    onSuccess: (data) => {
      setResults(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 results
      queryClient.invalidateQueries({ queryKey: ['/api/auto-analysis/status'] });
    }
  });

  // Batch analysis mutation
  const batchMutation = useMutation({
    mutationFn: async (inputs: any[]) => {
      const response = await apiRequest('/api/auto-analysis/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs })
      });
      return response;
    },
    onSuccess: (data) => {
      setResults(prev => [...data.results, ...prev].slice(0, 20));
    }
  });

  const handleAnalyze = () => {
    if (!inputData.trim()) return;

    const payload = {
      type: inputType,
      data: inputData,
      metadata: {
        source: 'manual_input',
        timestamp: new Date().toISOString()
      }
    };

    analysisMutation.mutate(payload);
  };

  const handleBatchAnalysis = () => {
    // Create sample batch for demonstration
    const sampleInputs = [
      {
        type: 'text',
        data: 'Urgent! Click this link to claim your prize: http://suspicious-site.com',
        metadata: { source: 'email' }
      },
      {
        type: 'network',
        data: {
          connections: [
            { ip: '192.168.1.100', port: 22 },
            { ip: '10.0.0.50', port: 80 }
          ],
          traffic: { volume: 1500000 }
        },
        metadata: { source: 'network_monitor' }
      },
      {
        type: 'transaction',
        data: {
          amount: 15000,
          frequency: 25,
          addresses: ['1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2']
        },
        metadata: { source: 'blockchain_monitor' }
      }
    ];

    batchMutation.mutate(sampleInputs);
  };

  const startRealTimeDemo = () => {
    // Simulate real-time analysis with mock data
    const mockData = [
      { type: 'text', data: 'Normal business communication about quarterly reports' },
      { type: 'text', data: 'URGENT: Your account will be suspended! Click here immediately!' },
      { type: 'network', data: { connections: [{ ip: '8.8.8.8', port: 443 }], traffic: { volume: 50000 } } },
      { type: 'network', data: { connections: Array.from({length: 20}, () => ({ ip: '192.168.1.100', port: 1337 })), traffic: { volume: 2000000 } } }
    ];

    mockData.forEach((data, index) => {
      setTimeout(() => {
        analysisMutation.mutate({
          ...data,
          metadata: { source: 'real_time_monitor', demo: true }
        });
      }, index * 2000);
    });
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case '+': return 'text-green-400';
      case '-': return 'text-red-400';
      case '=': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getFlagLabel = (flag: string) => {
    switch (flag) {
      case '+': return 'Positive (Safe)';
      case '-': return 'Negative (Threat)';
      case '=': return 'Suspicious (Investigate)';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">DAFF Automated Analysis System</h1>
          <p className="text-gray-300">
            Self-sufficient automated analysis with positive (+), negative (-), and suspicious (=) flagging
          </p>
        </div>

        {/* System Status */}
        {systemStatus && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">System: {systemStatus.system}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">Monitoring: {systemStatus.monitoring}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Capabilities: {systemStatus.capabilities?.length} modules</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <h3 className="font-medium mb-2">Flag System:</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-green-400">+</span> {systemStatus.flags?.positive}</div>
                <div><span className="text-red-400">-</span> {systemStatus.flags?.negative}</div>
                <div><span className="text-yellow-400">=</span> {systemStatus.flags?.suspicious}</div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Single Analysis */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Single Analysis</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Input Type</label>
                <select 
                  value={inputType} 
                  onChange={(e) => setInputType(e.target.value as any)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                >
                  <option value="text">Text Content</option>
                  <option value="file">File Analysis</option>
                  <option value="network">Network Data</option>
                  <option value="transaction">Transaction Data</option>
                  <option value="media">Media Content</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Input Data</label>
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={`Enter ${inputType} data to analyze...`}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 h-32"
                />
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={analysisMutation.isPending || !inputData.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-3 rounded font-medium"
              >
                {analysisMutation.isPending ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {/* Batch & Real-time */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Automated Operations</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Batch Analysis</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Process multiple inputs simultaneously for efficient analysis
                </p>
                <button
                  onClick={handleBatchAnalysis}
                  disabled={batchMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 p-3 rounded font-medium"
                >
                  {batchMutation.isPending ? 'Processing Batch...' : 'Run Batch Analysis'}
                </button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Start continuous monitoring and analysis of incoming data
                </p>
                <button
                  onClick={startRealTimeDemo}
                  className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-medium"
                >
                  Start Real-time Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <span className="text-sm text-gray-400">{results.length} recent results</span>
          </div>
          
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No analysis results yet. Start an analysis to see results here.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded border-l-4 border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-2xl font-bold ${getFlagColor(result.flag)}`}>
                        {result.flag}
                      </span>
                      <div>
                        <span className={`font-medium ${getFlagColor(result.flag)}`}>
                          {getFlagLabel(result.flag)}
                        </span>
                        <span className="text-sm text-gray-400 ml-2">
                          ({(result.confidence * 100).toFixed(1)}% confidence)
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <div>{result.category}</div>
                      <div>{result.processingTime}ms</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{result.reasoning}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Algorithm Information */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Algorithm Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-green-400 mb-2">Positive (+) Detection</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Verified digital signatures</li>
                <li>• Authenticated sources</li>
                <li>• Normal network patterns</li>
                <li>• Legitimate transactions</li>
                <li>• Safe file types</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-red-400 mb-2">Negative (-) Detection</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Malware signatures</li>
                <li>• Phishing attempts</li>
                <li>• Deepfake content</li>
                <li>• Money laundering patterns</li>
                <li>• Botnet activity</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-yellow-400 mb-2">Suspicious (=) Detection</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Anomalous patterns</li>
                <li>• Unverified sources</li>
                <li>• Modified metadata</li>
                <li>• Unusual transactions</li>
                <li>• Partial threat matches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}