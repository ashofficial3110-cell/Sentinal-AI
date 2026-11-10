import { QuickReply, ScamGuideItem } from '../types';

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'fake-refund',
    title: 'Fake refund call',
    shortLabel: '1. Fake refund call',
    iconName: 'RotateCcw',
    description: 'Caller claims your online order/flight was cancelled and asks you to accept a refund via UPI.',
    samplePrompt: 'Someone called claiming to be from Amazon/Flipkart saying my product failed delivery and they will refund ₹1,500. They told me to open Google Pay and approve a collect request or enter my UPI PIN to receive the refund.',
  },
  {
    id: 'qr-code-scam',
    title: 'QR code payment scam',
    shortLabel: '2. QR code payment scam',
    iconName: 'QrCode',
    description: 'Buyer on OLX or seller asks you to scan a QR code on WhatsApp to receive money.',
    samplePrompt: 'A buyer on OLX agreed to buy my furniture without bargaining. He sent a QR code on WhatsApp and said: "Scan this QR code and enter your UPI PIN, the ₹12,000 will be credited directly to your bank account."',
  },
  {
    id: 'accidental-money',
    title: 'Accidental money received',
    shortLabel: '3. Accidental money received',
    iconName: 'HelpCircle',
    description: 'Stranger calls claiming they accidentally sent money to your UPI number and asks you to transfer it back.',
    samplePrompt: 'I received an SMS looking like a bank credit alert of ₹25,000. Right after, an unknown person called weeping and pleading that they accidentally transferred ₹25,000 meant for their mother\'s hospital bill to my UPI number, and asked me to immediately send it back to their GPay number.',
  },
  {
    id: 'fake-kyc-call',
    title: 'Fake bank KYC call',
    shortLabel: '4. Fake bank KYC call',
    iconName: 'FileCheck',
    description: 'Threatens that your bank account, SIM card, or Paytm wallet is blocked due to pending KYC.',
    samplePrompt: 'I got an SMS saying: "Dear Customer, your SBI/HDFC bank account will be suspended today due to incomplete KYC. Call this 10-digit number or click this link to update your PAN & UPI ID immediately."',
  },
  {
    id: 'fake-customer-care',
    title: 'Fake customer care number',
    shortLabel: '5. Fake customer care number',
    iconName: 'PhoneCall',
    description: 'Searching customer service on Google/maps results in a fraudster number asking for remote access or test payments.',
    samplePrompt: 'My food delivery was stuck, so I searched Google for "Swiggy/Zomato customer care phone number". The person who answered asked me to pay ₹2 as a token verification fee on UPI and read out an SMS code to resolve my issue.',
  },
  {
    id: 'screen-sharing-scam',
    title: 'Screen sharing application scam',
    shortLabel: '6. Screen sharing application scam',
    iconName: 'ScreenShare',
    description: 'Caller insists you download AnyDesk, TeamViewer, RustDesk, or QuickSupport to fix a payment.',
    samplePrompt: 'A technical executive called saying my failed UPI transaction of ₹3,400 is stuck on the server. He told me to install "AnyDesk" or "TeamViewer QuickSupport" from Google Play Store and give him the 9-digit code so he can fix the glitch.',
  },
  {
    id: 'otp-fraud',
    title: 'OTP fraud',
    shortLabel: '7. OTP fraud',
    iconName: 'KeyRound',
    description: 'Tricksters asking for an SMS code under the guise of verification, prize, or courier delivery.',
    samplePrompt: 'A delivery boy or customer support person is asking me to share a 6-digit OTP that arrived on my phone so they can confirm my identity or cancel an unwanted debit.',
  },
  {
    id: 'suspicious-payment-link',
    title: 'Suspicious payment link',
    shortLabel: '8. Suspicious payment link',
    iconName: 'ExternalLink',
    description: 'Received a link on SMS/WhatsApp claiming reward, bill discount, or tax refund.',
    samplePrompt: 'I received a message: "Congratulations! You have won an Indian Oil ₹5,000 festival fuel reward. Click this link: bit.ly/indianoil-reward-claim to claim instantly into your PhonePe/Paytm wallet."',
  },
  {
    id: 'upi-collect-request',
    title: 'UPI collect request scam',
    shortLabel: '9. UPI collect request scam',
    iconName: 'ArrowDownLeft',
    description: 'Notification inside UPI app asking you to pay/decline with remarks like "Cashback Approved".',
    samplePrompt: 'I received a notification in PhonePe / Google Pay saying: "Request from Merchant (Cashback India) for ₹4,999. Remarks: Enter UPI PIN to receive ₹4,999 cashback in your account". Should I tap Pay and enter my PIN?',
  },
  {
    id: 'report-fraud',
    title: 'Report a UPI fraud',
    shortLabel: '10. Report a UPI fraud',
    iconName: 'AlertTriangle',
    description: 'Money was already debited! What urgent steps must be taken within the golden hour?',
    samplePrompt: 'I accidentally approved a request and ₹20,000 was debited from my bank account 10 minutes ago! What should I do right now to stop the money and get it back?',
  },
];

export const GOLDEN_RULES = [
  {
    title: 'UPI PIN is ONLY for paying',
    desc: 'You NEVER need to enter your UPI PIN to receive money. If someone asks for your PIN to send you money, it is 100% a scam.',
    badge: 'Fundamental Rule #1',
  },
  {
    title: 'QR codes are for paying, not receiving',
    desc: 'Scanning a QR code always DEBITS money from your bank account. No genuine sender ever needs you to scan a code.',
    badge: 'QR Code Reality',
  },
  {
    title: 'Never install remote screen apps',
    desc: 'Banks and UPI apps will NEVER tell you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport.',
    badge: 'Remote Access Alert',
  },
  {
    title: 'Golden Hour: Act within 2 hours',
    desc: 'If money was fraudulently debited, immediately dial 1930 and inform your bank within 2 hours to freeze the recipient account.',
    badge: 'Emergency Response',
  },
];

export const SCAM_KNOWLEDGE_BASE: ScamGuideItem[] = [
  {
    id: 'qr-scams',
    title: 'QR Code Payment Fraud',
    category: 'Marketplace & Sales',
    redFlags: [
      'Buyer insists on paying via QR code sent on WhatsApp or SMS',
      'Says "Scan this code and enter PIN to accept money into your account"',
      'Shows fake payment screenshots with your name',
    ],
    howItWorks:
      'Fraudsters send a collect QR code. When you scan it and enter your UPI PIN, money is deducted from your bank account instead of being credited.',
    prevention: [
      'Remember: QR codes are only scanned to PAY, never to RECEIVE.',
      'To receive money on UPI, the sender only needs your mobile number or UPI ID (VPA).',
      'Never open banking apps on the instructions of an unknown buyer.',
    ],
  },
  {
    id: 'fake-refunds',
    title: 'Fake Refund & Order Cancel Calls',
    category: 'E-Commerce Scams',
    redFlags: [
      'Call from personal 10-digit mobile number claiming to be Amazon/Flipkart/Myntra/Swiggy',
      'Asks you to accept a "Collect Request" on PhonePe/GPay to process a refund',
      'Threatens that refund will lapse in 5 minutes',
    ],
    howItWorks:
      'Scammers impersonate e-commerce customer support, sending a UPI Collect request titled "REFUND_CREDIT". Tapping Pay and entering PIN transfers your money to the scammer.',
    prevention: [
      'Legitimate e-commerce refunds are credited automatically back to the original source without PIN.',
      'Never approve any Collect request received on your UPI app from strangers.',
      'Only check order and refund status inside the official e-commerce app.',
    ],
  },
  {
    id: 'accidental-transfer',
    title: 'Accidental Money Received Fraud',
    category: 'Social Engineering',
    redFlags: [
      'Fake credit SMS from personal number or forged sender header',
      'Caller cries or panics, claiming they accidentally sent money to you',
      'Requests immediate transfer to a different UPI ID without checking bank passbook',
    ],
    howItWorks:
      'The scammer sends a spoofed SMS that looks like a bank credit notification. When you return the "accidental" money from your actual bank balance, your real money is lost.',
    prevention: [
      'Always open your bank mobile app and check your actual account balance and statement.',
      'Never trust an SMS alone.',
      'If real money was mistakenly credited, advise them to contact their bank branch for an official reversal.',
    ],
  },
  {
    id: 'fake-kyc',
    title: 'Fake Bank & SIM KYC Suspension Threats',
    category: 'Impersonation Scams',
    redFlags: [
      'SMS warning: "Your SBI/Paytm account or SIM will be blocked tonight"',
      'Link leading to a cloned phishing portal asking for net banking or UPI PIN',
      'Urgent call from someone claiming to be a "Bank Manager"',
    ],
    howItWorks:
      'Criminals create panic that your bank or SIM will be stopped immediately. The phishing link steals your login ID, password, and OTPs.',
    prevention: [
      'Banks never send 10-digit mobile numbers for KYC verification.',
      'KYC is updated in person at your home branch or via the official verified bank app.',
      'Never click shortened links (bit.ly, tinyurl, apk downloads) received via SMS.',
    ],
  },
  {
    id: 'remote-access',
    title: 'Screen Sharing & Remote Access (AnyDesk / TeamViewer)',
    category: 'Technical Fraud',
    redFlags: [
      'Caller asks you to download AnyDesk, TeamViewer, RustDesk, or QuickSupport from Play Store',
      'Asks for a 9-digit session code',
      'Tells you to open your UPI app and perform a test transaction of ₹1 or enter PIN',
    ],
    howItWorks:
      'Once you share the screen code, the fraudster views your entire mobile screen. When you open your banking app, they record your credentials, PIN, and incoming OTPs.',
    prevention: [
      'Never install screen-sharing software at the request of anyone claiming to be customer care.',
      'If you already installed it, immediately turn on Airplane Mode, disconnect Wi-Fi, and uninstall the app.',
    ],
  },
  {
    id: 'electricity-bill',
    title: 'Fake Electricity Bill Disconnection Threat',
    category: 'Urgency & Fear',
    redFlags: [
      'SMS: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill"',
      'Gives a personal mobile number to contact the "Electricity Officer"',
      'Officer demands payment via an unknown link or remote app',
    ],
    howItWorks:
      'Victims fear blackout and call the fake officer who sends malicious payment links or steals debit card details.',
    prevention: [
      'Power distribution companies (DISCOMs) do not send disconnection threats from personal numbers.',
      'Pay utility bills only through verified platforms (official DISCOM website or BBPS in trusted apps).',
    ],
  },
  {
    id: 'part-time-job',
    title: 'Work From Home & Telegram Task Scams',
    category: 'Investment Fraud',
    redFlags: [
      'WhatsApp message offering ₹3,000 to ₹8,000 per day for liking YouTube videos or Google reviews',
      'Initial payout of ₹150–₹500 to build trust',
      'Addition to Telegram VIP groups demanding "prepaid investment tasks" of ₹5,000 to ₹50,000 via UPI',
    ],
    howItWorks:
      'Victims are enticed with tiny initial profits, then tricked into transferring large sums on UPI to "crypto wallets" or "VIP accounts" that cannot be withdrawn.',
    prevention: [
      'No genuine company pays hundreds of rupees for liking YouTube videos or typing reviews.',
      'Never transfer money to get a job or unlock your salary.',
    ],
  },
];

export const SCAM_ALERTS = [
  {
    id: 'alert-digital-arrest',
    title: 'Surge in "Digital Arrest" Video Call Extortion via WhatsApp & Skype',
    category: 'Digital Arrest Threat' as const,
    severity: 'CRITICAL' as const,
    reportedDate: 'Updated Today',
    threatLevel: 'Severe Financial Danger',
    modusOperandi:
      'Criminals impersonate CBI officers, Mumbai Cyber Police, or Telecom Enforcement (DoT). Victims receive video calls showing a fake police station backdrop. Scammers claim your Aadhaar was used to send illegal packages (narcotics/passports) and demand immediate transfer of funds into "Government Verification Accounts" via RTGS/UPI to avoid arrest.',
    warningSigns: [
      'Threatens "Digital Arrest" — which has ZERO legal basis in Indian criminal law.',
      'Demands you remain on continuous video call and forbids speaking to family.',
      'Forces immediate fund transfer into individual or current accounts for "clearing".',
    ],
    protectionTips: [
      'Remember: Real Indian Police or CBI NEVER arrest or interrogate citizens over WhatsApp/Skype video calls.',
      'Never transfer money to any account claiming to be a "police verification" or "RBI holding" account.',
      'Immediately disconnect, block the number, and dial 1930.',
    ],
    verifiedSource: 'Indian Cybercrime Coordination Centre (I4C) & CERT-In',
    affectedDemographic: 'Senior citizens, retired professionals, and homemakers',
    isSampleOrRecent: 'Active Live Threat' as const,
  },
  {
    id: 'alert-electricity-bill',
    title: 'Widespread "Power Disconnection Tonight" SMS Fraud Wave',
    category: 'Electricity Bill Threat' as const,
    severity: 'HIGH' as const,
    reportedDate: 'Active Nationwide',
    threatLevel: 'High Identity & Fund Theft',
    modusOperandi:
      'Victims receive an SMS: "Dear consumer, your electricity power will be disconnected at 9:30 PM tonight from electricity office because previous month bill was not updated. Please immediately contact our power officer at 98xxxxxx." When victims call, they are instructed to install AnyDesk or click a phishing payment link to pay ₹10.',
    warningSigns: [
      'Sent from personal 10-digit mobile numbers instead of official state DISCOM sender IDs (e.g., BESCOM, TNEB, MSEDCL).',
      'Artificial deadline (9:30 PM tonight) to cause panic.',
      'Demands installation of remote desktop tools or payment through unfamiliar portals.',
    ],
    protectionTips: [
      'DISCOMs never disconnect supply without formal written notices and never send threats from personal mobile numbers.',
      'Pay bills only through official utility apps, bank net banking, or verified BBPS platforms.',
      'Do not dial the phone numbers listed in suspicious SMS text.',
    ],
    verifiedSource: 'National Payments Corporation of India (NPCI) & State DISCOMs',
    affectedDemographic: 'Households and small business owners',
    isSampleOrRecent: 'Active Live Threat' as const,
  },
  {
    id: 'alert-fake-kyc-apk',
    title: 'Malicious Android APKs Masquerading as Banking KYC Updates',
    category: 'Fake KYC Update' as const,
    severity: 'CRITICAL' as const,
    reportedDate: 'Elevated Threat',
    threatLevel: 'Device Takeover & SMS Interception',
    modusOperandi:
      'Fraudsters send WhatsApp messages containing files like "SBI_NetBanking_KYC.apk" or "PAN_Update_v2.apk". Once installed, the malicious malware requests SMS and Accessibility permissions, intercepts all incoming OTPs, and executes unauthorized UPI money transfers in the background.',
    warningSigns: [
      'File name ends with ".apk" sent via WhatsApp or Telegram.',
      'Claims your bank account or debit card is already blocked or will expire in 24 hours.',
      'Asks you to allow "Install from Unknown Sources" on your smartphone.',
    ],
    protectionTips: [
      'NEVER install APK files received via WhatsApp, Telegram, or SMS.',
      'Only download official banking applications from Google Play Store or Apple App Store.',
      'If accidentally installed, activate Airplane mode immediately, back up crucial media, and perform a factory reset.',
    ],
    verifiedSource: 'CERT-In Security Advisory (CIVN-2024)',
    affectedDemographic: 'Android smartphone users',
    isSampleOrRecent: 'Active Live Threat' as const,
  },
  {
    id: 'alert-qr-marketplace',
    title: 'OLX / Social Marketplace "Scan QR to Receive Advance" Scam',
    category: 'QR Code Scam' as const,
    severity: 'HIGH' as const,
    reportedDate: 'Ongoing Threat',
    threatLevel: 'Direct Account Debit',
    modusOperandi:
      'A fraudster contacts someone selling furniture, vehicles, or electronics online. The scammer agrees to buy immediately without negotiation and claims to be an Army officer or NRI. They send a QR code on WhatsApp stating: "Scan this QR code and enter your UPI PIN to collect the advance ₹15,000 into your bank."',
    warningSigns: [
      'Insistence on paying via QR code on WhatsApp.',
      'Claims that entering your UPI PIN is needed to "verify and deposit" money.',
      'Sends fake screenshots of bank transfers showing pending status.',
    ],
    protectionTips: [
      'RULE OF THUMB: QR codes are strictly for SENDING money. Scanning a QR code ALWAYS debits your bank account.',
      'To receive money on UPI, the sender only needs your UPI ID or mobile number. NO PIN OR QR SCAN IS EVER REQUIRED.',
      'Refuse to scan any QR code sent by a buyer.',
    ],
    verifiedSource: 'Reserve Bank of India (RBI) Cyber Awareness',
    affectedDemographic: 'Classified sellers and students selling used goods',
    isSampleOrRecent: 'Active Live Threat' as const,
  },
  {
    id: 'alert-work-from-home',
    title: 'Telegram VIP "YouTube Like & Review Task" Investment Scam',
    category: 'Investment & Part-time Job' as const,
    severity: 'HIGH' as const,
    reportedDate: 'High Volume',
    threatLevel: 'Substantial Financial Loss',
    modusOperandi:
      'Begins with unsolicited WhatsApp messages offering ₹2,000 to ₹5,000 per day for liking YouTube videos or rating hotels on Google Maps. Victims are paid ₹150 for the first 3 tasks to establish credibility, then moved to Telegram where they are tricked into depositing ₹5,000, ₹20,000, or lakhs into "crypto task pools" that cannot be withdrawn.',
    warningSigns: [
      'Offers high daily income for trivial tasks like clicking thumbs-up on video links.',
      'Demands you join a Telegram group with "task managers".',
      'Requires you to transfer "prepaid task funds" via UPI to unlock earnings.',
    ],
    protectionTips: [
      'No genuine company pays money for liking YouTube videos or typing fake ratings.',
      'Never pay money to receive a job or unlock your earned salary.',
      'Report offending Telegram channels and WhatsApp numbers on cybercrime.gov.in.',
    ],
    verifiedSource: 'Delhi Police Cyber Cell & I4C',
    affectedDemographic: 'Students, college youth, and job seekers',
    isSampleOrRecent: 'Active Live Threat' as const,
  },
];

export const SAMPLE_FAMILY_MEMBERS = [
  {
    id: 'fam-1',
    name: 'Ramesh Sharma',
    nickname: 'Dad',
    relationship: 'Parent' as const,
    phone: '+91 98112 xxxxx',
    isSenior: true,
    protectionActive: true,
    lastSimulatedQuizScore: 92,
    unresolvedAlerts: 0,
  },
  {
    id: 'fam-2',
    name: 'Kavita Sharma',
    nickname: 'Mom',
    relationship: 'Parent' as const,
    phone: '+91 98450 xxxxx',
    isSenior: true,
    protectionActive: true,
    lastSimulatedQuizScore: 85,
    unresolvedAlerts: 1,
  },
  {
    id: 'fam-3',
    name: 'Aarav Sharma',
    nickname: 'Aarav (College)',
    relationship: 'Child / Student' as const,
    phone: '+91 97234 xxxxx',
    isSenior: false,
    protectionActive: true,
    lastSimulatedQuizScore: 100,
    unresolvedAlerts: 0,
  },
];

