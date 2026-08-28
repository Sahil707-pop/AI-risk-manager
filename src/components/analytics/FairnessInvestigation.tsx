import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, ChevronRight, Activity, Cpu, CheckCircle, Database } from 'lucide-react';

export const FairnessInvestigation = ({ onBack }: { onBack: () => void }) => {
  const { fairness, resolveCalibration } = useSimulation();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gray-400 mb-6">
        <button onClick={onBack} className="hover:text-white transition-colors">Fairness Monitor</button>
        <ChevronRight size={16} />
        <span className="text-white font-medium">Diagnostic Investigation</span>
      </div>

      <div className="flex justify-between items-start bg-danger/10 border border-danger/30 p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle size={24} className="text-danger" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Fairness Warning: New Device Cohort</h2>
          </div>
          <p className="text-gray-300">The false positive rate for transactions in the "New Device" segment has increased by approximately 14% above its expected baseline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg text-white mb-4 border-b border-border/50 pb-2">What changed?</h3>
            <p className="text-gray-300 text-sm">
              False Positive Rate increased from <span className="font-bold text-white">10.0%</span> to <span className="font-bold text-danger">11.4%</span> (a 14% relative increase) for the New Device cohort over the last evaluation window.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg text-white mb-4 border-b border-border/50 pb-2">Why might it have changed?</h3>
            <div className="space-y-4">
              <div className="flex space-x-3 text-sm">
                <div className="mt-0.5 text-danger"><Activity size={16} /></div>
                <div>
                  <div className="font-bold text-white">Diagnostic Analysis Result</div>
                  <p className="text-gray-400 mt-1">The "New Device" feature contribution is higher than its historical baseline and is associated with a significant increase in legitimate transactions being escalated for review by humans.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg text-white mb-4 border-b border-border/50 pb-2">System Action Timeline</h3>
            <div className="space-y-4">
              <TimelineItem text="Feedback collection active (1,240 samples)" done />
              <TimelineItem text="14% relative FPR increase detected" done />
              <TimelineItem text="Fairness warning generated" done />
              <TimelineItem text="Diagnostic engine isolated feature weight cause" done />
              <TimelineItem text="Bounded calibration candidate generated" done />
              <TimelineItem text="Shadow evaluation running" done={fairness.calibration.status !== 'MONITORING'} active={fairness.calibration.status === 'SHADOW_EVALUATION'} />
              <TimelineItem text="Awaiting promotion decision" active={fairness.calibration.status === 'SHADOW_EVALUATION'} pending={fairness.calibration.status === 'MONITORING'} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Cpu size={120} />
            </div>
            
            <h3 className="font-semibold text-lg text-white mb-2">Shadow Evaluation Results</h3>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">Candidate: New Device Weight -18%</p>

            <div className="space-y-6 relative z-10">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-sm font-medium text-gray-300 mb-2">New Device Cohort FPR</div>
                <div className="flex items-end space-x-3">
                  <span className="text-xl font-bold text-danger line-through opacity-70">11.4%</span>
                  <span className="text-2xl font-bold text-success">9.8%</span>
                  <span className="text-xs text-success mb-1 font-bold">(-1.6% pt improvement)</span>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-sm font-medium text-gray-300 mb-2">Overall Global Recall</div>
                <div className="flex items-end space-x-3">
                  <span className="text-xl font-bold text-white opacity-70">94.0%</span>
                  <span className="text-2xl font-bold text-white">93.9%</span>
                  <span className="text-xs text-warning mb-1 font-bold">(-0.1% pt degradation)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Degradation is within the acceptable <span className="text-white">0.5%</span> tolerance limit.</p>
              </div>
            </div>
          </div>

          {fairness.calibration.status === 'SHADOW_EVALUATION' ? (
            <div className="glass-panel p-6 rounded-xl border border-border/50">
              <h3 className="font-semibold text-lg text-white mb-4">Governance Decision</h3>
              <p className="text-sm text-gray-400 mb-6">Review the shadow evaluation metrics above. The candidate safely improves cohort fairness without damaging global recall.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    resolveCalibration('PROMOTE');
                    onBack();
                  }}
                  className="py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={18} />
                  <span>Promote Candidate</span>
                </button>
                <button 
                  onClick={() => {
                    resolveCalibration('REJECT');
                    onBack();
                  }}
                  className="py-3 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg font-bold transition-colors"
                >
                  Reject & Rollback
                </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-4">This action will be permanently recorded in the Audit Logs.</p>
            </div>
          ) : fairness.calibration.status === 'PROMOTED' ? (
             <div className="p-6 bg-success/10 border border-success/30 rounded-xl text-center">
               <CheckCircle className="text-success mx-auto mb-2" size={32} />
               <div className="font-bold text-success text-lg mb-1">Calibration Successfully Promoted</div>
               <p className="text-sm text-gray-400">The model policy has been updated. Return to the Fairness Monitor.</p>
             </div>
          ) : (
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl text-center">
              <Database className="text-gray-500 mx-auto mb-2" size={32} />
              <div className="font-bold text-gray-300 text-lg mb-1">No Active Calibration</div>
              <p className="text-sm text-gray-400">The system is currently in standard monitoring mode.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ text, done, active, pending }: any) => (
  <div className="flex items-start space-x-3 text-sm">
    <div className={`mt-0.5 rounded-full p-0.5 ${done ? 'bg-success text-black' : active ? 'bg-primary text-white animate-pulse' : 'bg-gray-700 text-gray-500'}`}>
      <CheckCircle size={14} />
    </div>
    <div className={`${done ? 'text-gray-300' : active ? 'text-white font-bold' : 'text-gray-500'}`}>
      {text}
    </div>
  </div>
);
