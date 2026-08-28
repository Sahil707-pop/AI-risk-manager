import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Target, ShieldCheck, Activity } from 'lucide-react';

export const ModelIntelligence = () => {
  const { rlMetrics } = useSimulation();

  // Simulated learning curve data
  const learningData = Array.from({ length: 10 }).map((_, i) => ({
    episode: `Batch ${i + 1}`,
    accuracy: Math.min(99, 82 + (i * 1.5) + (rlMetrics.accuracy - 91.4)),
    precision: Math.min(99, 78 + (i * 2) + (rlMetrics.precision - 89.0))
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 text-white">
        <Brain className="text-primary" size={28} />
        <h2 className="text-2xl font-bold tracking-tight">Adaptive Model Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Model Accuracy" value={`${rlMetrics.accuracy.toFixed(1)}%`} subtext="↑ Driven by human feedback" icon={<Target />} />
        <MetricCard title="Precision" value={`${rlMetrics.precision.toFixed(1)}%`} subtext="True Positive Rate" icon={<ShieldCheck />} />
        <MetricCard title="Recall" value={`${rlMetrics.recall.toFixed(1)}%`} subtext="Fraud Capture Rate" icon={<Activity />} />
        <MetricCard title="False Positives" value={`${rlMetrics.falsePositiveRate.toFixed(1)}%`} subtext="↓ Decreasing over time" icon={<Brain />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="font-semibold text-lg text-white mb-6">Reinforcement Learning Curve (Simulated)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningData}>
                <XAxis dataKey="episode" stroke="#4B5563" fontSize={12} />
                <YAxis domain={['auto', 'auto']} stroke="#4B5563" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={3} name="Accuracy" />
                <Line type="monotone" dataKey="precision" stroke="#10B981" strokeWidth={3} name="Precision" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="font-semibold text-lg text-white mb-6">AI vs Human Decisions (Feedback Loop)</h3>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-300">AI Correct (Human Agreement)</span>
                <span className="text-success">{Math.min(100, (rlMetrics.accuracy + 2)).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-success h-full rounded-full" style={{ width: `${rlMetrics.accuracy + 2}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-300">False Positives (AI blocked, Human allowed)</span>
                <span className="text-warning">{rlMetrics.falsePositiveRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-warning h-full rounded-full" style={{ width: `${rlMetrics.falsePositiveRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-300">False Negatives (AI allowed, Human blocked)</span>
                <span className="text-danger">{(100 - rlMetrics.recall).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-danger h-full rounded-full" style={{ width: `${100 - rlMetrics.recall}%` }} />
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="font-bold text-primary">System Note:</span> 
                {' '}Model policy is actively adapting based on {rlMetrics.totalFeedbackEvents} total feedback events collected from Tier 2 investigators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtext, icon }: any) => (
  <div className="glass-panel rounded-xl p-5 border-t-2 border-t-primary/50 flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-gray-400 tracking-wide">{title}</h3>
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {React.cloneElement(icon, { size: 16 })}
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-xs text-gray-400">{subtext}</div>
  </div>
);
