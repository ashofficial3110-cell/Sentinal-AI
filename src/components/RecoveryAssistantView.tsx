import React, { useState } from 'react';
import {
  LifeBuoy,
  Clock,
  FileText,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  PhoneCall,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const RecoveryAssistantView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    victimName: '',
    victimPhone: '',
    victimBank: '',
    amount: '',
    utrNumber: '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '14:30',
    fraudsterUPI: '',
    fraudsterPhone: '',
    scamType: 'QR Code Scam',
    narrative: ''
  });

  const generateComplaintLetter = () => {
    return `TO:
The Nodal Cyber Crime Officer / Officer-in-Charge,
National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)
And The Branch Manager, ${formData.victimBank || '[Victim Bank Name]'}

SUBJECT: URGENT COMPLAINT REGARDING FRAUDULENT UPI TRANSACTION OF INR ${formData.amount || '[Amount]'} UNDER SECTION 66D OF THE IT ACT, 2000

Dear Sir/Madam,

I am writing to formally report an unauthorized and fraudulent transaction carried out against my bank account on ${formData.incidentDate} at approximately ${formData.incidentTime}.

INCIDENT & TRANSACTION DETAILS:
- Complainant Name: ${formData.victimName || '[Your Full Name]'}
- Registered Mobile Number: ${formData.victimPhone || '[Your Mobile]'}
- Complainant Bank Name: ${formData.victimBank || '[Your Bank]'}
- Disputed Transaction Amount: INR ${formData.amount || '[Amount in Figures]'}
- Transaction Reference / UPI UTR Number: ${formData.utrNumber || '[12-Digit UTR Number]'}
- Recipient / Fraudster UPI ID: ${formData.fraudsterUPI || '[Suspect UPI ID / VPA]'}
- Fraudster Mobile / Contact Number: ${formData.fraudsterPhone || '[Suspect Phone]'}
- Modus Operandi / Category: ${formData.scamType}

BRIEF SUMMARY OF FRAUD:
${formData.narrative || 'The complainant was contacted under fraudulent pretexts and misled into initiating/authorizing a payment transaction under deceptive circumstances. No goods or services were delivered.'}

URGENT RELIEF REQUESTED:
1. Immediate flagging and freezing of the beneficiary account holding UTR: ${formData.utrNumber || '[UTR Number]'}.
2. Reversal and chargeback of funds in accordance with RBI Circular on Customer Protection (RBI/2017-18/15 DBR.No.Leg.BC.78/09.07.005/2017-18).
3. Registration of Cyber Crime Complaint Ack number for police verification.

I declare that the facts stated above are true to the best of my knowledge.

Sincerely,
${formData.victimName || '[Your Full Name]'}
Contact: ${formData.victimPhone || '[Your Contact]'}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateComplaintLetter());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="embossed-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl embossed-icon flex items-center justify-center text-[#FF5263]">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#FF5263] font-mono font-bold">
                INCIDENT RESPONSE & ESCALATION
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FF5263]/10 text-[#FF5263] font-semibold border border-[#FF5263]/20">
                120-MIN GOLDEN HOUR
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#F4F7FF] tracking-tight mt-1">
              Fraud Recovery Assistant
            </h1>
            <p className="text-sm text-[#A5B4CC] mt-1 max-w-xl">
              Lost money to a UPI scam? Take emergency containment measures and generate official dispute letters for Cybercrime Portal (1930) and your bank.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="tel:1930"
            className="embossed-btn-danger px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            Dial 1930 Helpline
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="embossed-btn px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-[#00D9FF]"
          >
            cybercrime.gov.in
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Critical Golden Hour Timeline */}
      <div className="embossed-card p-6 space-y-4 border-l-4 border-l-[#FFB547]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#FFB547]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F4F7FF]">The 120-Minute Golden Hour Protocol</h2>
            <p className="text-xs text-[#A5B4CC]">
              Cyber criminals rapidly route stolen funds across layered mule accounts to withdraw via ATM. Swift action increases recovery probability by over 80%.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl embossed-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#00D9FF]">STEP 01 (0-15 MIN)</span>
            <h3 className="text-xs font-bold text-[#F4F7FF]">Dial 1930 Helpline</h3>
            <p className="text-[11px] text-[#A5B4CC]">
              Connect to Citizen Financial Cyber Fraud Reporting System. Have your bank account and transaction UTR ready.
            </p>
          </div>

          <div className="p-4 rounded-2xl embossed-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#00D9FF]">STEP 02 (15-30 MIN)</span>
            <h3 className="text-xs font-bold text-[#F4F7FF]">Freeze Bank UPI</h3>
            <p className="text-[11px] text-[#A5B4CC]">
              Open your bank app or call customer care to temporarily lock UPI access and prevent secondary unauthorized debits.
            </p>
          </div>

          <div className="p-4 rounded-2xl embossed-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#00D9FF]">STEP 03 (30-60 MIN)</span>
            <h3 className="text-xs font-bold text-[#F4F7FF]">File Portal Complaint</h3>
            <p className="text-[11px] text-[#A5B4CC]">
              Submit incident on cybercrime.gov.in using the auto-generated complaint draft below with bank statement PDF.
            </p>
          </div>

          <div className="p-4 rounded-2xl embossed-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#00D9FF]">STEP 04 (60-120 MIN)</span>
            <h3 className="text-xs font-bold text-[#F4F7FF]">Bank Written Dispute</h3>
            <p className="text-[11px] text-[#A5B4CC]">
              Submit formal dispute letter to home branch manager citing RBI customer liability circular for formal tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Complaint Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Input */}
        <div className="lg:col-span-5 embossed-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-lg font-bold text-[#F4F7FF]">Complaint Builder</h2>
          </div>
          <p className="text-xs text-[#A5B4CC]">
            Fill in the details below to generate a formatted legal notice to submit to Cyber Cell & your bank.
          </p>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.victimName}
                  onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Registered Phone</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={formData.victimPhone}
                  onChange={(e) => setFormData({ ...formData, victimPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Your Bank</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={formData.victimBank}
                  onChange={(e) => setFormData({ ...formData, victimBank: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Amount Lost (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 25,000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">
                UPI Reference / UTR Number (12 Digits)
              </label>
              <input
                type="text"
                placeholder="Find in UPI app transaction details (e.g. 412356789012)"
                value={formData.utrNumber}
                onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] font-mono focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Suspect UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g. scammer@paytm"
                  value={formData.fraudsterUPI}
                  onChange={(e) => setFormData({ ...formData, fraudsterUPI: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] font-mono focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Scam Type</label>
                <select
                  value={formData.scamType}
                  onChange={(e) => setFormData({ ...formData, scamType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none"
                >
                  <option value="QR Code Scam">QR Code Scam</option>
                  <option value="Digital Arrest Impersonation">Digital Arrest Impersonation</option>
                  <option value="Fake Bank KYC Call">Fake Bank KYC Call</option>
                  <option value="Electricity Disconnection Threat">Electricity Disconnection Threat</option>
                  <option value="Part-time Job / Telegram Task">Part-time Job / Telegram Task</option>
                  <option value="Screen Sharing App Fraud">Screen Sharing App Fraud</option>
                  <option value="Wrong Money Received Extortion">Wrong Money Received Extortion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A5B4CC] block mb-1">Brief Narrative / Story</label>
              <textarea
                rows={3}
                placeholder="Briefly describe what the caller said and how you were misled into paying..."
                value={formData.narrative}
                onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl embossed-inset text-[#F4F7FF] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Live Draft Preview */}
        <div className="lg:col-span-7 embossed-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#20C997]" />
              <h2 className="text-base font-bold text-[#F4F7FF]">Official Complaint Draft Preview</h2>
            </div>
            <button
              onClick={handleCopy}
              className="embossed-btn-cyan px-4 py-2 rounded-xl text-xs flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl embossed-inset font-mono text-[11px] leading-relaxed text-[#A5B4CC] overflow-y-auto max-h-[380px] whitespace-pre-wrap select-all">
            {generateComplaintLetter()}
          </div>

          <div className="p-3 rounded-xl bg-[#3478F6]/10 border border-[#3478F6]/20 flex items-center gap-2 text-xs text-[#00D9FF]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Tip: Save screenshots of the WhatsApp chat, SMS, and UPI debited notification as evidence before uploading to the cybercrime portal.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
