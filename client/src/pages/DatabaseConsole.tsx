import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Database,
  Play,
  Download,
  Upload,
  Trash2,
  BarChart3,
  RefreshCw,
  Terminal,
  HardDrive,
  Clock,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DatabaseStats {
  tables: TableInfo[];
  totalRows: number;
  databaseSize: string;
  connections: number;
  uptime: string;
  version: string;
}

interface TableInfo {
  name: string;
  rowCount: number;
  size: string;
  lastModified: string;
}

interface QueryResult {
  rows: any[];
  rowCount: number;
  executionTime: number;
  affectedRows?: number;
}

interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  created: string;
  tables: string[];
  type: 'full' | 'schema' | 'data';
}

export default function DatabaseConsole() {
  const { toast } = useToast();
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string>("");
  const [backupType, setBackupType] = useState<'full' | 'schema' | 'data'>('full');

  // Fetch database stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['/api/database/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch backups
  const { data: backups, isLoading: backupsLoading, refetch: refetchBackups } = useQuery({
    queryKey: ['/api/database/backups'],
  });

  // Execute query mutation
  const executeQueryMutation = useMutation({
    mutationFn: async (sqlQuery: string) => {
      return apiRequest('/api/database/query', {
        method: 'POST',
        body: JSON.stringify({ query: sqlQuery }),
      });
    },
    onSuccess: (result) => {
      setQueryResult(result);
      toast({
        title: "Query executed successfully",
        description: `Returned ${result.rowCount} rows in ${result.executionTime}ms`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Query execution failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsExecuting(false);
    },
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (type: 'full' | 'schema' | 'data') => {
      return apiRequest('/api/database/backup', {
        method: 'POST',
        body: JSON.stringify({ type }),
      });
    },
    onSuccess: (backup) => {
      toast({
        title: "Backup created successfully",
        description: `Backup ${backup.filename} created (${backup.size})`,
      });
      refetchBackups();
    },
    onError: (error: any) => {
      toast({
        title: "Backup creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      return apiRequest('/api/database/restore', {
        method: 'POST',
        body: JSON.stringify({ backupId }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Backup restored successfully",
        description: "Database has been restored from backup",
      });
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "Backup restoration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      return apiRequest('/api/database/backup', {
        method: 'DELETE',
        body: JSON.stringify({ backupId }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Backup deleted successfully",
      });
      refetchBackups();
    },
    onError: (error: any) => {
      toast({
        title: "Backup deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Optimize database mutation
  const optimizeDatabaseMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/database/optimize', {
        method: 'POST',
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Database optimization completed",
        description: result.message,
      });
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "Database optimization failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const executeQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Invalid query",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    executeQueryMutation.mutate(query);
  };

  const formatQueryResult = (result: QueryResult) => {
    if (!result.rows || result.rows.length === 0) {
      return (
        <Alert>
          <AlertDescription>
            Query executed successfully but returned no rows.
            {result.affectedRows && ` ${result.affectedRows} rows affected.`}
          </AlertDescription>
        </Alert>
      );
    }

    const columns = Object.keys(result.rows[0]);

    return (
      <ScrollArea className="h-96 w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-mono text-xs">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column} className="font-mono text-xs max-w-48 truncate">
                    {typeof row[column] === 'object' && row[column] !== null
                      ? JSON.stringify(row[column])
                      : String(row[column] || 'NULL')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Database Console</h1>
              <p className="text-slate-400">DAFF PostgreSQL Management Interface</p>
            </div>
          </div>
          <Button
            onClick={() => refetchStats()}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="query" className="data-[state=active]:bg-slate-800">
              Query Console
            </TabsTrigger>
            <TabsTrigger value="backups" className="data-[state=active]:bg-slate-800">
              Backups
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-slate-800">
              Maintenance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Database Stats Cards */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Database Size
                    </CardTitle>
                    <HardDrive className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats?.databaseSize || '0 bytes'}
                    </div>
                    <p className="text-xs text-slate-400">
                      {stats?.totalRows || 0} total rows
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Connections
                    </CardTitle>
                    <Users className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats?.connections || 0}
                    </div>
                    <p className="text-xs text-slate-400">Active connections</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Uptime
                    </CardTitle>
                    <Clock className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats?.uptime || '0:00:00'}
                    </div>
                    <p className="text-xs text-slate-400">
                      PostgreSQL {stats?.version || 'Unknown'}
                    </p>
                  </CardContent>
                </Card>

                {/* Tables Overview */}
                <Card className="md:col-span-3 bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Tables Overview</CardTitle>
                    <CardDescription className="text-slate-400">
                      Database tables and their statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-slate-300">Table Name</TableHead>
                            <TableHead className="text-slate-300">Row Count</TableHead>
                            <TableHead className="text-slate-300">Size</TableHead>
                            <TableHead className="text-slate-300">Last Modified</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.tables?.map((table) => (
                            <TableRow key={table.name} className="border-slate-700">
                              <TableCell className="font-mono text-green-400">
                                {table.name}
                              </TableCell>
                              <TableCell className="text-white">
                                {table.rowCount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {table.size}
                              </TableCell>
                              <TableCell className="text-slate-400">
                                {new Date(table.lastModified).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Query Console Tab */}
          <TabsContent value="query" className="space-y-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Terminal className="h-5 w-5 mr-2" />
                  SQL Query Console
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Execute SQL queries against the DAFF database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    SQL Query
                  </label>
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className="font-mono text-sm bg-slate-800 border-slate-600 text-green-400 min-h-32"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={executeQuery}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isExecuting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Execute Query
                  </Button>

                  <Button
                    onClick={() => setQuery("")}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Clear
                  </Button>
                </div>

                {queryResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Query Results</h3>
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {queryResult.rowCount} rows • {queryResult.executionTime}ms
                      </Badge>
                    </div>
                    {formatQueryResult(queryResult)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Database Backups</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Database Backup</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Choose the type of backup to create
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Backup Type
                      </label>
                      <Select value={backupType} onValueChange={(value: 'full' | 'schema' | 'data') => setBackupType(value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="full">Full Backup (Schema + Data)</SelectItem>
                          <SelectItem value="schema">Schema Only</SelectItem>
                          <SelectItem value="data">Data Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => createBackupMutation.mutate(backupType)}
                      disabled={createBackupMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createBackupMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Create Backup
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Filename</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Size</TableHead>
                      <TableHead className="text-slate-300">Created</TableHead>
                      <TableHead className="text-slate-300">Tables</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups?.map((backup: BackupInfo) => (
                      <TableRow key={backup.id} className="border-slate-700">
                        <TableCell className="font-mono text-green-400">
                          {backup.filename}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={backup.type === 'full' ? 'default' : 'secondary'}
                            className={
                              backup.type === 'full'
                                ? 'bg-green-600'
                                : backup.type === 'schema'
                                ? 'bg-blue-600'
                                : 'bg-yellow-600'
                            }
                          >
                            {backup.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{backup.size}</TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(backup.created).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {backup.tables.length} tables
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => restoreBackupMutation.mutate(backup.id)}
                              disabled={restoreBackupMutation.isPending}
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteBackupMutation.mutate(backup.id)}
                              disabled={deleteBackupMutation.isPending}
                              className="border-red-600 text-red-400 hover:bg-red-600/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Database Maintenance
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Optimize and maintain database performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => optimizeDatabaseMutation.mutate()}
                    disabled={optimizeDatabaseMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700 h-12"
                  >
                    {optimizeDatabaseMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    Optimize Database
                  </Button>

                  <Button
                    onClick={() => refetchStats()}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 h-12"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Statistics
                  </Button>
                </div>

                <Alert className="border-yellow-600 bg-yellow-600/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Database optimization may take several minutes to complete. 
                    The application will remain available during this process.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}