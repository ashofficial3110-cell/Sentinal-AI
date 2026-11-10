import React, { useState } from 'react';
import { AlertOctagon, Lock, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200/80 text-amber-950 px-4 py-2.5 sm:py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-sm mt-0.5 md:mt-0">
            <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-1.5 py-0.5 bg-red-600 text-white font-black text-[10px] tracking-wider uppercase rounded shadow-xs">
                IMPORTANT SAFETY WARNING
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-red-900 tracking-tight">
                NEVER SHARE YOUR REAL UPI PIN, OTP, PASSWORD OR BANK DETAILS WITH THIS CHATBOT.
              </p>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900/90 font-medium mt-0.5">
              This coach only needs a description of what someone asked you to do. Real PINs or passwords are never required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200/90 px-2.5 py-1 rounded-md transition-colors border border-amber-300"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Golden Rules</span>
            {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {showTips && (
        <div className="max-w-6xl mx-auto mt-2.5 pt-2.5 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Rule 1: UPI PIN is ONLY to send money</span>
              <p className="text-slate-600 text-[11px]">You never enter a PIN to receive cashback, refunds, or customer payments.</p>
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Rule 2: QR Codes are for paying only</span>
              <p className="text-slate-600 text-[11px]">Scanning a QR code debits your bank account. Never scan to receive money.</p>
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2 sm:col-span-2 lg:col-span-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Rule 3: No remote apps for banks</span>
              <p className="text-slate-600 text-[11px]">Never install AnyDesk or TeamViewer to fix bank issues or refunds.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
