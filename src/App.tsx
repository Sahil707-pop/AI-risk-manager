import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { SimulationProvider } from './context/SimulationContext';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { LiveMonitor } from './components/dashboard/LiveMonitor';
import { InvestigationView } from './components/investigation/InvestigationView';
import { FraudNetworkExplorer } from './components/network/FraudNetworkExplorer';
import { PolicyEngine } from './components/policy/PolicyEngine';
import { ModelIntelligence } from './components/analytics/ModelIntelligence';
import { FairnessMonitor } from './components/analytics/FairnessMonitor';
import { FairnessInvestigation } from './components/analytics/FairnessInvestigation';
import { AuditLogs } from './components/system/AuditLogs';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  return (
    <SimulationProvider>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {activeView === 'overview' && <CommandCenter />}
        {activeView === 'monitor' && <LiveMonitor onRowClick={(id) => { setSelectedTxId(id); setActiveView('investigation'); }} />}
        {(activeView === 'investigation' || activeView === 'review' || activeView === 'insights') && <InvestigationView txId={selectedTxId} onBack={() => setActiveView('monitor')} />}
        {activeView === 'network' && <FraudNetworkExplorer />}
        {activeView === 'policy' && <PolicyEngine />}
        {activeView === 'model_intelligence' && <ModelIntelligence />}
        {activeView === 'fairness' && <FairnessMonitor onInvestigate={() => setActiveView('fairness_investigation')} />}
        {activeView === 'fairness_investigation' && <FairnessInvestigation onBack={() => setActiveView('fairness')} />}
        {activeView === 'audit' && <AuditLogs />}
      </Layout>
    </SimulationProvider>
  );
}

export default App;
