import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Bot,
  ScanQrCode,
  Gauge,
  Mic,
  PhoneCall,
  Users,
  BellRing,
  ArrowRight,
  Sparkles,
  Clock,
  Activity,
  Lightbulb,
  ArrowUpRight,
  ChevronRight,
  GraduationCap,
  LifeBuoy
} from 'lucide-react';
import { NavSection } from '../types';

interface DashboardViewProps {
  onNavigate: (section: NavSection) => void;
  onSelectPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectPrompt,
}) => {
  const [activeChartMetric, setActiveChartMetric] = useState<'scams' | 'blocked'>('scams');
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  // Weekly fraud trends data for interactive visual chart
  const weeklyTrends = [
    { day: 'Mon', attempts: 42, blocked: 40 },
    { day: 'Tue', attempts: 58, blocked: 56 },
    { day: 'Wed', attempts: 49, blocked: 47 },
    { day: 'Thu', attempts: 64, blocked: 62 },
    { day: 'Fri', attempts: 78, blocked: 76 },
    { day: 'Sat', attempts: 89, blocked: 85 },
    { day: 'Sun', attempts: 94, blocked: 91 },
  ];

  const recentIncidents = [
    {
      id: 'inc-1',
      type: 'Digital Arrest Video Extortion',
      vector: 'WhatsApp Video (Fake Police Uniform)',
      time: '14 mins ago',
      status: 'HIGH RISK BLOCKED',
      statusColor: 'bg-[#FF5263]/15 text-[#FF5263] border-[#FF5263]/30',
    },
    {
      id: 'inc-2',
      type: 'Fake Electricity Disconnection SMS',
      vector: '10-Digit Mobile SMS with APK',
      time: '1 hour ago',
      status: 'TROJAN DETECTED',
      statusColor: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30',
    },
    {
      id: 'inc-3',
      type: 'OLX Advance Payment QR Code',
      vector: 'Reverse UPI Collect Request',
      time: '3 hours ago',
      status: 'PIN SCAM DEFUSED',
      statusColor: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    },
    {
      id: 'inc-4',
      type: 'Telegram "YouTube Video Like" Task',
      vector: 'Ponzi Investment Pool',
      time: '5 hours ago',
      status: 'MULE FRAUD STOPPED',
      statusColor: 'bg-[#8067FF]/15 text-[#8067FF] border-[#8067FF]/30',
    },
  ];

  const safetyTips = [
    {
      title: 'UPI PIN is Exclusively for Debiting Money',
      description: 'You NEVER need to enter your UPI PIN or scan any QR code to receive money. Scanning a QR code always debits funds from your bank.',
      badge: 'Golden Rule #1',
    },
    {
      title: 'Real Police & CBI Never Arrest Over Video Calls',
      description: 'No Indian law enforcement agency (CBI, ED, Cyber Police) conducts interrogations or puts citizens under "Digital Arrest" via Skype or WhatsApp.',
      badge: 'Extortion Defense',
    },
    {
      title: 'Never Install .APK Files from Unknown Numbers',
      description: 'Never install files ending in ".apk" received over messages. Malicious APKs intercept your SMS OTPs and control your device in the background.',
      badge: 'Malware Defense',
    },
    {
      title: 'The Golden 120-Minute Window',
      description: 'If funds are fraudulently debited, calling 1930 within 2 hours gives banks the highest chance to freeze scammer accounts before ATM cash-out.',
      badge: 'Emergency Action',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Large Welcome Hero Card with Dark 3D Embossed Depth */}
      <div className="relative overflow-hidden embossed-card p-6 sm:p-8">
        {/* Ambient Cyan/Purple Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D9FF]/8 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#3478F6]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/25 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D9FF]"></span>
                </span>
                Sentinel Cyber Shield Active
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#3478F6]/15 text-[#3478F6] border border-[#3478F6]/30">
                NPCI & I4C COMPLIANT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F4F7FF] tracking-tight leading-tight">
              Think Safe. Pay Safe. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3478F6] via-[#168BFF] to-[#00D9FF]">
                Intelligent UPI Fraud Prevention
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#A5B4CC] leading-relaxed">
              Real-time cyber defense platform safeguarding citizens, parents, and students against QR scams, malicious KYC links, fake refund calls, and digital arrest threats.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('scanner')}
                className="px-5 py-2.5 text-xs font-bold rounded-2xl embossed-btn-cyan flex items-center gap-2 cursor-pointer"
              >
                <ScanQrCode className="w-4 h-4" />
                <span>Verify Screenshot / QR</span>
              </button>

              <button
                onClick={() => onNavigate('chatbot')}
                className="px-5 py-2.5 text-xs font-bold rounded-2xl embossed-btn-primary flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask Safety Coach</span>
              </button>

              <button
                onClick={() => onNavigate('safety_academy')}
                className="px-4 py-2.5 text-xs font-bold rounded-2xl embossed-btn text-[#A5B4CC] hover:text-[#F4F7FF] flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#20C997]" />
                <span>Scam Academy</span>
              </button>
            </div>
          </div>

          {/* Defense Status Inset Panel */}
          <div className="w-full lg:w-80 rounded-2xl p-5 embossed-inset border border-white/5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5B4CC]">
                DEFENSE STATUS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30">
                100% GUARDED
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#F4F7FF]">
                <span>National Threat Level</span>
                <span className="text-[#FF5263] font-mono font-extrabold">ELEVATED</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden embossed-inset-soft">
                <div className="w-4/5 h-full bg-gradient-to-r from-[#FFB547] to-[#FF5263] rounded-full"></div>
              </div>
              <p className="text-[11px] text-[#A5B4CC] leading-tight">
                Surge in fake electricity bill SMS & WhatsApp extortion calls nationwide.
              </p>
            </div>

            <div className="p-3 rounded-xl embossed-inset-soft flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00D9FF]" />
                <span className="font-bold text-[#F4F7FF]">Golden Hour:</span>
              </div>
              <span className="font-mono font-extrabold text-[#00D9FF]">120 Minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Embossed Statistics Cards (4-Tier Dark 3D Depth) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Threat Vectors Monitored',
            value: '15 Active',
            sub: 'QR, KYC, AnyDesk, Calls',
            icon: ShieldAlert,
            color: 'text-[#3478F6]',
          },
          {
            title: 'Multimodal Vision OCR',
            value: 'Gemini AI',
            sub: 'Deep Text & Link Analysis',
            icon: ScanQrCode,
            color: 'text-[#00D9FF]',
          },
          {
            title: 'Voice AI Languages',
            value: '5 Indic',
            sub: 'EN, HI, TE, TA, KN',
            icon: Mic,
            color: 'text-[#8067FF]',
          },
          {
            title: 'Emergency Response',
            value: 'Dial 1930',
            sub: 'Instant Bank Account Freeze',
            icon: PhoneCall,
            color: 'text-[#FF5263]',
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="embossed-card p-5 hover:embossed-card-hover transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#A5B4CC] uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 embossed-icon ${metric.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <span className="text-xl sm:text-2xl font-black text-[#F4F7FF]">
                  {metric.value}
                </span>
              </div>

              <span className="text-[11px] text-[#71829D] font-mono">
                {metric.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Core Fraud Prevention Modules Cards */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg font-black text-[#F4F7FF] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              Core Fraud Prevention Modules
            </h2>
            <p className="text-xs text-[#A5B4CC]">
              Intelligent AI defenses configured for proactive financial cyber protection
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#00D9FF] hidden sm:block">
            ALL SYSTEMS ARMED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: AI Screenshot & QR Scanner */}
          <div
            onClick={() => onNavigate('scanner')}
            className="embossed-card p-6 hover:embossed-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl text-[#00D9FF] flex items-center justify-center group-hover:scale-110 transition-transform embossed-icon">
                  <ScanQrCode className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
                  VISION OCR
                </span>
              </div>
              <h3 className="text-base font-black text-[#F4F7FF] group-hover:text-[#00D9FF] transition-colors">
                AI Screenshot & QR Scanner
              </h3>
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed">
                Upload screenshots of SMS, WhatsApp chats, payment slips, or QR images. Extracts text, checks suspicious URLs, and breaks down danger signs.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#00D9FF]">
              <span>Launch Vision Scanner</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Smart Fraud Risk Analyzer */}
          <div
            onClick={() => onNavigate('risk_analyzer')}
            className="embossed-card p-6 hover:embossed-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl text-[#3478F6] flex items-center justify-center group-hover:scale-110 transition-transform embossed-icon">
                  <Gauge className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3478F6]/15 text-[#3478F6] border border-[#3478F6]/30">
                  0–100 GAUGE
                </span>
              </div>
              <h3 className="text-base font-black text-[#F4F7FF] group-hover:text-[#3478F6] transition-colors">
                Smart Fraud Risk Analyzer
              </h3>
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed">
                Describe unknown callers, refund promises, or KYC threats. Computes a multi-vector risk score with danger tags and concrete next steps.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#3478F6]">
              <span>Calculate Risk Score</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: AI Voice Assistant */}
          <div
            onClick={() => onNavigate('voice_assistant')}
            className="embossed-card p-6 hover:embossed-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl text-[#8067FF] flex items-center justify-center group-hover:scale-110 transition-transform embossed-icon">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#8067FF]/15 text-[#8067FF] border border-[#8067FF]/30">
                  5 INDIC VOICES
                </span>
              </div>
              <h3 className="text-base font-black text-[#F4F7FF] group-hover:text-[#8067FF] transition-colors">
                AI Voice Assistant
              </h3>
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed">
                Speak directly with Sentinel in English, Hindi, Telugu, Tamil, or Kannada. Features animated 3D mic orb and speech synthesis.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#8067FF]">
              <span>Start Voice Session</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Safety Academy */}
          <div
            onClick={() => onNavigate('safety_academy')}
            className="embossed-card p-6 hover:embossed-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl text-[#20C997] flex items-center justify-center group-hover:scale-110 transition-transform embossed-icon">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30">
                  INTERACTIVE
                </span>
              </div>
              <h3 className="text-base font-black text-[#F4F7FF] group-hover:text-[#20C997] transition-colors">
                Safety Academy & Simulation
              </h3>
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed">
                Test your fraud detection reflexes with interactive real-world scenarios. Learn to disarm Digital Arrest, Reverse QR, and APK trojan attacks.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#20C997]">
              <span>Take Simulation Quiz</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Recovery Assistant */}
          <div
            onClick={() => onNavigate('recovery_assistant')}
            className="embossed-card p-6 hover:embossed-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl text-[#FF5263] flex items-center justify-center group-hover:scale-110 transition-transform embossed-icon">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF5263]/15 text-[#FF5263] border border-[#FF5263]/30">
                  FIR BUILDER
                </span>
              </div>
              <h3 className="text-base font-black text-[#F4F7FF] group-hover:text-[#FF5263] transition-colors">
                Fraud Recovery Assistant
              </h3>
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed">
                Immediate 120-minute golden hour protocol. Generate legal complaint notices and dispute drafts for Cybercrime Portal (1930) and home bank.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#FF5263]">
              <span>Generate Complaint</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: UPI Safety Coach Chatbot */}
          <div
            onClick={() => onNavigate('chatbot')}
            className="embossed-card p-6 hover:embossed-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl text-[#00D9FF] flex items-center justify-center group-hover:scale-110 transition-transform embossed-icon">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
                  10 QUICK REPLIES
                </span>
              </div>
              <h3 className="text-base font-black text-[#F4F7FF] group-hover:text-[#00D9FF] transition-colors">
                UPI Safety Coach (Chatbot)
              </h3>
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed">
                Full-featured conversational assistant with one-click scam prompts, real-time Gemini AI analysis, structured verdicts, and text-to-speech.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#00D9FF]">
              <span>Start Safety Chat</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Visual Threat Trends & Distribution Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Chart Panel */}
        <div className="lg:col-span-8 embossed-card p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]"></span>
                <h3 className="text-base font-extrabold text-[#F4F7FF]">
                  Weekly Cyber Attack Telemetry
                </h3>
              </div>
              <p className="text-xs text-[#A5B4CC] mt-0.5">
                Real-time trend analysis from national telemetry & user community submissions
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl embossed-inset self-start sm:self-center">
              <button
                onClick={() => setActiveChartMetric('scams')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartMetric === 'scams'
                    ? 'bg-[#3478F6] text-white'
                    : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
                }`}
              >
                Reported Attempts
              </button>
              <button
                onClick={() => setActiveChartMetric('blocked')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartMetric === 'blocked'
                    ? 'bg-[#20C997] text-white'
                    : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
                }`}
              >
                Safe Neutralized
              </button>
            </div>
          </div>

          {/* 3D Inset Chart Graphic */}
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 px-2 border-b border-white/5">
              {weeklyTrends.map((item, idx) => {
                const heightPercent = Math.round((item.attempts / 100) * 100);
                const blockedHeight = Math.round((item.blocked / 100) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    <span className="text-[10px] font-mono text-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeChartMetric === 'scams' ? item.attempts : item.blocked}
                    </span>
                    <div className="w-full max-w-[36px] embossed-inset rounded-xl h-full flex items-end p-1 relative overflow-hidden">
                      <div
                        style={{ height: `${activeChartMetric === 'scams' ? heightPercent : blockedHeight}%` }}
                        className={`w-full rounded-lg transition-all duration-500 ${
                          activeChartMetric === 'scams'
                            ? 'bg-gradient-to-t from-[#3478F6] to-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                            : 'bg-gradient-to-t from-[#20C997] to-[#5eead4]'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#A5B4CC] group-hover:text-[#00D9FF]">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#A5B4CC] pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#00D9FF]"></span>
                  <span>Phishing Scans (88%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#20C997]"></span>
                  <span>Losses Intercepted (96.4%)</span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#71829D]">
                Updated 5 mins ago • Live Stream
              </span>
            </div>
          </div>
        </div>

        {/* Threat Distribution Panel */}
        <div className="lg:col-span-4 embossed-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#F4F7FF]">
                Threat Distribution
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5263]/15 text-[#FF5263] border border-[#FF5263]/30">
                TOP VECTORS
              </span>
            </div>

            <p className="text-xs text-[#A5B4CC] mb-5 leading-relaxed">
              Breakdown of fraudulent payment attempts targeting Indian consumers this month:
            </p>

            <div className="space-y-4">
              {[
                { label: 'Fake QR Payment Advance', pct: 38, color: 'bg-[#00D9FF]' },
                { label: 'Digital Arrest Video Extortion', pct: 29, color: 'bg-[#FF5263]' },
                { label: 'Electricity Disconnection SMS', pct: 21, color: 'bg-[#FFB547]' },
                { label: 'Telegram Job Task Schemes', pct: 12, color: 'bg-[#8067FF]' },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#F4F7FF]">
                    <span className="truncate">{item.label}</span>
                    <span className="font-mono text-[#00D9FF]">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden embossed-inset">
                    <div
                      style={{ width: `${item.pct}%` }}
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-[#A5B4CC]">Have a suspicious message?</span>
            <button
              onClick={() => onNavigate('scanner')}
              className="text-xs font-bold text-[#00D9FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Scan it now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity & Security Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Threat Interceptions */}
        <div className="lg:col-span-7 embossed-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#F4F7FF]">
                Recent Threat Interceptions
              </h3>
              <p className="text-xs text-[#A5B4CC]">
                Latest fraud patterns analyzed across community sessions
              </p>
            </div>
            <button
              onClick={() => onNavigate('fraud_alerts')}
              className="text-xs font-bold text-[#00D9FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-3.5 rounded-2xl embossed-inset-soft hover:border-[#00D9FF]/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl embossed-icon text-[#00D9FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F4F7FF] truncate">
                      {incident.type}
                    </h4>
                    <span className="text-[11px] text-[#71829D] font-mono">
                      {incident.vector} • {incident.time}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${incident.statusColor}`}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Safety Tip Card */}
        <div className="lg:col-span-5 embossed-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/25">
                <Lightbulb className="w-3.5 h-3.5" />
                Daily Safety Insight
              </span>
              <span className="text-[11px] font-mono text-[#71829D]">
                {activeTipIndex + 1} / {safetyTips.length}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#F4F7FF] mt-3">
              {safetyTips[activeTipIndex].title}
            </h3>

            <p className="text-xs sm:text-sm text-[#A5B4CC] mt-2 leading-relaxed">
              {safetyTips[activeTipIndex].description}
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {safetyTips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTipIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeTipIndex === i ? 'w-6 bg-[#00D9FF]' : 'w-2 bg-[#22334D]'
                  }`}
                  aria-label={`Go to tip ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => onNavigate('chatbot')}
              className="px-4 py-2 text-xs font-bold rounded-xl embossed-btn-cyan cursor-pointer"
            >
              Ask Safety Coach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
