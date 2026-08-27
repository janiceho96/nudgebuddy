export type SoundscapeType = 'none' | 'brown_noise' | 'rain' | 'binaural_40hz' | 'lofi_drone';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'none';
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private volume = 0.5;

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
      case 'brown_noise':
        this.generateBrownNoise();
        break;
      case 'rain':
        this.generateRain();
        break;
      case 'binaural_40hz':
        this.generateBinaural40Hz();
        break;
      case 'lofi_drone':
        this.generateLofiDrone();
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

  private generateBrownNoise() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm deep rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

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

  private generateBinaural40Hz() {
    if (!this.ctx || !this.gainNode) return;

    const baseFreq = 200; // Left ear 200 Hz
    const gammaOffset = 40; // Right ear 240 Hz -> 40Hz Gamma entrainment

    const merger = this.ctx.createChannelMerger(2);

    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + gammaOffset, this.ctx.currentTime);

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscL.start();
    oscR.start();

    this.activeNodes.push(oscL, oscR, merger);
  }

  private generateLofiDrone() {
    if (!this.ctx || !this.gainNode) return;

    const freqs = [130.81, 164.81, 196.00]; // C minor triad
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    freqs.forEach(freq => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(subGain);
      osc.start();
      this.activeNodes.push(osc);
    });

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    subGain.connect(filter);
    filter.connect(this.gainNode);
    this.activeNodes.push(subGain, filter);
  }
}

export const soundscapeEngine = new SoundscapeEngine();
