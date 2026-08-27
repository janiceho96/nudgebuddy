export type SoundscapeType = 
  | 'none' 
  | 'jazz_cafe' 
  | 'energetic_jazz' 
  | 'bossa_nova' 
  | 'rainy_lofi_jazz' 
  | 'forest_stream'
  | 'brown_noise'
  | 'rain';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'none';
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private volume = 0.45;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getCurrentType(): SoundscapeType {
    return this.currentType;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  startSoundscape(type: SoundscapeType) {
    this.stopSoundscape();
    if (type === 'none') {
      this.currentType = 'none';
      return;
    }

    this.initCtx();
    if (!this.ctx || !this.gainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.currentType = type;
    this.isPlaying = true;

    switch (type) {
      case 'jazz_cafe':
        this.generateJazzCafe();
        break;
      case 'energetic_jazz':
        this.generateEnergeticJazz();
        break;
      case 'bossa_nova':
        this.generateBossaNova();
        break;
      case 'rainy_lofi_jazz':
        this.generateRainyLofiJazz();
        break;
      case 'forest_stream':
      case 'brown_noise':
        this.generateForestStream();
        break;
      case 'rain':
        this.generateRain();
        break;
    }
  }

  stopSoundscape() {
    this.isPlaying = false;
    this.activeNodes.forEach(node => {
      if (typeof node === 'number') {
        clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.activeNodes = [];
  }

  // 1. ☕ Cozy Midnight Jazz Cafe (Warm Rhodes & Upright Bass)
  private generateJazzCafe() {
    if (!this.ctx || !this.gainNode) return;

    // Jazz Progression: Fmaj9 -> Dm9 -> Gm9 -> C13
    const chords = [
      { bass: 87.31, chord: [174.61, 220.00, 261.63, 329.63, 392.00] }, // Fmaj9
      { bass: 73.42, chord: [146.83, 220.00, 261.63, 349.23, 440.00] }, // Dm9
      { bass: 98.00, chord: [196.00, 233.08, 293.66, 349.23, 440.00] }, // Gm9
      { bass: 65.41, chord: [130.81, 196.00, 246.94, 329.63, 440.00] }  // C13
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const current = chords[chordIdx % chords.length];
      chordIdx++;

      // Play Rhodes Piano notes
      current.chord.forEach((freq, i) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const noteFilter = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

        const now = this.ctx.currentTime + (i * 0.04); // Gentle strum arpeggio
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.09, now + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 3.4);
      });

      // Play Upright Walking Bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();

      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(current.bass, this.ctx.currentTime);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(280, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.gainNode);

      bassOsc.start(now);
      bassOsc.stop(now + 3.0);
    };

    playNextChord();
    const interval = window.setInterval(playNextChord, 3400);
    this.activeNodes.push(interval);
  }

  // 2. 🎷 Energetic Coffeehouse Swing & Bop (Upbeat 116 BPM)
  private generateEnergeticJazz() {
    if (!this.ctx || !this.gainNode) return;

    // Upbeat Jazz Bop Progression: Bbmaj7 -> G7b9 -> Cm7 -> F7#9
    const chords = [
      { bass: 116.54, chord: [233.08, 293.66, 349.23, 440.00] }, // Bbmaj7
      { bass: 98.00, chord: [196.00, 246.94, 293.66, 415.30] },  // G7b9
      { bass: 130.81, chord: [261.63, 311.13, 392.00, 466.16] }, // Cm7
      { bass: 87.31, chord: [174.61, 220.00, 261.63, 415.30] }   // F7#9
    ];

    let beat = 0;
    const playBeat = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const currentChord = chords[Math.floor(beat / 4) % chords.length];
      const stepInMeasure = beat % 4;
      beat++;

      const now = this.ctx.currentTime;

      // Walking Bass on every beat
      const bassNotes = [currentChord.bass, currentChord.bass * 1.25, currentChord.bass * 1.5, currentChord.bass * 1.12];
      const bassFreq = bassNotes[stepInMeasure];

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.14, now + 0.03);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      bassOsc.connect(bassGain);
      bassGain.connect(this.gainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 0.5);

      // Piano Comping on offbeats (Swing feel: beat 1 and beat 3-and)
      if (stepInMeasure === 0 || stepInMeasure === 2) {
        currentChord.chord.forEach((freq, idx) => {
          if (!this.ctx || !this.gainNode) return;
          const osc = this.ctx.createOscillator();
          const chordGain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + 0.05);

          chordGain.gain.setValueAtTime(0.001, now + 0.05);
          chordGain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(chordGain);
          chordGain.connect(this.gainNode);
          osc.start(now + 0.05);
          osc.stop(now + 0.5);
        });
      }
    };

    playBeat();
    const interval = window.setInterval(playBeat, 520); // ~116 BPM swing
    this.activeNodes.push(interval);
  }

  // 3. 🌴 Sunset Bossa Nova & Vibes
  private generateBossaNova() {
    if (!this.ctx || !this.gainNode) return;

    // Bossa Progression: Dmaj9 -> Bm7 -> Em9 -> A13
    const chords = [
      { bass: 73.42, chord: [220.00, 277.18, 329.63, 415.30] }, // Dmaj9
      { bass: 61.74, chord: [185.00, 220.00, 277.18, 370.00] }, // Bm7
      { bass: 82.41, chord: [164.81, 246.94, 293.66, 370.00] }, // Em9
      { bass: 55.00, chord: [164.81, 220.00, 277.18, 370.00] }  // A13
    ];

    let patternIdx = 0;
    const playBossaStep = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const current = chords[Math.floor(patternIdx / 4) % chords.length];
      const now = this.ctx.currentTime;
      patternIdx++;

      // Warm Nylon Guitar / Vibraphone Chords
      current.chord.forEach((freq) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(this.gainNode);
        osc.start(now);
        osc.stop(now + 0.95);
      });

      // Smooth Bossa Bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(current.bass, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.15, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      bassOsc.connect(bassGain);
      bassGain.connect(this.gainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 0.9);
    };

    playBossaStep();
    const interval = window.setInterval(playBossaStep, 800);
    this.activeNodes.push(interval);
  }

  // 4. 🌧️ Tokyo Rainy Cafe & Lo-Fi Jazz Piano
  private generateRainyLofiJazz() {
    this.generateRain();

    if (!this.ctx || !this.gainNode) return;

    const melodyNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic jazz
    const playMelody = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.11, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 2.6);
    };

    const interval = window.setInterval(playMelody, 1600);
    this.activeNodes.push(interval);
  }

  // 5. 🍃 Forest Stream & Soft Wind
  private generateForestStream() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 2.8;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

  // 6. Rain
  private generateRain() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(900, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.8, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, bandpass);
  }
}

export const soundscapeEngine = new SoundscapeEngine();
