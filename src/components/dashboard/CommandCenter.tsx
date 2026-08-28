import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Activity, Target, ShieldCheck, AlertTriangle } from 'lucide-react';

const formatCurrency = (val: number) => `₹${(val / 1000000).toFixed(2)}M`;

export const CommandCenter = () => {
  const { stats, rlMetrics, transactions } = useSimulation();

  const chartData = [...transactions].reverse().map((t) => ({
    time: t.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    risk: t.riskScore,
    amount: t.amount
  })).slice(-20);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard title="TOTAL TRANSACTIONS" value={formatCurrency(stats.volume)} subtext="↑ 12.4% vs previous period" icon={<Activity />} />
        <KPICard title="TRANSACTIONS MONITORED" value={stats.monitored.toLocaleString()} subtext="Live monitoring active" icon={<Shield />} />
        <KPICard title="HIGH-RISK ALERTS" value={stats.highRisk.toString()} subtext="↑ 18% today" highlight icon={<AlertTriangle />} />
        <KPICard title="FRAUD PREVENTED" value={formatCurrency(stats.prevented)} subtext="↑ 23% vs previous period" icon={<ShieldCheck />} />
        <KPICard title="MODEL ACCURACY" value={`${rlMetrics.accuracy.toFixed(1)}%`} subtext="↑ 2.1% from RL Feedback" icon={<Target />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg tracking-wide">Live Risk Activity</h3>
          </div>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4B5563" fontSize={12} tickMargin={10} />
                <YAxis stroke="#4B5563" fontSize={12} tickMargin={10} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }} itemStyle={{ color: '#F3F4F6' }} />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <h3 className="font-semibold text-lg tracking-wide mb-6">Risk Distribution</h3>
          <div className="space-y-6">
            <DistributionRow label="LOW RISK" percentage={82} color="bg-success" />
            <DistributionRow label="MEDIUM RISK" percentage={13} color="bg-warning" />
            <DistributionRow label="HIGH RISK" percentage={5} color="bg-danger" />
          </div>
          <div className="mt-auto pt-6 border-t border-border/50">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Latest Critical Events</h4>
            <div className="space-y-3">
              {transactions.filter(t => t.riskScore > 80).slice(0,3).map(t => (
                <div key={t.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div>
                    <div className="font-medium text-white">{t.id}</div>
                    <div className="text-xs text-gray-400">{t.merchant}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-danger">{t.riskScore} / 100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, subtext, highlight = false, icon }: { title: string, value: string, subtext: string, highlight?: boolean, icon: React.ReactNode }) => (
  <div className={`glass-panel rounded-xl p-5 border-t-2 ${highlight ? 'border-t-danger' : 'border-t-primary/50'} flex flex-col`}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">{title}</h3>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className={`text-xs ${highlight ? 'text-danger' : 'text-gray-400'}`}>{subtext}</div>
  </div>
);

const DistributionRow = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div>
    <div className="flex justify-between text-sm font-medium mb-2">
      <span className="text-gray-300 tracking-wide">{label}</span>
      <span className="text-white">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
);
