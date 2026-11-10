import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Volume2,
  Users,
  Bell,
  Trash2,
  CheckCircle2,
  Save,
  Lock,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [seniorMode, setSeniorMode] = useState(true);
  const [autoVoice, setAutoVoice] = useState(false);
  const [speechRate, setSpeechRate] = useState('1.0');
  const [emergencyName, setEmergencyName] = useState('Family Guardian (Ravi)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');
  const [notificationSound, setNotificationSound] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="embossed-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl embossed-icon flex items-center justify-center text-[#8067FF]">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8067FF] font-mono font-bold">
                SYSTEM CONFIGURATION
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#8067FF]/10 text-[#8067FF] font-semibold border border-[#8067FF]/20">
                SENTINEL V3.2
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#F4F7FF] tracking-tight mt-1">
              Security & Preference Settings
            </h1>
            <p className="text-sm text-[#A5B4CC] mt-1 max-w-xl">
              Customize AI defense thresholds, voice assistant speech cadence, senior citizen accessibility, and emergency guardian routing.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="embossed-btn-primary px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-[#20C997]" /> : <Save className="w-4 h-4" />}
          {isSaved ? "Saved Successfully" : "Save Preferences"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Senior Citizen & Accessibility Card */}
        <div className="embossed-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#00D9FF]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F4F7FF]">Senior Protection & Accessibility</h2>
              <p className="text-xs text-[#A5B4CC]">Optimized ergonomics for elderly parents and grandparents</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl embossed-inset">
              <div>
                <p className="text-xs font-bold text-[#F4F7FF]">Senior Citizen High-Contrast Mode</p>
                <p className="text-[11px] text-[#A5B4CC]">Enlarged fonts and simplified vernacular summaries</p>
              </div>
              <button
                onClick={() => setSeniorMode(!seniorMode)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${seniorMode ? 'bg-[#3478F6]' : 'bg-[#22334D]'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${seniorMode ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl embossed-inset">
              <div>
                <p className="text-xs font-bold text-[#F4F7FF]">Auto-Read AI Answers via Voice</p>
                <p className="text-[11px] text-[#A5B4CC]">Automatically speaks response when verdict is SUSPICIOUS</p>
              </div>
              <button
                onClick={() => setAutoVoice(!autoVoice)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${autoVoice ? 'bg-[#3478F6]' : 'bg-[#22334D]'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${autoVoice ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Voice Assistant Engine Settings */}
        <div className="embossed-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#3478F6]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F4F7FF]">Sentinel Live Speech Engine</h2>
              <p className="text-xs text-[#A5B4CC]">Indic voice synthesis rate and audio output pitch</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs text-[#A5B4CC] mb-1">
                <span>Speech Speed Cadence</span>
                <span className="font-mono text-[#00D9FF]">{speechRate}x Speed</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(e.target.value)}
                className="w-full accent-[#00D9FF]"
              />
              <div className="flex justify-between text-[10px] text-[#71829D] font-mono mt-1">
                <span>0.75x (Gentle / Senior)</span>
                <span>1.0x (Standard)</span>
                <span>1.5x (Fast)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl embossed-inset">
              <div>
                <p className="text-xs font-bold text-[#F4F7FF]">Audio Chime on Threats</p>
                <p className="text-[11px] text-[#A5B4CC]">Play audible safety alert when high risk is detected</p>
              </div>
              <button
                onClick={() => setNotificationSound(!notificationSound)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${notificationSound ? 'bg-[#3478F6]' : 'bg-[#22334D]'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationSound ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Guardian Routing */}
        <div className="embossed-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#FF5263]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F4F7FF]">Designated Family Guardian</h2>
              <p className="text-xs text-[#A5B4CC]">Primary contact to notify when an elderly member faces an active scam</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Guardian Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Guardian Mobile (WhatsApp Alerts)</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Engine Diagnostics */}
        <div className="embossed-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#20C997]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F4F7FF]">Privacy & Sentinel Shield Core</h2>
              <p className="text-xs text-[#A5B4CC]">Client-side PIN/OTP redaction & security verification</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="p-3 rounded-xl embossed-inset flex items-center justify-between">
              <span className="text-[#A5B4CC]">Client-side PIN / OTP Scrubbing</span>
              <span className="text-[#20C997] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>
            <div className="p-3 rounded-xl embossed-inset flex items-center justify-between">
              <span className="text-[#A5B4CC]">Google Gemini Multimodal API</span>
              <span className="text-[#00D9FF] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> OPERATIONAL
              </span>
            </div>
            <div className="p-3 rounded-xl embossed-inset flex items-center justify-between">
              <span className="text-[#A5B4CC]">Citizen Helpline Connect</span>
              <span className="text-[#FFB547] font-mono font-bold">1930 / I4C LINKED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
