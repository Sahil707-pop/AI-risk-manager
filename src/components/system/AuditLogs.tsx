import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Terminal, Search } from 'lucide-react';

export const AuditLogs = () => {
  const { auditLogs } = useSimulation();
  const [filter, setFilter] = useState('');

  const filteredLogs = auditLogs.filter(l => 
    l.actor.toLowerCase().includes(filter.toLowerCase()) || 
    l.action.toLowerCase().includes(filter.toLowerCase()) ||
    l.entity.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <Terminal className="text-primary" size={28} />
          <h2 className="text-2xl font-bold tracking-tight">System & Audit Logs</h2>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-border/50 flex items-center space-x-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by actor, action, or entity..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-[#0A0D14] border border-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0A0D14] text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()} - {log.timestamp.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-300">
                    {log.actor}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.action === 'CONFIRM_FRAUD' ? 'bg-danger/20 text-danger' :
                      log.action === 'MARK_LEGITIMATE' ? 'bg-success/20 text-success' :
                      log.action.includes('ALERT') ? 'bg-warning/20 text-warning' :
                      'bg-gray-800 text-gray-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {log.entity}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {log.details}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No logs found matching "{filter}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
