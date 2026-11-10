import React, { useState, useRef } from 'react';
import {
  ScanQrCode,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Sparkles,
  X,
  FileCheck,
} from 'lucide-react';
import { ImageScanResult, ThemeMode } from '../types';

interface ScreenshotScannerViewProps {
  theme?: ThemeMode;
}

export const ScreenshotScannerView: React.FC<ScreenshotScannerViewProps> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ImageScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured realistic sample scenarios for instant 1-click test
  const sampleScenarios = [
    {
      title: 'Fake SBI KYC Suspension SMS',
      type: 'SMS Screenshot',
      description: 'SMS threatening account suspension tonight with a suspicious link: bit.ly/sbi-pan-kyc-update',
      sampleBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23172338"/><text x="20" y="40" font-family="Arial" font-size="14" fill="%23f4f7ff" font-weight="bold">SMS: SBI_ALERT</text><text x="20" y="75" font-family="Arial" font-size="12" fill="%23a5b4cc">Dear Customer, Your SBI account will be blocked</text><text x="20" y="95" font-family="Arial" font-size="12" fill="%23a5b4cc">today. Update your PAN card immediately on:</text><text x="20" y="125" font-family="Arial" font-size="12" fill="%2300d9ff" font-weight="bold">http://bit.ly/sbi-kyc-pan-update.apk</text><text x="20" y="160" font-family="Arial" font-size="11" fill="%23ff5263">Call officer: 98112-44551</text></svg>',
    },
    {
      title: 'OLX "Scan QR to Receive Money" WhatsApp',
      type: 'QR Code & Chat',
      description: 'Buyer claims to send advance ₹12,000 for sofa. Sends a QR code saying: "Scan this QR code and enter UPI PIN to receive money."',
      sampleBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23172338"/><text x="20" y="35" font-family="Arial" font-size="14" fill="%2320c997" font-weight="bold">WhatsApp: Buyer Rajesh</text><text x="20" y="65" font-family="Arial" font-size="12" fill="%23f4f7ff">"I am an Army officer. I am transferring ₹12,000."</text><rect x="20" y="85" width="80" height="80" fill="%230b1220" stroke="%2300d9ff"/><text x="120" y="115" font-family="Arial" font-size="12" fill="%23ff5263" font-weight="bold">"Scan this QR code and enter"</text><text x="120" y="135" font-family="Arial" font-size="12" fill="%23ff5263" font-weight="bold">"your UPI PIN to accept credit."</text></svg>',
    },
    {
      title: 'Electricity Bill Disconnection Threat',
      type: 'DISCOM Threat SMS',
      description: 'SMS claiming power will be cut tonight at 9:30 PM due to unpaid electricity bill. Contact 9876543210.',
      sampleBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23172338"/><text x="20" y="40" font-family="Arial" font-size="14" fill="%23ffb547" font-weight="bold">POWER_ALERT_DISCOM</text><text x="20" y="70" font-family="Arial" font-size="12" fill="%23f4f7ff">Dear consumer your electricity power will be</text><text x="20" y="90" font-family="Arial" font-size="12" fill="%23f4f7ff">disconnected tonight at 9:30 PM from office.</text><text x="20" y="120" font-family="Arial" font-size="12" fill="%23ff5263" font-weight="bold">Please contact our power officer: 9876543210</text></svg>',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 8MB. Please select a smaller screenshot.');
      return;
    }

    setFileName(file.name);
    setErrorMessage(null);
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: (typeof sampleScenarios)[0]) => {
    setSelectedImage(sample.sampleBase64);
    setFileName(sample.title);
    setCustomNote(`Tested preset: ${sample.description}`);
    setScanResult(null);
    setErrorMessage(null);
  };

  const handleScanImage = async (overrideBase64?: string) => {
    const imgData = overrideBase64 || selectedImage;
    if (!imgData) {
      setErrorMessage('Please upload or select an image screenshot first.');
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/scan-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imgData,
          note: customNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan image. Please try again.');
      }

      setScanResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'Failed to connect to AI vision scanner.');
    } finally {
      setIsScanning(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setFileName('');
    setCustomNote('');
    setScanResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRiskColor = (classification: 'SAFE' | 'CAUTION' | 'HIGH RISK') => {
    switch (classification) {
      case 'SAFE':
        return {
          badge: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
          border: 'border-[#20C997]/30',
          bg: 'bg-[#20C997]/10',
          text: 'text-[#20C997]',
          barColor: 'bg-[#20C997]',
        };
      case 'HIGH RISK':
        return {
          badge: 'bg-[#FF5263]/15 text-[#FF5263] border-[#FF5263]/30',
          border: 'border-[#FF5263]/30',
          bg: 'bg-[#FF5263]/10',
          text: 'text-[#FF5263]',
          barColor: 'bg-[#FF5263]',
        };
      case 'CAUTION':
      default:
        return {
          badge: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30',
          border: 'border-[#FFB547]/30',
          bg: 'bg-[#FFB547]/10',
          text: 'text-[#FFB547]',
          barColor: 'bg-[#FFB547]',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Banner with 3D Embossed Style */}
      <div className="embossed-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ScanQrCode className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Multimodal Vision Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#F4F7FF] tracking-tight">
              AI Screenshot & QR Code Scanner
            </h1>
            <p className="text-xs sm:text-sm text-[#A5B4CC] mt-1 font-medium">
              Upload screenshots of SMS, WhatsApp messages, payment requests, or QR codes for deep forensic analysis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#00D9FF] px-3.5 py-1.5 rounded-full embossed-inset border border-[#00D9FF]/20">
              OCR Engine Ready
            </span>
          </div>
        </div>

        {/* QR Code Safety Rule Banner with Embossed Inset */}
        <div className="mt-4 p-3.5 rounded-2xl border border-[#FF5263]/30 text-[#F4F7FF] flex items-center gap-3 text-xs embossed-inset">
          <div className="p-1 rounded-xl embossed-icon text-[#FF5263] flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="font-semibold leading-relaxed">
            <strong className="text-[#FF5263]">QR Code Safety Mandate:</strong> Never assume a QR code is safe from its visual look alone. In UPI, scanning a QR code is strictly for <em>sending money</em>, never receiving.
          </div>
        </div>
      </div>

      {/* 2. Upload Card & Sample Selection Grid */}
      <div className="embossed-card p-6 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Upload Area (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-[#F4F7FF] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#00D9FF]" />
                Upload Screenshot or QR Image
              </span>
              {selectedImage && (
                <button
                  onClick={clearSelection}
                  className="text-xs text-[#FF5263] hover:underline flex items-center gap-1 cursor-pointer font-bold font-mono"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Rounded Dropzone with Embossed Depth & Scanner Beam */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                selectedImage
                  ? 'border-[#00D9FF]/60 embossed-card'
                  : 'border-[rgba(130,170,230,0.18)] hover:border-[#00D9FF] embossed-inset'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-[#00D9FF] shadow-[0_0_15px_#00D9FF] scanner-beam z-10"></div>
              )}

              {selectedImage ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div className="max-h-56 max-w-full overflow-hidden rounded-xl embossed-inset p-2">
                    <img
                      src={selectedImage}
                      alt="Uploaded Screenshot"
                      className="max-h-52 object-contain rounded-lg mx-auto"
                    />
                  </div>
                  <div className="text-xs font-bold text-[#F4F7FF] truncate max-w-xs font-mono">
                    {fileName || 'Image Selected'}
                  </div>
                  <span className="text-[11px] text-[#00D9FF] font-bold hover:underline font-mono">
                    Tap to change screenshot
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl text-[#00D9FF] flex items-center justify-center mx-auto embossed-icon">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F4F7FF]">
                      Click to browse or drop screenshot here
                    </p>
                    <p className="text-xs text-[#A5B4CC] mt-1 font-medium">
                      Supports SMS screenshots, WhatsApp chats, payment slips & QR codes (PNG, JPG up to 8MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Context Input */}
            <div>
              <label className="text-[11px] font-mono font-bold text-[#A5B4CC] uppercase tracking-wide block mb-1.5">
                Optional Context / Caller Details
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. 'Buyer told me to scan this to get ₹1,500 advance for my table'"
                className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none transition-all font-medium embossed-inset focus:border-[#00D9FF]/40"
              />
            </div>

            {/* Scan Action Button */}
            <button
              onClick={() => handleScanImage()}
              disabled={!selectedImage || isScanning}
              className="w-full py-3.5 px-4 disabled:opacity-40 text-[#0B1220] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed embossed-btn-cyan"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Image Forensics with Gemini Vision...</span>
                </>
              ) : (
                <>
                  <ScanQrCode className="w-4 h-4" />
                  <span>Scan & Identify Fraud Risks</span>
                </>
              )}
            </button>

            {errorMessage && (
              <div className="p-3 border border-[#FF5263]/30 rounded-xl text-xs text-[#FF5263] flex items-center gap-2 embossed-inset">
                <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* 1-Click Sample Scenarios to Test (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-[#F4F7FF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
                Realistic Sample Presets
              </span>
              <span className="text-[11px] text-[#A5B4CC] font-mono font-bold">1-Click Test</span>
            </div>

            <div className="space-y-2.5">
              {sampleScenarios.map((sample, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    fileName === sample.title
                      ? 'embossed-nav-active border-[#00D9FF]/50'
                      : 'embossed-card hover:embossed-card-hover'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F4F7FF] group-hover:text-[#00D9FF] transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20">
                      {sample.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A5B4CC] mt-1.5 leading-snug line-clamp-2 font-medium">
                    {sample.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Scan Analysis Results Display (Embossed Panel) */}
      {scanResult && (
        <div className="embossed-card p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95">
          {/* Header Verdict Card */}
          {(() => {
            const riskConfig = getRiskColor(scanResult.classification);
            return (
              <div className={`p-5 rounded-2xl border ${riskConfig.border} ${riskConfig.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 embossed-card`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 embossed-icon">
                    {scanResult.classification === 'HIGH RISK' ? (
                      <AlertOctagon className="w-7 h-7 text-[#FF5263] animate-pulse" />
                    ) : scanResult.classification === 'CAUTION' ? (
                      <AlertTriangle className="w-7 h-7 text-[#FFB547]" />
                    ) : (
                      <ShieldCheck className="w-7 h-7 text-[#20C997]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-black uppercase tracking-wider border ${riskConfig.badge}`}>
                        VERDICT: {scanResult.classification}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-[#F4F7FF]">
                        Risk Score: {scanResult.riskScore}/100
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#F4F7FF] mt-1.5">
                      {scanResult.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Tri-Signal Grid: Safe Signals, Warning Signs, High-Risk Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Safe Signals */}
            <div className="p-4 rounded-2xl border border-[#20C997]/20 embossed-card">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-[#20C997] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#20C997]" />
                Safe Signals
              </div>
              <ul className="space-y-1.5 text-xs text-[#A5B4CC] font-medium">
                {scanResult.safeSignals && scanResult.safeSignals.length > 0 ? (
                  scanResult.safeSignals.map((sig, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#20C997] flex-shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#71829D] italic">No verifiable safe signals detected.</li>
                )}
              </ul>
            </div>

            {/* Warning Signs */}
            <div className="p-4 rounded-2xl border border-[#FFB547]/20 embossed-card">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-[#FFB547] mb-2">
                <AlertTriangle className="w-4 h-4 text-[#FFB547]" />
                Warning Signs
              </div>
              <ul className="space-y-1.5 text-xs text-[#A5B4CC] font-medium">
                {scanResult.warningSigns && scanResult.warningSigns.length > 0 ? (
                  scanResult.warningSigns.map((sig, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FFB547] flex-shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#71829D] italic">No moderate warning signs.</li>
                )}
              </ul>
            </div>

            {/* High-Risk Indicators */}
            <div className="p-4 rounded-2xl border border-[#FF5263]/20 embossed-card">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-[#FF5263] mb-2">
                <AlertOctagon className="w-4 h-4 text-[#FF5263]" />
                High-Risk Indicators
              </div>
              <ul className="space-y-1.5 text-xs text-[#A5B4CC] font-medium">
                {scanResult.highRiskIndicators && scanResult.highRiskIndicators.length > 0 ? (
                  scanResult.highRiskIndicators.map((sig, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertOctagon className="w-3.5 h-3.5 text-[#FF5263] flex-shrink-0 mt-0.5" />
                      <span className="font-bold text-[#FF5263]">{sig}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#71829D] italic">No fatal high-risk vectors detected.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-5 rounded-2xl embossed-inset space-y-3">
            <h4 className="text-xs font-mono font-black text-[#00D9FF] uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#00D9FF]" />
              Recommended Safety Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scanResult.recommendedActions && scanResult.recommendedActions.map((action, i) => (
                <div key={i} className="p-3 rounded-xl embossed-btn text-xs text-[#F4F7FF] font-medium flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg embossed-icon text-[#00D9FF] flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
