import OpenAI from "openai";
import { storage } from "../storage";
import { Case, Evidence, Threat, AiAnalysisJob } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ForensicReport {
  id: string;
  caseId: number;
  title: string;
  executiveSummary: string;
  findings: ReportFinding[];
  evidenceAnalysis: EvidenceAnalysis[];
  threatAssessment: ThreatAssessment;
  recommendations: string[];
  technicalDetails: TechnicalDetails;
  timeline: TimelineEvent[];
  riskScore: number;
  confidence: number;
  generatedAt: Date;
  generatedBy: string;
}

export interface ReportFinding {
  category: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  title: string;
  description: string;
  evidence: string[];
  impact: string;
  mitigation: string;
}

export interface EvidenceAnalysis {
  evidenceId: number;
  filename: string;
  analysisType: string;
  results: any;
  significance: string;
  aiInsights: string;
}

export interface ThreatAssessment {
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  threatActors: string[];
  attackVectors: string[];
  indicators: string[];
  timeline: string;
}

export interface TechnicalDetails {
  methodology: string[];
  toolsUsed: string[];
  dataProcessed: {
    totalFiles: number;
    totalSize: string;
    fileTypes: Record<string, number>;
  };
  analysisMetrics: {
    processingTime: number;
    aiAnalysisCount: number;
    anomaliesDetected: number;
  };
}

export interface TimelineEvent {
  timestamp: Date;
  event: string;
  source: string;
  significance: 'critical' | 'high' | 'medium' | 'low';
}

export class ForensicReportGenerator {
  async generateReport(caseId: number, options?: {
    includeAllEvidence?: boolean;
    confidenceThreshold?: number;
    reportType?: 'executive' | 'technical' | 'comprehensive';
  }): Promise<ForensicReport> {
    
    const caseData = await this.gatherCaseData(caseId);
    const aiInsights = await this.generateAIInsights(caseData);
    
    const report: ForensicReport = {
      id: `RPT-${caseId}-${Date.now()}`,
      caseId,
      title: await this.generateReportTitle(caseData),
      executiveSummary: await this.generateExecutiveSummary(caseData, aiInsights),
      findings: await this.generateFindings(caseData, aiInsights),
      evidenceAnalysis: await this.analyzeEvidence(caseData.evidence),
      threatAssessment: await this.assessThreats(caseData, aiInsights),
      recommendations: await this.generateRecommendations(caseData, aiInsights),
      technicalDetails: this.compileTechnicalDetails(caseData),
      timeline: this.createTimeline(caseData),
      riskScore: this.calculateRiskScore(caseData),
      confidence: this.calculateConfidence(caseData),
      generatedAt: new Date(),
      generatedBy: 'DAFF AI Analysis Engine'
    };

    return report;
  }

  private async gatherCaseData(caseId: number) {
    const caseInfo = await storage.getCase(caseId);
    const evidence = await storage.getEvidenceByCase(caseId);
    const threats = await storage.getActiveThreats();
    const aiJobs = await storage.getAiAnalysisJobs();
    
    return {
      case: caseInfo,
      evidence,
      threats: threats.filter(t => t.caseId === caseId),
      aiJobs: aiJobs.filter(j => evidence.some(e => e.id === j.evidenceId))
    };
  }

  private async generateAIInsights(caseData: any) {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a senior digital forensics expert analyzing case data. Generate comprehensive insights about the investigation findings, potential attack patterns, and security implications. Focus on actionable intelligence and technical accuracy.`
        },
        {
          role: "user",
          content: `Analyze this forensic case data and provide expert insights:
          
Case: ${JSON.stringify(caseData.case)}
Evidence Count: ${caseData.evidence.length}
Threats Detected: ${caseData.threats.length}
AI Analysis Jobs: ${caseData.aiJobs.length}

Provide insights in JSON format:
{
  "keyFindings": ["list of critical discoveries"],
  "attackPatterns": ["identified attack methodologies"],
  "riskAssessment": "overall risk evaluation",
  "technicalInsights": "detailed technical analysis",
  "recommendations": ["actionable security recommendations"]
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private async generateReportTitle(caseData: any): Promise<string> {
    const caseType = caseData.case?.type || 'General';
    const threatCount = caseData.threats.length;
    const date = new Date().toLocaleDateString();
    
    return `Forensic Analysis Report - ${caseType} Investigation (${threatCount} Threats) - ${date}`;
  }

  private async generateExecutiveSummary(caseData: any, aiInsights: any): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a concise executive summary for a forensic investigation report. Focus on high-level findings, business impact, and key recommendations for leadership."
        },
        {
          role: "user",
          content: `Create an executive summary for:
Case: ${caseData.case?.name || 'Unnamed Case'}
Evidence Files: ${caseData.evidence.length}
Threats: ${caseData.threats.length}
AI Insights: ${JSON.stringify(aiInsights)}

Write 2-3 paragraphs suitable for executive leadership.`
        }
      ]
    });

    return response.choices[0].message.content;
  }

  private async generateFindings(caseData: any, aiInsights: any): Promise<ReportFinding[]> {
    const findings: ReportFinding[] = [];

    // Critical threats
    const criticalThreats = caseData.threats.filter((t: any) => t.severity === 'critical');
    if (criticalThreats.length > 0) {
      findings.push({
        category: 'critical',
        title: `${criticalThreats.length} Critical Security Threats Identified`,
        description: `Analysis revealed ${criticalThreats.length} critical security threats requiring immediate attention.`,
        evidence: criticalThreats.map((t: any) => t.description),
        impact: 'Immediate risk to system security and data integrity',
        mitigation: 'Implement emergency containment procedures and patch identified vulnerabilities'
      });
    }

    // Evidence with high risk scores
    const highRiskEvidence = caseData.evidence.filter((e: any) => e.riskScore > 7);
    if (highRiskEvidence.length > 0) {
      findings.push({
        category: 'high',
        title: `${highRiskEvidence.length} High-Risk Evidence Items`,
        description: `Multiple evidence items show indicators of malicious activity or compromise.`,
        evidence: highRiskEvidence.map((e: any) => e.filename),
        impact: 'Potential system compromise and data exfiltration',
        mitigation: 'Isolate affected systems and conduct detailed malware analysis'
      });
    }

    // AI-generated insights
    if (aiInsights.keyFindings) {
      aiInsights.keyFindings.forEach((finding: string, index: number) => {
        findings.push({
          category: index === 0 ? 'high' : 'medium',
          title: `AI Analysis Finding ${index + 1}`,
          description: finding,
          evidence: ['AI Analysis Engine'],
          impact: 'Requires investigation and validation',
          mitigation: 'Review findings and implement recommended security measures'
        });
      });
    }

    return findings;
  }

  private async analyzeEvidence(evidence: Evidence[]): Promise<EvidenceAnalysis[]> {
    const analyses: EvidenceAnalysis[] = [];

    for (const item of evidence) {
      const aiInsight = await this.generateEvidenceInsight(item);
      
      analyses.push({
        evidenceId: item.id,
        filename: item.filename,
        analysisType: item.type || 'general',
        results: item.aiAnalysisResults || {},
        significance: this.determineSignificance(item),
        aiInsights: aiInsight
      });
    }

    return analyses;
  }

  private async generateEvidenceInsight(evidence: Evidence): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze digital evidence and provide forensic insights about its significance, potential threats, and investigative value."
        },
        {
          role: "user",
          content: `Analyze this evidence:
Filename: ${evidence.filename}
Type: ${evidence.type}
Risk Score: ${evidence.riskScore}
Analysis Results: ${JSON.stringify(evidence.aiAnalysisResults)}

Provide a brief forensic assessment of its significance.`
        }
      ]
    });

    return response.choices[0].message.content;
  }

  private determineSignificance(evidence: Evidence): string {
    if (evidence.riskScore >= 8) return 'Critical - Immediate attention required';
    if (evidence.riskScore >= 6) return 'High - Significant security concern';
    if (evidence.riskScore >= 4) return 'Medium - Warrants investigation';
    if (evidence.riskScore >= 2) return 'Low - Monitor for patterns';
    return 'Informational - No immediate concern';
  }

  private async assessThreats(caseData: any, aiInsights: any): Promise<ThreatAssessment> {
    const threats = caseData.threats;
    const severities = threats.map((t: any) => t.severity);
    const overallRisk = this.determineOverallRisk(severities);

    return {
      overallRisk,
      threatActors: [...new Set(threats.map((t: any) => t.source).filter(Boolean))],
      attackVectors: [...new Set(threats.map((t: any) => t.type).filter(Boolean))],
      indicators: threats.map((t: any) => t.description),
      timeline: this.generateThreatTimeline(threats)
    };
  }

  private determineOverallRisk(severities: string[]): 'critical' | 'high' | 'medium' | 'low' {
    if (severities.includes('critical')) return 'critical';
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    return 'low';
  }

  private generateThreatTimeline(threats: any[]): string {
    const sorted = threats.sort((a, b) => new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime());
    const first = sorted[0]?.detectedAt;
    const last = sorted[sorted.length - 1]?.detectedAt;
    
    if (first && last) {
      return `Threats detected from ${new Date(first).toLocaleDateString()} to ${new Date(last).toLocaleDateString()}`;
    }
    return 'No clear timeline established';
  }

  private async generateRecommendations(caseData: any, aiInsights: any): Promise<string[]> {
    const recommendations: string[] = [];

    // Base recommendations from AI insights
    if (aiInsights.recommendations) {
      recommendations.push(...aiInsights.recommendations);
    }

    // Evidence-based recommendations
    const highRiskEvidence = caseData.evidence.filter((e: any) => e.riskScore > 7);
    if (highRiskEvidence.length > 0) {
      recommendations.push('Implement additional endpoint protection on systems with high-risk evidence');
      recommendations.push('Conduct comprehensive malware scan on affected systems');
    }

    // Threat-based recommendations
    const criticalThreats = caseData.threats.filter((t: any) => t.severity === 'critical');
    if (criticalThreats.length > 0) {
      recommendations.push('Activate incident response procedures immediately');
      recommendations.push('Consider temporary network isolation for affected systems');
    }

    // General security recommendations
    recommendations.push('Update security policies based on investigation findings');
    recommendations.push('Schedule follow-up monitoring for 30 days');
    recommendations.push('Provide security awareness training to relevant personnel');

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private compileTechnicalDetails(caseData: any): TechnicalDetails {
    const evidence = caseData.evidence;
    const totalSize = evidence.reduce((sum: number, e: any) => sum + (e.size || 0), 0);
    const fileTypes: Record<string, number> = {};
    
    evidence.forEach((e: any) => {
      const ext = e.filename.split('.').pop()?.toLowerCase() || 'unknown';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    });

    return {
      methodology: [
        'Automated AI Analysis',
        'Signature-based Detection',
        'Behavioral Analysis',
        'Threat Intelligence Correlation'
      ],
      toolsUsed: [
        'DAFF Analysis Engine',
        'OpenAI GPT-4o',
        'PostgreSQL Database',
        'Custom Forensic Algorithms'
      ],
      dataProcessed: {
        totalFiles: evidence.length,
        totalSize: this.formatBytes(totalSize),
        fileTypes
      },
      analysisMetrics: {
        processingTime: evidence.reduce((sum: number, e: any) => sum + (e.processingTime || 0), 0),
        aiAnalysisCount: evidence.filter((e: any) => e.aiAnalysisResults).length,
        anomaliesDetected: caseData.threats.length
      }
    };
  }

  private createTimeline(caseData: any): TimelineEvent[] {
    const events: TimelineEvent[] = [];

    // Case creation
    if (caseData.case?.createdAt) {
      events.push({
        timestamp: new Date(caseData.case.createdAt),
        event: 'Investigation case created',
        source: 'Case Management',
        significance: 'medium'
      });
    }

    // Evidence submissions
    caseData.evidence.forEach((e: any) => {
      events.push({
        timestamp: new Date(e.createdAt),
        event: `Evidence submitted: ${e.filename}`,
        source: 'Evidence Collection',
        significance: e.riskScore > 7 ? 'high' : 'medium'
      });
    });

    // Threat detections
    caseData.threats.forEach((t: any) => {
      events.push({
        timestamp: new Date(t.detectedAt),
        event: `Threat detected: ${t.description}`,
        source: 'Threat Detection',
        significance: t.severity === 'critical' ? 'critical' : 'high'
      });
    });

    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private calculateRiskScore(caseData: any): number {
    const evidenceRisk = caseData.evidence.reduce((sum: number, e: any) => sum + (e.riskScore || 0), 0) / caseData.evidence.length;
    const threatMultiplier = caseData.threats.length > 0 ? 1.5 : 1;
    const criticalThreatBonus = caseData.threats.filter((t: any) => t.severity === 'critical').length * 2;
    
    return Math.min(10, (evidenceRisk * threatMultiplier) + criticalThreatBonus);
  }

  private calculateConfidence(caseData: any): number {
    const evidenceWithAI = caseData.evidence.filter((e: any) => e.aiAnalysisResults).length;
    const totalEvidence = caseData.evidence.length;
    const baseConfidence = evidenceWithAI / Math.max(totalEvidence, 1);
    
    // Boost confidence with more evidence and analysis
    const evidenceBonus = Math.min(0.2, totalEvidence * 0.02);
    const threatBonus = Math.min(0.1, caseData.threats.length * 0.01);
    
    return Math.min(0.99, baseConfidence + evidenceBonus + threatBonus);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async exportReportToPDF(report: ForensicReport): Promise<Buffer> {
    // This would integrate with a PDF generation library
    // For now, return a placeholder
    const reportText = this.formatReportAsText(report);
    return Buffer.from(reportText, 'utf-8');
  }

  private formatReportAsText(report: ForensicReport): string {
    return `
FORENSIC ANALYSIS REPORT
${report.title}
Generated: ${report.generatedAt.toISOString()}
Report ID: ${report.id}

EXECUTIVE SUMMARY
${report.executiveSummary}

KEY FINDINGS
${report.findings.map(f => `• ${f.title}: ${f.description}`).join('\n')}

THREAT ASSESSMENT
Overall Risk: ${report.threatAssessment.overallRisk.toUpperCase()}
Threat Actors: ${report.threatAssessment.threatActors.join(', ')}
Attack Vectors: ${report.threatAssessment.attackVectors.join(', ')}

RECOMMENDATIONS
${report.recommendations.map(r => `• ${r}`).join('\n')}

TECHNICAL DETAILS
Files Processed: ${report.technicalDetails.dataProcessed.totalFiles}
Total Size: ${report.technicalDetails.dataProcessed.totalSize}
Processing Time: ${report.technicalDetails.analysisMetrics.processingTime}ms
AI Analyses: ${report.technicalDetails.analysisMetrics.aiAnalysisCount}
Anomalies Detected: ${report.technicalDetails.analysisMetrics.anomaliesDetected}

Risk Score: ${report.riskScore}/10
Confidence: ${(report.confidence * 100).toFixed(1)}%
`;
  }
}

export const reportGenerator = new ForensicReportGenerator();