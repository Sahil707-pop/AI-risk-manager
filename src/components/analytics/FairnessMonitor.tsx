import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldCheck, AlertTriangle, TrendingDown, Target, Activity, Settings, ArrowRight } from 'lucide-react';

export const FairnessMonitor = ({ onInvestigate }: { onInvestigate: () => void }) => {
  const { fairness } = useSimulation();
  const nd = fairness.cohorts.newDevice;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 text-white">
        <ShieldCheck className="text-primary" size={28} />
        <h2 className="text-2xl font-bold tracking-tight">Fairness & Bias Monitor</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Overall Model Health" 
          value={fairness.overallHealth} 
          highlight={fairness.overallHealth !== 'HEALTHY'} 
          icon={<Activity />} 
        />
        <MetricCard 
          title="False Positive Drift" 
          value={fairness.falsePositiveDrift} 
          highlight={fairness.falsePositiveDrift === 'HIGH'} 
          icon={<TrendingDown />} 
        />
        <MetricCard 
          title="Decision Consistency" 
          value={`${fairness.decisionConsistency}%`} 
          highlight={fairness.decisionConsistency < 90} 
          icon={<Target />} 
        />
        <MetricCard 
          title="Performance Drift" 
          value={fairness.performanceDrift} 
          highlight={fairness.performanceDrift === 'DEGRADING'} 
          icon={<Activity />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-white">New Device Cohort Fairness</h3>
              {fairness.alerts > 0 && (
                <span className="px-3 py-1 bg-danger/20 text-danger border border-danger/30 rounded-full text-xs font-bold animate-pulse">
                  ⚠ WARNING
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="text-xs text-gray-400 font-bold mb-1">CURRENT FPR</div>
                <div className={`text-2xl font-bold ${fairness.alerts > 0 ? 'text-danger' : 'text-white'}`}>{nd.currentFPR.toFixed(1)}%</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="text-xs text-gray-400 font-bold mb-1">BASELINE FPR</div>
                <div className="text-2xl font-bold text-white">{nd.baselineFPR.toFixed(1)}%</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="text-xs text-gray-400 font-bold mb-1">CHANGE</div>
                <div className={`text-2xl font-bold ${nd.relativeIncrease >= 14 ? 'text-danger' : 'text-success'}`}>
                  {nd.relativeIncrease >= 14 ? '+' : ''}{nd.relativeIncrease.toFixed(1)}% relative
                </div>
              </div>
            </div>

            <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase">Cohort Confusion Matrix</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div></div>
              <div className="font-semibold text-gray-300 pb-2">Actual Fraud</div>
              <div className="font-semibold text-gray-300 pb-2">Actual Legitimate</div>
              
              <div className="font-semibold text-gray-300 flex items-center justify-end pr-4">AI Flagged</div>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500 mb-1">True Positive (TP)</div>
                <div className="text-lg font-bold text-white">{nd.truePositives}</div>
              </div>
              <div className={`p-3 rounded-lg border ${fairness.alerts > 0 ? 'bg-danger/20 border-danger/50' : 'bg-gray-800 border-gray-700'}`}>
                <div className={`text-xs mb-1 ${fairness.alerts > 0 ? 'text-danger' : 'text-gray-500'}`}>False Positive (FP)</div>
                <div className={`text-lg font-bold ${fairness.alerts > 0 ? 'text-danger' : 'text-white'}`}>{nd.falsePositives}</div>
              </div>

              <div className="font-semibold text-gray-300 flex items-center justify-end pr-4">AI Not Flagged</div>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500 mb-1">False Negative (FN)</div>
                <div className="text-lg font-bold text-white">{nd.falseNegatives}</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500 mb-1">True Negative (TN)</div>
                <div className="text-lg font-bold text-white">{nd.trueNegatives}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg text-white mb-4">Calibration Status</h3>
            
            {fairness.calibration.status === 'MONITORING' && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Settings className="text-gray-500 mb-3" size={32} />
                <p className="text-gray-400 font-medium">Standard Monitoring Active</p>
                <p className="text-xs text-gray-500 mt-2">No active calibration candidates running.</p>
              </div>
            )}

            {fairness.calibration.status === 'SHADOW_EVALUATION' && (
              <div className="space-y-4">
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="text-xs font-bold text-warning mb-1 uppercase">Current State</div>
                  <div className="text-white font-medium">Shadow Evaluation</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-1">Feedback Samples</div>
                  <div className="text-white font-bold">{nd.truePositives + nd.falsePositives}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1">Calibration Candidate</div>
                  <div className="text-primary font-bold">{fairness.calibration.candidateDescription}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1">Shadow FPR Performance</div>
                  <div className="text-success font-bold">{fairness.calibration.shadowFPR}% (Improved)</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1">Overall Model Impact</div>
                  <div className="text-white font-bold">Recall {fairness.calibration.shadowOverallRecall}% (Within Tolerance)</div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button onClick={onInvestigate} className="w-full py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center justify-center space-x-2">
                    <span>Investigate Calibration</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {fairness.calibration.status === 'PROMOTED' && (
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-center">
                <CheckCircle className="text-success mx-auto mb-2" size={24} />
                <div className="font-bold text-success mb-1">Calibration Promoted</div>
                <div className="text-xs text-gray-400">Model candidate successfully deployed.</div>
              </div>
            )}
            
            {fairness.calibration.status === 'REJECTED' && (
              <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
                <X className="text-gray-400 mx-auto mb-2" size={24} />
                <div className="font-bold text-gray-300 mb-1">Calibration Rejected</div>
                <div className="text-xs text-gray-500">Rolled back to standard monitoring.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { CheckCircle, X } from 'lucide-react';

const MetricCard = ({ title, value, highlight = false, icon }: any) => (
  <div className={`glass-panel rounded-xl p-5 border-t-2 ${highlight ? 'border-t-danger' : 'border-t-primary/50'} flex flex-col`}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">{title}</h3>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
        {React.cloneElement(icon, { size: 16 })}
      </div>
    </div>
    <div className={`text-2xl font-bold mb-2 ${highlight ? 'text-danger' : 'text-white'}`}>{value}</div>
  </div>
);
