import { users, cases, evidence, threats, aiAnalysisJobs, notifications } from "@shared/schema";
import type { User, InsertUser, Case, InsertCase, Evidence, InsertEvidence, Threat, InsertThreat, AiAnalysisJob, InsertAiAnalysisJob, Notification, InsertNotification } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  private initialized = false;

  constructor() {
    this.initializeOnce();
  }

  private async initializeOnce() {
    if (this.initialized) return;
    
    try {
      // Check if we have data already
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        this.initialized = true;
        return;
      }

      // Create sample data
      const user = await db.insert(users).values({
        username: "forensic_analyst",
        password: "hashed_password",
        name: "Dr. Sarah Chen",
        email: "analyst@daff.security",
        role: "Senior Forensic Analyst",
      }).returning();

      const case1 = await db.insert(cases).values({
        name: "CyberAttack-2024-001",
        description: "Advanced persistent threat investigation",
        status: "active",
        priority: "high",
        assignedTo: "Dr. Sarah Chen",
        progress: 65,
      }).returning();

      await db.insert(evidence).values({
        caseId: case1[0].id,
        filename: "suspicious_transaction.json",
        fileType: "application/json",
        size: 45678,
        analysisStatus: "completed",
        riskScore: 85,
        aiAnalysisResults: { type: "crypto", confidence: 0.92 },
      });

      await db.insert(threats).values({
        title: "AI-Generated Phishing Campaign Detected",
        description: "Advanced threat detected",
        severity: "high",
        source: "AI Detection Engine",
        confidence: 0.95,
        threatType: "phishing",
        isActive: true,
        metadata: { indicators: ["IOC-001"] },
      });

      await db.insert(aiAnalysisJobs).values({
        jobType: "deepfake",
        status: "running",
        evidenceId: 1,
        progress: 45,
      });

      await db.insert(notifications).values({
        userId: user[0].id,
        title: "High-risk evidence detected",
        message: "New evidence uploaded with risk score above 80%",
        type: "alert",
        isRead: false,
      });

      this.initialized = true;
      console.log("Database initialized with sample data");
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0] || undefined;
    } catch (error) {
      console.error("Get user error:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0] || undefined;
    } catch (error) {
      console.error("Get user by username error:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getCases(): Promise<Case[]> {
    try {
      return await db.select().from(cases);
    } catch (error) {
      console.error("Get cases error:", error);
      return [];
    }
  }

  async getCase(id: number): Promise<Case | undefined> {
    try {
      const result = await db.select().from(cases).where(eq(cases.id, id));
      return result[0] || undefined;
    } catch (error) {
      console.error("Get case error:", error);
      return undefined;
    }
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    try {
      return await db.select().from(cases).where(eq(cases.status, status));
    } catch (error) {
      console.error("Get cases by status error:", error);
      return [];
    }
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const result = await db.insert(cases).values(caseData).returning();
    return result[0];
  }

  async updateCase(id: number, updates: Partial<Case>): Promise<Case | undefined> {
    try {
      const result = await db.update(cases).set(updates).where(eq(cases.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error("Update case error:", error);
      return undefined;
    }
  }

  async getEvidence(): Promise<Evidence[]> {
    try {
      return await db.select().from(evidence);
    } catch (error) {
      console.error("Get evidence error:", error);
      return [];
    }
  }

  async getEvidenceByCase(caseId: number): Promise<Evidence[]> {
    try {
      return await db.select().from(evidence).where(eq(evidence.caseId, caseId));
    } catch (error) {
      console.error("Get evidence by case error:", error);
      return [];
    }
  }

  async getRecentEvidence(limit: number = 10): Promise<Evidence[]> {
    try {
      return await db.select().from(evidence).limit(limit);
    } catch (error) {
      console.error("Get recent evidence error:", error);
      return [];
    }
  }

  async createEvidence(evidenceData: InsertEvidence): Promise<Evidence> {
    const result = await db.insert(evidence).values(evidenceData).returning();
    return result[0];
  }

  async updateEvidence(id: number, updates: Partial<Evidence>): Promise<Evidence | undefined> {
    try {
      const result = await db.update(evidence).set(updates).where(eq(evidence.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error("Update evidence error:", error);
      return undefined;
    }
  }

  async getActiveThreats(): Promise<Threat[]> {
    try {
      return await db.select().from(threats).where(eq(threats.isActive, true));
    } catch (error) {
      console.error("Get active threats error:", error);
      return [];
    }
  }

  async getRecentThreats(limit: number = 10): Promise<Threat[]> {
    try {
      return await db.select().from(threats).limit(limit);
    } catch (error) {
      console.error("Get recent threats error:", error);
      return [];
    }
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const result = await db.insert(threats).values(threat).returning();
    return result[0];
  }

  async updateThreat(id: number, updates: Partial<Threat>): Promise<Threat | undefined> {
    try {
      const result = await db.update(threats).set(updates).where(eq(threats.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error("Update threat error:", error);
      return undefined;
    }
  }

  async getAiAnalysisJobs(): Promise<AiAnalysisJob[]> {
    try {
      return await db.select().from(aiAnalysisJobs);
    } catch (error) {
      console.error("Get AI jobs error:", error);
      return [];
    }
  }

  async getActiveAiJobs(): Promise<AiAnalysisJob[]> {
    try {
      return await db.select().from(aiAnalysisJobs).where(eq(aiAnalysisJobs.status, "running"));
    } catch (error) {
      console.error("Get active AI jobs error:", error);
      return [];
    }
  }

  async createAiAnalysisJob(job: InsertAiAnalysisJob): Promise<AiAnalysisJob> {
    const result = await db.insert(aiAnalysisJobs).values(job).returning();
    return result[0];
  }

  async updateAiAnalysisJob(id: number, updates: Partial<AiAnalysisJob>): Promise<AiAnalysisJob | undefined> {
    try {
      const result = await db.update(aiAnalysisJobs).set(updates).where(eq(aiAnalysisJobs.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error("Update AI job error:", error);
      return undefined;
    }
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    try {
      return await db.select().from(notifications).where(eq(notifications.userId, userId));
    } catch (error) {
      console.error("Get notifications error:", error);
      return [];
    }
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    try {
      return await db.select().from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    } catch (error) {
      console.error("Get unread notifications error:", error);
      return [];
    }
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationAsRead(id: number): Promise<void> {
    try {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  }
}

export const storage = new DatabaseStorage();