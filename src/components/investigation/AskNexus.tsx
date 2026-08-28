import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Transaction } from '../../types';

export const AskNexus = ({ tx }: { tx: Transaction }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello. I am Nexus AI. How can I help you investigate ${tx.id}?` }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      let aiResponse = "I'm analyzing the data...";
      const lower = userMsg.toLowerCase();

      if (lower.includes('explain') || lower.includes('why')) {
        aiResponse = `This transaction was flagged because the amount (₹${tx.amount.toLocaleString()}) is significantly higher than normal spending behavior, it originated from a new device (${tx.device}), and the receiving network shows suspicious connections.`;
      } else if (lower.includes('network') || lower.includes('graph')) {
        aiResponse = `The graph risk score is ${tx.networkRiskScore}/100. I detected a potential 'Fan-In' topology where multiple disconnected accounts are funneling funds into a single endpoint associated with this transaction.`;
      } else if (lower.includes('similar') || lower.includes('history')) {
        aiResponse = `I found 3 similar incidents in the last 72 hours. In 100% of those cases, the transaction was ultimately confirmed as fraud by a human investigator.`;
      } else {
        aiResponse = `Based on my current analysis of ${tx.id}, the risk score is ${tx.riskScore} with ${tx.confidence}% confidence. I recommend placing a HOLD on the transaction. Is there a specific aspect you'd like me to explain?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] border border-border/50 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 bg-gray-900 border-b border-border/50 flex items-center space-x-2">
        <Bot size={18} className="text-primary" />
        <h3 className="font-bold text-white text-sm">Ask Nexus</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-gray-700' : 'bg-primary/20 text-primary'}`}>
              {m.role === 'user' ? <User size={14} className="text-gray-300" /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 border border-gray-700/50'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-900 border-t border-border/50">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this alert..."
            className="w-full bg-[#0A0D14] text-sm text-white placeholder-gray-500 rounded-lg pl-3 pr-10 py-2.5 border border-gray-700 focus:outline-none focus:border-primary transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
