import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import InterfaceToggle from "@/components/InterfaceToggle";
import ContextMenu from "@/components/ContextMenu";
import StatusBar from "@/components/StatusBar";
import { 
  File, 
  Folder, 
  Play, 
  Pause, 
  Square, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Settings, 
  Terminal,
  Activity,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Minus,
  Database
} from "lucide-react";
import { Link } from "wouter";

interface Evidence {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'complete' | 'warning' | 'error' | 'processing' | 'pending';
  hash?: string;
  modified?: string;
}

interface AnalysisResult {
  id: string;
  type: string;
  title: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

interface ConsoleMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const mockEvidence: Evidence[] = [
  { id: '1', name: 'email.pst', type: 'PST', size: '2.1MB', status: 'complete', hash: 'sha256:a1b2c3...', modified: '2024-01-15 14:30' },
  { id: '2', name: 'disk.img', type: 'IMG', size: '4.2GB', status: 'warning', hash: 'sha256:d4e5f6...', modified: '2024-01-15 12:15' },
  { id: '3', name: 'network.pcap', type: 'PCAP', size: '856KB', status: 'processing', hash: 'sha256:g7h8i9...', modified: '2024-01-15 16:45' },
  { id: '4', name: 'memory.dmp', type: 'DMP', size: '1.8GB', status: 'pending', hash: 'sha256:j0k1l2...', modified: '2024-01-15 09:20' },
  { id: '5', name: 'logs.txt', type: 'LOG', size: '45KB', status: 'error', hash: 'sha256:m3n4o5...', modified: '2024-01-15 18:00' }
];

const mockAnalysisResults: AnalysisResult[] = [
  { id: '1', type: 'Malware Detection', title: 'Suspicious Executable Found', details: 'PE32 executable with obfuscated strings detected in email.pst', severity: 'high', timestamp: '14:31:22' },
  { id: '2', type: 'Network Analysis', title: 'Anomalous Traffic Pattern', details: 'Unusual connection to 192.168.1.100:4444 detected', severity: 'medium', timestamp: '14:29:15' },
  { id: '3', type: 'File System', title: 'Hidden Directory Structure', details: 'Alternate data streams found in NTFS partition', severity: 'low', timestamp: '14:25:08' },
  { id: '4', type: 'Cryptographic Analysis', title: 'Weak Encryption Detected', details: 'DES encryption used for sensitive data', severity: 'medium', timestamp: '14:20:45' }
];

const mockConsoleMessages: ConsoleMessage[] = [
  { id: '1', timestamp: '14:31:25', type: 'info', message: 'Starting analysis of evidence file: email.pst' },
  { id: '2', timestamp: '14:31:26', type: 'success', message: 'File signature verified: Microsoft Outlook PST' },
  { id: '3', timestamp: '14:31:28', type: 'info', message: 'Extracting email headers and attachments...' },
  { id: '4', timestamp: '14:31:30', type: 'warning', message: 'Suspicious attachment detected: invoice.exe (PE32)' },
  { id: '5', timestamp: '14:31:32', type: 'info', message: 'Running AI analysis on suspicious content...' },
  { id: '6', timestamp: '14:31:35', type: 'error', message: 'Hash mismatch detected in file integrity check' },
  { id: '7', timestamp: '14:31:37', type: 'success', message: 'Analysis complete: 3 threats identified' }
];

export default function ToolsLayout() {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(mockEvidence[0]);
  const [filterText, setFilterText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState(mockConsoleMessages);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    item?: Evidence;
  }>({ isOpen: false, x: 0, y: 0 });
  const filterInputRef = useRef<HTMLInputElement>(null);

  // Simulate real-time console updates
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setConsoleMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            type: Math.random() > 0.7 ? 'warning' : 'info',
            message: `Processing block ${Math.floor(Math.random() * 1000)}...`
          }
        ]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Keyboard shortcuts for Tools interface
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setIsAnalyzing(!isAnalyzing);
      } else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        filterInputRef.current?.focus();
      } else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        // Export functionality would go here
        console.log('Export triggered');
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Navigate evidence list
        const currentIndex = mockEvidence.findIndex(e => e.id === selectedEvidence?.id);
        if (e.key === 'ArrowDown' && currentIndex < mockEvidence.length - 1) {
          setSelectedEvidence(mockEvidence[currentIndex + 1]);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          setSelectedEvidence(mockEvidence[currentIndex - 1]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAnalyzing, selectedEvidence]);

  const getStatusIcon = (status: Evidence['status']) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-4 h-4 status-complete" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 status-warning" />;
      case 'error': return <XCircle className="w-4 h-4 status-error" />;
      case 'processing': return <Clock className="w-4 h-4 status-processing animate-spin" />;
      case 'pending': return <Minus className="w-4 h-4 status-pending" />;
    }
  };

  const getSeverityColor = (severity: AnalysisResult['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
    }
  };

  const getConsoleMessageClass = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'success': return 'console-line terminal-success';
      case 'warning': return 'console-line terminal-warning';
      case 'error': return 'console-line terminal-error';
      case 'info': return 'console-line terminal-fg';
    }
  };

  return (
    <div className="h-screen terminal-bg terminal-fg flex flex-col">
      <InterfaceToggle />
      {/* Menu Bar - Wireshark Style */}
      <div className="terminal-header border-b terminal-border px-4 py-1">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 text-sm">
            <Button variant="ghost" size="sm" className="toolbar-btn">File</Button>
            <Button variant="ghost" size="sm" className="toolbar-btn">Analyze</Button>
            <Button variant="ghost" size="sm" className="toolbar-btn">View</Button>
            <Button variant="ghost" size="sm" className="toolbar-btn">Tools</Button>
            <Button variant="ghost" size="sm" className="toolbar-btn">Help</Button>
          </div>
        </div>
      </div>

      {/* Toolbar - Linux Tool Style */}
      <div className="bg-gray-800 border-b terminal-border px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className="flex items-center space-x-1"
            >
              {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAnalyzing ? 'Pause' : 'Start'} Analysis</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center space-x-1">
              <Upload className="w-4 h-4" />
              <span>Add Evidence</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Link href="/database">
              <Button size="sm" variant="outline" className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>Database Console</span>
              </Button>
            </Link>
            <Button size="sm" variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Search className="w-4 h-4 terminal-muted" />
              <Input
                ref={filterInputRef}
                placeholder="Filter evidence... (Ctrl+F)"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-64 h-8 bg-gray-700 border-gray-600 text-sm"
              />
            </div>
            <Button size="sm" variant="ghost">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Three Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Evidence List Pane (Left) */}
        <div className="w-1/3 border-r terminal-border flex flex-col">
          <div className="pane-header">
            <div className="flex items-center justify-between">
              <span>Evidence Files</span>
              <Badge variant="secondary" className="text-xs">
                {mockEvidence.length}
              </Badge>
            </div>
          </div>
          <div className="pane-content">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">#</th>
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEvidence
                    .filter(evidence => 
                      evidence.name.toLowerCase().includes(filterText.toLowerCase()) ||
                      evidence.type.toLowerCase().includes(filterText.toLowerCase())
                    )
                    .map((evidence, index) => (
                    <tr 
                      key={evidence.id}
                      className={`border-b border-gray-700 hover:bg-gray-800 cursor-pointer ${
                        selectedEvidence?.id === evidence.id ? 'bg-blue-900/30' : ''
                      }`}
                      onClick={() => setSelectedEvidence(evidence)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          isOpen: true,
                          x: e.clientX,
                          y: e.clientY,
                          item: evidence
                        });
                      }}
                    >
                      <td className="p-2 terminal-muted mono-font">{index + 1}</td>
                      <td className="p-2 mono-font">{evidence.name}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {evidence.type}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          {getStatusIcon(evidence.status)}
                        </div>
                      </td>
                      <td className="p-2 terminal-muted mono-font">{evidence.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analysis Details Pane (Right) */}
        <div className="w-2/3 flex flex-col">
          <div className="pane-header">
            <div className="flex items-center justify-between">
              <span>Analysis Results</span>
              {selectedEvidence && (
                <span className="text-xs terminal-muted mono-font">
                  {selectedEvidence.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            {/* Evidence Details */}
            {selectedEvidence && (
              <div className="bg-gray-800 border-b terminal-border p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="terminal-muted">File:</span>
                    <span className="ml-2 mono-font">{selectedEvidence.name}</span>
                  </div>
                  <div>
                    <span className="terminal-muted">Type:</span>
                    <span className="ml-2">{selectedEvidence.type}</span>
                  </div>
                  <div>
                    <span className="terminal-muted">Size:</span>
                    <span className="ml-2 mono-font">{selectedEvidence.size}</span>
                  </div>
                  <div>
                    <span className="terminal-muted">Status:</span>
                    <span className="ml-2 flex items-center">
                      {getStatusIcon(selectedEvidence.status)}
                      <span className="capitalize">{selectedEvidence.status}</span>
                    </span>
                  </div>
                  {selectedEvidence.hash && (
                    <div className="col-span-2">
                      <span className="terminal-muted">Hash:</span>
                      <span className="ml-2 mono-font text-xs">{selectedEvidence.hash}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analysis Results Tree */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {mockAnalysisResults.map((result) => (
                  <div key={result.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                        <span className={`text-sm font-medium ${getSeverityColor(result.severity)}`}>
                          {result.title}
                        </span>
                      </div>
                      <span className="text-xs terminal-muted mono-font">
                        {result.timestamp}
                      </span>
                    </div>
                    <p className="text-sm terminal-muted">{result.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Console Pane (Bottom) */}
      <div className="h-64 border-t terminal-border flex flex-col">
        <div className="pane-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>Console Output</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                Clear
              </Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                Export Log
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-black p-2">
          <div className="space-y-1">
            <div className="text-xs terminal-success mono-font">
              [user@daff:~]$ analyze --type comprehensive evidence/{selectedEvidence?.name || 'evidence.file'}
            </div>
            {consoleMessages.map((msg) => (
              <div key={msg.id} className={getConsoleMessageClass(msg.type)}>
                <span className="terminal-muted">[{msg.timestamp}]</span>
                <span className="ml-2">{msg.message}</span>
              </div>
            ))}
            {isAnalyzing && (
              <div className="console-line terminal-processing">
                <span className="terminal-muted">[{new Date().toLocaleTimeString()}]</span>
                <span className="ml-2">Analysis in progress...</span>
                <span className="ml-2 animate-pulse">▊</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        item={contextMenu.item}
        onClose={() => setContextMenu({ isOpen: false, x: 0, y: 0 })}
      />

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}