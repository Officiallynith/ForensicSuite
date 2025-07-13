import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface DeepfakeAnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  details: string;
  riskScore: number;
}

export interface SocialMediaAnalysisResult {
  manipulationScore: number;
  suspiciousPatterns: string[];
  riskLevel: string;
  details: string;
}

export interface NetworkAnomalyResult {
  anomalyDetected: boolean;
  threatLevel: string;
  suspiciousConnections: number;
  riskScore: number;
  details: string;
}

export interface CryptoAnalysisResult {
  suspiciousTxCount: number;
  riskScore: number;
  launderingProbability: number;
  flaggedAddresses: string[];
  details: string;
}

export class AIAnalysisService {
  async analyzeDeepfake(fileData: Buffer, filename: string): Promise<DeepfakeAnalysisResult> {
    try {
      // Convert buffer to base64 for image analysis
      const base64Data = fileData.toString('base64');
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a deepfake detection expert. Analyze the provided media for signs of AI generation, manipulation, or synthetic content. Respond with JSON in this format: { 'isDeepfake': boolean, 'confidence': number, 'details': string, 'riskScore': number }"
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this file (${filename}) for deepfake or AI-generated content. Consider facial inconsistencies, temporal artifacts, compression anomalies, and other indicators.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        isDeepfake: result.isDeepfake || false,
        confidence: Math.max(0, Math.min(1, result.confidence || 0)),
        details: result.details || "Analysis completed",
        riskScore: Math.max(0, Math.min(10, result.riskScore || 0))
      };
    } catch (error) {
      throw new Error(`Deepfake analysis failed: ${error.message}`);
    }
  }

  async analyzeSocialMediaContent(content: string): Promise<SocialMediaAnalysisResult> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a social media manipulation detection expert. Analyze content for signs of coordinated inauthentic behavior, bot activity, disinformation campaigns, and manipulation tactics. Respond with JSON in this format: { 'manipulationScore': number, 'suspiciousPatterns': array, 'riskLevel': string, 'details': string }"
          },
          {
            role: "user",
            content: `Analyze this social media content for manipulation indicators: ${content.substring(0, 2000)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        manipulationScore: Math.max(0, Math.min(100, result.manipulationScore || 0)),
        suspiciousPatterns: Array.isArray(result.suspiciousPatterns) ? result.suspiciousPatterns : [],
        riskLevel: result.riskLevel || "low",
        details: result.details || "Analysis completed"
      };
    } catch (error) {
      throw new Error(`Social media analysis failed: ${error.message}`);
    }
  }

  async analyzeNetworkTraffic(packetData: any): Promise<NetworkAnomalyResult> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a network security expert specializing in anomaly detection. Analyze network traffic patterns for signs of malicious activity, C2 communications, data exfiltration, and other threats. Respond with JSON in this format: { 'anomalyDetected': boolean, 'threatLevel': string, 'suspiciousConnections': number, 'riskScore': number, 'details': string }"
          },
          {
            role: "user",
            content: `Analyze this network traffic data for anomalies and threats: ${JSON.stringify(packetData).substring(0, 2000)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        anomalyDetected: result.anomalyDetected || false,
        threatLevel: result.threatLevel || "low",
        suspiciousConnections: Math.max(0, result.suspiciousConnections || 0),
        riskScore: Math.max(0, Math.min(10, result.riskScore || 0)),
        details: result.details || "Analysis completed"
      };
    } catch (error) {
      throw new Error(`Network analysis failed: ${error.message}`);
    }
  }

  async analyzeCryptoTransactions(transactions: any[]): Promise<CryptoAnalysisResult> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency forensics expert. Analyze transaction patterns for money laundering, mixing services, suspicious clustering, and other illicit activities. Respond with JSON in this format: { 'suspiciousTxCount': number, 'riskScore': number, 'launderingProbability': number, 'flaggedAddresses': array, 'details': string }"
          },
          {
            role: "user",
            content: `Analyze these cryptocurrency transactions for suspicious patterns: ${JSON.stringify(transactions).substring(0, 2000)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        suspiciousTxCount: Math.max(0, result.suspiciousTxCount || 0),
        riskScore: Math.max(0, Math.min(10, result.riskScore || 0)),
        launderingProbability: Math.max(0, Math.min(1, result.launderingProbability || 0)),
        flaggedAddresses: Array.isArray(result.flaggedAddresses) ? result.flaggedAddresses : [],
        details: result.details || "Analysis completed"
      };
    } catch (error) {
      throw new Error(`Crypto analysis failed: ${error.message}`);
    }
  }

  async generateThreatIntelligenceFromText(text: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a threat intelligence analyst. Extract and analyze potential security threats, indicators of compromise, attack patterns, and threat actor TTPs from the provided text. Respond with JSON in this format: { 'threats': array, 'iocs': array, 'riskLevel': string, 'summary': string }"
          },
          {
            role: "user",
            content: `Extract threat intelligence from this text: ${text.substring(0, 3000)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      throw new Error(`Threat intelligence generation failed: ${error.message}`);
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();
