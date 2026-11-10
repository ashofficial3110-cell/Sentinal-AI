/**
 * Audio processing utilities for Gemini Live API
 * Handles 16kHz PCM capture and 24kHz PCM gapless playback
 */

// Convert Float32Array audio buffer to 16-bit linear PCM Little-Endian Buffer
export function float32To16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    // Clamp to -1.0 .. 1.0
    const s = Math.max(-1, Math.min(1, input[i]));
    // Convert to 16-bit signed integer (-32768 to 32767)
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

// Convert ArrayBuffer / Uint8Array to base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert base64 string to Float32Array PCM for 24kHz AudioContext
export function base64ToFloat32PCM(base64: string): Float32Array {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const dataView = new DataView(bytes.buffer);
  const sampleCount = Math.floor(bytes.length / 2);
  const float32 = new Float32Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    float32[i] = int16 / (int16 < 0 ? 0x8000 : 0x7fff);
  }

  return float32;
}

/**
 * Live audio player managing a 24kHz AudioContext with gapless queuing
 */
export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  init(): void {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
      this.gainNode = this.audioCtx.createGain();
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;

      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  playChunk(base64Audio: string): void {
    this.init();
    if (!this.audioCtx || !this.gainNode) return;

    try {
      const pcmFloat32 = base64ToFloat32PCM(base64Audio);
      if (pcmFloat32.length === 0) return;

      const audioBuffer = this.audioCtx.createBuffer(1, pcmFloat32.length, 24000);
      audioBuffer.getChannelData(0).set(pcmFloat32);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      const currentTime = this.audioCtx.currentTime;
      const startTime = Math.max(currentTime, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        const index = this.activeSources.indexOf(source);
        if (index > -1) {
          this.activeSources.splice(index, 1);
        }
      };
    } catch (e) {
      console.warn('Failed to decode or play audio chunk:', e);
    }
  }

  stopAll(): void {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (err) {
        // Source may already have finished
      }
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
  }

  close(): void {
    this.stopAll();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
