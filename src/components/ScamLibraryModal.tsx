import React, { useState } from 'react';
import { X, BookOpen, AlertTriangle, ArrowRight, Search } from 'lucide-react';
import { SCAM_KNOWLEDGE_BASE } from '../data/scenarios';

interface ScamLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const ScamLibraryModal: React.FC<ScamLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredGuides = SCAM_KNOWLEDGE_BASE.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.redFlags.some((rf) => rf.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl embossed-card overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 border border-[rgba(130,170,230,0.2)]">
        {/* Header */}
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#121c2c]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl text-[#00D9FF] flex items-center justify-center embossed-icon">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#F4F7FF]">UPI Scam Knowledge Directory</h3>
              <p className="text-xs text-[#A5B4CC]">Recognize fraud patterns & psychological manipulation tricks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A5B4CC] hover:text-[#F4F7FF] transition-colors cursor-pointer embossed-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar with Embossed Inset */}
        <div className="p-4 sm:p-5 border-b border-white/5 bg-[#101a2b]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#71829D] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scams (e.g. QR code, KYC, refund, electricity bill, remote app)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium transition-all embossed-inset focus:border-[#00D9FF]/40"
            />
          </div>
        </div>

        {/* Modal List */}
        <div className="p-6 overflow-y-auto space-y-4 text-[#F4F7FF]">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="p-5 rounded-2xl border border-white/5 embossed-card hover:embossed-card-hover transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-0.5 rounded-full border border-[#00D9FF]/20">
                    {guide.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-[#F4F7FF] mt-1.5">
                    {guide.title}
                  </h4>
                </div>
                <button
                  onClick={() => onSelectPrompt(`Please analyze this scenario: ${guide.title}. How do scammers pull this off and what should I do?`)}
                  className="px-3.5 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0 embossed-btn-primary"
                >
                  <span>Analyse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* How it works */}
              <p className="text-xs text-[#A5B4CC] mt-2 leading-relaxed font-medium">
                {guide.howItWorks}
              </p>

              {/* Red flags */}
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#FF5263] uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Common Warning Signs:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#A5B4CC] font-medium pt-1">
                  {guide.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-[#FF5263] font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between bg-[#121c2c]">
          <span className="text-xs text-[#A5B4CC] font-mono">
            National Cybercrime Helpline: 1930
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#A5B4CC] hover:text-[#F4F7FF] rounded-xl text-xs font-bold cursor-pointer embossed-btn"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
