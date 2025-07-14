import { users, cases, evidence, threats, aiAnalysisJobs, notifications } from "@shared/schema";
import type { User, InsertUser, Case, InsertCase, Evidence, InsertEvidence, Threat, InsertThreat, AiAnalysisJob, InsertAiAnalysisJob, Notification, InsertNotification } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
  constructor() {
    this.initializeMockData().catch(console.error);
  }

  private async initializeMockData() {
    try {
      const existingUser = await this.getUser(1);
      if (existingUser) return;

      const defaultUser = await this.createUser({
        username: "forensic_analyst",
        password: "hashed_password_placeholder",
        name: "Dr. Sarah Chen",
        email: "analyst@daff.security",
        role: "Senior Forensic Analyst",
      });

      const case1 = await this.createCase({
        name: "CyberAttack-2024-001",
        description: "Advanced persistent threat investigation involving cryptocurrency laundering and deepfake social engineering",
        status: "active",
        priority: "high",
        assignedUserId: defaultUser.id,
        progress: 65,
      });

      await this.createCase({
        name: "SocialMedia-Manip-2024-002",
        description: "Large-scale social media manipulation campaign using AI-generated content",
        status: "investigating",
        priority: "medium",
        assignedUserId: defaultUser.id,
        progress: 30,
      });

      await this.createEvidence({
        caseId: case1.id,
        filename: "suspicious_transaction.json",
        fileType: "application/json",
        fileSize: 45678,
        analysisStatus: "completed",
        riskScore: 85,
        aiAnalysisResult: {
          type: "cryptocurrency",
          findings: ["Potential money laundering pattern detected", "Unusual transaction timing"],
          confidence: 0.92,
        },
      });

      const threatTitles = [
        "AI-Generated Phishing Campaign Detected",
        "Cryptocurrency Mixer Usage Surge",
        "IoT Botnet Command & Control Activity",
        "Deepfake Audio in Voice Authorization Bypass",
        "Social Media Bot Network Coordination",
      ];

      for (const title of threatTitles) {
        await this.createThreat({
          title,
          description: `Advanced threat detected: ${title.toLowerCase()}`,
          severity: "high",
          source: "AI Detection Engine",
          status: "active",
          indicators: [`IOC-${Math.random().toString(36).substr(2, 6)}`],
        });
      }

      await this.createAiAnalysisJob({
        jobType: "deepfake",
        status: "running",
        evidenceId: 1,
        progress: 45,
      });

      await this.createNotification({
        userId: defaultUser.id,
        title: "High-risk evidence detected",
        message: "New evidence uploaded with risk score above 80%",
        type: "alert",
        isRead: false,
      });

    } catch (error) {
      console.error("Failed to initialize mock data:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCases(): Promise<Case[]> {
    return await db.select().from(cases);
  }

  async getCase(id: number): Promise<Case | undefined> {
    const [case_] = await db.select().from(cases).where(eq(cases.id, id));
    return case_ || undefined;
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.status, status));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [case_] = await db.insert(cases).values(caseData).returning();
    return case_;
  }

  async updateCase(id: number, updates: Partial<Case>): Promise<Case | undefined> {
    const [case_] = await db.update(cases).set(updates).where(eq(cases.id, id)).returning();
    return case_ || undefined;
  }

  async getEvidence(): Promise<Evidence[]> {
    return await db.select().from(evidence);
  }

  async getEvidenceByCase(caseId: number): Promise<Evidence[]> {
    return await db.select().from(evidence).where(eq(evidence.caseId, caseId));
  }

  async getRecentEvidence(limit: number = 10): Promise<Evidence[]> {
    return await db.select().from(evidence).limit(limit);
  }

  async createEvidence(evidenceData: InsertEvidence): Promise<Evidence> {
    const [evidenceItem] = await db.insert(evidence).values(evidenceData).returning();
    return evidenceItem;
  }

  async updateEvidence(id: number, updates: Partial<Evidence>): Promise<Evidence | undefined> {
    const [evidenceItem] = await db.update(evidence).set(updates).where(eq(evidence.id, id)).returning();
    return evidenceItem || undefined;
  }

  async getActiveThreats(): Promise<Threat[]> {
    return await db.select().from(threats).where(eq(threats.status, "active"));
  }

  async getRecentThreats(limit: number = 10): Promise<Threat[]> {
    return await db.select().from(threats).limit(limit);
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const [threatItem] = await db.insert(threats).values(threat).returning();
    return threatItem;
  }

  async updateThreat(id: number, updates: Partial<Threat>): Promise<Threat | undefined> {
    const [threatItem] = await db.update(threats).set(updates).where(eq(threats.id, id)).returning();
    return threatItem || undefined;
  }

  async getAiAnalysisJobs(): Promise<AiAnalysisJob[]> {
    return await db.select().from(aiAnalysisJobs);
  }

  async getActiveAiJobs(): Promise<AiAnalysisJob[]> {
    return await db.select().from(aiAnalysisJobs).where(eq(aiAnalysisJobs.status, "running"));
  }

  async createAiAnalysisJob(job: InsertAiAnalysisJob): Promise<AiAnalysisJob> {
    const [jobItem] = await db.insert(aiAnalysisJobs).values(job).returning();
    return jobItem;
  }

  async updateAiAnalysisJob(id: number, updates: Partial<AiAnalysisJob>): Promise<AiAnalysisJob | undefined> {
    const [jobItem] = await db.update(aiAnalysisJobs).set(updates).where(eq(aiAnalysisJobs.id, id)).returning();
    return jobItem || undefined;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [notificationItem] = await db.insert(notifications).values(notification).returning();
    return notificationItem;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();