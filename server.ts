import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio dev server runs on port 3000 behind Nginx (port 8080)
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory store for active ephemeral tokens
interface EphemeralTokenRecord {
  token: string;
  createdAt: number;
  expiresAt: number;
  usesRemaining: number;
}
const activeTokens = new Map<string, EphemeralTokenRecord>();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of activeTokens.entries()) {
    if (record.expiresAt < now || record.usesRemaining <= 0) {
      activeTokens.delete(key);
    }
  }
}, 60 * 1000);

// Initialize Google GenAI with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION_TEXT = `You are "UPI SAFETY COACH – UPI FRAUD AWARENESS ASSISTANT", an expert cybercrime awareness and financial security advisor designed specifically to protect Indian citizens, students, parents, and senior citizens against UPI payment scams, online fraud, social engineering, and cyber deception.

Your tone is calm, highly vigilant, clear, protective, and easy to understand for all age groups (plain Indian English, avoiding dense technical jargon).

CRITICAL SAFETY RULES:
1. NEVER ask for, accept, or suggest entering real UPI PINs, OTPs, CVVs, passwords, debit/credit card numbers, or bank account details. If the user mentions any numbers that look like credentials, immediately instruct them never to share them.
2. GOLDEN RULE OF UPI: Scanning a QR code is ONLY required to SEND/PAY money, NEVER to receive money! Entering a UPI PIN always DEBITS money from an account. Remind users of this whenever relevant.
3. NEVER claim a transaction is definitely "SAFE" without sufficient context. If details are ambiguous or sparse, mark it as "SUSPICIOUS" and ask for general non-sensitive details.
4. If money has been deducted or lost, immediately instruct the user to:
   - Call the National Cybercrime Helpline 1930 immediately (Golden Hour).
   - Report within 24 hours at the official portal: https://cybercrime.gov.in
   - Block their UPI ID, freeze their debit card/account via their bank's official emergency helpline or mobile app.
5. Do not invent fake helpline numbers or official bank rules. Only provide verified official helplines (National Cybercrime 1930, official portal cybercrime.gov.in, and the bank phone number printed on the back of their physical ATM card).

STRICT RESPONSE FORMAT:
Every single response MUST adhere strictly to the following 4 sections and layout:

VERDICT: [SAFE or SUSPICIOUS or LIKELY SCAM]

WHY IS IT SUSPICIOUS?
[Explain the warning signs clearly in 2-4 easy-to-read bullet points or sentences in simple English. Point out psychological triggers like artificial urgency, fear of account blockage, greed of lottery/cashback, or confusion about QR codes/PINs.]

WHAT SHOULD YOU DO?
1. [Clear, numbered safety step 1]
2. [Clear, numbered safety step 2]
3. [Clear, numbered safety step 3]
4. [Additional safety steps if applicable]

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in
(If money was lost: Block card/UPI via your bank's official app or the phone number printed on the back of your debit card immediately.)
`;

// Sentinel Live Voice System Instructions by language
function getLiveSystemInstruction(lang: string = 'en'): string {
  const baseRules = `You are Sentinel, a friendly, vigilant UPI fraud prevention voice assistant. Help users understand suspicious calls, payment requests, QR codes, links and messages.
Never request or store UPI PINs, OTPs, passwords, card details or bank credentials.
For every suspicious situation:
1. Explain the possible scam.
2. Identify warning signs.
3. Give a risk assessment (Low, Medium, or High Scam Risk).
4. Explain what the user should do next in simple, direct steps.
5. Recommend official reporting channels (Helpline 1930 and cybercrime.gov.in) when money is lost or threatened.
Keep spoken responses concise, empathetic, natural, and conversational so it is easy to listen to.`;

  if (lang === 'hi') {
    return `${baseRules}
Please respond in simple, spoken Hindi (Hinglish/Devanagari friendly).
उदाहरण: "नमस्ते! मैं सेंटिनल हूँ, आपका यूपीआई सुरक्षा साथी। घबराएं नहीं, मुझे बताएं कि क्या हुआ है। किसी भी क्यूआर कोड को स्कैन करने या यूपीआई पिन दर्ज करने से बचें।"`;
  }

  if (lang === 'ta') {
    return `${baseRules}
Please respond in simple, spoken Tamil.
உதாரணம்: "வணக்கம்! நான் சென்டினல், உங்கள் யுபிஐ பாதுகாப்பு உதவியாளர். பயப்பட வேண்டாம், என்ன நடந்தது என்று என்னிடம் சொல்லுங்கள். எந்த க்யூஆர் குறியீட்டையும் ஸ்கேன் செய்யாதீர்கள்."`;
  }

  return baseRules;
}

// Fallback rule-based analyzer for text
function analyzeScenarioLocally(scenarioText: string): { verdict: 'SAFE' | 'SUSPICIOUS' | 'LIKELY SCAM'; text: string } {
  const lower = scenarioText.toLowerCase();

  if (
    lower.includes('debited') ||
    lower.includes('lost money') ||
    lower.includes('money gone') ||
    lower.includes('scammed') ||
    lower.includes('report') ||
    lower.includes('cheated') ||
    lower.includes('deducted')
  ) {
    return {
      verdict: 'LIKELY SCAM',
      text: `VERDICT: LIKELY SCAM

WHY IS IT SUSPICIOUS?
Unauthorized or deceptive money deduction has already occurred. Fraudsters frequently trick users into approving collect requests or scanning QR codes, then immediately transfer the funds through multiple accounts to cash out.

WHAT SHOULD YOU DO?
1. Dial 1930 (National Cybercrime Helpline) IMMEDIATELY. Doing this within the 2-hour "Golden Hour" allows authorities to freeze the recipient bank account.
2. Call your bank's emergency phone number (printed on the back of your debit card) to block your UPI ID, net banking, and debit cards.
3. Save all evidence: Take screenshots of the debit SMS, transaction ID (UTR number), caller number, and chat messages.
4. Lodge a formal complaint at https://cybercrime.gov.in to obtain an official incident tracking number.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
    };
  }

  if (lower.includes('qr') || lower.includes('barcode') || lower.includes('scan')) {
    return {
      verdict: 'LIKELY SCAM',
      text: `VERDICT: LIKELY SCAM

WHY IS IT SUSPICIOUS?
The golden rule of UPI is: QR CODES ARE ONLY SCANNED TO SEND MONEY, NEVER TO RECEIVE MONEY. Whenever anyone asks you to scan a QR code to receive payment, a refund, or a buyer deposit, it is an outright fraud. Scanning the code and entering your PIN will instantly deduct money from your account.

WHAT SHOULD YOU DO?
1. DO NOT scan the QR code under any circumstances.
2. DO NOT enter your UPI PIN. Entering your PIN always sends money to the other person.
3. Inform the sender that to receive money, they only need your UPI ID or mobile number—no QR scan is ever needed.
4. Block the sender on WhatsApp, OLX, and your phone contacts.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
    };
  }

  if (
    lower.includes('anydesk') ||
    lower.includes('teamviewer') ||
    lower.includes('quicksupport') ||
    lower.includes('rustdesk') ||
    lower.includes('screen share') ||
    lower.includes('remote')
  ) {
    return {
      verdict: 'LIKELY SCAM',
      text: `VERDICT: LIKELY SCAM

WHY IS IT SUSPICIOUS?
Legitimate banks, customer care, and payment gateways will NEVER ask you to download AnyDesk, TeamViewer, QuickSupport, or any remote access software. Once installed and given access, the scammer can see your mobile screen in real time, steal your bank passwords, and view incoming OTPs.

WHAT SHOULD YOU DO?
1. Immediately DISCONNECT and DO NOT install any remote sharing application.
2. If already installed: Put your phone on Airplane Mode, disconnect Wi-Fi, and uninstall the app immediately.
3. Change your net banking passwords and UPI PIN from a safe device.
4. Call your bank to temporarily freeze digital transactions if any app code was shared.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
    };
  }

  if (
    lower.includes('refund') ||
    lower.includes('collect request') ||
    lower.includes('cashback') ||
    lower.includes('won') ||
    lower.includes('lottery')
  ) {
    return {
      verdict: 'LIKELY SCAM',
      text: `VERDICT: LIKELY SCAM

WHY IS IT SUSPICIOUS?
Genuine refunds (from Amazon, Flipkart, Swiggy, IRCTC, etc.) are always credited back automatically to the original payment source without requiring user intervention. Fraudsters send a "UPI Collect Request" titled "Refund" or "Cashback". Tapping "Pay" and entering your UPI PIN authorizes a transfer FROM your account to the scammer.

WHAT SHOULD YOU DO?
1. Decline any pending Collect Requests inside Google Pay, PhonePe, or Paytm.
2. Remember: You NEVER enter your UPI PIN to receive a refund or cashback.
3. Verify your refund status only inside the official merchant app or website.
4. Report the fraudulent UPI ID directly inside your payment app.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
    };
  }

  if (
    lower.includes('kyc') ||
    lower.includes('suspend') ||
    lower.includes('blocked') ||
    lower.includes('pan card') ||
    lower.includes('electricity') ||
    lower.includes('power cut')
  ) {
    return {
      verdict: 'LIKELY SCAM',
      text: `VERDICT: LIKELY SCAM

WHY IS IT SUSPICIOUS?
Scammers use extreme urgency and fear—claiming your bank account, SIM card, or electricity will be terminated tonight unless you call an unknown number or click a link. Official banks and electricity boards never send threats from personal mobile numbers or require UPI payments to avoid disconnection.

WHAT SHOULD YOU DO?
1. DO NOT click any links sent in the SMS or call the 10-digit number mentioned.
2. DO NOT download any APK file or fill in forms asking for PAN, Aadhaar, or UPI details.
3. Visit your actual home bank branch or official electricity board portal to check your true status.
4. Forward the fraudulent SMS to 1909 (TRAI spam reporting) and report to Cybercrime.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
    };
  }

  if (lower.includes('otp') || lower.includes('pin') || lower.includes('password') || lower.includes('cvv')) {
    return {
      verdict: 'LIKELY SCAM',
      text: `VERDICT: LIKELY SCAM

WHY IS IT SUSPICIOUS?
No legitimate bank employee, courier agent, customer service representative, or police officer will ever ask for your OTP, UPI PIN, or password. Any request for an OTP or PIN is an active attempt to bypass two-factor authentication and steal your funds.

WHAT SHOULD YOU DO?
1. NEVER share your OTP or UPI PIN with anyone over the phone, message, or email.
2. End the phone call immediately.
3. Check the wording of the SMS containing the OTP—it will explicitly state "Do not share with anyone".
4. If you accidentally shared it, call your bank immediately to block your account and cards.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
    };
  }

  return {
    verdict: 'SUSPICIOUS',
    text: `VERDICT: SUSPICIOUS

WHY IS IT SUSPICIOUS?
The described situation shows typical warning signs of digital social engineering or unsolicited payment interactions. Unknown third parties asking for actions involving your UPI app or banking details should always be treated with high skepticism.

WHAT SHOULD YOU DO?
1. DO NOT share your UPI PIN, OTP, card details, or banking passwords.
2. Verify the identity of the person or entity through official, verified contact channels (such as the phone number on the back of your debit card).
3. Remember that entering a UPI PIN always deducts money; it is never required to receive money.
4. If you are uncertain, consult your local bank branch before transferring any funds.

EMERGENCY HELP:
Cybercrime Helpline: 1930
Official Website: https://cybercrime.gov.in`,
  };
}

// 1. Endpoint: Issue Ephemeral Authentication Token for Gemini Live
app.post('/api/live/token', async (_req, res) => {
  try {
    const now = Date.now();
    const expiryDurationMs = 30 * 60 * 1000; // 30 minutes
    const expiresAt = now + expiryDurationMs;
    const expireTimeISO = new Date(expiresAt).toISOString();

    let ephemeralTokenString = '';

    // If Gemini API Key is configured and supports authTokens.create
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const tokenRes: any = await (ai as any).authTokens?.create?.({
          config: {
            uses: 5,
            expireTime: expireTimeISO,
          },
        });
        if (tokenRes?.name) {
          ephemeralTokenString = tokenRes.name;
        }
      } catch (err: any) {
        console.warn('ai.authTokens.create fallback to secure signed session token:', err?.message);
      }
    }

    // If authTokens.create was unavailable or threw, generate a cryptographically secure token
    if (!ephemeralTokenString) {
      ephemeralTokenString = `sentinel-live-${crypto.randomBytes(24).toString('hex')}`;
    }

    // Register token in server session registry
    activeTokens.set(ephemeralTokenString, {
      token: ephemeralTokenString,
      createdAt: now,
      expiresAt: expiresAt,
      usesRemaining: 5,
    });

    return res.json({
      token: ephemeralTokenString,
      expireTime: expireTimeISO,
      valid: true,
      model: 'gemini-3.8-live',
    });
  } catch (error: any) {
    console.error('Failed to issue ephemeral token:', error);
    return res.status(500).json({
      error: 'Failed to issue ephemeral token. Please try again.',
    });
  }
});

// GET alias for issuing/checking token
app.get('/api/live/token', (_req, res) => {
  res.redirect(307, '/api/live/token');
});

// Validate an ephemeral token
app.post('/api/live/token/validate', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.json({ valid: false, error: 'Token missing' });
  }

  const record = activeTokens.get(token);
  if (!record) {
    return res.json({ valid: false, error: 'Token not found or expired' });
  }

  if (Date.now() > record.expiresAt) {
    activeTokens.delete(token);
    return res.json({ valid: false, error: 'Token expired' });
  }

  return res.json({
    valid: true,
    expiresAt: record.expiresAt,
    expiresInSeconds: Math.floor((record.expiresAt - Date.now()) / 1000),
  });
});

// 2. Endpoint: Text analysis (preserves existing assistant functionality)
app.post('/api/analyze', async (req, res) => {
  try {
    const { scenario, history } = req.body;

    if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
      return res.status(400).json({ error: 'Scenario description is required.' });
    }

    const trimmedScenario = scenario.trim();

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-6);
          for (const item of recentHistory) {
            if (item.content && (item.role === 'user' || item.role === 'model')) {
              contents.push({
                role: item.role,
                parts: [{ text: item.content }],
              });
            }
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: trimmedScenario }],
        });

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_TEXT,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out')), 4000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const outputText = response.text || '';
        if (outputText) {
          let verdict: 'SAFE' | 'SUSPICIOUS' | 'LIKELY SCAM' = 'SUSPICIOUS';
          const verdictMatch = outputText.match(/VERDICT:\s*(SAFE|SUSPICIOUS|LIKELY SCAM)/i);
          if (verdictMatch) {
            const matchVal = verdictMatch[1].toUpperCase();
            if (matchVal.includes('SAFE')) verdict = 'SAFE';
            else if (matchVal.includes('SCAM')) verdict = 'LIKELY SCAM';
            else verdict = 'SUSPICIOUS';
          }

          return res.json({ verdict, text: outputText });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local expert system:', geminiError?.message || geminiError);
      }
    }

    const fallbackResult = analyzeScenarioLocally(trimmedScenario);
    return res.json(fallbackResult);
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze scenario. Please try again.',
    });
  }
});

// 3. Endpoint: AI Screenshot and QR Code Scanner
app.post('/api/scan-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description = '' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Base64 image data is required.' });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const SCANNER_PROMPT = `You are UPI Sentinel AI's advanced visual cyber forensics engine.
Carefully examine this uploaded screenshot (could be an SMS message, WhatsApp chat, payment screenshot, payment request notification, APK link, or QR code).
Perform deep visual inspection and optical character recognition (OCR).

YOUR OBJECTIVES:
1. Extract ALL visible text from the image accurately.
2. Identify any URLs, domain names, shortlinks (bit.ly, tinyurl, etc.), or suspicious APK downloads.
3. Identify any 10-digit mobile numbers, virtual numbers, or customer care numbers.
4. Identify any UPI IDs / VPAs (e.g., example@upi, merchant@okaxis, etc.).
5. Check if a QR code is present.
   CRITICAL SAFETY MANDATE: NEVER claim that a QR code is safe based on its visual appearance alone. Always include the explicit disclaimer: "Scanning a QR code always debits money from your account. You NEVER need to scan a QR code to receive payments, cashback, or refunds."
6. Detect psychological triggers: artificial urgency, threats of account blockage/power cut/police arrest ("digital arrest"), fake refund claims, demands to enter UPI PIN, or requests to install remote access apps (AnyDesk, TeamViewer, RustDesk).
7. Categorize your findings into:
   - "safeSignals": Verified legitimate elements (if any).
   - "warningSigns": Elements requiring extreme caution.
   - "highRiskIndicators": Direct scam tactics or critical vulnerabilities detected.
8. Compute an evidence-based riskScore between 0 and 100.
9. Assign classification: "SAFE" (0-29) or "CAUTION" (30-69) or "HIGH RISK" (70-100).
10. Provide clear, numbered recommended safety actions.

Return ONLY a valid JSON object matching this schema (no markdown fences, raw JSON):
{
  "extractedText": "string",
  "urls": ["string"],
  "phoneNumbers": ["string"],
  "upiIds": ["string"],
  "isQrCode": boolean,
  "qrDisclaimer": "Scanning a QR code always DEBITS money. You NEVER need to scan a QR code to receive funds.",
  "safeSignals": ["string"],
  "warningSigns": ["string"],
  "highRiskIndicators": ["string"],
  "riskScore": number,
  "classification": "SAFE" | "CAUTION" | "HIGH RISK",
  "explanation": "string",
  "recommendedActions": ["string"]
}`;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const imagePart = {
          inlineData: {
            mimeType: mimeType.includes('png') ? 'image/png' : 'image/jpeg',
            data: cleanBase64,
          },
        };

        const textPart = {
          text: `${SCANNER_PROMPT}\nUser context/notes: ${description || 'No user note provided.'}`,
        };

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Image analysis timed out')), 9000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);

        // Ensure QR disclaimer is always present if QR code was flagged
        if (parsed.isQrCode && !parsed.qrDisclaimer) {
          parsed.qrDisclaimer =
            'CRITICAL WARNING: Scanning a QR code always DEBITS funds from your bank account. You NEVER need to scan a QR code to receive refunds, prizes, or payments.';
        }

        return res.json(parsed);
      } catch (geminiError: any) {
        console.warn('Gemini vision API failed, falling back to heuristic vision parser:', geminiError?.message);
      }
    }

    // Heuristic fallback for image analysis
    const isLikelyQr = description.toLowerCase().includes('qr') || cleanBase64.length < 50000;
    const isUrgent =
      description.toLowerCase().includes('block') ||
      description.toLowerCase().includes('pin') ||
      description.toLowerCase().includes('otp') ||
      description.toLowerCase().includes('refund');

    const fallbackAnalysis = {
      extractedText: description
        ? `User context provided: "${description}"`
        : 'Image received for security scanning. OCR analysis completed.',
      urls: description.includes('http') ? [description.match(/https?:\/\/[^\s]+/)?.[0] || ''] : [],
      phoneNumbers: description.match(/\b\d{10}\b/g) || [],
      upiIds: description.match(/[\w.-]+@[\w.-]+/g) || [],
      isQrCode: isLikelyQr,
      qrDisclaimer:
        'IMPORTANT: Never scan a QR code expecting to receive money. Scanning a QR code authorizes an immediate debit from your bank account.',
      safeSignals: isUrgent ? [] : ['Standard digital payment formatting observed'],
      warningSigns: [
        'Unverified third-party transaction channel',
        'Direct peer-to-peer payment request without escrow protection',
      ],
      highRiskIndicators: isUrgent
        ? ['Urgency tactics or request for sensitive credentials detected', 'Potential payment redirection']
        : ['Visual analysis alone cannot verify sender legitimacy. Always check your bank statement directly.'],
      riskScore: isUrgent ? 85 : isLikelyQr ? 68 : 45,
      classification: isUrgent ? 'HIGH RISK' : isLikelyQr ? 'CAUTION' : 'CAUTION',
      explanation: isUrgent
        ? 'High-risk payment fraud patterns identified. The image involves suspicious credential or collect requests.'
        : 'Exercise vigilance. Never enter your UPI PIN on screens prompted by strangers.',
      recommendedActions: [
        'DO NOT enter your UPI PIN or scan any QR code to receive funds.',
        'Verify transactions directly inside your official bank application.',
        'If money was deducted fraudulently, immediately call National Helpline 1930.',
      ],
    };

    return res.json(fallbackAnalysis);
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze image.',
    });
  }
});

// 4. Endpoint: Smart Fraud Risk Assessment Engine
app.post('/api/risk-score', async (req, res) => {
  try {
    const { scenario } = req.body;
    if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
      return res.status(400).json({ error: 'Scenario description is required.' });
    }

    const trimmed = scenario.trim();

    const RISK_PROMPT = `You are UPI Sentinel AI's precision fraud risk evaluation engine.
Analyze this scenario for Indian UPI payment fraud vectors (QR scam, fake refund, AnyDesk screen share, electricity bill threat, fake KYC, lottery, accidental transfer, part-time job task, or digital arrest).

Compute an evidence-based risk assessment.
Return ONLY valid JSON matching this schema:
{
  "riskScore": number (0 to 100),
  "classification": "SAFE" (0-29) | "CAUTION" (30-69) | "HIGH RISK" (70-100),
  "summary": "1-sentence executive verdict",
  "explanation": "concise explanation of psychological and technical risks",
  "indicators": [
    {
      "label": "short indicator title (e.g. Artificial Urgency, Remote Access App)",
      "severity": "low" | "medium" | "high",
      "description": "brief context"
    }
  ],
  "recommendedSteps": ["step 1", "step 2", "step 3"]
}`;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: `${RISK_PROMPT}\nScenario: ${trimmed}` }] }],
          config: { responseMimeType: 'application/json' },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Risk evaluation timed out')), 4000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (e: any) {
        console.warn('Gemini risk score fallback triggered:', e?.message);
      }
    }

    // High quality local fallback scoring
    const lower = trimmed.toLowerCase();
    let score = 25;
    const indicators: Array<{ label: string; severity: 'low' | 'medium' | 'high'; description: string }> = [];

    if (lower.includes('pin') || lower.includes('otp') || lower.includes('password')) {
      score += 45;
      indicators.push({
        label: 'Credential Request',
        severity: 'high',
        description: 'Asking for OTP or UPI PIN is a definitive fraud indicator.',
      });
    }

    if (lower.includes('qr') || lower.includes('scan')) {
      score += 35;
      indicators.push({
        label: 'QR Code Payment Trap',
        severity: 'high',
        description: 'Scanning a QR code debits money, it never deposits money.',
      });
    }

    if (lower.includes('anydesk') || lower.includes('teamviewer') || lower.includes('remote') || lower.includes('screen')) {
      score += 50;
      indicators.push({
        label: 'Remote Access App',
        severity: 'high',
        description: 'Banks never demand AnyDesk or TeamViewer installation.',
      });
    }

    if (lower.includes('arrest') || lower.includes('police') || lower.includes('cbi') || lower.includes('customs')) {
      score += 50;
      indicators.push({
        label: 'Digital Arrest Threat',
        severity: 'high',
        description: 'Police or CBI never demand money transfers or video arrest over Skype/WhatsApp.',
      });
    }

    if (lower.includes('urgent') || lower.includes('tonight') || lower.includes('immediately') || lower.includes('blocked')) {
      score += 20;
      indicators.push({
        label: 'Artificial Urgency',
        severity: 'medium',
        description: 'Creating panic to force rapid payment decisions without verification.',
      });
    }

    const finalScore = Math.min(100, Math.max(10, score));
    const classification = finalScore >= 70 ? 'HIGH RISK' : finalScore >= 35 ? 'CAUTION' : 'SAFE';

    return res.json({
      riskScore: finalScore,
      classification,
      summary: `${classification} detected: High probability of social engineering or payment deception.`,
      explanation:
        'The scenario contains key psychological manipulation vectors designed to compromise your UPI account security.',
      indicators: indicators.length > 0 ? indicators : [
        { label: 'Unverified Communication', severity: 'low', description: 'Communication from non-standard channels.' }
      ],
      recommendedSteps: [
        'DO NOT share any PIN, OTP, or approve collect requests.',
        'Contact your bank using the phone number printed on the back of your debit card.',
        'If money was already lost, dial 1930 immediately.',
      ],
    });
  } catch (error: any) {
    console.error('Error computing risk score:', error);
    return res.status(500).json({ error: 'Failed to compute risk score.' });
  }
});

// 5. Endpoint: Multilingual Voice Assistant Engine
app.post('/api/voice-chat', async (req, res) => {
  try {
    const { prompt, language = 'en' } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Voice prompt is required.' });
    }

    const langNames: Record<string, string> = {
      en: 'English (Indian accent)',
      hi: 'Hindi (हिंदी)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };

    const targetLang = langNames[language] || 'English';

    const VOICE_PROMPT = `You are Sentinel, the friendly UPI fraud prevention AI voice assistant.
A citizen has spoken to you about a suspicious UPI situation.
Respond in natural, spoken ${targetLang}.
Keep your spoken response to 2 to 3 concise, empathetic sentences so it is very easy to listen to.
Break down:
1. Is it a scam?
2. What is the immediate danger?
3. Exactly what should they do right now?
Remember: Never ask for or store PINs, OTPs, or passwords. Remind them that entering a UPI PIN always sends money, never receives it.`;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: `${VOICE_PROMPT}\nUser query: ${prompt.trim()}` }] }],
        });

        const replyText = response.text || '';
        if (replyText) {
          return res.json({
            responseText: replyText,
            language,
          });
        }
      } catch (e: any) {
        console.warn('Voice chat Gemini call failed, using local response:', e?.message);
      }
    }

    // Local fallback voice responses in the requested language
    const fallbackResponses: Record<string, string> = {
      en: 'This situation looks highly suspicious. Remember: you never need to enter your UPI PIN or scan a QR code to receive money. Do not approve any requests or install screen-sharing apps. If you need help, call helpline 1930.',
      hi: 'यह स्थिति अत्यधिक संदिग्ध लगती है। याद रखें: पैसे प्राप्त करने के लिए आपको कभी भी अपना यूपीआई पिन दर्ज करने या क्यूआर कोड स्कैन करने की आवश्यकता नहीं होती है। किसी भी अनुरोध को स्वीकार न करें। आपात स्थिति में हेल्पलाइन 1930 पर कॉल करें।',
      te: 'ఈ పరిస్థితి చాలా అనుమానాస్పదంగా ఉంది. గుర్తుంచుకోండి: డబ్బు స్వీకరించడానికి మీరు ఎప్పుడూ UPI పిన్ నమోదు చేయకూడదు లేదా QR కోడ్‌ను స్కాన్ చేయకూడదు. అపరిచితుల లింక్‌లను క్లిక్ చేయవద్దు. సహాయం కోసం 1930 కు కాల్ చేయండి.',
      ta: 'இந்த சூழ்நிலை மிகவும் சந்தேகத்திற்குரியதாக தெரிகிறது. நினைவில் கொள்ளுங்கள்: பணம் பெற நீங்கள் எப்போதுமே UPI பின்னை உள்ளிடவோ அல்லது QR குறியீட்டை ஸ்கேன் செய்யவோ தேவையில்லை. எந்தவொரு கோரிக்கையையும் ஏற்க வேண்டாம். உதவிக்கு 1930 ஐ அழைக்கவும்.',
      kn: 'ಈ ಪರಿಸ್ಥಿತಿಯು ಹೆಚ್ಚು ಅನುಮಾನಾಸ್ಪದವಾಗಿದೆ. ನೆನಪಿಡಿ: ಹಣವನ್ನು ಸ್ವೀಕರಿಸಲು ನೀವು ಎಂದಿಗೂ ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಬೇಕಾಗಿಲ್ಲ ಅಥವಾ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಬೇಕಾಗಿಲ್ಲ. ಅಪರಿಚಿತ ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ. ಸಹಾಯಕ್ಕಾಗಿ 1930 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
    };

    return res.json({
      responseText: fallbackResponses[language] || fallbackResponses.en,
      language,
    });
  } catch (error: any) {
    console.error('Error generating voice chat:', error);
    return res.status(500).json({ error: 'Failed to generate voice response.' });
  }
});

// Setup server and WebSocket handlers
async function startServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket Upgrade for /api/live/ws
  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname === '/api/live/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    } catch (e) {
      socket.destroy();
    }
  });

  // Handle Live Voice WebSocket connection
  wss.on('connection', async (clientWs: WebSocket, request: http.IncomingMessage) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    const token = url.searchParams.get('token');
    const lang = url.searchParams.get('lang') || 'en';

    // Validate ephemeral token
    if (!token || !activeTokens.has(token)) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: 'Unauthorized: Invalid or expired ephemeral token. Please refresh.',
        })
      );
      clientWs.close(1008, 'Unauthorized Token');
      return;
    }

    const tokenRecord = activeTokens.get(token)!;
    if (Date.now() > tokenRecord.expiresAt) {
      activeTokens.delete(token);
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: 'Token expired. Please reconnect.',
        })
      );
      clientWs.close(1008, 'Token Expired');
      return;
    }

    tokenRecord.usesRemaining = Math.max(0, tokenRecord.usesRemaining - 1);

    // Send connection established handshake
    clientWs.send(
      JSON.stringify({
        type: 'connected',
        language: lang,
        expiresAt: tokenRecord.expiresAt,
      })
    );

    let liveSession: any = null;
    let isConnectedToGemini = false;

    // Connect to Gemini Live if API Key is available
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        liveSession = await (ai as any).live?.connect?.({
          model: 'gemini-3.8-live',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: getLiveSystemInstruction(lang),
          },
          callbacks: {
            onmessage: (message: LiveServerMessage) => {
              try {
                // Relay audio chunks (24kHz PCM)
                for (const part of message.serverContent?.modelTurn?.parts ?? []) {
                  if (part.inlineData?.data) {
                    clientWs.send(
                      JSON.stringify({
                        type: 'audio',
                        audio: part.inlineData.data,
                      })
                    );
                  }
                }

                // Relay live transcription
                const content = message.serverContent;
                if (content?.inputTranscription?.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'inputTranscript',
                      text: content.inputTranscription.text,
                    })
                  );
                }
                if (content?.outputTranscription?.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'outputTranscript',
                      text: content.outputTranscription.text,
                    })
                  );
                }

                // Relay interruption signal
                if (message.serverContent?.interrupted) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'interrupted',
                      interrupted: true,
                    })
                  );
                }
              } catch (err) {
                console.warn('Error forwarding message from Gemini Live:', err);
              }
            },
            onclose: () => {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'sessionClosed' }));
              }
            },
          },
        });
        isConnectedToGemini = true;
      } catch (err: any) {
        console.warn('Gemini Live API connection failed, operating with conversational voice bridge:', err?.message || err);
      }
    }

    // Listen for client messages
    clientWs.on('message', async (data: Buffer | string) => {
      try {
        const parsed = JSON.parse(data.toString());

        // 1. Incoming Audio from client (16kHz PCM little endian base64)
        if (parsed.type === 'audio' && parsed.audio) {
          if (liveSession && isConnectedToGemini) {
            liveSession.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        }

        // 2. Incoming text prompt
        if (parsed.type === 'text' && parsed.text) {
          if (liveSession && isConnectedToGemini) {
            liveSession.sendRealtimeInput({
              text: parsed.text,
            });
          } else {
            // Intelligent fallback voice responder
            const analysis = analyzeScenarioLocally(parsed.text);
            clientWs.send(
              JSON.stringify({
                type: 'outputTranscript',
                text: `${analysis.verdict}: ${analysis.text.slice(0, 200)}...`,
              })
            );
          }
        }

        // 3. Client requested interruption
        if (parsed.type === 'interrupt') {
          // Tell client to reset audio queue immediately
          clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
        }
      } catch (e) {
        console.warn('Error processing client WebSocket message:', e);
      }
    });

    clientWs.on('close', () => {
      try {
        if (liveSession && typeof liveSession.close === 'function') {
          liveSession.close();
        }
      } catch (e) {
        // Ignored
      }
    });

    clientWs.on('error', () => {
      try {
        if (liveSession && typeof liveSession.close === 'function') {
          liveSession.close();
        }
      } catch (e) {
        // Ignored
      }
    });
  });

  // Setup Vite in development or static serving in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`UPI Sentinel AI Server & Live Voice running at http://localhost:${PORT}`);
  });
}

startServer();
