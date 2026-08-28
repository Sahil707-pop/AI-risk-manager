import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SimulationState, Transaction, ActionDecision, RLMetrics, AuditLogEntry, FairnessMetrics } from '../types';

interface SimulationContextType extends SimulationState {
  startSimulation: () => void;
  resetSimulation: () => void;
  submitFeedback: (txId: string, decision: 'CONFIRM_FRAUD' | 'MARK_LEGITIMATE' | 'ESCALATE') => void;
  resolveCalibration: (decision: 'PROMOTE' | 'REJECT') => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const calculateHybridRisk = (baseRisk: number, step: number, isNewDevice: boolean, newDeviceWeightMod: number) => {
  const behavioral = Math.min(40, (baseRisk * 0.4) + (step * 2.5));
  const transaction = Math.min(25, (baseRisk * 0.25) + (step * 2));
  const graph = Math.min(20, (baseRisk * 0.2) + (step > 4 ? 15 : 0));
  
  // Apply weight modification if calibrated
  const deviceRiskBase = isNewDevice ? 25 : (baseRisk * 0.1);
  const device = Math.min(28, deviceRiskBase * newDeviceWeightMod);
  
  const historical = Math.min(5, baseRisk * 0.05);
  
  return {
    total: Math.floor(behavioral + transaction + graph + device + historical),
    components: { behavioral, transaction, graph, device, historical }
  };
};

const generateInitialTransactions = (): Transaction[] => {
  const txs: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const isHigh = Math.random() > 0.95;
    const isMedium = !isHigh && Math.random() > 0.85;
    const isNewDevice = Math.random() > 0.8;
    
    let score = Math.floor(Math.random() * 20) + 5;
    let action: ActionDecision = 'ALLOW';
    let status: 'PENDING' | 'HELD' | 'CLEARED' | 'BLOCKED' = 'CLEARED';
    
    if (isHigh) {
      score = Math.floor(Math.random() * 20) + 75;
      action = 'HOLD';
      status = 'HELD';
    } else if (isMedium) {
      score = Math.floor(Math.random() * 40) + 30;
      action = 'REVIEW';
      status = 'PENDING';
    }

    txs.push({
      id: `TXN-${10000 + i}`,
      userId: `USR-${Math.floor(Math.random() * 100)}`,
      amount: Math.floor(Math.random() * 10000) + 500,
      merchant: ['Amazon', 'Uber', 'Starbucks', 'Apple', 'Netflix'][Math.floor(Math.random() * 5)],
      device: `DEV-${Math.floor(Math.random() * 200)}`,
      isNewDevice,
      location: ['New York, US', 'London, UK', 'Mumbai, IN', 'Tokyo, JP'][Math.floor(Math.random() * 4)],
      riskScore: score,
      networkRiskScore: Math.floor(score * 0.8),
      confidence: Math.floor(Math.random() * 20) + 80,
      status: status,
      recommendedAction: action,
      timestamp: new Date(now.getTime() - (50 - i) * 60000),
      signals: [],
      investigationSteps: [
        "Analyzed standard transaction features",
        "Checked against 6-month historical baseline",
        "No major anomalies detected"
      ]
    });
  }
  return txs.reverse();
};

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [newDeviceWeightMod, setNewDeviceWeightMod] = useState(1.0); // 1.0 = default
  const [transactions, setTransactions] = useState<Transaction[]>(generateInitialTransactions());
  
  const [stats, setStats] = useState({
    volume: 12800000,
    monitored: 124892,
    highRisk: 342,
    prevented: 82000000,
    falsePositiveRate: 2.4
  });
  
  const [rlMetrics, setRlMetrics] = useState<RLMetrics>({
    accuracy: 91.4,
    precision: 89.0,
    recall: 94.0,
    falsePositiveRate: 7.0,
    totalFeedbackEvents: 1420
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: 'LOG-1', timestamp: new Date(Date.now() - 3600000), actor: 'SYSTEM', action: 'POLICY_UPDATE', entity: 'Rule #402', details: 'Auto-updated block threshold to 90.' },
    { id: 'LOG-2', timestamp: new Date(Date.now() - 7200000), actor: 'INV-ALICE', action: 'MARK_LEGITIMATE', entity: 'TXN-9982', details: 'User traveling, verified via phone.' }
  ]);

  const [fairness, setFairness] = useState<FairnessMetrics>({
    overallHealth: 'HEALTHY',
    falsePositiveDrift: 'LOW',
    decisionConsistency: 94,
    performanceDrift: 'STABLE',
    alerts: 0,
    cohorts: {
      newDevice: {
        baselineFPR: 10.0,
        currentFPR: 10.1,
        relativeIncrease: 1.0,
        truePositives: 420,
        falsePositives: 42,
        trueNegatives: 3800,
        falseNegatives: 18
      }
    },
    calibration: {
      status: 'MONITORING'
    }
  });

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const now = new Date();
      
      const isNewDevice = true;
      const riskCalc = calculateHybridRisk(60, step, isNewDevice, newDeviceWeightMod);
      
      const newTx: Transaction = {
        id: `TXN-${20000 + step}`,
        userId: 'USR-88 (Attacker)',
        amount: 85000 + (Math.random() * 10000),
        merchant: 'CryptoExchange',
        device: 'DEV-NEW',
        isNewDevice,
        location: 'Unknown Location',
        riskScore: riskCalc.total,
        networkRiskScore: Math.min(99, 50 + (step * 8)),
        confidence: Math.min(98, 80 + (step * 2)),
        status: step > 5 ? 'BLOCKED' : (step > 3 ? 'HELD' : 'PENDING'),
        recommendedAction: step > 5 ? 'BLOCK' : (step > 3 ? 'HOLD' : 'REVIEW'),
        timestamp: now,
        signals: [
          { id: 'S1', type: 'Velocity', description: `Unusual Transaction Amount`, impact: Math.floor(riskCalc.components.behavioral), severity: 'CRITICAL' },
          { id: 'S2', type: 'Device', description: 'New Device', impact: Math.floor(riskCalc.components.device), severity: 'HIGH' },
          { id: 'S3', type: 'Graph', description: 'High Transaction Velocity', impact: Math.floor(riskCalc.components.transaction), severity: 'HIGH' }
        ],
        investigationSteps: [
          "✓ Compared against historical behavior",
          "✓ Detected significant deviation",
          "✓ Found repeated rapid transactions",
          step > 3 ? "✓ Identified similar suspicious patterns" : "⏳ Analyzing network graph..."
        ]
      };

      setTransactions(prev => [newTx, ...prev]);
      setStats(prev => ({
        ...prev,
        volume: prev.volume + newTx.amount,
        monitored: prev.monitored + 1,
        highRisk: prev.highRisk + 1,
        prevented: (newTx.recommendedAction === 'HOLD' || newTx.recommendedAction === 'BLOCK') ? prev.prevented + newTx.amount : prev.prevented
      }));

      if (step >= 10) {
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 3000);
      }
    }, 1500);
  };

  const submitFeedback = (txId: string, decision: 'CONFIRM_FRAUD' | 'MARK_LEGITIMATE' | 'ESCALATE') => {
    let newTxInfo: Transaction | undefined;
    
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        const aiPredictedFraud = tx.riskScore >= 75;
        const aiAgreement = (decision === 'CONFIRM_FRAUD' && aiPredictedFraud) || 
                            (decision === 'MARK_LEGITIMATE' && !aiPredictedFraud);
        
        newTxInfo = { ...tx, feedback: { investigatorDecision: decision, aiAgreement } };
        return newTxInfo;
      }
      return tx;
    }));

    if (newTxInfo) {
      const aiPredictedFraud = newTxInfo.riskScore >= 75;
      const isFalsePositive = aiPredictedFraud && decision === 'MARK_LEGITIMATE';
      const isNewDevice = newTxInfo.isNewDevice;

      // Update Audit log
      setAuditLogs(logs => [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date(),
        actor: 'CURRENT_USER',
        action: decision,
        entity: txId,
        details: `Investigator recorded decision. AI Agreement: ${(decision === 'CONFIRM_FRAUD' && aiPredictedFraud) || (decision === 'MARK_LEGITIMATE' && !aiPredictedFraud)}`
      }, ...logs]);

      // If it's a false positive on a New Device, we drive the 14% FPR increase logic
      if (isFalsePositive && isNewDevice) {
        setFairness(prev => {
          const currentFP = prev.cohorts.newDevice.falsePositives + 1;
          const currentTN = prev.cohorts.newDevice.trueNegatives;
          const newFPR = (currentFP / (currentFP + currentTN)) * 100;
          const baselineFPR = prev.cohorts.newDevice.baselineFPR;
          
          // Fast-forward simulation: force FPR to hit exactly 11.4% (14% relative increase)
          // For demo purposes, we override the math to explicitly hit the warning threshold upon feedback
          const simulatedFPR = 11.4;
          const relativeIncrease = 14; 
          
          const hitThreshold = relativeIncrease >= 14;

          if (hitThreshold && prev.calibration.status === 'MONITORING') {
            // Trigger Fairness Warning & Shadow Evaluation
            setAuditLogs(logs => [{
              id: `LOG-${Date.now() + 1}`,
              timestamp: new Date(),
              actor: 'FAIRNESS_MONITOR',
              action: 'WARNING_GENERATED',
              entity: 'New Device Cohort',
              details: `Detected 14% relative FPR increase. Initiating SHADOW_EVALUATION for candidate weight -18%.`
            }, ...logs]);

            return {
              ...prev,
              overallHealth: 'WARNING',
              falsePositiveDrift: 'HIGH',
              alerts: 1,
              cohorts: {
                newDevice: {
                  ...prev.cohorts.newDevice,
                  currentFPR: simulatedFPR,
                  relativeIncrease: relativeIncrease,
                  falsePositives: currentFP
                }
              },
              calibration: {
                status: 'SHADOW_EVALUATION',
                candidateDescription: 'New Device Risk Contribution -18%',
                shadowFPR: 9.8,
                shadowOverallRecall: 93.9
              }
            };
          }

          return {
            ...prev,
            cohorts: {
              newDevice: {
                ...prev.cohorts.newDevice,
                falsePositives: currentFP,
                currentFPR: newFPR
              }
            }
          };
        });
      }
    }
  };

  const resolveCalibration = (decision: 'PROMOTE' | 'REJECT') => {
    if (decision === 'PROMOTE') {
      setNewDeviceWeightMod(0.82); // -18% weight
      setFairness(prev => ({
        ...prev,
        overallHealth: 'HEALTHY',
        falsePositiveDrift: 'LOW',
        alerts: 0,
        cohorts: {
          newDevice: {
            ...prev.cohorts.newDevice,
            baselineFPR: prev.calibration.shadowFPR || prev.cohorts.newDevice.baselineFPR,
            currentFPR: prev.calibration.shadowFPR || prev.cohorts.newDevice.currentFPR,
            relativeIncrease: 0
          }
        },
        calibration: {
          status: 'PROMOTED'
        }
      }));
      setAuditLogs(logs => [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date(),
        actor: 'CURRENT_USER',
        action: 'PROMOTE_CALIBRATION',
        entity: 'Model v12',
        details: 'Promoted candidate with New Device Weight -18%.'
      }, ...logs]);
    } else {
      setFairness(prev => ({
        ...prev,
        calibration: {
          status: 'REJECTED'
        }
      }));
      setAuditLogs(logs => [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date(),
        actor: 'CURRENT_USER',
        action: 'REJECT_CALIBRATION',
        entity: 'Model v12',
        details: 'Rejected candidate. Rolling back to original weights.'
      }, ...logs]);
    }
  };

  const resetSimulation = () => {
    setTransactions(generateInitialTransactions());
    setNewDeviceWeightMod(1.0);
    setFairness({
      overallHealth: 'HEALTHY',
      falsePositiveDrift: 'LOW',
      decisionConsistency: 94,
      performanceDrift: 'STABLE',
      alerts: 0,
      cohorts: {
        newDevice: {
          baselineFPR: 10.0,
          currentFPR: 10.1,
          relativeIncrease: 1.0,
          truePositives: 420,
          falsePositives: 42,
          trueNegatives: 3800,
          falseNegatives: 18
        }
      },
      calibration: {
        status: 'MONITORING'
      }
    });
    setIsSimulating(false);
  };

  return (
    <SimulationContext.Provider value={{ isSimulating, transactions, stats, rlMetrics, auditLogs, fairness, startSimulation, resetSimulation, submitFeedback, resolveCalibration }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
