import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Activity, 
  HardDrive, 
  Wifi, 
  Clock,
  Database,
  Shield,
  Zap
} from "lucide-react";

interface SystemStats {
  cpu: number;
  memory: string;
  disk: number;
  network: 'connected' | 'disconnected';
  database: 'connected' | 'disconnected';
  analysis: 'idle' | 'running' | 'completed';
  totalEvidence: number;
  currentCase: string;
}

export default function StatusBar() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 34,
    memory: '2.1GB',
    disk: 78,
    network: 'connected',
    database: 'connected',
    analysis: 'idle',
    totalEvidence: 15,
    currentCase: 'Investigation_2024'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate system stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.max(15, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        disk: Math.max(60, Math.min(90, prev.disk + (Math.random() - 0.5) * 5))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-400';
    if (value < thresholds[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConnectionStatus = (status: 'connected' | 'disconnected') => {
    return status === 'connected' 
      ? 'text-green-400' 
      : 'text-red-400';
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs mono-font">
      <div className="flex items-center space-x-6">
        {/* Application Info */}
        <div className="flex items-center space-x-1">
          <span className="text-blue-400 font-semibold">DAFF v2.1</span>
        </div>
        
        <div className="text-gray-500">|</div>
        
        {/* Case Info */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Case:</span>
          <span className="text-white">{stats.currentCase}</span>
        </div>
        
        <div className="text-gray-500">|</div>
        
        {/* Evidence Count */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Evidence:</span>
          <span className="text-white">{stats.totalEvidence} files</span>
        </div>
        
        <div className="text-gray-500">|</div>
        
        {/* Analysis Status */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Status:</span>
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0.5 ${
              stats.analysis === 'running' ? 'text-blue-400 border-blue-400' :
              stats.analysis === 'completed' ? 'text-green-400 border-green-400' :
              'text-gray-400 border-gray-400'
            }`}
          >
            {stats.analysis === 'running' && <Zap className="w-3 h-3 mr-1" />}
            {stats.analysis}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* System Performance */}
        <div className="flex items-center space-x-1">
          <Cpu className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">CPU:</span>
          <span className={getStatusColor(stats.cpu, [50, 80])}>{stats.cpu.toFixed(0)}%</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">Mem:</span>
          <span className="text-white">{stats.memory}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <HardDrive className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">Disk:</span>
          <span className={getStatusColor(stats.disk, [70, 85])}>{stats.disk}%</span>
        </div>
        
        <div className="text-gray-500">|</div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-gray-400" />
            <span className={getConnectionStatus(stats.database)}>DB</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Wifi className="w-3 h-3 text-gray-400" />
            <span className={getConnectionStatus(stats.network)}>NET</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-gray-400" />
            <span className="text-green-400">SEC</span>
          </div>
        </div>
        
        <div className="text-gray-500">|</div>
        
        {/* Current Time */}
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-white">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}