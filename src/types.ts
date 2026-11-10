export type VerdictType = 'SAFE' | 'SUSPICIOUS' | 'LIKELY SCAM';

export type NavSection =
  | 'dashboard'
  | 'chatbot'
  | 'scanner'
  | 'risk_analyzer'
  | 'voice_assistant'
  | 'emergency_sos'
  | 'family_protection'
  | 'fraud_alerts'
  | 'safety_academy'
  | 'recovery_assistant'
  | 'settings';

export type ThemeMode = 'light' | 'dark';

export type VoiceLanguage = 'en' | 'hi' | 'te' | 'ta' | 'kn';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  verdict?: VerdictType;
  timestamp: string;
  isLoading?: boolean;
  isError?: boolean;
}

export interface QuickReply {
  id: string;
  title: string;
  shortLabel: string;
  iconName: string;
  description: string;
  samplePrompt: string;
}

export interface ScamGuideItem {
  id: string;
  title: string;
  category: string;
  redFlags: string[];
  howItWorks: string;
  prevention: string[];
}

export type VoiceConnectionStatus =
  | 'idle'
  | 'requesting_permission'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'speaking'
  | 'muted'
  | 'interrupted'
  | 'error';

export interface TranscriptItem {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isInterim?: boolean;
}

export interface EphemeralTokenResponse {
  token: string;
  expireTime: string;
  valid: boolean;
  model?: string;
  error?: string;
}

export interface BankContact {
  id: string;
  name: string;
  category: 'bank' | 'upi_app' | 'wallet';
  phone: string;
  tollFree?: string;
  helpLink?: string;
  note?: string;
}

export interface EmergencyChecklistItem {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  completed: boolean;
  urgentNotice: string;
}

// 2. Image Scanner Types
export interface ImageScanResult {
  extractedText: string;
  urls: string[];
  phoneNumbers: string[];
  upiIds: string[];
  isQrCode: boolean;
  qrDisclaimer?: string;
  safeSignals: string[];
  warningSigns: string[];
  highRiskIndicators: string[];
  riskScore: number; // 0 - 100
  classification: 'SAFE' | 'CAUTION' | 'HIGH RISK';
  explanation: string;
  recommendedActions: string[];
}

// 4. Smart Fraud Risk Analyzer Types
export interface RiskAssessmentResult {
  riskScore: number; // 0 - 100
  classification: 'SAFE' | 'CAUTION' | 'HIGH RISK';
  summary: string;
  explanation: string;
  indicators: Array<{
    label: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  recommendedSteps: string[];
}

// 6. Family Protection Types
export interface FamilyMember {
  id: string;
  name: string;
  nickname?: string;
  relationship: 'Parent' | 'Grandparent' | 'Child / Student' | 'Spouse' | 'Sibling' | 'Relative';
  phone?: string;
  isSenior: boolean;
  protectionActive: boolean;
  lastSimulatedQuizScore?: number;
  unresolvedAlerts: number;
}

// 7. Fraud Alert System Types
export interface ScamAlertItem {
  id: string;
  title: string;
  category:
    | 'Emerging UPI Scam'
    | 'Digital Arrest Threat'
    | 'Fake Customer Care'
    | 'Phishing Website'
    | 'Fake KYC Update'
    | 'Investment & Part-time Job'
    | 'Electricity Bill Threat'
    | 'QR Code Scam';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  reportedDate: string;
  threatLevel: string;
  modusOperandi: string;
  warningSigns: string[];
  protectionTips: string[];
  verifiedSource: string;
  affectedDemographic: string;
  isSampleOrRecent: 'Active Live Threat' | 'Sample Alert';
}
