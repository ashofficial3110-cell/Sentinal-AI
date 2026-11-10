import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Search,
  Share2,
  Check,
  Building2,
  Radio,
  Users,
  Sparkles,
  Info,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { SCAM_ALERTS } from '../data/scenarios';
import { ScamAlertItem } from '../types';

interface FraudAlertsViewProps {
  onGoToSos: () => void;
  onGoToScanner: () => void;
  onGoToAnalyzer: () => void;
}

export const FraudAlertsView: React.FC<FraudAlertsViewProps> = ({
  onGoToSos,
  onGoToScanner,
  onGoToAnalyzer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAlertId, setActiveAlertId] = useState<string>(SCAM_ALERTS[0]?.id || '');

  const categories = [
    { id: 'ALL', label: 'All Live Alerts' },
    { id: 'Digital Arrest Threat', label: 'Digital Arrest' },
    { id: 'Electricity Bill Threat', label: 'Electricity Bills' },
    { id: 'Fake KYC Update', label: 'Fake KYC APKs' },
    { id: 'QR Code Scam', label: 'QR Scams' },
    { id: 'Investment & Part-time Job', label: 'Task & Job Scams' },
  ];

  const filteredAlerts = SCAM_ALERTS.filter((alert) => {
    const matchesCategory =
      selectedCategory === 'ALL' || alert.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.modusOperandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.verifiedSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.warningSigns.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyAlert = (alert: ScamAlertItem) => {
    const textToCopy = `🚨 *CYBER FRAUD ALERT: ${alert.title.toUpperCase()}*\n\n` +
      `⚠️ *How the Scam Operates:* ${alert.modusOperandi}\n\n` +
      `🚩 *Warning Signs:*\n${alert.warningSigns.map((w) => `• ${w}`).join('\n')}\n\n` +
      `🛡️ *Protection Advice:*\n${alert.protectionTips.map((t) => `• ${t}`).join('\n')}\n\n` +
      `Verified Source: ${alert.verifiedSource}\nCybercrime Helpline: Dial 1930 | https://cybercrime.gov.in\n- Shared via UPI Sentinel AI`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const selectedAlert =
    filteredAlerts.find((a) => a.id === activeAlertId) || filteredAlerts[0] || SCAM_ALERTS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner with 3D Embossed Style */}
      <div className="embossed-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Fraud Intelligence Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight">
              Emerging Threats & National Cybercrime Advisories
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#A5B4CC] leading-relaxed font-medium">
              Real-time threat intelligence syndicated from official law enforcement authorities,
              including the Indian Cybercrime Coordination Centre (I4C), CERT-In, RBI, and State Cyber Cells.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToSos}
              className="px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer embossed-btn-danger"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Victim Incident</span>
            </button>
            <button
              onClick={onGoToScanner}
              className="px-4 py-2.5 rounded-xl text-[#00D9FF] hover:text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer embossed-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>Verify Received Message</span>
            </button>
          </div>
        </div>

        {/* Live Ticker */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-3 text-xs text-[#A5B4CC]">
          <span className="font-mono font-bold text-[#FF5263] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Flame className="w-3.5 h-3.5 text-[#FF5263]" />
            Active Warning:
          </span>
          <span className="p-2 rounded-xl font-mono text-[11px] text-[#F4F7FF] embossed-inset">
            Fake Skype Video Arrests claiming illegal FedEx drug parcels (Do not transfer to "clearing" accounts)
          </span>
        </div>
      </div>

      {/* 2. Filter & Search Bar with Embossed Depth */}
      <div className="embossed-card p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#71829D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scams by keyword (e.g. electricity, APK, Skype)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium transition-all embossed-inset focus:border-[#00D9FF]/40"
            />
          </div>

          <div className="text-xs text-[#A5B4CC] font-mono">
            Showing <span className="text-[#00D9FF] font-bold">{filteredAlerts.length}</span> Verified Threat Advisories
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer font-mono ${
                selectedCategory === cat.id
                  ? 'bg-[#3478F6] text-white shadow-lg'
                  : 'embossed-btn text-[#A5B4CC] hover:text-[#F4F7FF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Feed List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#71829D] px-1">
            Active Bulletins
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl embossed-card">
              <Info className="w-8 h-8 text-[#71829D] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#F4F7FF]">
                No matching alerts found
              </p>
              <p className="text-xs text-[#A5B4CC] mt-1">
                Try searching for general keywords or reset your filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="mt-3.5 px-4 py-2 text-white rounded-xl text-xs font-bold cursor-pointer embossed-btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              const isCritical = alert.severity === 'CRITICAL';
              const isHigh = alert.severity === 'HIGH';

              return (
                <div
                  key={alert.id}
                  onClick={() => setActiveAlertId(alert.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'embossed-nav-active border-[#00D9FF]/50'
                      : 'embossed-card hover:embossed-card-hover'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                        isCritical
                          ? 'bg-[#FF5263]/15 text-[#FF5263] border border-[#FF5263]/30'
                          : isHigh
                          ? 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                          : 'bg-[#3478F6]/15 text-[#3478F6] border border-[#3478F6]/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCritical ? 'bg-[#FF5263] animate-ping' : isHigh ? 'bg-[#FFB547]' : 'bg-[#3478F6]'
                        }`}
                      ></span>
                      {alert.severity} SEVERITY
                    </span>

                    <span className="text-[11px] font-mono text-[#71829D]">
                      {alert.reportedDate}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#F4F7FF] leading-snug">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-[#A5B4CC] mt-1.5 line-clamp-2 font-medium">
                    {alert.modusOperandi}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-[#A5B4CC] truncate max-w-[200px] flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                      {alert.verifiedSource}
                    </span>
                    <span className="text-[#00D9FF] font-bold flex items-center gap-1 font-mono">
                      Read Advisory
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Deep-Dive Card */}
        {selectedAlert && (
          <div className="lg:col-span-7 embossed-card p-6 sm:p-7 space-y-5 sticky top-24">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-black px-3 py-1 rounded-full uppercase tracking-wide border ${
                      selectedAlert.severity === 'CRITICAL'
                        ? 'bg-[#FF5263]/15 text-[#FF5263] border-[#FF5263]/30'
                        : 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30'
                    }`}
                  >
                    {selectedAlert.severity} PRIORITY
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20">
                    {selectedAlert.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyAlert(selectedAlert)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer embossed-btn text-[#A5B4CC] hover:text-[#00D9FF]"
                >
                  {copiedId === selectedAlert.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#20C997]" />
                      <span className="text-[#20C997] font-mono">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                      <span className="font-mono">Share Alert</span>
                    </>
                  )}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#F4F7FF] mt-2">
                {selectedAlert.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#A5B4CC]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <strong className="text-[#F4F7FF]">Source:</strong> {selectedAlert.verifiedSource}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-[#8067FF]" />
                  <strong className="text-[#F4F7FF]">Target:</strong> {selectedAlert.affectedDemographic}
                </span>
              </div>
            </div>

            {/* Modus Operandi Box */}
            <div className="p-4 sm:p-5 rounded-2xl embossed-inset-soft">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-[#00D9FF] mb-1.5">
                <Info className="w-4 h-4" />
                Modus Operandi (How Fraudsters Operate)
              </div>
              <p className="text-xs sm:text-sm text-[#F4F7FF] leading-relaxed font-medium">
                {selectedAlert.modusOperandi}
              </p>
            </div>

            {/* Warning Signs */}
            <div>
              <div className="text-xs font-mono font-black uppercase tracking-wider text-[#FF5263] mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Deadly Red Flags To Recognize
              </div>
              <div className="space-y-2">
                {selectedAlert.warningSigns.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#FF5263]/20 flex items-start gap-3 text-xs text-[#F4F7FF] font-medium embossed-card"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#FF5263]/20 text-[#FF5263] font-mono flex items-center justify-center font-black flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Protection Advice */}
            <div>
              <div className="text-xs font-mono font-black uppercase tracking-wider text-[#20C997] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Official Preventive Countermeasures
              </div>
              <div className="space-y-2">
                {selectedAlert.protectionTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#20C997]/20 flex items-start gap-3 text-xs text-[#F4F7FF] font-medium embossed-card"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#20C997] flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#A5B4CC] font-medium">
                Facing this situation right now?
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onGoToAnalyzer}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#A5B4CC] hover:text-[#00D9FF] transition-all cursor-pointer embossed-btn"
                >
                  Analyze Risk Score
                </button>
                <button
                  onClick={onGoToSos}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer embossed-btn-danger"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Call 1930 Helpline</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
