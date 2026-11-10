import React, { useState } from 'react';
import { Mic, PhoneCall, ShieldAlert, Radio, AlertOctagon, Sparkles } from 'lucide-react';
import { LiveVoiceModule } from './LiveVoiceModule';
import { EmergencyCallCenter } from './EmergencyCallCenter';

interface VoiceAndEmergencyHubProps {
  initialSubTab?: 'voice' | 'emergency';
}

export const VoiceAndEmergencyHub: React.FC<VoiceAndEmergencyHubProps> = ({
  initialSubTab = 'voice',
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'emergency'>(initialSubTab);

  return (
    <div className="space-y-4">
      {/* Module Selector Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-cyan-200/80 flex items-center justify-between gap-2 max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'voice'
              ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-900 hover:bg-cyan-50/60'
          }`}
        >
          <Mic className={`w-4 h-4 ${activeTab === 'voice' ? 'animate-pulse text-cyan-200' : 'text-slate-500'}`} />
          <span>Sentinel Live Voice</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] uppercase font-black tracking-wider bg-white/20 rounded">
            Live API
          </span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'emergency'
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md'
              : 'text-slate-700 hover:text-red-700 hover:bg-rose-50/60'
          }`}
        >
          <PhoneCall className={`w-4 h-4 ${activeTab === 'emergency' ? 'animate-bounce text-white' : 'text-rose-600'}`} />
          <span>Emergency Call Center</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] uppercase font-black tracking-wider bg-white/20 rounded">
            1930
          </span>
        </button>
      </div>

      {/* Render Active Sub-Module */}
      {activeTab === 'voice' ? (
        <LiveVoiceModule onOpenEmergency={() => setActiveTab('emergency')} />
      ) : (
        <EmergencyCallCenter />
      )}
    </div>
  );
};
