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
      case 'energetic_jazz':
        this.generateBlueNoteSwing(128); // 128 BPM
        break;
      case 'coffeehouse_bebop':
        this.generateCoffeehouseBebop(120); // 120 BPM
        break;
      case 'sunday_brunch_jazz':
        this.generateSundayBrunch(110); // 110 BPM
        break;
      case 'bossa_jazz':
        this.generateBossaJazz(124); // 124 BPM
        break;
      case 'lofi_jazz_cafe':
        this.generateLofiJazzCafe();
        break;
      case 'forest_stream':
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

  // --- PERCUSSION & INSTRUMENT SYNTHESIS HELPERS ---

  // 1. Swing Ride Cymbal Tap
  private triggerRideCymbal(time: number, accent = false) {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(8500, time);
    bandpass.Q.setValueAtTime(4.0, time);

    const gain = this.ctx.createGain();
    const peakGain = accent ? 0.05 : 0.025;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(peakGain, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);

    noiseSource.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.gainNode);

    noiseSource.start(time);
    noiseSource.stop(time + 0.24);
  }

  // 2. Hi-Hat Pedal Chick (Beats 2 & 4)
  private triggerHiHat(time: number) {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(6000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.035, time + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

    noiseSource.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.gainNode);

    noiseSource.start(time);
    noiseSource.stop(time + 0.07);
  }

  // 3. Acoustic Upright Walking Bass Pluck
  private triggerBassNote(time: number, freq: number, duration = 0.42) {
    if (!this.ctx || !this.gainNode) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 0.5, time); // Deep sub octave

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(140, time + duration);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.22, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.02);
    osc2.stop(time + duration + 0.02);
  }

  // 4. Acoustic Jazz Piano Chord Comp
  private triggerPianoChord(time: number, freqs: number[], duration = 0.5) {
    if (!this.ctx || !this.gainNode) return;

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, time);
      filter.frequency.exponentialRampToValueAtTime(400, time + duration);

      const noteTime = time + (idx * 0.012); // Natural human strum
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.07, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
    });
  }

  // 5. Vibraphone / Horn Melodic Lead Note
  private triggerLeadNote(time: number, freq: number, duration = 0.35) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // ==========================================
  // 1. 🎷 CLASSIC BLUE NOTE ENERGETIC SWING QUARTET
  // ==========================================
  private generateBlueNoteSwing(bpm = 128) {
    if (!this.ctx || !this.gainNode) return;

    const beatDuration = 60 / bpm; // ~0.47s per beat in 128 BPM
    const swingSub = beatDuration * 0.66; // Swung eighth note

    // Classic 12-Bar Blues in F Major / ii-V-I Progression
    const jazzChords = [
      // Fmaj7 / F6
      { bass: [87.31, 98.00, 110.00, 103.83], piano: [261.63, 329.63, 392.00, 440.00] },
      // D7alt / D7b9
      { bass: [73.42, 82.41, 92.50, 98.00], piano: [246.94, 311.13, 370.00, 415.30] },
      // Gm9 (ii)
      { bass: [98.00, 110.00, 116.54, 123.47], piano: [293.66, 349.23, 440.00, 523.25] },
      // C13 / C7#9 (V)
      { bass: [65.41, 87.31, 98.00, 82.41], piano: [261.63, 329.63, 392.00, 466.16] },
      // Am7
      { bass: [110.00, 123.47, 130.81, 123.47], piano: [261.63, 329.63, 392.00, 493.88] },
      // D7b9
      { bass: [73.42, 87.31, 92.50, 87.31], piano: [246.94, 311.13, 370.00, 415.30] },
      // Gm9
      { bass: [98.00, 116.54, 130.81, 123.47], piano: [293.66, 349.23, 440.00, 523.25] },
      // C7
      { bass: [65.41, 77.78, 87.31, 98.00], piano: [261.63, 329.63, 392.00, 466.16] }
    ];

    // Melodic Solo Pentatonic Licks
    const jazzSoloLicks = [
      [349.23, 392.00, 440.00, 523.25], // F G A C
      [440.00, 466.16, 523.25, 587.33], // A Bb C D
      [523.25, 466.16, 440.00, 349.23], // C Bb A F
      [392.00, 440.00, 466.16, 523.25]  // G A Bb C
    ];

    let beat = 0;
    const playStep = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const measure = Math.floor(beat / 4);
      const beatInMeasure = beat % 4;
      const currentChord = jazzChords[measure % jazzChords.length];
      const now = this.ctx.currentTime;
      beat++;

      // 1. Upright Walking Bass on Every Quarter Beat (1-2-3-4)
      const bassFreq = currentChord.bass[beatInMeasure];
      this.triggerBassNote(now, bassFreq, beatDuration * 0.95);

      // 2. Jazz Ride Cymbal (Swung Pattern: 1, 2-and, 3, 4-and)
      this.triggerRideCymbal(now, beatInMeasure === 0 || beatInMeasure === 2);
      this.triggerRideCymbal(now + swingSub, false);

      // 3. Hi-Hat Pedal on Beats 2 & 4
      if (beatInMeasure === 1 || beatInMeasure === 3) {
        this.triggerHiHat(now);
      }

      // 4. Piano Comping (Charleston & Syncopated Offbeats: Beat 1 and Beat 2-and)
      if (beatInMeasure === 0) {
        this.triggerPianoChord(now, currentChord.piano, beatDuration * 1.4);
      } else if (beatInMeasure === 1) {
        this.triggerPianoChord(now + swingSub, currentChord.piano, beatDuration * 0.8);
      } else if (beatInMeasure === 3 && Math.random() > 0.4) {
        this.triggerPianoChord(now + swingSub, currentChord.piano, beatDuration * 0.7);
      }

      // 5. Occasional Vibraphone Jazz Melody Solo
      if (measure % 2 === 1 && (beatInMeasure === 0 || beatInMeasure === 2)) {
        const lick = jazzSoloLicks[measure % jazzSoloLicks.length];
        const note = lick[Math.floor(Math.random() * lick.length)];
        this.triggerLeadNote(now, note, beatDuration * 1.2);
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
    if (!this.ctx || !this.gainNode) return;

    const beatDuration = 60 / bpm;
    const swingSub = beatDuration * 0.65;

    // Classic Rhythm Changes in Bb Major
    const bebopChords = [
      { bass: [116.54, 130.81, 146.83, 138.59], piano: [233.08, 293.66, 349.23, 440.00] }, // Bbmaj7
      { bass: [98.00, 110.00, 116.54, 123.47], piano: [220.00, 293.66, 370.00, 440.00] },  // G7b9
      { bass: [130.81, 146.83, 155.56, 164.81], piano: [261.63, 311.13, 392.00, 466.16] }, // Cm7
      { bass: [87.31, 98.00, 110.00, 103.83], piano: [261.63, 329.63, 415.30, 466.16] }   // F7#9
    ];

    let beat = 0;
    const playBebop = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const measure = Math.floor(beat / 4);
      const beatInMeasure = beat % 4;
      const chord = bebopChords[measure % bebopChords.length];
      const now = this.ctx.currentTime;
      beat++;

      // Snappy Walking Bass
      this.triggerBassNote(now, chord.bass[beatInMeasure], beatDuration * 0.9);

      // Swing Ride & Hi-hat
      this.triggerRideCymbal(now, true);
      this.triggerRideCymbal(now + swingSub, false);
      if (beatInMeasure === 1 || beatInMeasure === 3) {
        this.triggerHiHat(now);
      }

      // Crisp Stabs
      if (beatInMeasure === 0 || beatInMeasure === 2) {
        this.triggerPianoChord(now, chord.piano, beatDuration * 0.6);
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
    if (!this.ctx || !this.gainNode) return;

    const beatDuration = 60 / bpm;
    const swingSub = beatDuration * 0.67;

    // Warm, joyful Major 9th progression
    const brunchChords = [
      { bass: [130.81, 146.83, 164.81, 146.83], piano: [261.63, 329.63, 392.00, 493.88] }, // Cmaj9
      { bass: [110.00, 123.47, 130.81, 123.47], piano: [261.63, 329.63, 392.00, 440.00] }, // Am9
      { bass: [146.83, 164.81, 174.61, 164.81], piano: [293.66, 349.23, 440.00, 523.25] }, // Dm9
      { bass: [98.00, 110.00, 123.47, 110.00], piano: [246.94, 329.63, 392.00, 440.00] }   // G13
    ];

    let beat = 0;
    const playBrunch = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const measure = Math.floor(beat / 4);
      const beatInMeasure = beat % 4;
      const chord = brunchChords[measure % brunchChords.length];
      const now = this.ctx.currentTime;
      beat++;

      // Gentle walking bass
      this.triggerBassNote(now, chord.bass[beatInMeasure], beatDuration * 0.95);

      // Light brush cymbal
      this.triggerRideCymbal(now, false);
      this.triggerRideCymbal(now + swingSub, false);
      if (beatInMeasure === 1 || beatInMeasure === 3) {
        this.triggerHiHat(now);
      }

      // Warm rolling piano chords
      if (beatInMeasure === 0 || beatInMeasure === 2) {
        this.triggerPianoChord(now, chord.piano, beatDuration * 1.5);
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
    if (!this.ctx || !this.gainNode) return;

    const beatDuration = 60 / bpm;

    const bossaChords = [
      { root: 73.42, fifth: 110.00, piano: [220.00, 277.18, 329.63, 415.30] }, // Dmaj9
      { root: 61.74, fifth: 92.50, piano: [185.00, 220.00, 277.18, 370.00] },  // Bm7
      { root: 82.41, fifth: 123.47, piano: [164.81, 246.94, 293.66, 370.00] }, // Em9
      { root: 55.00, fifth: 82.41, piano: [164.81, 220.00, 277.18, 370.00] }   // A13
    ];

    let step = 0;
    const playBossa = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const measure = Math.floor(step / 8);
      const stepInMeasure = step % 8;
      const chord = bossaChords[measure % bossaChords.length];
      const now = this.ctx.currentTime;
      step++;

      // Bossa Bass (Root on 1, Fifth on 3)
      if (stepInMeasure === 0) {
        this.triggerBassNote(now, chord.root, beatDuration * 1.6);
      } else if (stepInMeasure === 4) {
        this.triggerBassNote(now, chord.fifth, beatDuration * 1.6);
      }

      // Shaker on every eighth note
      this.triggerRideCymbal(now, stepInMeasure % 2 === 0);

      // Classic Bossa Clave Syncopation (1, 1-and, 2-and, 3-and, 4)
      if ([0, 3, 5, 7].includes(stepInMeasure)) {
        this.triggerPianoChord(now, chord.piano, beatDuration * 0.8);
      }
    };

    playBossa();
    const interval = window.setInterval(playBossa, (beatDuration / 2) * 1000);
    this.activeNodes.push(interval);
  }

  // ==========================================
  // 5. 🌧️ LATE NIGHT RAIN & LO-FI JAZZ CAFE
  // ==========================================
  private generateLofiJazzCafe() {
    this.generateRain();

    if (!this.ctx || !this.gainNode) return;

    const melodyNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const playMelody = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const now = this.ctx.currentTime;
      this.triggerLeadNote(now, note, 2.2);
    };

    const interval = window.setInterval(playMelody, 1800);
    this.activeNodes.push(interval);
  }

  // 6. Forest Brook
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

  // 7. Rain
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
