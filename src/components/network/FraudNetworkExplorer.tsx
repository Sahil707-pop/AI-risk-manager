import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import { useSimulation } from '../../context/SimulationContext';
import { User, Smartphone, Globe, CreditCard, ShoppingCart } from 'lucide-react';

export const FraudNetworkExplorer = () => {
  const { isSimulating } = useSimulation();

  const nodes: Node[] = useMemo(() => [
    { id: 'dev-882', type: 'custom', position: { x: 300, y: 200 }, data: { label: 'DEV-882', icon: Smartphone, type: 'Device', risk: 'critical' } },
    { id: 'usr-88', type: 'custom', position: { x: 200, y: 100 }, data: { label: 'USR-88', icon: User, type: 'User', risk: 'critical' } },
    { id: 'usr-12', type: 'custom', position: { x: 400, y: 100 }, data: { label: 'USR-12', icon: User, type: 'User', risk: 'high' } },
    { id: 'ip-x', type: 'custom', position: { x: 300, y: 350 }, data: { label: '192.168.1.x', icon: Globe, type: 'IP', risk: 'high' } },
    { id: 'card-1', type: 'custom', position: { x: 100, y: 200 }, data: { label: 'Card ending 8812', icon: CreditCard, type: 'Payment', risk: 'high' } },
    { id: 'merch-1', type: 'custom', position: { x: 500, y: 250 }, data: { label: 'CryptoExchange', icon: ShoppingCart, type: 'Merchant', risk: 'medium' } },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { id: 'e1', source: 'usr-88', target: 'dev-882', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
    { id: 'e2', source: 'usr-12', target: 'dev-882', animated: true, style: { stroke: '#F59E0B', strokeWidth: 2 } },
    { id: 'e3', source: 'dev-882', target: 'ip-x', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
    { id: 'e4', source: 'usr-88', target: 'card-1', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
    { id: 'e5', source: 'usr-12', target: 'merch-1', animated: true, style: { stroke: '#F59E0B', strokeWidth: 2 } },
  ], []);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="h-full flex space-x-6">
      <div className="flex-1 glass-panel rounded-xl overflow-hidden relative border border-border/50">
        {isSimulating && (
          <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-danger/20 border border-danger/50 text-danger rounded-lg font-bold animate-pulse text-sm backdrop-blur-sm">
            Detecting active Fan-In money laundering cluster...
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#06080F]"
        >
          <Background color="#1F2937" gap={16} />
          <Controls className="bg-gray-800 fill-white text-white border-gray-700" />
        </ReactFlow>
      </div>
      
      <div className="w-80 space-y-4">
        <div className="glass-panel p-5 rounded-xl border border-border/50">
          <h3 className="font-bold text-lg mb-4 text-white">Network Intelligence</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-xs text-gray-400 font-bold tracking-wide mb-1 uppercase">Detected Pattern</div>
              <div className="text-danger font-bold mb-2">Fan-In → Fan-Out</div>
              <p className="text-sm text-gray-300">Multiple unverified accounts funneling funds into a single endpoint prior to merchant withdrawal.</p>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-xs text-gray-400 font-bold tracking-wide mb-1 uppercase">Cluster Metrics</div>
              <div className="space-y-2 mt-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Total Accounts:</span><span className="text-white font-medium">12</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Transactions:</span><span className="text-white font-medium">47</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Shared Devices:</span><span className="text-white font-medium">3</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Network Risk:</span><span className="text-danger font-bold">92 / 100</span></div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-xs text-primary font-bold tracking-wide mb-1 uppercase">AI Assessment</div>
              <p className="text-sm text-gray-300">High probability of mule account behavior. Recommendation is to freeze connected endpoints immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomNode = ({ data }: any) => {
  const Icon = data.icon;
  const isCritical = data.risk === 'critical';
  const isHigh = data.risk === 'high';
  
  return (
    <div className={`px-4 py-2 shadow-xl rounded-lg border-2 bg-[#111827] flex items-center space-x-3 ${
      isCritical ? 'border-danger shadow-danger/20' : (isHigh ? 'border-warning shadow-warning/20' : 'border-border')
    }`}>
      <div className={`p-1.5 rounded-full ${
        isCritical ? 'bg-danger/20 text-danger' : (isHigh ? 'bg-warning/20 text-warning' : 'bg-gray-800 text-white')
      }`}>
        <Icon size={16} />
      </div>
      <div>
        <div className="font-bold text-sm text-white">{data.label}</div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{data.type}</div>
      </div>
    </div>
  );
};
