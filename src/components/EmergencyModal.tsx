import React from 'react';
import { X, PhoneCall, ExternalLink, ShieldAlert, Clock, Building2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const banks = [
    { name: 'State Bank of India (SBI)', phone: '1800 1234 / 1800 2100' },
    { name: 'HDFC Bank', phone: '1800 202 6161 / 1800 1600' },
    { name: 'ICICI Bank', phone: '1800 1080' },
    { name: 'Axis Bank', phone: '1860 419 5555' },
    { name: 'Punjab National Bank (PNB)', phone: '1800 180 2222' },
    { name: 'Bank of Baroda', phone: '1800 5700' },
    { name: 'PhonePe Support', phone: '080-68727374 / In-App Help' },
    { name: 'Google Pay Support', phone: '1800-419-0157 / In-App Help' },
    { name: 'Paytm Payments Bank', phone: '0120-4456-456' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl embossed-card overflow-hidden max-h-[90vh] flex flex-col border border-[rgba(130,170,230,0.2)]">
        {/* Header */}
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#121c2c]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl text-[#FF5263] flex items-center justify-center embossed-icon">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#F4F7FF]">Emergency Fraud Helpdesk</h3>
              <p className="text-xs text-[#FF5263] font-mono font-semibold">National Cybercrime Action Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A5B4CC] hover:text-[#F4F7FF] transition-colors cursor-pointer embossed-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#F4F7FF]">
          {/* Top Urgent Card: 1930 */}
          <div className="p-5 border-2 border-[#FF5263]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 embossed-card">
            <div>
              <div className="flex items-center gap-2 text-[#FF5263] font-mono font-black text-xs uppercase tracking-wide">
                <Clock className="w-4 h-4 animate-pulse" />
                GOLDEN HOUR: ACT WITHIN 2 HOURS
              </div>
              <p className="text-sm font-black text-[#F4F7FF] mt-1">
                If money was debited fraudulently, call immediately to freeze the recipient account!
              </p>
              <p className="text-xs text-[#A5B4CC] mt-0.5 font-medium">
                Indian Cybercrime Coordination Centre (I4C) & Citizen Financial Cyber Fraud Reporting System.
              </p>
            </div>

            <a
              href="tel:1930"
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all flex-shrink-0 embossed-btn-danger"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Call 1930</span>
            </a>
          </div>

          {/* Official Portal Link */}
          <div className="p-4 rounded-2xl flex items-center justify-between gap-3 embossed-card">
            <div>
              <h4 className="text-xs font-black text-[#F4F7FF]">Official National Cybercrime Reporting Portal</h4>
              <p className="text-xs text-[#A5B4CC] font-medium">File your formal online complaint with evidence</p>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0 embossed-btn-primary"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bank Emergency Helplines */}
          <div>
            <h4 className="text-xs font-mono font-black text-[#A5B4CC] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#00D9FF]" />
              Major Bank & UPI Dispute Helplines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {banks.map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl flex items-center justify-between gap-2 embossed-card">
                  <span className="font-bold text-[#F4F7FF] truncate">{b.name}</span>
                  <a
                    href={`tel:${b.phone.split('/')[0].replace(/[^0-9]/g, '')}`}
                    className="font-mono text-[11px] font-bold text-[#00D9FF] hover:underline flex-shrink-0"
                  >
                    {b.phone.split('/')[0]}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between bg-[#121c2c]">
          <span className="text-[11px] text-[#A5B4CC] font-mono">
            National Cybercrime Helpline: Dial 1930
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#A5B4CC] hover:text-[#F4F7FF] rounded-xl text-xs font-bold cursor-pointer embossed-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
