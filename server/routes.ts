import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiAnalysisService } from "./services/aiAnalysis";
import { automatedAnalysis } from "./services/automatedAnalysis";
import { reportGenerator } from "./services/reportGeneration";
import { threatIntelligenceService } from "./services/threatIntelligence";
import { insertCaseSchema, insertEvidenceSchema, insertNotificationSchema } from "@shared/schema";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);



  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const connectedClients: Set<WebSocket> = new Set();

  wss.on('connection', (ws: WebSocket) => {
    connectedClients.add(ws);
    
    ws.on('close', () => {
      connectedClients.delete(ws);
    });

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connection_established',
      timestamp: new Date().toISOString()
    }));
  });

  // Function to broadcast to all connected clients
  const broadcast = (data: any) => {
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Initialize threat intelligence feed
  await threatIntelligenceService.generateMockThreats();
  threatIntelligenceService.simulateRealTimeUpdates();

  // Dashboard data endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      const [
        activeCases,
        recentEvidence,
        activeThreats,
        aiJobs,
        user
      ] = await Promise.all([
        storage.getCasesByStatus("active"),
        storage.getRecentEvidence(5),
        storage.getRecentThreats(10),
        storage.getActiveAiJobs(),
        storage.getUser(1) // Default user
      ]);

      const dashboardData = {
        stats: {
          threatsDetected: await storage.getActiveThreats().then(threats => threats.length),
          evidenceFiles: await storage.getEvidence().then(evidence => evidence.length),
          activeInvestigations: activeCases.length,
          aiProgress: aiJobs.length > 0 ? Math.round(aiJobs.reduce((acc, job) => acc + job.progress, 0) / aiJobs.length) : 0
        },
        activeCases,
        recentEvidence,
        activeThreats,
        aiJobs,
        user,
        notifications: await storage.getUnreadNotifications(1)
      };

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Cases endpoints
  app.get("/api/cases", async (req, res) => {
    try {
      const cases = await storage.getCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/cases", async (req, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const newCase = await storage.createCase(validatedData);
      
      // Broadcast new case to connected clients
      broadcast({
        type: 'case_created',
        data: newCase
      });

      res.status(201).json(newCase);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedCase = await storage.updateCase(id, req.body);
      
      if (!updatedCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      broadcast({
        type: 'case_updated',
        data: updatedCase
      });

      res.json(updatedCase);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Evidence endpoints
  app.get("/api/evidence", async (req, res) => {
    try {
      const evidence = await storage.getEvidence();
      res.json(evidence);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/evidence", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const evidenceData = {
        filename: req.file.originalname,
        originalPath: req.body.originalPath || req.file.originalname,
        fileType: req.file.mimetype,
        size: req.file.size,
        hash: req.body.hash || `sha256_${Date.now()}`,
        caseId: req.body.caseId ? parseInt(req.body.caseId) : null,
        riskScore: 0,
        analysisStatus: "pending" as const,
        aiAnalysisResults: null
      };

      const validatedData = insertEvidenceSchema.parse(evidenceData);
      const newEvidence = await storage.createEvidence(validatedData);

      // Start AI analysis in background
      if (req.file.buffer) {
        try {
          let aiResults: any = {};
          
          if (req.file.mimetype.startsWith('image/') || req.file.mimetype.startsWith('video/')) {
            aiResults.deepfake = await aiAnalysisService.analyzeDeepfake(req.file.buffer, req.file.originalname);
          }
          
          // Update evidence with AI results
          const updatedEvidence = await storage.updateEvidence(newEvidence.id, {
            analysisStatus: "completed",
            aiAnalysisResults: aiResults,
            riskScore: aiResults.deepfake?.riskScore || Math.random() * 10,
            processedAt: new Date()
          });

          broadcast({
            type: 'evidence_analyzed',
            data: updatedEvidence
          });
        } catch (aiError) {
          await storage.updateEvidence(newEvidence.id, {
            analysisStatus: "failed"
          });
        }
      }

      res.status(201).json(newEvidence);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Threats endpoints
  app.get("/api/threats", async (req, res) => {
    try {
      const threats = await storage.getActiveThreats();
      res.json(threats);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/threats/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const threats = await storage.getRecentThreats(limit);
      res.json(threats);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // AI Analysis endpoints
  app.get("/api/ai-jobs", async (req, res) => {
    try {
      const jobs = await storage.getActiveAiJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/ai-analysis/text", async (req, res) => {
    try {
      const { text, analysisType } = req.body;
      
      if (!text || !analysisType) {
        return res.status(400).json({ error: "Text and analysis type required" });
      }

      let result;
      switch (analysisType) {
        case 'social_media':
          result = await aiAnalysisService.analyzeSocialMediaContent(text);
          break;
        case 'threat_intelligence':
          result = await aiAnalysisService.generateThreatIntelligenceFromText(text);
          break;
        default:
          return res.status(400).json({ error: "Invalid analysis type" });
      }

      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Automated DAFF Analysis endpoints
  app.post("/api/auto-analysis", async (req, res) => {
    try {
      const { type, data, metadata } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({ error: "Type and data are required" });
      }

      const result = await automatedAnalysis.analyzeAutomatically({
        type,
        data,
        metadata
      });

      // Log results for monitoring
      console.log(`[DAFF-AUTO] Analysis result: ${result.flag} (${result.confidence})`);

      // Broadcast real-time results
      broadcast({
        type: 'auto_analysis_complete',
        data: result
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/auto-analysis/batch", async (req, res) => {
    try {
      const { inputs } = req.body;
      
      if (!inputs || !Array.isArray(inputs)) {
        return res.status(400).json({ error: "Inputs array is required" });
      }

      const results = await automatedAnalysis.processBatch(inputs);

      // Generate summary statistics
      const summary = {
        total: results.length,
        positive: results.filter(r => r.flag === '+').length,
        negative: results.filter(r => r.flag === '-').length,
        suspicious: results.filter(r => r.flag === '=').length,
        averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
        processingTime: results.reduce((sum, r) => sum + r.processingTime, 0)
      };

      broadcast({
        type: 'batch_analysis_complete',
        data: { results, summary }
      });

      res.json({ results, summary });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/auto-analysis/status", async (req, res) => {
    try {
      // Return current system status and monitoring statistics
      const status = {
        system: 'operational',
        timestamp: new Date().toISOString(),
        monitoring: 'active',
        capabilities: [
          'file_analysis',
          'text_analysis', 
          'network_analysis',
          'transaction_analysis',
          'media_analysis'
        ],
        flags: {
          positive: 'Legitimate/Safe content (+)',
          negative: 'Confirmed threats (-)',
          suspicious: 'Requires investigation (=)'
        }
      };

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Notifications endpoints
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || 1;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Forensic Report Generation endpoints
  app.post("/api/reports/generate/:caseId", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const options = req.body || {};
      
      if (!caseId || isNaN(caseId)) {
        return res.status(400).json({ error: "Valid case ID is required" });
      }

      console.log(`[DAFF-REPORTS] Generating report for case ${caseId}`);
      const report = await reportGenerator.generateReport(caseId, options);

      // Broadcast report generation completion
      broadcast({
        type: 'report_generated',
        data: { 
          reportId: report.id, 
          caseId: report.caseId,
          riskScore: report.riskScore,
          confidence: report.confidence
        }
      });

      res.json(report);
    } catch (error) {
      console.error('[DAFF-REPORTS] Report generation failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Report generation failed" });
    }
  });

  app.get("/api/reports/preview/:caseId", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      
      if (!caseId || isNaN(caseId)) {
        return res.status(400).json({ error: "Valid case ID is required" });
      }

      // Generate a quick preview without full AI analysis for faster response
      const caseData = await storage.getCase(caseId);
      const evidence = await storage.getEvidenceByCase(caseId);
      const threats = await storage.getActiveThreats();
      
      const preview = {
        caseId,
        caseName: caseData?.name || 'Unnamed Case',
        evidenceCount: evidence.length,
        threatCount: threats.filter(t => t.caseId === caseId).length,
        avgRiskScore: evidence.reduce((sum, e) => sum + (e.riskScore || 0), 0) / Math.max(evidence.length, 1),
        lastActivity: evidence.length > 0 ? Math.max(...evidence.map(e => new Date(e.createdAt).getTime())) : null,
        readyForReport: evidence.length > 0
      };

      res.json(preview);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Preview generation failed" });
    }
  });

  app.get("/api/reports/export/:reportId/pdf", async (req, res) => {
    try {
      const reportId = req.params.reportId;
      
      // In a real implementation, you would retrieve the stored report
      // For now, we'll generate a text version
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="forensic-report-${reportId}.pdf"`);
      
      const textReport = `Forensic Report ${reportId}\nGenerated: ${new Date().toISOString()}\n\nThis is a placeholder PDF export.`;
      res.send(Buffer.from(textReport, 'utf-8'));
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Export failed" });
    }
  });

  app.get("/api/reports/status", async (req, res) => {
    try {
      const status = {
        system: 'operational',
        reportingEngine: 'active',
        aiInsights: 'enabled',
        exportFormats: ['PDF', 'JSON', 'Text'],
        timestamp: new Date().toISOString(),
        capabilities: [
          'Executive Summary Generation',
          'Technical Analysis',
          'Threat Assessment',
          'Evidence Analysis',
          'AI-Powered Insights',
          'Risk Scoring',
          'Timeline Creation',
          'Recommendations'
        ]
      };

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Status check failed" });
    }
  });

  // Simulate real-time threat updates
  setInterval(async () => {
    const recentThreats = await storage.getRecentThreats(5);
    broadcast({
      type: 'threats_updated',
      data: recentThreats
    });
  }, 15000); // Every 15 seconds

  // Simulate AI job progress updates
  setInterval(async () => {
    const activeJobs = await storage.getActiveAiJobs();
    for (const job of activeJobs) {
      if (job.progress < 100) {
        const newProgress = Math.min(100, job.progress + Math.random() * 5);
        await storage.updateAiAnalysisJob(job.id, {
          progress: Math.round(newProgress),
          itemsProcessed: Math.round((newProgress / 100) * job.itemsTotal)
        });
      }
    }
    
    const updatedJobs = await storage.getActiveAiJobs();
    broadcast({
      type: 'ai_jobs_updated',
      data: updatedJobs
    });
  }, 10000); // Every 10 seconds

  return httpServer;
}
