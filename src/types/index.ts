export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActionDecision = 'ALLOW' | 'VERIFY' | 'REVIEW' | 'HOLD' | 'BLOCK';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  merchant: string;
  device: string;
  location: string;
  isNewDevice: boolean;
  riskScore: number;
  confidence: number;
  status: 'PENDING' | 'HELD' | 'CLEARED' | 'BLOCKED';
  recommendedAction: ActionDecision;
  timestamp: Date;
  signals: RiskSignal[];
  networkRiskScore?: number;
  investigationSteps?: string[];
  feedback?: {
    investigatorDecision: 'CONFIRM_FRAUD' | 'MARK_LEGITIMATE' | 'ESCALATE';
    aiAgreement: boolean;
  };
}

export interface RiskSignal {
  id: string;
  type: string;
  description: string;
  impact: number;
  severity: RiskLevel;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RLMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  falsePositiveRate: number;
  totalFeedbackEvents: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  entity: string;
  details: string;
}

export type CalibrationStatus = 'MONITORING' | 'SHADOW_EVALUATION' | 'PROMOTED' | 'REJECTED';

export interface CohortMetrics {
  baselineFPR: number;
  currentFPR: number;
  relativeIncrease: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface FairnessMetrics {
  overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  falsePositiveDrift: 'LOW' | 'MEDIUM' | 'HIGH';
  decisionConsistency: number;
  performanceDrift: 'STABLE' | 'DEGRADING' | 'IMPROVING';
  alerts: number;
  cohorts: {
    newDevice: CohortMetrics;
  };
  calibration: {
    status: CalibrationStatus;
    candidateDescription?: string;
    shadowFPR?: number;
    shadowOverallRecall?: number;
  };
}

export interface SimulationState {
  isSimulating: boolean;
  transactions: Transaction[];
  stats: {
    volume: number;
    monitored: number;
    highRisk: number;
    prevented: number;
    falsePositiveRate: number;
  };
  rlMetrics: RLMetrics;
  auditLogs: AuditLogEntry[];
  fairness: FairnessMetrics;
}
