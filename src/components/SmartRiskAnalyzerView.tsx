import React, { useState } from 'react';
import {
  Gauge,
  AlertTriangle,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { RiskAssessmentResult, ThemeMode } from '../types';

interface SmartRiskAnalyzerViewProps {
  theme?: ThemeMode;
  initialPrompt?: string;
}

export const SmartRiskAnalyzerView: React.FC<SmartRiskAnalyzerViewProps> = ({
  initialPrompt = '',
}) => {
  const [scenarioInput, setScenarioInput] = useState<string>(initialPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<RiskAssessmentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scenarioCategories = [
    {
      label: 'Suspicious Payment Request',
      prompt: 'Someone sent a Google Pay collect request titled "CASHBACK APPROVED ₹4,999" and asked me to approve it and type my UPI PIN.',
    },
    {
      label: 'Unknown Caller / Police Threat',
      prompt: 'A caller claiming to be from Mumbai Cyber Crime / CBI said my Aadhaar was found in an illegal parcel. They asked me to stay on a WhatsApp video call under "Digital Arrest" and transfer ₹50,000 for clearing.',
    },
    {
      label: 'Refund Offer Call',
      prompt: 'A customer support person called saying my Amazon delivery failed and they will refund ₹2,000. They told me to open PhonePe and accept a collect request.',
    },
    {
      label: 'KYC Update SMS',
      prompt: 'Received an SMS: "Dear SBI customer, your net banking and UPI will be suspended today due to pending KYC. Click link: bit.ly/sbi-pan-kyc-update to verify PAN."',
    },
    {
      label: 'QR Code Marketplace Scam',
      prompt: 'An OLX buyer agreed to buy my refrigerator and sent a QR code on WhatsApp saying: "Scan this QR code and enter your UPI PIN to receive the advance payment into your account."',
    },
    {
      label: 'Lottery & Reward Offer',
      prompt: 'Received a WhatsApp message saying I won a ₹25,00,000 KBC Jio Lottery prize and need to transfer ₹12,500 tax fees via UPI to claim it.',
    },
    {
      label: 'Electricity Bill Disconnection',
      prompt: 'SMS warning that my home electricity power will be disconnected at 9:30 PM tonight due to unpaid bill. Gave a 10-digit mobile number to contact the officer.',
    },
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || scenarioInput;
    if (!text.trim()) {
      setErrorMessage('Please describe the situation or select a common scenario below.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/risk-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to compute risk assessment.');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Risk analyzer error:', err);
      setErrorMessage(err.message || 'Unable to connect to risk scoring engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMeterColor = (score: number) => {
    if (score >= 70) {
      return {
        stroke: '#FF5263',
        text: 'text-[#FF5263]',
        badge: 'bg-[#FF5263]/15 text-[#FF5263] border-[#FF5263]/30',
        label: 'HIGH RISK (CRITICAL)',
      };
    }
    if (score >= 30) {
      return {
        stroke: '#FFB547',
        text: 'text-[#FFB547]',
        badge: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30',
        label: 'CAUTION (SUSPICIOUS)',
      };
    }
    return {
      stroke: '#20C997',
      text: 'text-[#20C997]',
      badge: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
      label: 'SAFE (LOW RISK)',
    };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Banner with 3D Embossed Style */}
      <div className="embossed-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8067FF]/10 text-[#8067FF] border border-[#8067FF]/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Gauge className="w-3.5 h-3.5" />
              <span>Multi-Vector Algorithmic Scoring</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#F4F7FF] tracking-tight">
              Smart Fraud Risk Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-[#A5B4CC] mt-1 font-medium">
              Calculates a real-time risk score (0–100) based on social engineering flags, urgency tactics, and credential requests.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-white/5 text-xs text-[#A5B4CC] max-w-xs embossed-inset">
            <span className="font-extrabold text-[#F4F7FF] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />
              Evidence-Based Assessment
            </span>
            <p className="text-[11px] text-[#71829D] mt-1 leading-snug font-mono">
              Evaluates behavioral danger patterns. Never share your real PIN or password.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Situation Input Card with Embossed Styling */}
      <div className="embossed-card p-6 sm:p-7 space-y-4">
        <label className="block text-xs font-mono font-black uppercase tracking-wider text-[#F4F7FF]">
          Describe the Suspicious Situation
        </label>

        <div className="relative">
          <textarea
            rows={3}
            value={scenarioInput}
            onChange={(e) => setScenarioInput(e.target.value)}
            placeholder="e.g. 'A caller claimed my electricity will be cut at 9:30 PM unless I pay ₹10 on a link' or 'Buyer told me to scan a QR code to receive money'..."
            className="w-full p-4 rounded-2xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none transition-all resize-none font-medium embossed-inset focus:border-[#00D9FF]/40"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#A5B4CC] font-mono">
            Never share real OTPs or PINs. Describe the interaction only.
          </span>

          <button
            onClick={() => handleAnalyze()}
            disabled={!scenarioInput.trim() || isAnalyzing}
            className="py-3 px-6 disabled:opacity-40 text-[#0B1220] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed embossed-btn-cyan"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Risk Index...</span>
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4" />
                <span>Calculate Risk Score</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 border border-[#FF5263]/30 rounded-xl text-xs text-[#FF5263] flex items-center gap-2 embossed-inset">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Scenario Buttons with 3D Embossed Depth */}
        <div className="pt-4 border-t border-white/5">
          <span className="text-xs font-mono font-black text-[#A5B4CC] uppercase tracking-wider block mb-2.5">
            Or Choose from Common Situations to Evaluate:
          </span>

          <div className="flex flex-wrap gap-2">
            {scenarioCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setScenarioInput(cat.prompt);
                  handleAnalyze(cat.prompt);
                }}
                className="text-xs px-3.5 py-2 rounded-xl text-[#A5B4CC] hover:text-[#00D9FF] font-medium transition-all text-left cursor-pointer embossed-btn hover:embossed-card-hover"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Visual Risk Assessment Output (Embossed Panel with Circular Gauge) */}
      {result && (
        <div className="embossed-card p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
          {(() => {
            const meter = getMeterColor(result.riskScore);
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset =
              circumference - (result.riskScore / 100) * circumference;

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Visual Risk Meter (SVG Gauge inside Embossed Circular Base) */}
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="relative w-44 h-44 flex items-center justify-center rounded-full embossed-card shadow-[0_0_24px_rgba(0,0,0,0.6)]">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="text-[#101a2b]"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke={meter.stroke}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-4xl font-black font-mono ${meter.text} tracking-tight`}>
                        {result.riskScore}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#71829D]">
                        Risk Index
                      </span>
                    </div>
                  </div>

                  <span className={`mt-3 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider border ${meter.badge}`}>
                    {meter.label}
                  </span>
                </div>

                {/* Executive Verdict Details */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-lg font-black text-[#F4F7FF]">
                    {result.summary}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A5B4CC] leading-relaxed font-medium">
                    {result.explanation}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {result.indicators.map((ind, i) => (
                      <span
                        key={i}
                        className={`text-xs px-3 py-1 rounded-xl font-bold border flex items-center gap-1.5 ${
                          ind.severity === 'high'
                            ? 'bg-[#FF5263]/15 text-[#FF5263] border-[#FF5263]/30'
                            : ind.severity === 'medium'
                            ? 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30'
                            : 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {ind.label}: {ind.description}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Action Steps Card */}
          <div className="p-5 rounded-2xl embossed-inset space-y-3">
            <h4 className="text-xs font-mono font-black text-[#00D9FF] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D9FF]" />
              Recommended Safety Precautions
            </h4>
            <div className="space-y-2">
              {result.recommendedSteps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl embossed-btn text-xs text-[#F4F7FF] font-medium flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg embossed-icon text-[#00D9FF] flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
