import { AgentPersona } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private speechTimeout: NodeJS.Timeout | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
  }

  // Play pleasant retro synthesized sounds
  playSfx(type: 'pop' | 'ding' | 'boing' | 'fanfare' | 'snooze' | 'alert') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (type) {
        case 'pop':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'boing':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(540, now + 0.12);
          osc.frequency.linearRampToValueAtTime(320, now + 0.22);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
          break;

        case 'ding':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case 'snooze':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.linearRampToValueAtTime(300, now + 0.25);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;

        case 'alert':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.setValueAtTime(450, now + 0.1);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;

        case 'fanfare':
          this.playNote(523.25, now, 0.12);       // C5
          this.playNote(659.25, now + 0.12, 0.12); // E5
          this.playNote(783.99, now + 0.24, 0.3);  // G5
          break;
      }
    } catch {
      // Ignore audio failure
    }
  }

  private playNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.linearRampToValueAtTime(0.01, startTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {}
  }

  // Web Speech API with V8 GC Protection and Deadlock Watchdog
  speakText(text: string, persona: AgentPersona, onStart?: () => void, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      if (this.speechTimeout) clearTimeout(this.speechTimeout);

      // Fix Chromium speech queue hang
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/[*#_~`]/g, '').slice(0, 200); // Protect against huge payloads
      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (persona === 'gentle') {
        utterance.pitch = 1.25;
        utterance.rate = 0.95;
      } else if (persona === 'direct') {
        utterance.pitch = 1.0;
        utterance.rate = 1.1;
      } else {
        utterance.pitch = 1.45;
        utterance.rate = 1.2;
      }

      const cleanup = () => {
        if (this.speechTimeout) clearTimeout(this.speechTimeout);
        delete (window as unknown as { _activeUtterance?: SpeechSynthesisUtterance })._activeUtterance;
        onEnd?.();
      };

      utterance.onstart = () => {
        onStart?.();
        // Safety watchdog: abort if audio hangs for > 8s
        this.speechTimeout = setTimeout(() => {
          this.stopSpeaking();
          cleanup();
        }, 8000);
      };

      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      // Prevent V8 garbage collection mid-speech (major cause of Chrome freezing)
      (window as unknown as { _activeUtterance?: SpeechSynthesisUtterance })._activeUtterance = utterance;

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  stopSpeaking() {
    if (this.speechTimeout) clearTimeout(this.speechTimeout);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const audioEngine = new AudioEngine();
