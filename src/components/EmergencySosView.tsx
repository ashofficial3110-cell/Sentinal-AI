import React, { useState } from 'react';
import {
  PhoneCall,
  ExternalLink,
  Building2,
  Clock,
  CheckSquare,
  Square,
  Copy,
  Check,
  Search,
  FileCheck,
  PhoneForwarded,
} from 'lucide-react';
import { BankContact, EmergencyChecklistItem, ThemeMode } from '../types';

interface EmergencySosViewProps {
  theme?: ThemeMode;
}

export const EmergencySosView: React.FC<EmergencySosViewProps> = () => {
  const [showCallConfirm, setShowCallConfirm] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [bankSearch, setBankSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bank' | 'upi_app'>('all');

  const [evidenceChecklist, setEvidenceChecklist] = useState([
    { id: 'ev-1', text: '12-digit UPI Transaction Reference (UTR Number)', done: false },
    { id: 'ev-2', text: 'Exact date, time & debited amount from your bank statement', done: false },
    { id: 'ev-3', text: 'Screenshot of the WhatsApp chat, SMS, or QR code used by the scammer', done: false },
    { id: 'ev-4', text: 'Fraudster phone number, WhatsApp profile, or UPI VPA address', done: false },
    { id: 'ev-5', text: 'Screenshot of the bank debit SMS notification', done: false },
  ]);

  const [actionChecklist, setActionChecklist] = useState<EmergencyChecklistItem[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Contact 1930 immediately',
      instruction:
        'Dial 1930 (National Cybercrime Reporting Helpline). Do this within 2 hours ("Golden Hour") so the cyber coordination cell can immediately freeze the recipient fraudster account and stop ATM cash-out.',
      completed: false,
      urgentNotice: 'Golden Hour: Highest fund recovery rate when reported within 120 minutes',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Inform your bank or payment provider',
      instruction:
        'Call the official phone number on the back of your debit card or launch your bank app to freeze your UPI ID, net banking password, and debit card. Request a transaction dispute token.',
      completed: false,
      urgentNotice: 'Bank will immediately block unauthorized debit permissions',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Preserve transaction IDs and evidence',
      instruction:
        'Collect your 12-digit UPI UTR number, debit SMS, sender and recipient VPAs, WhatsApp chat screenshots, and scammer phone numbers. Do not delete any messages.',
      completed: false,
      urgentNotice: 'Required for official FIR submission and bank arbitration',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Submit report through official portal',
      instruction:
        'Visit https://cybercrime.gov.in and lodge a formal financial cyber fraud complaint. Attach all collected screenshots, bank statements, and your 1930 acknowledgment token.',
      completed: false,
      urgentNotice: 'Legal prerequisite for inter-bank fund repatriation',
    },
  ]);

  const bankDirectory: BankContact[] = [
    {
      id: 'sbi',
      name: 'State Bank of India (SBI)',
      category: 'bank',
      phone: '1800111109',
      tollFree: '18001234',
      note: 'Dedicated 24x7 cyber fraud debit blocking hotline.',
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      category: 'bank',
      phone: '18002026161',
      tollFree: '18001600',
      note: 'Ask agent for "Emergency NetBanking & UPI Freeze".',
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      category: 'bank',
      phone: '18002662',
      tollFree: '18001080',
      note: 'Instant card and UPI block available 24/7.',
    },
    {
      id: 'pnb',
      name: 'Punjab National Bank (PNB)',
      category: 'bank',
      phone: '18001802222',
      tollFree: '18001032222',
      note: 'Press 1 for fraudulent debit disputes.',
    },
    {
      id: 'axis',
      name: 'Axis Bank',
      category: 'bank',
      phone: '18604195555',
      tollFree: '18605005555',
      note: 'Report unauthenticated UPI collect debits.',
    },
    {
      id: 'canara',
      name: 'Canara Bank',
      category: 'bank',
      phone: '18004250018',
      tollFree: '18001030018',
      note: 'National toll-free fraud escalation line.',
    },
    {
      id: 'kotak',
      name: 'Kotak Mahindra Bank',
      category: 'bank',
      phone: '18602662666',
      note: 'Immediate token generation for cyber unit.',
    },
    {
      id: 'gpay',
      name: 'Google Pay (India)',
      category: 'upi_app',
      phone: '18004190157',
      note: 'NPCI certified 24/7 user support line.',
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      category: 'upi_app',
      phone: '08068727374',
      tollFree: '02268727374',
      note: 'Direct dispute team for fraudulent collect requests.',
    },
    {
      id: 'paytm',
      name: 'Paytm Payments Bank',
      category: 'upi_app',
      phone: '01204456456',
      note: 'Cyber fraud desk for wallet and UPI debits.',
    },
  ];

  const toggleAction = (id: string) => {
    setActionChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const toggleEvidence = (id: string) => {
    setEvidenceChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(text);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleConfirmCall = () => {
    setShowCallConfirm(false);
    window.location.href = 'tel:1930';
  };

  const filteredBanks = bankDirectory.filter((b) => {
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.phone.includes(bankSearch);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Banner: 3D Embossed Style with SOS Alert */}
      <div className="embossed-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5263]/15 text-[#FF5263] border border-[#FF5263]/30 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF5263] animate-ping"></span>
              <span>National Cybercrime Emergency Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight">
              One-Tap Emergency SOS
            </h1>
            <p className="text-xs sm:text-sm text-[#A5B4CC] max-w-2xl font-medium leading-relaxed">
              Immediate countermeasures if money has been debited or credentials have been compromised.
              Never wait—every minute counts to freeze fraudster accounts.
            </p>
          </div>

          {/* Prominent Red SOS 1930 Button */}
          <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0">
            <button
              onClick={() => setShowCallConfirm(true)}
              className="w-full sm:w-auto px-7 py-4 text-white font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer group embossed-btn-danger"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>CALL 1930 NOW</span>
            </button>
            <span className="text-[11px] text-[#71829D] font-mono text-center sm:text-right">
              Toll Free • Explicit confirmation required
            </span>
          </div>
        </div>

        {/* 120-Minute Golden Hour Advisory */}
        <div className="mt-5 p-3.5 rounded-2xl border border-[#FF5263]/30 flex flex-wrap items-center justify-between gap-3 text-xs embossed-inset">
          <div className="flex items-center gap-2 font-bold text-[#FF5263]">
            <div className="p-1 rounded-xl embossed-icon text-[#FF5263]">
              <Clock className="w-4 h-4" />
            </div>
            <span>Golden Hour Rule: Report within 120 minutes of fraud to maximize fund recovery.</span>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#00D9FF] hover:underline inline-flex items-center gap-1.5 px-3 py-1 rounded-xl embossed-btn"
          >
            <span>Lodge Official Report</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Four-Step Emergency Action Protocol */}
      <div className="embossed-card p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#F4F7FF]">
              4-Step Emergency Action Checklist
            </h3>
            <p className="text-xs text-[#A5B4CC] mt-0.5">
              Execute these vital steps in order immediately following any unauthorized debit
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#00D9FF]">
            {actionChecklist.filter((c) => c.completed).length} of {actionChecklist.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {actionChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleAction(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-[#20C997]/15 border-[#20C997]/30 text-[#20C997]'
                  : 'embossed-card hover:embossed-card-hover'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-[#00D9FF] flex-shrink-0 cursor-pointer"
                aria-label={`Toggle ${item.title}`}
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-[#20C997]" />
                ) : (
                  <Square className="w-5 h-5 text-[#71829D]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className={`text-xs sm:text-sm font-bold ${item.completed ? 'line-through text-[#71829D]' : 'text-[#F4F7FF]'}`}>
                    Step {item.stepNumber}: {item.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20">
                    {item.urgentNotice}
                  </span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${item.completed ? 'text-[#71829D]' : 'text-[#A5B4CC]'}`}>
                  {item.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Evidence Collection Checklist */}
      <div className="embossed-card p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#F4F7FF] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#00D9FF]" />
              Evidence Checklist for Police & Bank Report
            </h3>
            <p className="text-xs text-[#A5B4CC] mt-0.5">
              Preserve these exact items before contacting authorities or submitting an FIR
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#20C997]">
            {evidenceChecklist.filter((e) => e.done).length} / {evidenceChecklist.length} Preserved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {evidenceChecklist.map((ev) => (
            <div
              key={ev.id}
              onClick={() => toggleEvidence(ev.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                ev.done
                  ? 'bg-[#20C997]/15 border-[#20C997]/30 text-[#20C997]'
                  : 'embossed-card hover:embossed-card-hover'
              }`}
            >
              <button
                type="button"
                className="flex-shrink-0 text-[#00D9FF] cursor-pointer"
                aria-label={`Toggle evidence ${ev.text}`}
              >
                {ev.done ? (
                  <CheckSquare className="w-4 h-4 text-[#20C997]" />
                ) : (
                  <Square className="w-4 h-4 text-[#71829D]" />
                )}
              </button>
              <span className={`text-xs font-semibold ${ev.done ? 'line-through text-[#71829D]' : 'text-[#F4F7FF]'}`}>
                {ev.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 24/7 Bank & UPI Directory */}
      <div className="embossed-card p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#F4F7FF] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00D9FF]" />
              24/7 Official Bank & UPI Helplines
            </h3>
            <p className="text-xs text-[#A5B4CC] mt-0.5">
              Always verify phone numbers on the back of your physical ATM/Debit card before calling.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl embossed-inset text-xs font-bold self-start sm:self-center">
            {(['all', 'bank', 'upi_app'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-mono ${
                  categoryFilter === cat
                    ? 'bg-[#3478F6] text-white'
                    : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'bank' ? 'Banks' : 'UPI Apps'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#71829D] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bank or UPI app (e.g. SBI, HDFC, PhonePe, Google Pay)..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium transition-all embossed-inset focus:border-[#00D9FF]/40"
          />
        </div>

        {/* Bank Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="p-4 rounded-2xl embossed-card hover:embossed-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#F4F7FF] truncate">
                    {bank.name}
                  </h4>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20">
                    {bank.category === 'bank' ? 'Bank' : 'UPI App'}
                  </span>
                </div>

                <div className="mt-2.5 text-xs font-mono font-bold text-[#00D9FF] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{bank.phone}</span>
                </div>
                {bank.tollFree && (
                  <span className="text-[10px] text-[#71829D] font-mono block mt-0.5">
                    Toll-Free: {bank.tollFree}
                  </span>
                )}
                {bank.note && (
                  <p className="text-[11px] text-[#A5B4CC] mt-1.5 line-clamp-2 font-medium">
                    {bank.note}
                  </p>
                )}
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                <a
                  href={`tel:${bank.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 embossed-btn-primary transition-colors"
                >
                  <PhoneForwarded className="w-3 h-3" />
                  <span>Call Bank</span>
                </a>

                <button
                  onClick={() => handleCopy(bank.phone)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 embossed-btn text-[#A5B4CC] hover:text-[#00D9FF] cursor-pointer"
                >
                  {copiedPhone === bank.phone ? (
                    <>
                      <Check className="w-3 h-3 text-[#20C997]" />
                      <span className="text-[11px] text-[#20C997]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. User Call Confirmation Modal */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md embossed-card p-6 sm:p-7 text-[#F4F7FF] animate-in fade-in zoom-in-95 border border-[#FF5263]/30">
            <div className="w-14 h-14 rounded-2xl text-[#FF5263] flex items-center justify-center mx-auto mb-3.5 embossed-icon">
              <PhoneCall className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-center text-[#F4F7FF]">Confirm Call to 1930?</h3>
            <p className="text-xs text-center text-[#A5B4CC] mt-2 leading-relaxed font-medium">
              You are initiating a direct phone call to the <strong>National Cybercrime Reporting Helpline (1930)</strong>. Have your 12-digit UPI UTR number and debited bank name ready.
            </p>

            <div className="mt-4 p-4 border border-[#FF5263]/30 rounded-2xl text-xs space-y-1.5 embossed-inset">
              <span className="font-extrabold block text-[#FF5263] font-mono">Important Checklist Before Dialing:</span>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-[#A5B4CC] font-medium">
                <li>Bank account number debited</li>
                <li>Transaction reference (UTR) from bank debit SMS</li>
                <li>Approximate time and amount lost</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCallConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer embossed-btn text-[#A5B4CC] hover:text-[#F4F7FF]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCall}
                className="px-6 py-2.5 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer embossed-btn-danger"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Yes, Dial 1930 Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
