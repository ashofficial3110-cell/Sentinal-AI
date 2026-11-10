import React from 'react';
import { Shield, ExternalLink, PhoneCall, AlertCircle } from 'lucide-react';

interface DisclaimerFooterProps {
  onOpenEmergency: () => void;
}

export const DisclaimerFooter: React.FC<DisclaimerFooterProps> = ({ onOpenEmergency }) => {
  return (
    <footer className="bg-[#F1F4FA] text-[#718096] border-t border-white/80 text-xs py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top bar with emergency contacts */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-[#E8EEF7] text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-white flex items-center justify-center text-[#2563EB] embossed-icon">
              <Shield className="w-4 h-4 stroke-[2.3]" />
            </div>
            <div>
              <span className="font-extrabold text-[#172B4D] text-sm">UPI Safety Coach</span>
              <span className="text-[#718096] text-xs ml-2 font-medium">Public Cyber Awareness Initiative</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white rounded-[12px] font-bold transition-all embossed-btn-danger"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Helpline: 1930</span>
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[#2563EB] border border-white/80 rounded-[12px] font-bold transition-all embossed-btn"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-[#2563EB]" />
            </a>
          </div>
        </div>

        {/* Disclaimer Text with Embossed Inset */}
        <div className="bg-[#F8FAFF] rounded-[20px] p-4 border border-white/90 text-[#718096] space-y-1.5 embossed-inset-soft">
          <div className="flex items-center gap-1.5 font-bold text-amber-700 text-[11px] uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Important Awareness Disclaimer
          </div>
          <p className="text-[11px] leading-relaxed text-[#718096] font-medium">
            This chatbot is an educational fraud-awareness assistant designed to help citizens recognize common cyber scam tactics, phishing tricks, and social engineering. It does not replace official bank verification, law enforcement advice, or formal cyber police reporting. If you suspect an unauthorized deduction from your bank account, immediately contact your bank via the official phone number printed on the back of your debit card and dial <strong className="text-rose-600">1930</strong> to lodge a complaint on <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-[#2563EB]">cybercrime.gov.in</a>.
          </p>
        </div>

        {/* Copyright & Safety note */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#718096] gap-2 text-center font-medium">
          <p>Stay Safe: Remember that entering your UPI PIN is only needed to transfer money, never to receive it.</p>
          <p>Powered by Gemini AI • Safety First</p>
        </div>
      </div>
    </footer>
  );
};
