import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiAnalysisService } from "./services/aiAnalysis";
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
