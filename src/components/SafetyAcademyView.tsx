import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  QrCode,
  Smartphone,
  PhoneCall,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  question: string;
  category: string;
  icon: typeof QrCode;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: "A buyer on OLX sends a QR code screenshot and says: 'Scan this QR in Google Pay to receive ₹8,500 advance payment for your sofa.'",
    question: "What happens when you scan this QR code and enter your UPI PIN?",
    category: "QR Code Scam",
    icon: QrCode,
    options: [
      {
        id: "a",
        text: "The ₹8,500 will be credited directly to your bank account.",
        isCorrect: false,
        explanation: "INCORRECT. QR codes and UPI PINs are strictly for SENDING money, never receiving!"
      },
      {
        id: "b",
        text: "₹8,500 will be instantly deducted from your bank account.",
        isCorrect: true,
        explanation: "CORRECT! The Golden Rule of UPI: Entering a UPI PIN ALWAYS deducts money from your account. You NEVER need a PIN to receive payments."
      },
      {
        id: "c",
        text: "It will just verify your identity without moving any money.",
        isCorrect: false,
        explanation: "INCORRECT. Scanning a merchant/collect QR code triggers a payment transfer instruction."
      }
    ]
  },
  {
    id: 2,
    scenario: "You receive a video call on WhatsApp from an individual wearing a police uniform with a CBI backdrop, stating your Aadhaar was used in money laundering and you are placed under 'Digital Arrest'.",
    question: "What is the legitimate police / CBI protocol regarding 'Digital Arrest'?",
    category: "Digital Arrest Trap",
    icon: PhoneCall,
    options: [
      {
        id: "a",
        text: "Transfer money to the government safety escrow account to clear your name.",
        isCorrect: false,
        explanation: "INCORRECT. Police never ask for money or fund transfers to clear someone's name."
      },
      {
        id: "b",
        text: "Stay on camera for 48 hours until verification completes.",
        isCorrect: false,
        explanation: "INCORRECT. Digital arrest is 100% fake. There is NO legal provision in Indian law for digital arrest."
      },
      {
        id: "c",
        text: "'Digital Arrest' does not legally exist in India. Hang up immediately and report to 1930.",
        isCorrect: true,
        explanation: "CORRECT! PM Modi and the Ministry of Home Affairs confirmed: No law enforcement agency arrests people over video calls or demands money."
      }
    ]
  },
  {
    id: 3,
    scenario: "An SMS arrives: 'Dear Customer, your electricity power will be disconnected at 9:30 PM due to unpaid bill. Update now via quick app: bit.ly/power-upd'.",
    question: "How should you verify this urgent power disconnection notice?",
    category: "Electricity Bill Threat",
    icon: Zap,
    options: [
      {
        id: "a",
        text: "Download the APK file from the link to settle the ₹12 pending balance.",
        isCorrect: false,
        explanation: "INCORRECT! APK links from unknown numbers are remote access trojans that steal OTPs."
      },
      {
        id: "b",
        text: "Call only the official DISCOM helpline printed on your physical utility bill or electricity board app.",
        isCorrect: true,
        explanation: "CORRECT! Utility boards send official sender IDs (e.g. BESCOM, TNEB, MSEDCL) with your consumer account number, never random 10-digit mobile numbers."
      },
      {
        id: "c",
        text: "Forward the message to your family group to warn them.",
        isCorrect: false,
        explanation: "Always verify on the official portal before taking action."
      }
    ]
  },
  {
    id: 4,
    scenario: "A customer care executive asks you to download 'AnyDesk' or 'TeamViewer QuickSupport' to help you refund a failed ₹500 transaction.",
    question: "Why does the caller want you to download these specific applications?",
    category: "Screen Sharing Fraud",
    icon: Smartphone,
    options: [
      {
        id: "a",
        text: "To safely link your bank account to the central NPCI refund gateway.",
        isCorrect: false,
        explanation: "INCORRECT. NPCI never uses third-party screen sharing apps."
      },
      {
        id: "b",
        text: "To view your mobile screen, record your UPI PIN and intercept SMS OTPs in real-time.",
        isCorrect: true,
        explanation: "CORRECT! Screen sharing apps allow the fraudster to see everything on your screen, including passwords and banking OTPs."
      },
      {
        id: "c",
        text: "To speed up the network packet delivery from the bank server.",
        isCorrect: false,
        explanation: "INCORRECT. It provides complete unauthorized remote access to your device."
      }
    ]
  }
];

export const SafetyAcademyView: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'tactics' | 'dos_donts'>('quiz');

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOption(optionId);
    setShowExplanation(true);

    const chosen = currentQ.options.find(o => o.id === optionId);
    if (chosen?.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="embossed-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl embossed-icon flex items-center justify-center text-[#00D9FF]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#00D9FF] font-mono font-bold">
                SENTINEL CYBER DEFENSE ACADEMY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#00D9FF]/10 text-[#00D9FF] font-semibold border border-[#00D9FF]/20">
                CERTIFIED CURRICULUM
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#F4F7FF] tracking-tight mt-1">
              UPI Scam Defense Training
            </h1>
            <p className="text-sm text-[#A5B4CC] mt-1 max-w-xl">
              Master the psychology and mechanics of modern financial cybercrime. Train your instincts to identify fraud in seconds.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl embossed-inset">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#3478F6] text-white shadow-lg'
                : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Simulation Quiz
          </button>
          <button
            onClick={() => setActiveTab('tactics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tactics'
                ? 'bg-[#3478F6] text-white shadow-lg'
                : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Fraud Tactics
          </button>
          <button
            onClick={() => setActiveTab('dos_donts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dos_donts'
                ? 'bg-[#3478F6] text-white shadow-lg'
                : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Golden Rules
          </button>
        </div>
      </div>

      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {!quizFinished ? (
            <div className="embossed-card p-6 md:p-8 space-y-6">
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-[#A5B4CC]">
                <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="text-[#00D9FF] font-mono">Current Score: {score}</span>
              </div>
              <div className="w-full h-2 rounded-full embossed-inset overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3478F6] to-[#00D9FF] rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Scenario Box */}
              <div className="p-5 rounded-2xl embossed-inset-soft border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB547]">
                  <AlertTriangle className="w-4 h-4" />
                  REAL-LIFE SCENARIO SIMULATION
                </div>
                <p className="text-base md:text-lg text-[#F4F7FF] font-medium leading-relaxed">
                  "{currentQ.scenario}"
                </p>
              </div>

              {/* Question */}
              <div>
                <h3 className="text-lg font-bold text-[#F4F7FF]">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  let cardStyle = "embossed-btn text-left p-4 rounded-2xl w-full flex items-start gap-3 transition-all";

                  if (showExplanation) {
                    if (opt.isCorrect) {
                      cardStyle = "p-4 rounded-2xl w-full flex items-start gap-3 bg-[#20C997]/15 border border-[#20C997]/50 text-[#F4F7FF]";
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = "p-4 rounded-2xl w-full flex items-start gap-3 bg-[#FF5263]/15 border border-[#FF5263]/50 text-[#F4F7FF]";
                    } else {
                      cardStyle = "p-4 rounded-2xl w-full flex items-start gap-3 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={showExplanation}
                      className={cardStyle}
                    >
                      <div className="mt-0.5 shrink-0">
                        {showExplanation && opt.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-[#20C997]" />
                        )}
                        {showExplanation && isSelected && !opt.isCorrect && (
                          <XCircle className="w-5 h-5 text-[#FF5263]" />
                        )}
                        {(!showExplanation || (!opt.isCorrect && !isSelected)) && (
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs font-mono text-[#A5B4CC]">
                            {opt.id.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-sm font-medium">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {showExplanation && (
                <div className="p-5 rounded-2xl embossed-inset border border-white/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#00D9FF]" />
                    <span className="text-sm font-bold text-[#F4F7FF]">Sentinel Safety Analysis:</span>
                  </div>
                  <p className="text-sm text-[#A5B4CC] leading-relaxed">
                    {currentQ.options.find(o => o.id === selectedOption)?.explanation || currentQ.options.find(o => o.isCorrect)?.explanation}
                  </p>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNext}
                      className="embossed-btn-cyan px-6 py-2.5 rounded-xl text-xs flex items-center gap-2"
                    >
                      {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Next Scenario" : "View Final Score"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="embossed-card p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl embossed-icon flex items-center justify-center text-[#20C997]">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#F4F7FF]">Simulation Completed!</h2>
                <p className="text-sm text-[#A5B4CC] mt-2">
                  You scored <span className="text-[#00D9FF] font-bold text-lg">{score}</span> out of {QUIZ_QUESTIONS.length}
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl embossed-inset text-xs text-[#A5B4CC] leading-relaxed">
                {score === QUIZ_QUESTIONS.length ? (
                  <span className="text-[#20C997] font-semibold">
                    ⭐ Perfect Score! You demonstrate high cyber readiness. Share your knowledge with senior family members!
                  </span>
                ) : (
                  <span>
                    Keep practicing! Scammers constantly evolve their scripts. Remember the core rule: UPI PIN is ONLY for paying out.
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRestart}
                  className="embossed-btn px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tactics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="embossed-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#FF5263]">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#F4F7FF]">Digital Arrest Scam</h3>
                <span className="text-[10px] text-[#FF5263] uppercase tracking-wider font-semibold">High Threat</span>
              </div>
            </div>
            <p className="text-xs text-[#A5B4CC] leading-relaxed">
              Cyber criminals impersonate CBI, Mumbai Police, ED or Telecom Dept. They call on Skype or WhatsApp Video in fake police uniforms, claim your identity is linked to illegal narcotics packages or money laundering, and threaten immediate imprisonment unless you transfer money to a "safe Supreme Court verification account".
            </p>
            <div className="p-3 rounded-xl embossed-inset text-xs text-[#00D9FF] font-mono">
              DEFENSE: No Indian police agency holds video call trials or demands escrow money. Disconnect immediately.
            </div>
          </div>

          <div className="embossed-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#FFB547]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#F4F7FF]">Reverse QR Scam</h3>
                <span className="text-[10px] text-[#FFB547] uppercase tracking-wider font-semibold">Common on Marketplaces</span>
              </div>
            </div>
            <p className="text-xs text-[#A5B4CC] leading-relaxed">
              When selling items on OLX or Facebook Marketplace, fraudsters pose as army officers or corporate buyers. They send a QR code claiming: "Scan to receive payment". Entering a PIN always debits your account.
            </p>
            <div className="p-3 rounded-xl embossed-inset text-xs text-[#00D9FF] font-mono">
              DEFENSE: QR codes only send money. You NEVER scan a QR code to receive money.
            </div>
          </div>

          <div className="embossed-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#3478F6]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#F4F7FF]">Screen Share Takeover</h3>
                <span className="text-[10px] text-[#3478F6] uppercase tracking-wider font-semibold">Device Compromise</span>
              </div>
            </div>
            <p className="text-xs text-[#A5B4CC] leading-relaxed">
              Fake customer care numbers found on Google search instruct you to install AnyDesk, RustDesk, or TeamViewer to fix a pending payment or KYC error. Once installed, they view your OTPs and control your phone.
            </p>
            <div className="p-3 rounded-xl embossed-inset text-xs text-[#00D9FF] font-mono">
              DEFENSE: Never install any remote control app at the request of an unknown caller.
            </div>
          </div>

          <div className="embossed-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl embossed-icon flex items-center justify-center text-[#20C997]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#F4F7FF]">Urgent Utility Power Cuts</h3>
                <span className="text-[10px] text-[#20C997] uppercase tracking-wider font-semibold">Psychological Urgency</span>
              </div>
            </div>
            <p className="text-xs text-[#A5B4CC] leading-relaxed">
              SMS threats claim power will be disconnected in 2 hours due to an unpaid bill. A fake executive number is provided. When you call, they ask you to pay a nominal ₹10 fee via an APK link or phishing portal.
            </p>
            <div className="p-3 rounded-xl embossed-inset text-xs text-[#00D9FF] font-mono">
              DEFENSE: Utility providers never send SMS from personal 10-digit mobile numbers. Check your physical bill.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dos_donts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="embossed-card p-6 border-l-4 border-l-[#20C997] space-y-4">
            <div className="flex items-center gap-2 text-[#20C997]">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#F4F7FF]">The 4 Sacred Golden Rules</h3>
            </div>
            <ul className="space-y-3 text-xs text-[#A5B4CC]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
                <span><strong>UPI PIN = Debit Only:</strong> You only enter your UPI PIN to transfer money OUT of your bank account. Receiving money never requires a PIN.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
                <span><strong>Verify Customer Care:</strong> Look up numbers inside official bank mobile apps, never on Google search or Google Maps reviews.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
                <span><strong>Check UPI ID Name:</strong> Always verify the beneficiary name that appears on the UPI app before confirming any payment.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
                <span><strong>Act Within 2 Hours:</strong> If scammed, call 1930 immediately. Golden hour freezing saves your funds from ATM withdrawal.</span>
              </li>
            </ul>
          </div>

          <div className="embossed-card p-6 border-l-4 border-l-[#FF5263] space-y-4">
            <div className="flex items-center gap-2 text-[#FF5263]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#F4F7FF]">Never Do These Things</h3>
            </div>
            <ul className="space-y-3 text-xs text-[#A5B4CC]">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-[#FF5263] shrink-0 mt-0.5" />
                <span><strong>Never share OTP or PIN:</strong> No bank employee, police officer, or RBI official will EVER ask for your PIN or OTP.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-[#FF5263] shrink-0 mt-0.5" />
                <span><strong>Never install APK files:</strong> Avoid downloading .apk files sent over WhatsApp or SMS claiming to be bank or utility updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-[#FF5263] shrink-0 mt-0.5" />
                <span><strong>Never refund "accidental" payments immediately:</strong> Ask the sender to request a chargeback through their own bank. Do not send UPI funds back blindly.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-[#FF5263] shrink-0 mt-0.5" />
                <span><strong>Never accept remote support screen sharing:</strong> Reject AnyDesk, QuickSupport, or screen broadcast requests during payment support.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
