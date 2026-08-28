import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldAlert, CheckCircle, Clock, TrendingUp, Cpu, Activity, Network, Check, X, AlertTriangle } from 'lucide-react';
import { AskNexus } from './AskNexus';

export const InvestigationView = ({ txId, onBack }: { txId: string | null, onBack: () => void }) => {
  const { transactions, submitFeedback } = useSimulation();
  
  const tx = txId 
    ? transactions.find(t => t.id === txId) 
    : [...transactions].sort((a, b) => b.riskScore - a.riskScore)[0];

  if (!tx) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-96 text-gray-400 space-y-4">
        <ShieldAlert size={48} className="text-gray-600" />
        <h3 className="text-lg font-medium text-white">No Incident Selected</h3>
        <button onClick={onBack} className="px-4 py-2 bg-primary text-white rounded-lg">Return to Monitor</button>
      </div>
    );
  }

  const isHighRisk = tx.riskScore >= 75;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/80 p-6 rounded-xl border border-border/50 shadow-xl">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">{tx.id}</h2>
            {isHighRisk && <span className="px-3 py-1 bg-danger/20 text-danger border border-danger/30 rounded-full text-xs font-bold tracking-wide animate-pulse">CRITICAL RISK</span>}
          </div>
          <div className="text-gray-400 text-sm">Customer: <span className="text-white font-medium">{tx.userId}</span> • Amount: <span className="text-white font-medium">₹{tx.amount.toLocaleString()}</span></div>
        </div>
        
        <div className="flex items-center space-x-6 text-right">
          <div>
            <div className={`text-4xl font-bold ${isHighRisk ? 'text-danger' : (tx.riskScore > 30 ? 'text-warning' : 'text-success')}`}>
              {tx.riskScore} <span className="text-lg text-gray-500 font-normal">/ 100</span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">Confidence: {tx.confidence}%</div>
          </div>
          <div className="w-px h-12 bg-border/50"></div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recommended Policy</div>
            <div className="flex space-x-2">
              <button className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors ${tx.recommendedAction === 'ALLOW' ? 'bg-success/20 text-success border-success/50' : 'border-border/50 text-gray-500'}`}>ALLOW</button>
              <button className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors ${(tx.recommendedAction === 'VERIFY' || tx.recommendedAction === 'REVIEW') ? 'bg-warning/20 text-warning border-warning/50' : 'border-border/50 text-gray-500'}`}>REVIEW</button>
              <button className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors ${(tx.recommendedAction === 'HOLD' || tx.recommendedAction === 'BLOCK') ? 'bg-danger/20 text-danger border-danger/50' : 'border-border/50 text-gray-500'}`}>HOLD</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center space-x-2 mb-6">
              <Cpu className="text-primary" size={24} />
              <h3 className="text-xl font-semibold tracking-wide uppercase">Why Was This Flagged?</h3>
            </div>
            
            <div className="space-y-4">
              {tx.signals.length > 0 ? tx.signals.map(s => (
                <div key={s.id} className="flex space-x-4 p-4 rounded-lg bg-gray-800/40 border border-border/50 hover:bg-gray-800/60 transition-colors">
                  <div className={`mt-1 p-2 rounded-lg ${s.severity === 'CRITICAL' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
                    {s.type === 'Velocity' ? <Activity size={18} /> : s.type === 'Device' ? <Network size={18} /> : <TrendingUp size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className={`text-sm font-bold tracking-wide text-white`}>{s.description}</div>
                      <div className="text-sm font-bold text-gray-300">+{s.impact} Risk Impact</div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex items-center space-x-3 text-success">
                  <CheckCircle size={20} />
                  <p className="font-medium text-sm">No significant risk factors detected in this transaction.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border-l-4 border-l-primary">
            <h3 className="font-semibold text-lg mb-4 text-white uppercase tracking-wide">AI Investigation</h3>
            <div className="space-y-3">
              {tx.investigationSteps?.map((step, idx) => (
                <div key={idx} className={`text-sm font-medium ${step.includes('⏳') ? 'text-gray-400 animate-pulse' : 'text-gray-300'}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-96">
            <AskNexus tx={tx} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-border/50 relative overflow-hidden">
            <h3 className="font-semibold text-lg mb-6">AI Risk Engine</h3>
            
            <div className="space-y-4 mb-8">
              <RiskComponent label="Behavioral Deviation" score={Math.max(5, Math.floor(tx.riskScore * 0.4))} />
              <RiskComponent label="Transaction Risk" score={Math.max(2, Math.floor(tx.riskScore * 0.25))} />
              <RiskComponent label="Graph Network Risk" score={Math.max(3, Math.floor((tx.networkRiskScore || tx.riskScore) * 0.2))} />
              <RiskComponent label="Device Risk" score={Math.max(1, Math.floor(tx.riskScore * 0.1))} />
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-gray-400">FINAL RISK SCORE</span>
                <span className={`text-2xl font-bold ${isHighRisk ? 'text-danger' : 'text-success'}`}>{tx.riskScore}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-gray-400">CONFIDENCE</span>
                <span className="text-lg font-bold text-white">{tx.confidence}%</span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg mb-4">Human-in-the-Loop Review</h3>
            {tx.feedback ? (
              <div className="p-4 bg-gray-800 rounded-lg text-center border border-gray-700">
                <p className="text-sm text-gray-300 mb-2">Decision recorded:</p>
                <div className={`font-bold ${tx.feedback.investigatorDecision === 'CONFIRM_FRAUD' ? 'text-danger' : tx.feedback.investigatorDecision === 'MARK_LEGITIMATE' ? 'text-success' : 'text-warning'}`}>
                  {tx.feedback.investigatorDecision.replace('_', ' ')}
                </div>
                <p className="text-xs text-primary mt-2">Feedback recorded in Audit Log & sent to RL Engine.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={() => submitFeedback(tx.id, 'CONFIRM_FRAUD')} className="w-full py-3 rounded-lg font-bold bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 transition-colors flex items-center justify-center space-x-2">
                  <Check size={18} />
                  <span>Confirm Fraud</span>
                </button>
                <button onClick={() => submitFeedback(tx.id, 'MARK_LEGITIMATE')} className="w-full py-3 rounded-lg font-bold bg-success/20 text-success border border-success/30 hover:bg-success/30 transition-colors flex items-center justify-center space-x-2">
                  <X size={18} />
                  <span>Mark Legitimate</span>
                </button>
                <button onClick={() => submitFeedback(tx.id, 'ESCALATE')} className="w-full py-3 rounded-lg font-bold bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <AlertTriangle size={18} />
                  <span>Escalate to Tier 2</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskComponent = ({ label, score }: { label: string, score: number }) => (
  <div>
    <div className="flex justify-between text-xs font-medium text-gray-400 mb-1">
      <span>{label}</span>
      <span className="text-white">{score} pts</span>
    </div>
    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
      <div className="bg-primary/70 h-full rounded-full" style={{ width: `${Math.min(100, score * 3)}%` }} />
    </div>
  </div>
);
