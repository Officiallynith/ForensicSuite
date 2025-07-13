import { 
  users, cases, evidence, threats, aiAnalysisJobs, notifications,
  type User, type InsertUser,
  type Case, type InsertCase,
  type Evidence, type InsertEvidence,
  type Threat, type InsertThreat,
  type AiAnalysisJob, type InsertAiAnalysisJob,
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cases
  getCases(): Promise<Case[]>;
  getCase(id: number): Promise<Case | undefined>;
  getCasesByStatus(status: string): Promise<Case[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, updates: Partial<Case>): Promise<Case | undefined>;

  // Evidence
  getEvidence(): Promise<Evidence[]>;
  getEvidenceByCase(caseId: number): Promise<Evidence[]>;
  getRecentEvidence(limit?: number): Promise<Evidence[]>;
  createEvidence(evidenceData: InsertEvidence): Promise<Evidence>;
  updateEvidence(id: number, updates: Partial<Evidence>): Promise<Evidence | undefined>;

  // Threats
  getActiveThreats(): Promise<Threat[]>;
  getRecentThreats(limit?: number): Promise<Threat[]>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  updateThreat(id: number, updates: Partial<Threat>): Promise<Threat | undefined>;

  // AI Analysis Jobs
  getAiAnalysisJobs(): Promise<AiAnalysisJob[]>;
  getActiveAiJobs(): Promise<AiAnalysisJob[]>;
  createAiAnalysisJob(job: InsertAiAnalysisJob): Promise<AiAnalysisJob>;
  updateAiAnalysisJob(id: number, updates: Partial<AiAnalysisJob>): Promise<AiAnalysisJob | undefined>;

  // Notifications
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getUnreadNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private cases: Map<number, Case> = new Map();
  private evidence: Map<number, Evidence> = new Map();
  private threats: Map<number, Threat> = new Map();
  private aiAnalysisJobs: Map<number, AiAnalysisJob> = new Map();
  private notifications: Map<number, Notification> = new Map();
  
  private currentUserId = 1;
  private currentCaseId = 1;
  private currentEvidenceId = 1;
  private currentThreatId = 1;
  private currentAiJobId = 1;
  private currentNotificationId = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "sarah.chen",
      password: "hashed_password",
      name: "Dr. Sarah Chen",
      role: "Lead Forensic Analyst",
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create sample cases
    const cases: Case[] = [
      {
        id: 1,
        name: "CyberAttack-2024-001",
        description: "Advanced persistent threat targeting financial institutions using AI-powered social engineering",
        priority: "critical",
        status: "active",
        assignedTo: "Dr. Sarah Chen",
        progress: 67,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 2,
        name: "Deepfake-Investigation-2024-007",
        description: "Corporate espionage investigation involving deepfake technology for CEO impersonation",
        priority: "high",
        status: "active",
        assignedTo: "Marcus Rodriguez",
        progress: 43,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: 3,
        name: "IoT-Botnet-Analysis-2024-012",
        description: "Investigation of coordinated IoT device compromise affecting smart city infrastructure",
        priority: "medium",
        status: "active",
        assignedTo: "Alex Kim",
        progress: 82,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    ];
    cases.forEach(c => this.cases.set(c.id, c));
    this.currentCaseId = 4;

    // Create AI analysis jobs
    const aiJobs: AiAnalysisJob[] = [
      {
        id: 1,
        jobType: "deepfake",
        status: "running",
        progress: 94,
        itemsTotal: 847,
        itemsProcessed: 796,
        results: null,
        errorMessage: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: null,
      },
      {
        id: 2,
        jobType: "social_media",
        status: "running",
        progress: 67,
        itemsTotal: 23400,
        itemsProcessed: 15678,
        results: null,
        errorMessage: null,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        completedAt: null,
      },
      {
        id: 3,
        jobType: "network",
        status: "running",
        progress: 82,
        itemsTotal: 1200000,
        itemsProcessed: 984000,
        results: null,
        errorMessage: null,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        completedAt: null,
      },
      {
        id: 4,
        jobType: "crypto",
        status: "running",
        progress: 45,
        itemsTotal: 3700,
        itemsProcessed: 1665,
        results: null,
        errorMessage: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        completedAt: null,
      }
    ];
    aiJobs.forEach(job => this.aiAnalysisJobs.set(job.id, job));
    this.currentAiJobId = 5;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "analyst",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Cases
  async getCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async getCase(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(c => c.status === status);
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const id = this.currentCaseId++;
    const newCase: Case = {
      ...caseData,
      id,
      priority: caseData.priority || "medium",
      status: caseData.status || "active",
      progress: caseData.progress || 0,
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.cases.set(id, newCase);
    return newCase;
  }

  async updateCase(id: number, updates: Partial<Case>): Promise<Case | undefined> {
    const existingCase = this.cases.get(id);
    if (!existingCase) return undefined;
    
    const updatedCase = { ...existingCase, ...updates, lastActivity: new Date() };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }

  // Evidence
  async getEvidence(): Promise<Evidence[]> {
    return Array.from(this.evidence.values());
  }

  async getEvidenceByCase(caseId: number): Promise<Evidence[]> {
    return Array.from(this.evidence.values()).filter(e => e.caseId === caseId);
  }

  async getRecentEvidence(limit: number = 10): Promise<Evidence[]> {
    return Array.from(this.evidence.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createEvidence(evidenceData: InsertEvidence): Promise<Evidence> {
    const id = this.currentEvidenceId++;
    const evidence: Evidence = {
      ...evidenceData,
      id,
      originalPath: evidenceData.originalPath || null,
      hash: evidenceData.hash || null,
      caseId: evidenceData.caseId || null,
      riskScore: evidenceData.riskScore || null,
      analysisStatus: evidenceData.analysisStatus || "pending",
      aiAnalysisResults: evidenceData.aiAnalysisResults || null,
      createdAt: new Date(),
      processedAt: null,
    };
    this.evidence.set(id, evidence);
    return evidence;
  }

  async updateEvidence(id: number, updates: Partial<Evidence>): Promise<Evidence | undefined> {
    const existing = this.evidence.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.evidence.set(id, updated);
    return updated;
  }

  // Threats
  async getActiveThreats(): Promise<Threat[]> {
    return Array.from(this.threats.values()).filter(t => t.isActive);
  }

  async getRecentThreats(limit: number = 10): Promise<Threat[]> {
    return Array.from(this.threats.values())
      .filter(t => t.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const id = this.currentThreatId++;
    const newThreat: Threat = {
      ...threat,
      id,
      isActive: threat.isActive !== undefined ? threat.isActive : true,
      metadata: threat.metadata || {},
      createdAt: new Date(),
    };
    this.threats.set(id, newThreat);
    return newThreat;
  }

  async updateThreat(id: number, updates: Partial<Threat>): Promise<Threat | undefined> {
    const existing = this.threats.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.threats.set(id, updated);
    return updated;
  }

  // AI Analysis Jobs
  async getAiAnalysisJobs(): Promise<AiAnalysisJob[]> {
    return Array.from(this.aiAnalysisJobs.values());
  }

  async getActiveAiJobs(): Promise<AiAnalysisJob[]> {
    return Array.from(this.aiAnalysisJobs.values())
      .filter(job => job.status === "running" || job.status === "queued");
  }

  async createAiAnalysisJob(job: InsertAiAnalysisJob): Promise<AiAnalysisJob> {
    const id = this.currentAiJobId++;
    const newJob: AiAnalysisJob = {
      ...job,
      id,
      status: job.status || "queued",
      progress: job.progress || 0,
      itemsTotal: job.itemsTotal || 0,
      itemsProcessed: job.itemsProcessed || 0,
      results: job.results || null,
      errorMessage: job.errorMessage || null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.aiAnalysisJobs.set(id, newJob);
    return newJob;
  }

  async updateAiAnalysisJob(id: number, updates: Partial<AiAnalysisJob>): Promise<AiAnalysisJob | undefined> {
    const existing = this.aiAnalysisJobs.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    if (updates.status === "completed" || updates.status === "failed") {
      updated.completedAt = new Date();
    }
    this.aiAnalysisJobs.set(id, updated);
    return updated;
  }

  // Notifications
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.isRead);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const newNotification: Notification = {
      ...notification,
      id,
      type: notification.type || "info",
      userId: notification.userId || null,
      isRead: notification.isRead !== undefined ? notification.isRead : false,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }
}

export const storage = new MemStorage();
