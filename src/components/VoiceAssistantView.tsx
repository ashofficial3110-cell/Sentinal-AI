import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Square,
  Shield,
  Send,
} from 'lucide-react';
import { VoiceLanguage, ThemeMode, TranscriptItem } from '../types';

interface VoiceAssistantViewProps {
  theme?: ThemeMode;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = () => {
  const [language, setLanguage] = useState<VoiceLanguage>('en');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isContinuousMode, setIsContinuousMode] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: 'voice-welcome',
      speaker: 'assistant',
      text: 'Hello! I am Sentinel, your UPI Fraud Prevention Voice Assistant. Speak your question or describe any suspicious call, payment request, or SMS. I support English, Hindi, Telugu, Tamil, and Kannada.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [statusText, setStatusText] = useState<string>('Ready to talk. Tap the microphone orb.');

  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const langConfigs: Record<VoiceLanguage, { name: string; nativeName: string; speechCode: string }> = {
    en: { name: 'English', nativeName: 'English', speechCode: 'en-IN' },
    hi: { name: 'Hindi', nativeName: 'हिंदी', speechCode: 'hi-IN' },
    te: { name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
    ta: { name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
    kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  };

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Animated Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.lineWidth = 2.5;

      // Draw primary wave
      ctx.beginPath();
      const waveColor = isSpeaking ? '#8067FF' : isListening ? '#00D9FF' : '#3478F6';
      ctx.strokeStyle = waveColor;

      const amplitude = isSpeaking ? 22 : isListening ? 18 : 5;
      const frequency = isSpeaking ? 0.04 : isListening ? 0.03 : 0.015;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary ghost wave
      if (isSpeaking || isListening) {
        ctx.beginPath();
        ctx.strokeStyle = isSpeaking ? 'rgba(128, 103, 255, 0.35)' : 'rgba(0, 217, 255, 0.35)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.cos(x * frequency * 1.3 - phase) * (amplitude * 0.7) * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += isSpeaking ? 0.12 : isListening ? 0.08 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSpeaking, isListening]);

  // Web Speech Synthesis (TTS)
  const speakVoiceResponse = (text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();

    const clean = text
      .replace(/https?:\/\/[^\s]+/g, 'official cyber crime portal')
      .replace(/[*_#`]/g, '');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    const speechCode = langConfigs[language].speechCode;
    utterance.lang = speechCode;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.replace('_', '-').startsWith(speechCode.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusText(`Speaking in ${langConfigs[language].name}...`);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusText('Ready. Tap the orb or speak again.');
      if (onComplete) onComplete();
      if (isContinuousMode) {
        setTimeout(() => startListening(), 600);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatusText('Speech playback ended.');
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setStatusText('Playback stopped.');
  };

  // Web Speech Recognition (STT)
  const startListening = () => {
    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusText('Speech recognition not supported in this browser. Please type below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langConfigs[language].speechCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusText(`Listening in ${langConfigs[language].name} (${langConfigs[language].nativeName})...`);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        if (spokenText) {
          handleProcessUserQuery(spokenText);
        }
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'no-speech') {
          setStatusText('No speech detected. Tap microphone to try again.');
        } else {
          setStatusText(`Microphone error: ${e.error}. Try typing your question.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start recognition:', err);
      setIsListening(false);
      setStatusText('Microphone permission required or speech recognition busy.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setStatusText('Listening paused.');
  };

  // Process Query via Gemini backend
  const handleProcessUserQuery = async (queryText: string) => {
    stopListening();

    const userTranscript: TranscriptItem = {
      id: `u-${Date.now()}`,
      speaker: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTranscripts((prev) => [...prev, userTranscript]);
    setStatusText('Consulting Gemini AI Security Engine...');

    try {
      const res = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryText,
          language: language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process voice response.');
      }

      const assistantTranscript: TranscriptItem = {
        id: `a-${Date.now()}`,
        speaker: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTranscripts((prev) => [...prev, assistantTranscript]);
      speakVoiceResponse(data.text);
    } catch (err: any) {
      console.error('Voice assistant error:', err);
      const fallbackText =
        'Treat any unsolicited demand for your UPI PIN, OTP, or remote screen sharing as dangerous fraud. Do not scan any QR codes to receive money. For emergency cybercrime help, dial 1930.';

      const fallbackItem: TranscriptItem = {
        id: `err-${Date.now()}`,
        speaker: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTranscripts((prev) => [...prev, fallbackItem]);
      speakVoiceResponse(fallbackText);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Banner with 3D Embossed Style */}
      <div className="embossed-card p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Mic className="w-3.5 h-3.5" />
              <span>Voice AI Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#F4F7FF] tracking-tight">
              AI Voice Assistant
            </h1>
            <p className="text-xs sm:text-sm text-[#A5B4CC] mt-1 font-medium">
              Interactive voice conversations explaining complex UPI fraud vectors in simple, spoken regional languages.
            </p>
          </div>

          {/* Language Selector Pills with Embossed Depth */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl embossed-inset border border-white/5 overflow-x-auto no-scrollbar">
            {[
              { code: 'en' as VoiceLanguage, label: 'English' },
              { code: 'hi' as VoiceLanguage, label: 'हिंदी' },
              { code: 'te' as VoiceLanguage, label: 'తెలుగు' },
              { code: 'ta' as VoiceLanguage, label: 'தமிழ்' },
              { code: 'kn' as VoiceLanguage, label: 'ಕನ್ನಡ' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  stopSpeaking();
                  stopListening();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  language === lang.code
                    ? 'bg-[#3478F6] text-white'
                    : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Floating Assistant Card with 3D Circular Mic Orb & Waveform */}
      <div className="embossed-card p-6 sm:p-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Waveform Canvas inside Embossed Inset */}
        <div className="w-full max-w-lg mb-4">
          <canvas
            ref={canvasRef}
            width={480}
            height={65}
            className="w-full h-[60px] rounded-2xl embossed-inset"
          />
        </div>

        {/* Central Glowing 3D Mic Orb */}
        <div className="relative my-4 flex items-center justify-center">
          <div
            className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${
              isSpeaking
                ? 'bg-[#8067FF]/30 scale-125 animate-ping'
                : isListening
                ? 'bg-[#00D9FF]/30 scale-110 animate-pulse'
                : 'bg-transparent scale-100'
            }`}
          ></div>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer embossed-card hover:embossed-card-hover ${
              isSpeaking
                ? 'border border-[#8067FF] bg-gradient-to-tr from-[#8067FF] to-[#3478F6] text-white shadow-[0_0_30px_rgba(128,103,255,0.6)]'
                : isListening
                ? 'border border-[#00D9FF] bg-gradient-to-tr from-[#00D9FF] to-[#3478F6] text-[#0B1220] shadow-[0_0_30px_rgba(0,217,255,0.6)] animate-pulse'
                : 'border border-[rgba(130,170,230,0.2)] text-[#00D9FF]'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-8 h-8 text-[#0B1220]" />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#0B1220] mt-1">
                  Listening...
                </span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="w-8 h-8 text-white animate-bounce" />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white mt-1">
                  Speaking...
                </span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 text-[#00D9FF]" />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#F4F7FF] mt-1">
                  Tap to Talk
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Status Indicator */}
        <p className="text-xs sm:text-sm font-bold text-[#F4F7FF] mt-2 font-mono">
          {statusText}
        </p>

        {/* Controls Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {/* Continuous Conversation Toggle */}
          <button
            onClick={() => setIsContinuousMode(!isContinuousMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer font-mono ${
              isContinuousMode
                ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                : 'embossed-btn text-[#A5B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            {isContinuousMode ? 'Continuous Mode: ON' : 'Continuous Mode: OFF'}
          </button>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer embossed-btn-danger"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop Speaking</span>
            </button>
          )}
        </div>

        {/* Fallback Text Input */}
        <div className="mt-6 w-full max-w-md pt-5 border-t border-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualText.trim()) {
                handleProcessUserQuery(manualText);
                setManualText('');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Or type a question to hear spoken response..."
              className="flex-1 px-4 py-2.5 rounded-xl text-xs text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium embossed-inset focus:border-[#00D9FF]/40"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-[#0B1220] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer embossed-btn-cyan"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Live Spoken Conversation Transcripts (Embossed Panel) */}
      <div className="embossed-card p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#F4F7FF]">
            Live Spoken Transcripts & Guidance Feed
          </h3>
          <span className="text-[11px] font-mono text-[#00D9FF]">
            Language: {langConfigs[language].name} ({langConfigs[language].nativeName})
          </span>
        </div>

        <div className="mt-4 space-y-3.5 max-h-72 overflow-y-auto pr-1">
          {transcripts.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 ${
                t.speaker === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {t.speaker === 'assistant' && (
                <div className="w-8 h-8 rounded-xl embossed-icon text-[#00D9FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  t.speaker === 'user'
                    ? 'embossed-btn-primary text-white rounded-tr-xs'
                    : 'embossed-card text-[#F4F7FF] rounded-tl-xs font-medium'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-[#A5B4CC] font-mono">
                  <span>{t.speaker === 'user' ? 'You' : 'Sentinel Voice AI'}</span>
                  <span>{t.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{t.text}</p>
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
};
