import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  RefreshCw,
  Volume2,
  VolumeX,
  Languages,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Clock,
  KeyRound,
  Zap,
} from 'lucide-react';
import { VoiceLanguage, VoiceConnectionStatus, TranscriptItem, EphemeralTokenResponse } from '../types';
import { LiveAudioPlayer, float32To16BitPCM, arrayBufferToBase64 } from '../utils/audio';

interface LiveVoiceModuleProps {
  onOpenEmergency?: () => void;
}

export const LiveVoiceModule: React.FC<LiveVoiceModuleProps> = ({ onOpenEmergency }) => {
  const [language, setLanguage] = useState<VoiceLanguage>('en');
  const [status, setStatus] = useState<VoiceConnectionStatus>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: 'welcome-voice',
      speaker: 'assistant',
      text: 'Hello! I am Sentinel, your live UPI fraud prevention assistant. Press the microphone button to talk with me in real time. Never share your real PIN or OTP.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [tokenInfo, setTokenInfo] = useState<EphemeralTokenResponse | null>(null);

  // References
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const isMutedRef = useRef(false);

  isMutedRef.current = isMuted;

  // Initialize Audio Player on mount
  useEffect(() => {
    audioPlayerRef.current = new LiveAudioPlayer();
    return () => {
      stopVoiceSession();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.close();
      }
    };
  }, []);

  // Auto-scroll transcripts
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

      let amplitude = 0.15; // idle breathing amplitude
      if (status === 'listening' && !isMuted) {
        if (inputAnalyserRef.current) {
          const dataArray = new Uint8Array(inputAnalyserRef.current.frequencyBinCount);
          inputAnalyserRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((acc, val) => acc + val, 0);
          const avg = sum / dataArray.length;
          amplitude = Math.max(0.2, (avg / 255) * 1.4);
        } else {
          amplitude = 0.45;
        }
      } else if (isSpeaking) {
        amplitude = 0.75 + Math.sin(phase * 4) * 0.25;
      }

      phase += 0.08;

      // Draw multi-layered glowing sine waves (cyan and electric blue)
      const centerY = canvas.height / 2;
      const width = canvas.width;

      const waves = [
        { color: 'rgba(6, 182, 212, 0.7)', speed: 1.2, freq: 0.03, height: 18 * amplitude },
        { color: 'rgba(59, 130, 246, 0.8)', speed: 0.9, freq: 0.02, height: 26 * amplitude },
        { color: 'rgba(14, 165, 233, 0.5)', speed: 1.5, freq: 0.04, height: 12 * amplitude },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = w.color;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * w.freq + phase * w.speed) * w.height;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, isMuted, isSpeaking]);

  // Request Ephemeral Token from secure server endpoint
  const fetchEphemeralToken = async (): Promise<string> => {
    const res = await fetch('/api/live/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error('Failed to obtain ephemeral authentication token from server');
    }
    const data: EphemeralTokenResponse = await res.json();
    setTokenInfo(data);
    return data.token;
  };

  // Start Real-Time Live Session
  const startVoiceSession = async () => {
    try {
      setErrorMessage(null);
      setStatus('requesting_permission');

      // 1. Capture user microphone at 16kHz
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Obtain short-lived ephemeral token
      setStatus('connecting');
      const token = await fetchEphemeralToken();

      // 3. Setup Web Audio Input Processor
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = inputCtx;

      const sourceNode = inputCtx.createMediaStreamSource(stream);
      const analyserNode = inputCtx.createAnalyser();
      analyserNode.fftSize = 64;
      inputAnalyserRef.current = analyserNode;

      // Script processor to chunk 16-bit PCM audio
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      sourceNode.connect(analyserNode);
      analyserNode.connect(processor);
      processor.connect(inputCtx.destination);

      // 4. Initialize 24kHz output player
      if (audioPlayerRef.current) {
        audioPlayerRef.current.init();
      }

      // 5. Connect WebSocket to server with ephemeral token & language
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live/ws?token=${encodeURIComponent(token)}&lang=${language}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        setTimeout(() => setStatus('listening'), 500);

        // Add system message in transcript
        const langNames: Record<VoiceLanguage, string> = {
          en: 'English',
          hi: 'Hindi (हिंदी)',
          ta: 'Tamil (தமிழ்)',
          te: 'Telugu (తెలుగు)',
          kn: 'Kannada (ಕನ್ನಡ)',
        };
        setTranscripts((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            speaker: 'assistant',
            text: `🎙️ Sentinel Live session connected in ${langNames[language]}. Speak naturally into your microphone.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      };

      // Stream mic audio to server
      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN && !isMutedRef.current) {
          const inputChannel = e.inputBuffer.getChannelData(0);
          const pcmBuffer = float32To16BitPCM(inputChannel);
          const base64Audio = arrayBufferToBase64(pcmBuffer);
          ws.send(
            JSON.stringify({
              type: 'audio',
              audio: base64Audio,
            })
          );
        }
      };

      // Handle messages from server
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Audio output from model (24kHz PCM)
          if (data.type === 'audio' && data.audio) {
            setIsSpeaking(true);
            setStatus('speaking');
            audioPlayerRef.current?.playChunk(data.audio);
          }

          // User Input Transcription
          if (data.type === 'inputTranscript' && data.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker === 'user' && last.isInterim) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: `${last.text} ${data.text}`.trim(), isInterim: false },
                ];
              }
              return [
                ...prev,
                {
                  id: `user-${Date.now()}-${Math.random()}`,
                  speaker: 'user',
                  text: data.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
          }

          // Model Output Transcription
          if (data.type === 'outputTranscript' && data.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker === 'assistant' && last.id.startsWith('live-model-')) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: `${last.text} ${data.text}`.trim() },
                ];
              }
              return [
                ...prev,
                {
                  id: `live-model-${Date.now()}`,
                  speaker: 'assistant',
                  text: data.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
          }

          // Interruption Signal
          if (data.type === 'interrupted') {
            audioPlayerRef.current?.stopAll();
            setIsSpeaking(false);
            setStatus('listening');
          }

          // Error or Session Closed
          if (data.type === 'error') {
            setErrorMessage(data.error || 'Voice session error');
          }
        } catch (e) {
          console.warn('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('Live WebSocket error:', e);
        setErrorMessage('Voice connection encountered a network error. Click Reconnect.');
        setStatus('error');
      };

      ws.onclose = () => {
        if (status !== 'idle') {
          setStatus('idle');
          setIsSpeaking(false);
        }
      };
    } catch (err: any) {
      console.error('Failed to start voice session:', err);
      let msg = 'Could not start voice session.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No microphone found on this device.';
      } else {
        msg = err.message || msg;
      }
      setErrorMessage(msg);
      setStatus('error');
      stopVoiceSession();
    }
  };

  // Stop / End Live Voice Session
  const stopVoiceSession = () => {
    // Stop recording and stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop playback
    audioPlayerRef.current?.stopAll();

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus('idle');
    setIsSpeaking(false);
    setIsMuted(false);
  };

  // Interrupt AI Spoken Output
  const handleInterrupt = () => {
    audioPlayerRef.current?.stopAll();
    setIsSpeaking(false);
    setStatus('listening');
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
    }
  };

  // Toggle Microphone Mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Quick prompt scenario injection into voice session
  const sendVoiceText = (text: string) => {
    if (status === 'idle') {
      startVoiceSession().then(() => {
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'text', text }));
          }
        }, 1200);
      });
    } else if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', text }));
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'requesting_permission':
        return {
          label: 'Requesting Mic Access',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500 animate-ping',
        };
      case 'connecting':
        return {
          label: 'Connecting to Gemini Live...',
          color: 'bg-cyan-100 text-cyan-900 border-cyan-300',
          dot: 'bg-cyan-500 animate-pulse',
        };
      case 'connected':
      case 'listening':
        return {
          label: isMuted ? 'Microphone Muted' : 'Live Listening',
          color: isMuted
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: isMuted ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse',
        };
      case 'speaking':
        return {
          label: 'Sentinel Speaking...',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-600 animate-bounce',
        };
      case 'error':
        return {
          label: 'Connection Error',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-600',
        };
      default:
        return {
          label: 'Voice Standby (Ready to connect)',
          color: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-4">
      {/* 1. Module Banner & Controls Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-cyan-500/30 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                Gemini Live Voice Engine
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusBadge.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                {statusBadge.label}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              SENTINEL AI LIVE VOICE
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/90 font-medium max-w-xl">
              Bidirectional real-time AI voice conversation. Speak directly to investigate suspicious calls, SMS links, QR codes, and payment requests.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-white/10 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs text-cyan-200 px-2 font-medium">
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1">
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'ta', label: 'தமிழ்' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    if (status !== 'idle') {
                      stopVoiceSession();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Voice Orb & Waveform Display */}
      <div className="bg-gradient-to-b from-[#eaf4fc] to-white rounded-2xl p-6 shadow-sm border border-cyan-200/80 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Animated Visual Waveform */}
        <div className="w-full max-w-lg mb-2">
          <canvas
            ref={canvasRef}
            width={480}
            height={70}
            className="w-full h-[65px] rounded-xl bg-white/60 shadow-inner border border-cyan-100"
          />
        </div>

        {/* Central Voice Avatar Orb */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Pulsing Aura */}
          <div
            className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${
              isSpeaking
                ? 'bg-blue-400/30 scale-125 animate-ping'
                : status === 'listening' && !isMuted
                ? 'bg-cyan-400/20 scale-110 animate-pulse'
                : 'bg-transparent scale-100'
            }`}
          ></div>

          {/* Outer Ring */}
          <div
            className={`w-28 h-28 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
              isSpeaking
                ? 'border-blue-500 bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-blue-300/50'
                : status === 'listening'
                ? isMuted
                  ? 'border-amber-400 bg-amber-500 text-white'
                  : 'border-cyan-400 bg-gradient-to-tr from-blue-700 to-cyan-600 text-white shadow-cyan-200/50'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50'
            }`}
          >
            {status === 'idle' || status === 'error' ? (
              <button
                onClick={startVoiceSession}
                className="w-full h-full rounded-full flex flex-col items-center justify-center gap-1 focus:outline-hidden"
                title="Click to Start Voice Conversation"
              >
                <Mic className="w-8 h-8 text-cyan-600 animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Start Voice</span>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Shield className="w-9 h-9 stroke-[2.2] text-white" />
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-cyan-100 mt-0.5">
                  {isSpeaking ? 'Speaking' : isMuted ? 'Muted' : 'Listening'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Status Description */}
        <div className="max-w-md">
          {status === 'idle' ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Tap the orb to start live voice analysis. Speak naturally in{' '}
              <strong className="text-blue-900">{language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Tamil'}</strong>.
            </p>
          ) : status === 'listening' ? (
            <p className="text-xs sm:text-sm font-bold text-cyan-900 animate-pulse">
              Sentinel is listening to you... Describe your situation freely.
            </p>
          ) : isSpeaking ? (
            <p className="text-xs sm:text-sm font-bold text-blue-900">
              Sentinel is explaining the fraud risks... Tap Interrupt to jump in.
            </p>
          ) : (
            <p className="text-xs text-slate-600">Connecting real-time audio pipeline...</p>
          )}

          <p className="text-[11px] text-slate-500 mt-1">
            🔒 Privacy First: Audio is analyzed ephemerally in-session and never saved or stored.
          </p>
        </div>

        {/* Primary Live Action Bar */}
        {status !== 'idle' && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isMuted
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
              <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
            </button>

            {/* Interrupt AI */}
            {isSpeaking && (
              <button
                onClick={handleInterrupt}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-xs animate-bounce"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Interrupt AI</span>
              </button>
            )}

            {/* Reconnect */}
            <button
              onClick={() => {
                stopVoiceSession();
                setTimeout(startVoiceSession, 400);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reconnect</span>
            </button>

            {/* End Session */}
            <button
              onClick={stopVoiceSession}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm"
            >
              <Square className="w-3.5 h-3.5" />
              <span>End Session</span>
            </button>
          </div>
        )}

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 max-w-md flex items-center justify-between gap-2 text-left">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 3. Quick Spoken Voice Prompts */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Quick Audio Topics (Tap to test voice discussion)
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Instant AI Voice Guidance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'A buyer on OLX sent a QR code to pay me.',
            'Someone called asking for a 6-digit OTP to reverse a transaction.',
            'Got an SMS saying my bank electricity bill will cut power tonight.',
            'Asked to download AnyDesk to get an e-commerce refund.',
            'Accidental credit SMS of ₹20,000 and stranger wants it back.',
            'Money was debited from my account right now! What do I do?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendVoiceText(prompt)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50/70 hover:border-cyan-300 text-left text-xs font-semibold text-slate-800 transition-colors flex items-center justify-between gap-2"
            >
              <span className="line-clamp-1">"{prompt}"</span>
              <Mic className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Live Conversation Transcripts View */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900">Live Spoken Transcripts</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              {transcripts.length} exchanges
            </span>
          </div>

          {tokenInfo && (
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              Session Auth: Valid until {new Date(tokenInfo.expireTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-1">
          {transcripts.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-2.5 ${
                item.speaker === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {item.speaker === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-700 to-cyan-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                  item.speaker === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-75 font-semibold">
                  <span>{item.speaker === 'user' ? 'You (Voice)' : 'Sentinel Voice Assistant'}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{item.text}</p>
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
};
