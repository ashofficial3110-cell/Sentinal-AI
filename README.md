# UPI SENTINEL AI – VOICE & EMERGENCY CONNECT UPGRADE

**UPI Sentinel AI** is a professional financial cybercrime prevention and fraud awareness assistant designed for Indian citizens, students, parents, and senior citizens.

This upgrade integrates two real-time modules:
1. **Module 1: Sentinel AI Live Voice** – Low-latency bidirectional voice assistant powered by Google's Gemini Live API (`gemini-3.8-live`).
2. **Module 2: Emergency Call Center** – High-urgency action hub featuring one-touch 1930 calling with confirmation, cybercrime.gov.in reporting, verified 24/7 bank helplines, and the Golden Hour lost-money action checklist.

---

## Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Web Audio API (16kHz PCM recording & 24kHz gapless playback).
- **Backend**: Node.js, Express, WebSocket Server (`ws`), Google GenAI SDK (`@google/genai`).
- **AI Models**:
  - `gemini-3.8-live`: Bidirectional live voice streaming, interruption handling, input/output transcription.
  - `gemini-3.8-flash`: Structured fraud scenario text analysis and risk verdicts.
- **Security & Privacy**:
  - Zero storage of audio recordings or financial details.
  - Ephemeral authentication tokens issued via `/api/live/token` with 30-minute expiry.
  - Permanent `GEMINI_API_KEY` remains securely on the server.
  - Call safety: Confirmation prompt guarantees the app never dials `tel:1930` automatically.

---

## Module 1: Sentinel AI Live Voice

### Features:
1. **Interactive Microphone Button**: Starts real-time bidirectional voice conversation with visual pulse animations.
2. **16kHz PCM Audio Capture**: Captures speech using the Web Audio API and streams 16-bit linear PCM audio over WebSockets.
3. **24kHz Gapless Audio Playback**: Plays spoken Gemini responses smoothly using an internal timing queue (`nextStartTime`).
4. **Live Conversation Transcripts**: Real-time streaming transcription of both user speech and Sentinel's spoken response.
5. **Trilingual Support**: One-click switching between:
   - **English**
   - **Hindi (हिंदी)**
   - **Tamil (தமிழ்)**
6. **Instant Interruption**: Speaking into the mic or clicking **Interrupt AI** halts audio playback immediately and notifies Gemini Live.
7. **Comprehensive Session Controls**: Mute/Unmute microphone, Reconnect, Interrupt AI, and End Session buttons.
8. **Live Waveform & Avatar**: Real-time canvas waveform and glowing avatar reacting dynamically to audio amplitude.

---

## Module 2: Emergency Call Center

### Features:
1. **Large CALL 1930 Button**: Uses `tel:1930` with an explicit confirmation dialog before launching the dialer.
2. **Official Reporting Portal**: Direct verified link to [cybercrime.gov.in](https://cybercrime.gov.in).
3. **Bank Emergency Directory**: Searchable contact directory with instant dial & copy actions for:
   - State Bank of India (SBI)
   - HDFC Bank
   - ICICI Bank
   - Axis Bank
   - Punjab National Bank (PNB)
   - Canara Bank
   - Bank of Baroda
   - Kotak Mahindra Bank
   - PhonePe, Google Pay, and Paytm Payments Bank
4. **Interactive 4-Step Lost Money Checklist**:
   - Step 1: Call 1930 immediately (Golden Hour freezing).
   - Step 2: Inform your bank to block cards, net banking, and UPI permissions.
   - Step 3: Preserve 12-digit UTR numbers, debit SMS, and screenshots.
   - Step 4: Submit formal police cyber complaint on the national portal.

---

## Security & API Endpoints

### 1. Ephemeral Token Generation
- **Endpoint**: `POST /api/live/token`
- **Description**: Issues a short-lived token (valid for 30 minutes) for authenticating browser WebSocket sessions without exposing the permanent API key.
- **Validation**: `POST /api/live/token/validate`

### 2. Live Audio WebSocket Bridge
- **Endpoint**: `ws://<host>/api/live/ws?token=<ephemeral_token>&lang=<en|hi|ta>`
- **Description**: Bidirectional audio streaming between the browser and Gemini Live (`gemini-3.8-live`).

### 3. Scenario Analysis Engine
- **Endpoint**: `POST /api/analyze`
- **Payload**: `{ scenario: string, history?: [...] }`
- **Output**: Strict 4-part structured response (`VERDICT`, `WHY IS IT SUSPICIOUS?`, `WHAT SHOULD YOU DO?`, `EMERGENCY HELP`).

---

## Environment Configuration

Create a `.env` file in the project root:

```env
# Gemini API Key (injected automatically in AI Studio Secrets)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Port (defaults to 3000)
PORT=3000
```

---

## Running the Application

### 1. Development Mode
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000`.

### 2. Production Build
```bash
npm run build
npm start
```

---

## Testing Instructions

1. **Test Chat Assistant**:
   - Click any of the 10 Quick Reply buttons (e.g., *Fake refund call* or *QR code payment scam*).
   - Verify the color-coded verdict banner, risk explanation, and interactive checklist.

2. **Test Voice Assistant**:
   - Navigate to the **VOICE & EMERGENCY** tab.
   - Select your language (English, Hindi, or Tamil).
   - Tap the central microphone orb to start the voice session.
   - Grant microphone permissions when prompted by your browser.
   - Speak a scenario (e.g., *"A caller asked me to scan a QR code on WhatsApp"*).
   - Watch the animated waveform and live transcripts respond in real time.
   - Tap **Mute Mic**, **Interrupt AI**, or **End Session** to test session controls.

3. **Test Emergency Call Center**:
   - Click the **Emergency Call Center** subtab.
   - Tap **CALL 1930** and verify the confirmation modal appears first with incident checklist reminders.
   - Search the bank directory for your bank (e.g. *SBI* or *HDFC*) and test the **Copy** and **Call Bank** actions.
