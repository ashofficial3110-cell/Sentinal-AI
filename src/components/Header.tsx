import React from 'react';
import {
  Shield,
  PhoneCall,
  BookOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MessageSquare,
  Radio,
  Flame,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'chat' | 'voice_emergency';
  onTabChange: (tab: 'chat' | 'voice_emergency') => void;
  onResetChat: () => void;
  onOpenEmergency: () => void;
  onOpenLibrary: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onResetChat,
  onOpenEmergency,
  onOpenLibrary,
  speechEnabled,
  onToggleSpeech,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-lg border-b border-cyan-500/20">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('chat')}>
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 border border-cyan-300/40 shadow-inner glow-shield text-white">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                UPI SENTINEL AI
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded">
                PRO COACH
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/80 font-medium tracking-wide">
              UPI Fraud Awareness & Live Emergency Connect
            </p>
          </div>
        </div>

        {/* Primary Navigation Item: VOICE & EMERGENCY & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Main Navigation Item: VOICE & EMERGENCY */}
          <button
            onClick={() => onTabChange(currentTab === 'voice_emergency' ? 'chat' : 'voice_emergency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border shadow-sm ${
              currentTab === 'voice_emergency'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-300 shadow-cyan-500/20'
                : 'bg-cyan-950/70 text-cyan-300 hover:text-white hover:bg-cyan-900/80 border-cyan-500/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="tracking-wide">VOICE & EMERGENCY</span>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          </button>

          {/* Direct 1930 Emergency Action button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 border border-rose-400/40"
            title="Emergency 1930 & Lost Money Hub"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>Call 1930</span>
          </button>

          {/* Scam Directory / Library */}
          <button
            onClick={onOpenLibrary}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-blue-100 rounded-xl text-xs font-semibold transition-all border border-white/15"
            title="Browse 15 Common UPI Scams & Warning Signs"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
            <span>Scam Guide</span>
          </button>

          {/* Voice Speech Readout Toggle */}
          <button
            onClick={onToggleSpeech}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              speechEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title={speechEnabled ? 'Voice readout is ON' : 'Turn voice readout ON'}
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{speechEnabled ? 'Voice ON' : 'Voice OFF'}</span>
          </button>

          {/* Start New Chat Button */}
          {currentTab === 'chat' && (
            <button
              onClick={onResetChat}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 active:scale-95"
              title="Clear conversation and start fresh"
            >
              <RotateCcw className="w-3 h-3 text-cyan-300" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Subnav switcher for switching views on mobile/desktop */}
      <div className="bg-slate-950/70 px-4 py-1.5 border-t border-white/5 flex items-center justify-center gap-4 text-xs font-bold">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg transition-colors ${
            currentTab === 'chat'
              ? 'text-cyan-400 bg-white/10 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat Assistant & Scanner</span>
        </button>

        <span className="text-slate-600">|</span>

        <button
          onClick={() => onTabChange('voice_emergency')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg transition-colors ${
            currentTab === 'voice_emergency'
              ? 'text-cyan-400 bg-white/10 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Voice & Emergency (Live)</span>
        </button>
      </div>
    </header>
  );
};
