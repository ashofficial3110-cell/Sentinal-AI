import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, ShieldCheck, Eraser, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [sensitiveDetected, setSensitiveDetected] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check for potential real PIN / OTP / Card patterns
  useEffect(() => {
    const sensitivePattern = /(?:otp|pin|password|cvv|passcode|secret|card)\s*(?:is|:|=|-)?\s*\b\d{3,6}\b|\b\d{4,6}\b\s*(?:is\s*my\s*(?:pin|otp|code))|\b(?:\d{4}[ -]?){3}\d{4}\b/i;
    setSensitiveDetected(sensitivePattern.test(input));
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const scrubSensitive = () => {
    const scrubbed = input
      .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[CARD NUMBER REDACTED]')
      .replace(/(?:otp|pin|password|cvv|passcode)\s*(?:is|:|=|-)?\s*\b\d{3,6}\b/gi, 'PIN/OTP [REDACTED]');
    setInput(scrubbed);
  };

  const quickSamples = [
    'A caller told me to scan a QR code to receive money.',
    'I got an SMS saying my electricity bill is unpaid and power will be cut tonight.',
    'Someone asked me to install AnyDesk to process a failed UPI refund.',
  ];

  return (
    <div className="bg-[#0B1220]/95 backdrop-blur-md border-t border-white/5 p-4 sm:p-5 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Sensitive data warning banner if detected */}
        {sensitiveDetected && (
          <div className="p-3 sm:p-4 rounded-2xl border border-[#FF5263]/30 text-[#FF5263] flex items-start justify-between gap-3 embossed-inset animate-shake">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-xl embossed-icon text-[#FF5263]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              </div>
              <div>
                <p className="text-xs font-black">
                  CRITICAL: Possible Real PIN / OTP / Sensitive Data Detected!
                </p>
                <p className="text-[11px] text-[#A5B4CC] mt-0.5">
                  Remember: NEVER share your real PIN, OTP, or card number with anyone or any chatbot.
                </p>
              </div>
            </div>
            <button
              onClick={scrubSensitive}
              className="px-3.5 py-1.5 embossed-btn-danger text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <Eraser className="w-3 h-3" />
              <span>Redact Numbers</span>
            </button>
          </div>
        )}

        {/* Input Form with 3D Embossed Inset */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2.5 rounded-2xl transition-all p-2.5 embossed-inset focus-within:border-[#00D9FF]/40">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={2}
              placeholder="Describe what happened (e.g. 'Someone asked me to scan a QR code to get ₹5,000 refund' or paste an SMS)..."
              className="w-full bg-transparent resize-none border-none outline-none text-[#F4F7FF] text-sm placeholder:text-[#71829D] px-2.5 py-1 max-h-32 min-h-[44px] font-medium"
            />

            <div className="flex items-center gap-2 flex-shrink-0 mb-0.5">
              {input.trim() && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="px-2.5 py-1.5 text-[#A5B4CC] hover:text-[#F4F7FF] rounded-xl transition-colors text-xs font-bold embossed-btn cursor-pointer"
                  title="Clear text"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-[#0B1220] rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer embossed-btn-cyan"
              >
                <span>Analyse</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Micro suggestion pills */}
        {!input && (
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto py-1 text-[11px] text-[#A5B4CC]">
            <span className="font-bold text-[#F4F7FF] flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-[#00D9FF]" /> Try asking:
            </span>
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(sample)}
                className="whitespace-nowrap px-3 py-1 rounded-full embossed-btn text-[#00D9FF] hover:text-white transition-all font-mono text-[11px] cursor-pointer"
              >
                "{sample.slice(0, 42)}..."
              </button>
            ))}
          </div>
        )}

        {/* Bottom Safety Reminder */}
        <div className="flex items-center justify-between text-[11px] text-[#71829D] px-1 pt-0.5 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#20C997]" />
            Zero personal bank credentials required. Educational fraud analysis.
          </span>
          <span>{input.length}/1000 characters</span>
        </div>
      </div>
    </div>
  );
};
