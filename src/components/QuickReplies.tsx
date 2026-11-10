import React from 'react';
import {
  RotateCcw,
  QrCode,
  HelpCircle,
  FileCheck,
  PhoneCall,
  ScreenShare,
  KeyRound,
  ExternalLink,
  ArrowDownLeft,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { QUICK_REPLIES } from '../data/scenarios';
import { QuickReply } from '../types';

interface QuickRepliesProps {
  onSelect: (scenario: QuickReply) => void;
  isLoading: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, isLoading }) => {
  const getIcon = (name: string) => {
    const className = 'w-4 h-4 flex-shrink-0';
    switch (name) {
      case 'RotateCcw':
        return <RotateCcw className={className} />;
      case 'QrCode':
        return <QrCode className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      case 'FileCheck':
        return <FileCheck className={className} />;
      case 'PhoneCall':
        return <PhoneCall className={className} />;
      case 'ScreenShare':
        return <ScreenShare className={className} />;
      case 'KeyRound':
        return <KeyRound className={className} />;
      case 'ExternalLink':
        return <ExternalLink className={className} />;
      case 'ArrowDownLeft':
        return <ArrowDownLeft className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-mono font-bold text-[#F4F7FF] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF]"></span>
          10 Common Scam Scenarios (1-Tap Analysis)
        </span>
        <span className="text-[11px] text-[#A5B4CC] hidden sm:inline font-mono">
          Tap to analyse standard fraud vectors
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {QUICK_REPLIES.map((reply) => {
          const isUrgent = reply.id === 'report-fraud';
          return (
            <button
              key={reply.id}
              onClick={() => onSelect(reply)}
              disabled={isLoading}
              title={reply.description}
              className={`group flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all duration-200 text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isUrgent
                  ? 'embossed-btn-danger'
                  : 'embossed-btn hover:text-[#00D9FF]'
              }`}
            >
              <div
                className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                  isUrgent
                    ? 'bg-white/20 text-white'
                    : 'embossed-icon text-[#00D9FF] group-hover:scale-105'
                }`}
              >
                {getIcon(reply.iconName)}
              </div>
              <span className="line-clamp-2 leading-tight font-bold">
                {reply.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
