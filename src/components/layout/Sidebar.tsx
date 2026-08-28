import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  ListTodo, 
  Network, 
  BrainCircuit, 
  Scale, 
  History, 
  BarChart3, 
  Settings,
  ShieldCheck,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navGroups = [
    {
      title: 'COMMAND CENTER',
      items: [
        { id: 'overview', label: 'Executive Dashboard', icon: <ShieldAlert size={18} /> },
      ]
    },
    {
      title: 'RISK OPERATIONS',
      items: [
        { id: 'monitor', label: 'Live Monitoring', icon: <Activity size={18} /> },
        { id: 'investigation', label: 'Risk Alerts', icon: <Search size={18} /> },
        { id: 'review', label: 'Human Feedback', icon: <ListTodo size={18} /> },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'network', label: 'Fraud Network', icon: <Network size={18} /> },
        { id: 'insights', label: 'AI Investigations', icon: <BrainCircuit size={18} /> },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'model_intelligence', label: 'Model Intelligence', icon: <BarChart3 size={18} /> },
        { id: 'fairness', label: 'Fairness & Bias Monitor', icon: <ShieldCheck size={18} /> },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'policy', label: 'Policy Engine', icon: <Scale size={18} /> },
        { id: 'audit', label: 'System & Audit Logs', icon: <Terminal size={18} /> },
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-[#06080F] border-r border-border/50 flex flex-col pt-6 pb-4">
      <div className="px-6 mb-8 flex items-center space-x-2 text-white">
        <ShieldAlert className="text-primary" size={24} />
        <div>
          <h1 className="font-bold text-xl leading-tight tracking-tight uppercase">NEXUS</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className="px-2 mb-2 text-xs font-semibold text-gray-500 tracking-wider">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === item.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {activeView === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
