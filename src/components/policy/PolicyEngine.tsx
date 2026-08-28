import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Scale, ArrowRight } from 'lucide-react';

export const PolicyEngine = () => {
  const { isSimulating } = useSimulation();

  const [policies, setPolicies] = useState([
    { id: 1, name: 'Critical Fraud Ring Block', condition: 'Risk Score > 90 AND Confidence > 90%', action: 'BLOCK TRANSACTION', active: true, priority: 1, type: 'critical' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Scale className="text-primary mr-2" size={28} />
            Deterministic Policy Engine
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className={`glass-panel p-5 rounded-xl border flex items-center space-x-6 transition-all ${policy.active ? 'border-border/50' : 'border-border/20 opacity-50'}`}>
              <div className="flex flex-col items-center justify-center w-8 h-8 bg-gray-800 rounded-lg text-gray-400 font-bold text-sm">
                {policy.priority}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="font-bold text-white text-lg">{policy.name}</h3>
                </div>
                <div className="flex items-center space-x-3 text-sm mt-3">
                  <div className="px-3 py-1.5 bg-gray-800/80 rounded-md font-mono text-gray-300 border border-gray-700/50">
                    IF <span className="text-primary font-bold">{policy.condition}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-500" />
                  <div className={`px-3 py-1.5 rounded-md font-bold tracking-wide bg-danger/20 text-danger border border-danger/30`}>
                    THEN {policy.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
