import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("analyst"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  status: text("status").notNull().default("active"), // active, closed, on-hold
  assignedTo: text("assigned_to").notNull(),
  progress: integer("progress").notNull().default(0), // percentage
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalPath: text("original_path"),
  fileType: text("file_type").notNull(),
  size: integer("size").notNull(), // in bytes
  hash: text("hash"),
  caseId: integer("case_id").references(() => cases.id),
  riskScore: real("risk_score").default(0),
  analysisStatus: text("analysis_status").notNull().default("pending"), // pending, processing, completed, failed
  aiAnalysisResults: json("ai_analysis_results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export const threats = pgTable("threats", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  source: text("source").notNull(),
  confidence: real("confidence").notNull(), // 0-1
  threatType: text("threat_type").notNull(), // deepfake, phishing, malware, etc.
  isActive: boolean("is_active").notNull().default(true),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiAnalysisJobs = pgTable("ai_analysis_jobs", {
  id: serial("id").primaryKey(),
  jobType: text("job_type").notNull(), // deepfake, social_media, network, crypto
  status: text("status").notNull().default("queued"), // queued, running, completed, failed
  progress: integer("progress").notNull().default(0),
  itemsTotal: integer("items_total").notNull().default(0),
  itemsProcessed: integer("items_processed").notNull().default(0),
  results: json("results"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, error, success
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertEvidenceSchema = createInsertSchema(evidence).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  createdAt: true,
});

export const insertAiAnalysisJobSchema = createInsertSchema(aiAnalysisJobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;

export type Threat = typeof threats.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;

export type AiAnalysisJob = typeof aiAnalysisJobs.$inferSelect;
export type InsertAiAnalysisJob = z.infer<typeof insertAiAnalysisJobSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
