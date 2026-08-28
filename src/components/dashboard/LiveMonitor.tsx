import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Search, Filter, AlertOctagon, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Transaction } from '../../types';

export const LiveMonitor = ({ onRowClick }: { onRowClick: (id: string) => void }) => {
  const { transactions } = useSimulation();
  const [filter, setFilter] = useState('ALL');

  const filteredTx = transactions.filter(t => {
    if (filter === 'HIGH') return t.riskScore >= 75;
    if (filter === 'MEDIUM') return t.riskScore >= 30 && t.riskScore < 75;
    if (filter === 'LOW') return t.riskScore < 30;
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center bg-card/80 p-4 rounded-xl border border-border/50">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by TXN or User..." 
              className="w-full bg-[#0A0D14] border border-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <FilterBtn label="All" active={filter === 'ALL'} onClick={() => setFilter('ALL')} />
          <FilterBtn label="Critical" active={filter === 'HIGH'} onClick={() => setFilter('HIGH')} color="text-danger" />
          <FilterBtn label="Review" active={filter === 'MEDIUM'} onClick={() => setFilter('MEDIUM')} color="text-warning" />
          <FilterBtn label="Low Risk" active={filter === 'LOW'} onClick={() => setFilter('LOW')} color="text-success" />
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0A0D14] text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTx.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => onRowClick(tx.id)}
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{tx.id}</div>
                    <div className="text-xs text-gray-500">{tx.merchant}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-300">{tx.userId}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4"><RiskBadge score={tx.riskScore} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${tx.confidence}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{tx.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><ActionBadge action={tx.recommendedAction} /></td>
                  <td className="px-6 py-4 text-right text-sm text-gray-400 font-medium">
                    {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FilterBtn = ({ label, active, onClick, color = 'text-gray-300' }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
      active ? 'bg-gray-800 text-white shadow-md' : `hover:bg-gray-800/50 ${color}`
    }`}
  >
    {label}
  </button>
);

const RiskBadge = ({ score }: { score: number }) => {
  if (score >= 75) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-danger/10 text-danger border border-danger/20"><AlertOctagon size={14} className="mr-1"/> {score} CRITICAL</span>;
  if (score >= 30) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/20"><ShieldAlert size={14} className="mr-1"/> {score} REVIEW</span>;
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">{score} LOW</span>;
};

const ActionBadge = ({ action }: { action: Transaction['recommendedAction'] }) => {
  if (action === 'HOLD' || action === 'BLOCK') return <span className="flex items-center text-xs font-bold text-danger"><AlertOctagon size={14} className="mr-1.5"/> {action}</span>;
  if (action === 'REVIEW' || action === 'VERIFY') return <span className="flex items-center text-xs font-bold text-warning"><Clock size={14} className="mr-1.5"/> {action}</span>;
  return <span className="flex items-center text-xs font-bold text-success"><CheckCircle size={14} className="mr-1.5"/> ALLOW</span>;
};
