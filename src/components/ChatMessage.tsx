import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  User,
  Copy,
  Check,
  PhoneCall,
  ExternalLink,
  Volume2,
  VolumeX,
  CheckSquare,
  Square,
  Info,
} from 'lucide-react';
import { Message, VerdictType } from '../types';

interface ChatMessageProps {
  message: Message;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSpeak, isSpeaking }) => {
  const [copied, setCopied] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  // Helper to parse sections from message text
  const parseSections = (rawText: string) => {
    const verdictMatch = rawText.match(/VERDICT:\s*([^\n\r]+)/i);
    const whyMatch = rawText.match(/WHY IS IT SUSPICIOUS\??\s*([\s\S]*?)(?=WHAT SHOULD YOU DO\??|$)/i);
    const whatMatch = rawText.match(/WHAT SHOULD YOU DO\??\s*([\s\S]*?)(?=EMERGENCY HELP|$)/i);
    const emergencyMatch = rawText.match(/EMERGENCY HELP:?\s*([\s\S]*)$/i);

    const verdictText = verdictMatch ? verdictMatch[1].trim() : '';
    const whyText = whyMatch ? whyMatch[1].trim() : '';
    const whatText = whatMatch ? whatMatch[1].trim() : '';
    const emergencyText = emergencyMatch ? emergencyMatch[1].trim() : '';

    return {
      hasStructuredFormat: Boolean(verdictMatch && (whyMatch || whatMatch)),
      verdictText,
      whyText,
      whatText,
      emergencyText,
    };
  };

  if (message.sender === 'user') {
    return (
      <div className="flex justify-end items-start gap-3 my-3.5">
        <div className="max-w-[85%] sm:max-w-[75%] embossed-btn-primary text-white rounded-2xl rounded-tr-xs px-5 py-3.5">
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>
          <div className="text-[10px] text-blue-200 mt-2 text-right font-mono">
            {message.timestamp}
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl embossed-icon text-[#00D9FF] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant Message
  const { hasStructuredFormat, verdictText, whyText, whatText, emergencyText } = parseSections(message.text);
  const detectedVerdict = message.verdict || (verdictText.toUpperCase().includes('SAFE') ? 'SAFE' : verdictText.toUpperCase().includes('SCAM') ? 'LIKELY SCAM' : 'SUSPICIOUS');

  const getVerdictBadge = (verdict: VerdictType) => {
    switch (verdict) {
      case 'SAFE':
        return {
          bg: 'bg-[#20C997]/15 border-[#20C997]/30 text-[#F4F7FF]',
          badgeBg: 'bg-[#20C997] text-[#0B1220]',
          icon: <ShieldCheck className="w-5 h-5 text-[#20C997] flex-shrink-0" />,
          title: 'VERDICT: SAFE',
          subtitle: 'No immediate fraud flags detected, but always stay vigilant.',
        };
      case 'LIKELY SCAM':
        return {
          bg: 'bg-[#FF5263]/15 border-[#FF5263]/30 text-[#F4F7FF]',
          badgeBg: 'bg-[#FF5263] text-white',
          icon: <AlertTriangle className="w-5 h-5 text-[#FF5263] flex-shrink-0 animate-pulse" />,
          title: 'VERDICT: LIKELY SCAM',
          subtitle: 'High probability of fraudulent activity. Do not proceed or send money!',
        };
      case 'SUSPICIOUS':
      default:
        return {
          bg: 'bg-[#FFB547]/15 border-[#FFB547]/30 text-[#F4F7FF]',
          badgeBg: 'bg-[#FFB547] text-[#0B1220]',
          icon: <ShieldAlert className="w-5 h-5 text-[#FFB547] flex-shrink-0" />,
          title: 'VERDICT: SUSPICIOUS',
          subtitle: 'Warning signs detected. High caution advised before taking any action.',
        };
    }
  };

  const verdictConfig = getVerdictBadge(detectedVerdict);

  const actionSteps = whatText
    ? whatText
        .split(/\n(?=\d+[\.\)])/)
        .map((step) => step.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex justify-start items-start gap-3 my-4">
      <div className="w-9 h-9 rounded-xl embossed-icon text-[#00D9FF] flex items-center justify-center flex-shrink-0 mt-1">
        <ShieldCheck className="w-5 h-5" />
      </div>

      <div className="max-w-[95%] sm:max-w-[85%] embossed-card overflow-hidden">
        {/* Assistant Header & Actions */}
        <div className="px-5 py-2.5 border-b border-white/5 flex items-center justify-between gap-2 bg-[#121c2c]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-[#00D9FF] tracking-tight">UPI SAFETY COACH</span>
            <span className="text-[10px] text-[#71829D] font-mono hidden sm:inline">• Analysis & Guidance</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onSpeak && (
              <button
                onClick={() => onSpeak(message.text)}
                className="px-2.5 py-1 text-[#A5B4CC] hover:text-[#00D9FF] rounded-lg transition-all text-xs flex items-center gap-1 embossed-btn cursor-pointer"
                title={isSpeaking ? 'Stop speaking' : 'Listen to this advice'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-[#FF5263]" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline font-bold">{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-[#A5B4CC] hover:text-[#00D9FF] rounded-lg transition-all text-xs flex items-center gap-1 embossed-btn cursor-pointer"
              title="Copy response to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#20C997]" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline font-bold">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {hasStructuredFormat ? (
            <>
              {/* Verdict Card */}
              <div className={`p-4 rounded-2xl border ${verdictConfig.bg}`}>
                <div className="flex items-start gap-3.5">
                  <div className="p-1 rounded-xl embossed-icon">
                    {verdictConfig.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wide uppercase font-mono ${verdictConfig.badgeBg}`}>
                        {verdictConfig.title}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold mt-1 text-[#F4F7FF]">
                      {verdictConfig.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* WHY IS IT SUSPICIOUS? */}
              {whyText && (
                <div className="p-4 sm:p-5 rounded-2xl embossed-inset-soft">
                  <h4 className="text-xs font-black text-[#FFB547] tracking-wider uppercase mb-2 flex items-center gap-1.5 font-mono">
                    <Info className="w-4 h-4 text-[#FFB547]" />
                    WHY IS IT SUSPICIOUS?
                  </h4>
                  <div className="text-xs sm:text-sm text-[#A5B4CC] leading-relaxed whitespace-pre-wrap pl-1 font-medium">
                    {whyText}
                  </div>
                </div>
              )}

              {/* WHAT SHOULD YOU DO? */}
              {actionSteps.length > 0 ? (
                <div className="p-4 sm:p-5 rounded-2xl embossed-inset-soft">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-black text-[#00D9FF] tracking-wider uppercase flex items-center gap-1.5 font-mono">
                      <ShieldAlert className="w-4 h-4 text-[#00D9FF]" />
                      WHAT SHOULD YOU DO?
                    </h4>
                    <span className="text-[11px] text-[#00D9FF] font-mono">Interactive Safety Checklist</span>
                  </div>
                  <div className="space-y-2">
                    {actionSteps.map((step, idx) => {
                      const isChecked = !!completedSteps[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStep(idx)}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30'
                              : 'embossed-btn text-[#F4F7FF]'
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 flex-shrink-0 text-[#00D9FF] cursor-pointer"
                            aria-label={`Toggle action step ${idx + 1}`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#20C997]" />
                            ) : (
                              <Square className="w-4 h-4 text-[#71829D]" />
                            )}
                          </button>
                          <span className={`text-xs sm:text-sm leading-snug font-medium ${isChecked ? 'line-through text-[#71829D]' : ''}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : whatText ? (
                <div className="p-4 sm:p-5 rounded-2xl embossed-inset-soft">
                  <h4 className="text-xs font-black text-[#00D9FF] tracking-wider uppercase mb-2 font-mono">
                    WHAT SHOULD YOU DO?
                  </h4>
                  <div className="text-xs sm:text-sm text-[#A5B4CC] leading-relaxed whitespace-pre-wrap font-medium">
                    {whatText}
                  </div>
                </div>
              ) : null}

              {/* EMERGENCY HELP */}
              <div className="p-4 sm:p-5 rounded-2xl embossed-inset border border-[#FF5263]/30 text-[#F4F7FF]">
                <h4 className="text-xs font-black text-[#FF5263] tracking-wider uppercase mb-2 flex items-center gap-1.5 font-mono">
                  <PhoneCall className="w-4 h-4 text-[#FF5263]" />
                  EMERGENCY HELP (NATIONAL ASSISTANCE)
                </h4>
                <div className="text-xs sm:text-sm space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#A5B4CC]">Cybercrime Helpline:</span>
                    <a
                      href="tel:1930"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 embossed-btn-danger text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Call 1930 (Toll Free)
                    </a>
                    <span className="text-[11px] text-[#FF5263] font-mono">(Report within 2 hours)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-bold text-[#A5B4CC]">Official Portal:</span>
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 embossed-btn text-[#00D9FF] font-bold rounded-xl text-xs transition-colors"
                    >
                      <span>https://cybercrime.gov.in</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {emergencyText && (
                    <div className="text-xs text-[#A5B4CC] pt-1.5 leading-relaxed border-t border-white/5 font-medium">
                      {emergencyText.replace(/Cybercrime Helpline:?\s*1930/i, '').replace(/Official Website:?\s*https?:\/\/cybercrime\.gov\.in/i, '').trim()}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm sm:text-base text-[#F4F7FF] leading-relaxed whitespace-pre-wrap font-medium">
              {message.text}
            </div>
          )}
        </div>

        {/* Message Footer */}
        <div className="px-5 py-2 border-t border-white/5 text-[10px] text-[#718096] flex items-center justify-between font-mono bg-[#101a2b]">
          <span>Awareness advisory • Verify with official bank channels</span>
          <span>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
