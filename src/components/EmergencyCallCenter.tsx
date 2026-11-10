import React, { useState } from 'react';
import {
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CheckSquare,
  Square,
  Copy,
  Check,
  Search,
  HelpCircle,
  FileText,
  PhoneForwarded,
  X,
} from 'lucide-react';
import { BankContact, EmergencyChecklistItem } from '../types';

export const EmergencyCallCenter: React.FC = () => {
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [bankSearch, setBankSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bank' | 'upi_app'>('all');

  // Interactive 4-step emergency checklist
  const [checklist, setChecklist] = useState<EmergencyChecklistItem[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Contact 1930 immediately',
      instruction:
        'Dial 1930 (National Cybercrime Reporting Portal Helpline). Do this within 2 hours ("Golden Hour") so the cyber coordination cell can immediately freeze the recipient fraudster account and stop ATM cash-out.',
      completed: false,
      urgentNotice: 'Golden Hour: Fastest recovery rate when reported within 120 minutes',
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
        'Save the 12-digit UPI Reference (UTR) number, transaction screenshot, debit SMS, sender/receiver UPI ID, fraudster phone number, and WhatsApp chat history.',
      completed: false,
      urgentNotice: 'Crucial for police FIR and bank chargeback processing',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Submit a report through the official portal',
      instruction:
        'Lodge an official financial fraud cyber complaint on https://cybercrime.gov.in. Upload your evidence and obtain an official Incident Acknowledgement Number.',
      completed: false,
      urgentNotice: 'Generates formal legal tracking and inter-bank freezing memo',
    },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const bankDirectory: BankContact[] = [
    {
      id: 'sbi',
      name: 'State Bank of India (SBI)',
      category: 'bank',
      phone: '1800 1234',
      tollFree: '1800 2100 / 1800 11 2211',
      helpLink: 'https://bank.sbi',
      note: 'Option 1 for unauthorized electronic transactions / card block',
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      category: 'bank',
      phone: '1800 202 6161',
      tollFree: '1800 1600',
      helpLink: 'https://www.hdfcbank.com',
      note: 'Available 24x7 for fraud reporting & digital freeze',
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      category: 'bank',
      phone: '1800 1080',
      tollFree: '1800 1080',
      helpLink: 'https://www.icicibank.com',
      note: 'Press 1 to immediately report suspected cyber fraud',
    },
    {
      id: 'axis',
      name: 'Axis Bank',
      category: 'bank',
      phone: '1860 419 5555',
      tollFree: '1800 103 5577',
      helpLink: 'https://www.axisbank.com',
      note: 'Immediate card & UPI stop option',
    },
    {
      id: 'pnb',
      name: 'Punjab National Bank (PNB)',
      category: 'bank',
      phone: '1800 180 2222',
      tollFree: '1800 103 2222',
      helpLink: 'https://pnbindia.in',
      note: 'Dedicated national 24/7 fraud cell',
    },
    {
      id: 'canara',
      name: 'Canara Bank',
      category: 'bank',
      phone: '1800 425 0018',
      tollFree: '1800 103 0018',
      helpLink: 'https://canarabank.com',
      note: 'Toll-free 24-hour helpline',
    },
    {
      id: 'bob',
      name: 'Bank of Baroda',
      category: 'bank',
      phone: '1800 5700',
      tollFree: '1800 258 4455',
      helpLink: 'https://www.bankofbaroda.in',
      note: 'Call to lock Baroda M-Connect & debit card',
    },
    {
      id: 'kotak',
      name: 'Kotak Mahindra Bank',
      category: 'bank',
      phone: '1860 266 2666',
      tollFree: '1800 209 0000',
      helpLink: 'https://www.kotak.com',
      note: 'Emergency fraud reporting line',
    },
    {
      id: 'phonepe',
      name: 'PhonePe Support',
      category: 'upi_app',
      phone: '080-68727374',
      tollFree: '022-68727374',
      helpLink: 'https://www.phonepe.com/contact-us',
      note: 'In-app Help > Have an issue with a transaction',
    },
    {
      id: 'gpay',
      name: 'Google Pay (GPay) Support',
      category: 'upi_app',
      phone: '1800-419-0157',
      tollFree: '1800-419-0157',
      helpLink: 'https://support.google.com/pay/india',
      note: 'In-app Help & Feedback > Dispute transaction',
    },
    {
      id: 'paytm',
      name: 'Paytm Payments Bank / Wallet',
      category: 'upi_app',
      phone: '0120-4456-456',
      tollFree: '0120-4456-456',
      helpLink: 'https://paytm.com/care',
      note: '24x7 Fraud reporting desk',
    },
  ];

  const filteredBanks = bankDirectory.filter((b) => {
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.phone.includes(bankSearch) ||
      (b.tollFree && b.tollFree.includes(bankSearch));
    return matchesCat && matchesSearch;
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleConfirmCall1930 = () => {
    setShowCallConfirm(false);
    window.location.href = 'tel:1930';
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-red-800 via-rose-700 to-red-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-red-500/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              <ShieldAlert className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white mb-1">
                National Cybercrime Action Center
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">EMERGENCY CALL CENTER</h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium max-w-xl">
                Immediate response protocol for unauthorized UPI debits, financial fraud, and cyber threats.
              </p>
            </div>
          </div>

          {/* Golden Hour Countdown notice */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-xs text-rose-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-300 animate-pulse flex-shrink-0" />
            <div>
              <span className="font-extrabold text-white block">Golden Hour Protocol:</span>
              <span className="text-[11px]">Dial 1930 within 2 hours to freeze accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Emergency Action Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Large CALL 1930 Button (Requires Confirmation) */}
        <div className="bg-white p-5 rounded-2xl border-2 border-red-300 shadow-sm flex flex-col justify-between hover:border-red-500 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Primary Emergency Line
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                Toll-Free 24/7
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-2">National Cybercrime Helpline</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Connects directly to the Citizen Financial Cyber Fraud Reporting System to freeze fraudulent recipient accounts.
            </p>
          </div>

          <button
            onClick={() => setShowCallConfirm(true)}
            className="mt-4 w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-xl font-black text-sm tracking-wide shadow-lg shadow-red-200 flex items-center justify-center gap-2.5 transition-transform"
          >
            <PhoneCall className="w-5 h-5" />
            <span>CALL 1930</span>
          </button>
        </div>

        {/* REPORT ONLINE Button */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700">Official Portal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Government of India
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-2">cybercrime.gov.in</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              File a formal police cyber complaint, upload screenshots, transaction statements, and obtain an official tracking ID.
            </p>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-transform"
          >
            <span>REPORT ONLINE</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* CONTACT YOUR BANK Button */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-400 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Bank Emergency Cell</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                Account Freeze
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-2">Contact Your Bank</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Find verified 24/7 emergency customer care numbers for State Bank, HDFC, ICICI, Axis, PNB, and UPI apps below.
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('bank-directory-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-4 w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-transform"
          >
            <Building2 className="w-4 h-4" />
            <span>BROWSE BANK NUMBERS</span>
          </button>
        </div>
      </div>

      {/* 3. Lost Money Immediate Checklist */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <h3 className="font-black text-base text-slate-900">
                Action Checklist: If Money Has Been Lost via UPI Fraud
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Follow these 4 critical steps immediately. Check off each step as you complete it.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            {checklist.filter((i) => i.completed).length} of 4 steps completed
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-800'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 flex-shrink-0 text-blue-600 focus:outline-hidden"
                aria-label={`Toggle step ${item.stepNumber}`}
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    Step {item.stepNumber}
                  </span>
                  <h4 className={`text-sm font-bold ${item.completed ? 'line-through text-slate-500' : ''}`}>
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {item.urgentNotice}
                  </span>
                </div>
                <p className={`text-xs mt-1.5 leading-relaxed ${item.completed ? 'text-slate-500' : 'text-slate-700'}`}>
                  {item.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Verified Bank & Payment Provider Emergency Directory */}
      <div id="bank-directory-section" className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-700" />
              Verified Bank & Payment Provider Emergency Directory
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Direct official 24x7 helpline numbers to block cards, freeze net banking, and log disputed transactions.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('bank')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'bank' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Banks
            </button>
            <button
              onClick={() => setSelectedCategory('upi_app')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'upi_app' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              UPI Apps
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bank name (e.g. SBI, HDFC, ICICI, PhonePe, Google Pay)..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Bank Cards Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{bank.name}</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-blue-100 text-blue-800">
                    {bank.category === 'bank' ? 'Bank' : 'UPI App'}
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-blue-800 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{bank.phone}</span>
                </div>
                {bank.tollFree && (
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Alt: {bank.tollFree}
                  </div>
                )}
                {bank.note && (
                  <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 italic">
                    {bank.note}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
                <a
                  href={`tel:${bank.phone.replace(/[^0-9]/g, '')}`}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <PhoneForwarded className="w-3 h-3" />
                  <span>Call Bank</span>
                </a>

                <button
                  onClick={() => handleCopyPhone(bank.phone)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Copy Phone Number"
                >
                  {copiedPhone === bank.phone ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-[11px] text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 mt-4 italic text-center">
          Note: Always verify emergency numbers on the back of your physical ATM/Debit card before dialing.
        </p>
      </div>

      {/* 5. User Confirmation Modal Before Placing Call (Crucial requirement: "Never place a call automatically") */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-red-400 overflow-hidden p-6 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>

            <h3 className="text-lg font-black text-center text-slate-900">
              Confirm Call to 1930?
            </h3>
            <p className="text-xs text-center text-slate-600 mt-2 leading-relaxed">
              You are about to dial the <strong>National Cybercrime Reporting Helpline (1930)</strong>. This line connects you with the Government of India Citizen Financial Cyber Fraud Reporting System.
            </p>

            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
              <span className="font-bold block">Please have ready:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800">
                <li>Your bank name & account number</li>
                <li>12-digit UPI transaction reference (UTR)</li>
                <li>Approximate time and amount debited</li>
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowCallConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCall1930}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-transform"
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
