export type SoundscapeType = 
  | 'none' 
  | 'energetic_jazz' 
  | 'coffeehouse_bebop' 
  | 'sunday_brunch_jazz' 
  | 'bossa_jazz' 
  | 'lofi_jazz_cafe'
  | 'forest_stream'
  | 'rain';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'none';
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private volume = 0.35;

  private initCtx() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.gainNode = this.ctx.createGain();
          this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
          this.gainNode.connect(this.ctx.destination);
        }
      }
    } catch (err) {
      console.warn('Web Audio init error:', err);
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
      }
    } catch {
      // ignore
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

    try {
      this.initCtx();
      if (!this.ctx || !this.gainNode) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      this.currentType = type;
      this.isPlaying = true;

      switch (type) {
        case 'energetic_jazz':
          this.generateBlueNoteSwing(128);
          break;
        case 'coffeehouse_bebop':
          this.generateCoffeehouseBebop(120);
          break;
        case 'sunday_brunch_jazz':
          this.generateSundayBrunch(110);
          break;
        case 'bossa_jazz':
          this.generateBossaJazz(124);
          break;
        case 'lofi_jazz_cafe':
          this.generateMidnightLounge();
          break;
        case 'forest_stream':
          this.generateForestStream();
          break;
        case 'rain':
          this.generateForestStream();
          break;
      }
    } catch (err) {
      console.warn('Failed to start soundscape:', err);
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

  // --- SAFE RESILIENT INSTRUMENT SYNTHESIS HELPERS ---

  // 1. Swing Ride Cymbal Tap
  private triggerRideCymbal(time: number, accent = false) {
    try {
      if (!this.ctx || !this.gainNode) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(8000, time);
      bandpass.Q.setValueAtTime(3.5, time);

      const gain = this.ctx.createGain();
      const peakGain = accent ? 0.04 : 0.02;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.008);
      gain.gain.linearRampToValueAtTime(0.0001, time + 0.16);

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.gainNode);

      noiseSource.start(time);
      noiseSource.stop(time + 0.18);
    } catch {
      // safe ignore
    }
  }

  // 2. Hi-Hat Pedal Chick (Beats 2 & 4)
  private triggerHiHat(time: number) {
    try {
      if (!this.ctx || !this.gainNode) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(6500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.025, time + 0.004);
      gain.gain.linearRampToValueAtTime(0.0001, time + 0.05);

      noiseSource.connect(highpass);
      highpass.connect(gain);
      gain.connect(this.gainNode);

      noiseSource.start(time);
      noiseSource.stop(time + 0.06);
    } catch {
      // safe ignore
    }
  }

  // 3. Acoustic Upright Walking Bass Pluck
  private triggerBassNote(time: number, freq: number, duration = 0.4) {
    try {
      if (!this.ctx || !this.gainNode) return;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 0.5, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, time);
      filter.frequency.linearRampToValueAtTime(140, time + duration);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
      gain.gain.linearRampToValueAtTime(0.0001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.02);
      osc2.stop(time + duration + 0.02);
    } catch {
      // safe ignore
    }
  }

  // 4. Acoustic Jazz Piano Chord Comp
  private triggerPianoChord(time: number, freqs: number[], duration = 0.5) {
    try {
      if (!this.ctx || !this.gainNode) return;
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, time);
        filter.frequency.linearRampToValueAtTime(400, time + duration);

        const noteTime = time + (idx * 0.012);
        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.06, noteTime + 0.02);
        gain.gain.linearRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.gainNode);

        osc.start(noteTime);
        osc.stop(noteTime + duration + 0.03);
      });
    } catch {
      // safe ignore
    }
  }

  // 5. Vibraphone / Horn Melodic Lead Note
  private triggerLeadNote(time: number, freq: number, duration = 0.35) {
    try {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.09, time + 0.02);
      gain.gain.linearRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(time);
      osc.stop(time + duration + 0.03);
    } catch {
      // safe ignore
    }
  }

  // ==========================================
  // 1. 🎷 CLASSIC BLUE NOTE ENERGETIC SWING QUARTET
  // ==========================================
  private generateBlueNoteSwing(bpm = 128) {
    const beatDuration = 60 / bpm;
    const swingSub = beatDuration * 0.66;

    const jazzChords = [
      { bass: [87.31, 98.00, 110.00, 103.83], piano: [261.63, 329.63, 392.00, 440.00] },
      { bass: [73.42, 82.41, 92.50, 98.00], piano: [246.94, 311.13, 370.00, 415.30] },
      { bass: [98.00, 110.00, 116.54, 123.47], piano: [293.66, 349.23, 440.00, 523.25] },
      { bass: [65.41, 87.31, 98.00, 82.41], piano: [261.63, 329.63, 392.00, 466.16] },
      { bass: [110.00, 123.47, 130.81, 123.47], piano: [261.63, 329.63, 392.00, 493.88] },
      { bass: [73.42, 87.31, 92.50, 87.31], piano: [246.94, 311.13, 370.00, 415.30] },
      { bass: [98.00, 116.54, 130.81, 123.47], piano: [293.66, 349.23, 440.00, 523.25] },
      { bass: [65.41, 77.78, 87.31, 98.00], piano: [261.63, 329.63, 392.00, 466.16] }
    ];

    const jazzSoloLicks = [
      [349.23, 392.00, 440.00, 523.25],
      [440.00, 466.16, 523.25, 587.33],
      [523.25, 466.16, 440.00, 349.23],
      [392.00, 440.00, 466.16, 523.25]
    ];

    let beat = 0;
    const playStep = () => {
      try {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const measure = Math.floor(beat / 4);
        const beatInMeasure = beat % 4;
        const currentChord = jazzChords[measure % jazzChords.length];
        const now = this.ctx.currentTime;
        beat++;

        // Upright Walking Bass
        this.triggerBassNote(now, currentChord.bass[beatInMeasure], beatDuration * 0.95);

        // Ride Cymbal & Hi-Hat
        this.triggerRideCymbal(now, beatInMeasure === 0 || beatInMeasure === 2);
        this.triggerRideCymbal(now + swingSub, false);
        if (beatInMeasure === 1 || beatInMeasure === 3) {
          this.triggerHiHat(now);
        }

        // Piano Comping
        if (beatInMeasure === 0) {
          this.triggerPianoChord(now, currentChord.piano, beatDuration * 1.3);
        } else if (beatInMeasure === 1) {
          this.triggerPianoChord(now + swingSub, currentChord.piano, beatDuration * 0.8);
        }

        // Vibraphone Lick
        if (measure % 2 === 1 && (beatInMeasure === 0 || beatInMeasure === 2)) {
          const lick = jazzSoloLicks[measure % jazzSoloLicks.length];
          const note = lick[Math.floor(Math.random() * lick.length)];
          this.triggerLeadNote(now, note, beatDuration * 1.1);
        }
      } catch {
        // safe ignore
      }
    };

    playStep();
    const interval = window.setInterval(playStep, beatDuration * 1000);
    this.activeNodes.push(interval);
  }

  // ==========================================
  // 2. ☕ UPTOWN COFFEEHOUSE BEBOP (120 BPM)
  // ==========================================
  private generateCoffeehouseBebop(bpm = 120) {
    const beatDuration = 60 / bpm;
    const swingSub = beatDuration * 0.65;

    const bebopChords = [
      { bass: [116.54, 130.81, 146.83, 138.59], piano: [233.08, 293.66, 349.23, 440.00] },
      { bass: [98.00, 110.00, 116.54, 123.47], piano: [220.00, 293.66, 370.00, 440.00] },
      { bass: [130.81, 146.83, 155.56, 164.81], piano: [261.63, 311.13, 392.00, 466.16] },
      { bass: [87.31, 98.00, 110.00, 103.83], piano: [261.63, 329.63, 415.30, 466.16] }
    ];

    let beat = 0;
    const playBebop = () => {
      try {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const measure = Math.floor(beat / 4);
        const beatInMeasure = beat % 4;
        const chord = bebopChords[measure % bebopChords.length];
        const now = this.ctx.currentTime;
        beat++;

        this.triggerBassNote(now, chord.bass[beatInMeasure], beatDuration * 0.9);
        this.triggerRideCymbal(now, true);
        this.triggerRideCymbal(now + swingSub, false);
        if (beatInMeasure === 1 || beatInMeasure === 3) {
          this.triggerHiHat(now);
        }
        if (beatInMeasure === 0 || beatInMeasure === 2) {
          this.triggerPianoChord(now, chord.piano, beatDuration * 0.6);
        }
      } catch {
        // safe ignore
      }
    };

    playBebop();
    const interval = window.setInterval(playBebop, beatDuration * 1000);
    this.activeNodes.push(interval);
  }

  // ==========================================
  // 3. 🥐 SUNDAY MORNING JAZZ BRUNCH (110 BPM)
  // ==========================================
  private generateSundayBrunch(bpm = 110) {
    const beatDuration = 60 / bpm;
    const swingSub = beatDuration * 0.67;

    const brunchChords = [
      { bass: [130.81, 146.83, 164.81, 146.83], piano: [261.63, 329.63, 392.00, 493.88] },
      { bass: [110.00, 123.47, 130.81, 123.47], piano: [261.63, 329.63, 392.00, 440.00] },
      { bass: [146.83, 164.81, 174.61, 164.81], piano: [293.66, 349.23, 440.00, 523.25] },
      { bass: [98.00, 110.00, 123.47, 110.00], piano: [246.94, 329.63, 392.00, 440.00] }
    ];

    let beat = 0;
    const playBrunch = () => {
      try {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const measure = Math.floor(beat / 4);
        const beatInMeasure = beat % 4;
        const chord = brunchChords[measure % brunchChords.length];
        const now = this.ctx.currentTime;
        beat++;

        this.triggerBassNote(now, chord.bass[beatInMeasure], beatDuration * 0.95);
        this.triggerRideCymbal(now, false);
        this.triggerRideCymbal(now + swingSub, false);
        if (beatInMeasure === 1 || beatInMeasure === 3) {
          this.triggerHiHat(now);
        }
        if (beatInMeasure === 0 || beatInMeasure === 2) {
          this.triggerPianoChord(now, chord.piano, beatDuration * 1.4);
        }
      } catch {
        // safe ignore
      }
    };

    playBrunch();
    const interval = window.setInterval(playBrunch, beatDuration * 1000);
    this.activeNodes.push(interval);
  }

  // ==========================================
  // 4. 🌴 IPANEMA BOSSA NOVA JAZZ (124 BPM)
  // ==========================================
  private generateBossaJazz(bpm = 124) {
    const beatDuration = 60 / bpm;
    const bossaChords = [
      { root: 73.42, fifth: 110.00, piano: [220.00, 277.18, 329.63, 415.30] },
      { root: 61.74, fifth: 92.50, piano: [185.00, 220.00, 277.18, 370.00] },
      { root: 82.41, fifth: 123.47, piano: [164.81, 246.94, 293.66, 370.00] },
      { root: 55.00, fifth: 82.41, piano: [164.81, 220.00, 277.18, 370.00] }
    ];

    let step = 0;
    const playBossa = () => {
      try {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const measure = Math.floor(step / 8);
        const stepInMeasure = step % 8;
        const chord = bossaChords[measure % bossaChords.length];
        const now = this.ctx.currentTime;
        step++;

        if (stepInMeasure === 0) {
          this.triggerBassNote(now, chord.root, beatDuration * 1.5);
        } else if (stepInMeasure === 4) {
          this.triggerBassNote(now, chord.fifth, beatDuration * 1.5);
        }

        this.triggerRideCymbal(now, stepInMeasure % 2 === 0);

        if ([0, 3, 5, 7].includes(stepInMeasure)) {
          this.triggerPianoChord(now, chord.piano, beatDuration * 0.8);
        }
      } catch {
        // safe ignore
      }
    };

    playBossa();
    const interval = window.setInterval(playBossa, (beatDuration / 2) * 1000);
    this.activeNodes.push(interval);
  }

  // ==========================================
  // 5. 🌙 MIDNIGHT JAZZ LOUNGE (RHODES)
  // ==========================================
  private generateMidnightLounge() {
    const loungeChords = [
      { bass: 77.78, chord: [155.56, 196.00, 233.08, 293.66, 349.23] },
      { bass: 65.41, chord: [130.81, 196.00, 233.08, 311.13, 392.00] },
      { bass: 87.31, chord: [174.61, 207.65, 261.63, 311.13, 392.00] },
      { bass: 58.27, chord: [116.54, 174.61, 233.08, 293.66, 370.00] }
    ];

    let chordIdx = 0;
    const playLoungeStep = () => {
      try {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const current = loungeChords[chordIdx % loungeChords.length];
        const now = this.ctx.currentTime;
        chordIdx++;

        this.triggerBassNote(now, current.bass, 3.0);

        current.chord.forEach((freq, idx) => {
          if (!this.ctx || !this.gainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + (idx * 0.03));

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1100, now);

          const noteTime = now + (idx * 0.03);
          gain.gain.setValueAtTime(0.0001, noteTime);
          gain.gain.linearRampToValueAtTime(0.07, noteTime + 0.06);
          gain.gain.linearRampToValueAtTime(0.0001, noteTime + 2.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.gainNode);

          osc.start(noteTime);
          osc.stop(noteTime + 3.0);
        });
      } catch {
        // safe ignore
      }
    };

    playLoungeStep();
    const interval = window.setInterval(playLoungeStep, 3400);
    this.activeNodes.push(interval);
  }

  // 6. Forest Brook
  private generateForestStream() {
    try {
      if (!this.ctx || !this.gainNode) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 2.4;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(340, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      whiteNoise.start();

      this.activeNodes.push(whiteNoise, filter);
    } catch {
      // safe ignore
    }
  }
}

export const soundscapeEngine = new SoundscapeEngine();
