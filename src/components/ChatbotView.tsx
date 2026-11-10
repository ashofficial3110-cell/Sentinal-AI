import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Volume2,
  VolumeX,
  Lock,
  Bot,
} from 'lucide-react';
import { Message, QuickReply, VerdictType, NavSection } from '../types';
import { ChatMessage } from './ChatMessage';
import { QuickReplies } from './QuickReplies';
import { ChatInput } from './ChatInput';

interface ChatbotViewProps {
  onNavigate?: (section: NavSection) => void;
  onOpenEmergency?: () => void;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: `Hello! Welcome to UPI Safety Coach. I can help you identify suspicious UPI transactions and stay safe from online fraud.

VERDICT: SAFE

WHY IS IT SUSPICIOUS?
You are in a secure educational simulator. Fraudsters frequently use social engineering, urgency tactics, fake refund promises, or fear of bank account blockage to trick people into sharing OTPs, scanning QR codes, or installing remote screen-sharing tools.

WHAT SHOULD YOU DO?
1. Tap any of the 10 quick scam scenarios below to see how typical frauds operate.
2. Or describe any suspicious call, WhatsApp message, SMS, QR code, or collect request you received.
3. NEVER share your real UPI PIN, OTP, password, or bank details with anyone or any chatbot.
4. Remember: You NEVER need to enter a UPI PIN or scan a QR code to receive money.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
  verdict: 'SAFE',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  onNavigate,
  onOpenEmergency,
}) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice Speech Functionality
  const speakText = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanSpeech = text
      .replace(/https?:\/\/[^\s]+/g, 'official cyber crime website')
      .replace(/[*_#`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    setCurrentlySpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorBanner(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = newMessages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.text,
      }));

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: text.trim(),
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server failed to analyze the situation.');
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        verdict: (data.verdict as VerdictType) || 'SUSPICIOUS',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (speechEnabled) {
        speakText(data.text, assistantMessage.id);
      }
    } catch (err: any) {
      console.error('Error in handleSendMessage:', err);
      const errorMessage =
        err?.message || 'Unable to connect to analysis engine. Please try again.';
      setErrorBanner(errorMessage);

      const fallbackMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `VERDICT: SUSPICIOUS

WHY IS IT SUSPICIOUS?
There was a temporary connection latency with the AI analysis engine (${errorMessage}). However, treat any unsolicited request asking for your UPI PIN, OTP, remote screen-sharing, or QR scanning as dangerous.

WHAT SHOULD YOU DO?
1. DO NOT scan any QR code or enter your UPI PIN.
2. DO NOT download AnyDesk, TeamViewer, or any screen-sharing APK.
3. Check your actual bank statement directly inside your official bank app.
4. Report fraudulent transaction attempts to your bank immediately.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
        verdict: 'SUSPICIOUS',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickReply = (scenario: QuickReply) => {
    handleSendMessage(scenario.samplePrompt);
  };

  const handleResetChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorBanner(null);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-8">
      {/* 1. Header Card: Dark 3D Embossed Surface with Shield Icon */}
      <div className="embossed-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl embossed-icon flex items-center justify-center flex-shrink-0 text-[#00D9FF]">
            <Shield className="w-8 h-8 stroke-[2.3]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#20C997] rounded-full border-2 border-[#172338] flex items-center justify-center pulse-cyan">
              <span className="w-1.5 h-1.5 bg-[#0B1220] rounded-full"></span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>Interactive AI Assistant</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F4F7FF]">
              UPI SAFETY COACH
            </h1>
            <p className="text-xs sm:text-sm text-[#A5B4CC]">
              UPI Fraud Awareness Assistant • Helping citizens, students & seniors prevent financial fraud
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              speechEnabled
                ? 'embossed-btn-cyan'
                : 'embossed-btn text-[#A5B4CC] hover:text-[#F4F7FF]'
            }`}
            title="Auto-read assistant responses aloud"
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono">{speechEnabled ? 'Voice ON' : 'Audio Readout'}</span>
          </button>

          <button
            onClick={handleResetChat}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all embossed-btn text-[#A5B4CC] hover:text-[#F4F7FF] flex items-center gap-1.5 cursor-pointer"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-mono">New Chat</span>
          </button>
        </div>
      </div>

      {/* 2. IMPORTANT SAFETY WARNING (Dark Embossed Inset Banner) */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#FF5263]/30 embossed-inset text-[#F4F7FF] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl embossed-icon text-[#FF5263] flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5263]">
              CRITICAL FRAUD PREVENTION RULE
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-[#F4F7FF] tracking-tight leading-snug">
              NEVER SHARE YOUR REAL UPI PIN, OTP, PASSWORD OR BANK DETAILS WITH THIS CHATBOT.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5263] px-3 py-1.5 rounded-full embossed-inset flex-shrink-0 border border-[#FF5263]/20">
          <span>Helpline: 1930</span>
        </div>
      </div>

      {/* 3. 10 Quick Reply Buttons */}
      <div className="embossed-card p-4 sm:p-5">
        <QuickReplies onSelect={handleSelectQuickReply} isLoading={isLoading} />
      </div>

      {/* Error notification banner if any */}
      {errorBanner && (
        <div className="p-3.5 border border-[#FF5263]/30 rounded-xl text-xs sm:text-sm text-[#FF5263] flex items-center justify-between gap-2 embossed-inset">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF5263] flex-shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            onClick={() => setErrorBanner(null)}
            className="text-xs font-bold text-[#FF5263] hover:underline px-2 py-0.5 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Chat Conversation Stream */}
      <div className="embossed-card p-4 sm:p-6 flex flex-col min-h-[460px]">
        {/* Top bar of chat box */}
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-white/5 text-xs text-[#A5B4CC]">
          <span className="flex items-center gap-2 font-bold text-[#F4F7FF]">
            <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
            Active Session • Real-Time Gemini AI Fraud Analysis
          </span>
          <span className="text-[11px] font-mono text-[#71829D]">{messages.length} messages in history</span>
        </div>

        {/* Message List */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSpeak={(text) => speakText(text, message.id)}
              isSpeaking={currentlySpeakingId === message.id}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 my-4">
              <div className="w-9 h-9 rounded-xl embossed-icon text-[#00D9FF] flex items-center justify-center flex-shrink-0 animate-pulse">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="embossed-card p-4 text-[#F4F7FF] max-w-sm border border-[#00D9FF]/20">
                <div className="flex items-center gap-2 font-bold text-xs text-[#00D9FF]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing situation with Gemini AI...</span>
                </div>
                <p className="text-xs text-[#A5B4CC] mt-1.5 leading-snug">
                  Evaluating social engineering vectors, urgency flags, and UPI security protocols.
                </p>
                <div className="mt-3 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 5. Chat Input Field with Sensitive Data Redaction */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
