import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const { isSimulating, startSimulation } = useSimulation();

  return (
    <div className="flex h-screen bg-background overflow-hidden text-white font-sans selection:bg-primary/30">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-8 flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {activeView === 'overview' && 'Executive Risk Dashboard'}
              {activeView === 'monitor' && 'Live Transaction Monitoring'}
              {activeView === 'investigation' && 'Alert Investigation'}
              {activeView === 'network' && 'Fraud Network Explorer'}
              {activeView === 'policy' && 'Policy Engine'}
              {activeView === 'model_intelligence' && 'Model Intelligence Center'}
              {activeView === 'fairness' && 'Fairness & Bias Monitor'}
              {activeView === 'audit' && 'System & Audit Logs'}
            </h2>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className={`w-2 h-2 rounded-full bg-green-500 ${isSimulating ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium text-green-400 tracking-wide uppercase">
                {isSimulating ? 'SIMULATION ACTIVE' : 'SYSTEM MONITORING ACTIVE'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={startSimulation}
              disabled={isSimulating}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isSimulating 
                  ? 'bg-danger/20 text-danger border border-danger/30' 
                  : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25'
              }`}
            >
              <Zap size={16} className={isSimulating ? 'animate-bounce' : ''} />
              <span>{isSimulating ? 'ATTACK SIMULATION RUNNING' : 'RUN LIVE DEMO SCENARIO'}</span>
            </button>
            <div className="flex items-center space-x-4 border-l border-border/50 pl-6">
              <button className="text-gray-400 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-background"></span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-[#0A0D14] p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
