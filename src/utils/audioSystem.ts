class ChronoAudioSystem {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicTimer: number | null = null;
  private musicEnabled = true;
  private sfxEnabled = true;
  private masterVolume = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.35 : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.6 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSettings(musicEnabled: boolean, sfxEnabled: boolean, volume: number) {
    this.musicEnabled = musicEnabled;
    this.sfxEnabled = sfxEnabled;
    this.masterVolume = Math.max(0, Math.min(1, volume));

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.35 : 0, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.6 : 0, this.ctx.currentTime);
    }

    if (!musicEnabled && this.isMusicPlaying) {
      this.stopMusic();
    } else if (musicEnabled && !this.isMusicPlaying && this.ctx) {
      this.startMusic();
    }
  }

  public startMusic() {
    this.initContext();
    if (!this.musicEnabled || this.isMusicPlaying || !this.ctx || !this.musicGain) return;
    this.isMusicPlaying = true;
    this.scheduleNextMusicNote();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Ancient Egyptian Phrygian Dominant / Hijaz scale notes (Hz)
  // D3, Eb3, F#3, G3, A3, Bb3, C4, D4
  private hijazScale = [146.83, 155.56, 185.00, 196.00, 220.00, 233.08, 261.63, 293.66, 311.13, 370.00, 392.00, 440.00];

  private scheduleNextMusicNote = () => {
    if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

    try {
      const t = this.ctx.currentTime;
      // Ambient warm drone / temple string pluck
      const freq = this.hijazScale[Math.floor(Math.random() * this.hijazScale.length)];
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(300, t + 2.5);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + 3.2);

      // Low foundation drone occasional
      if (Math.random() > 0.65) {
        const droneOsc = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(73.42, t); // D2
        droneGain.gain.setValueAtTime(0.001, t);
        droneGain.gain.linearRampToValueAtTime(0.08, t + 0.8);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

        droneOsc.connect(droneGain);
        droneGain.connect(this.musicGain);
        droneOsc.start(t);
        droneOsc.stop(t + 4.6);
      }
    } catch {
      // Audio node cleanup
    }

    // Schedule next ambient note after 1.8 - 3.2 seconds
    const nextInterval = 1800 + Math.random() * 1400;
    this.musicTimer = window.setTimeout(this.scheduleNextMusicNote, nextInterval);
  };

  public playTap() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.06);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      // ignore
    }
  }

  public playNumberPlaced() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.12); // E5

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // ignore
    }
  }

  public playErase() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.1);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.11);
    } catch {
      // ignore
    }
  }

  public playMistake() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      // Dissonant low chord
      const freqs = [180, 240, 255];
      freqs.forEach((f) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(t);
        osc.stop(t + 0.36);
      });
    } catch {
      // ignore
    }
  }

  public playHint() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      // Celestial ascending chime sequence
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const noteTime = t + idx * 0.08;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    } catch {
      // ignore
    }
  }

  public playCoin() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, t); // B5
      osc1.frequency.setValueAtTime(1318.51, t + 0.08); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1975.53, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.36);
      osc2.stop(t + 0.36);
    } catch {
      // ignore
    }
  }

  public playArtifact() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      // Royal golden fanfare
      const notes = [293.66, 370.00, 440.00, 587.33, 740.00];
      notes.forEach((freq, i) => {
        const noteTime = t + i * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.25, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(noteTime);
        osc.stop(noteTime + 0.65);
      });
    } catch {
      // ignore
    }
  }

  public playTrapWarning() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.linearRampToValueAtTime(80, t + 0.4);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.46);
    } catch {
      // ignore
    }
  }

  public playTrapExplode() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      // White noise blast + sub rumble
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(80, t + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + 0.52);

      // Low rumble
      const rumble = this.ctx.createOscillator();
      const rGain = this.ctx.createGain();
      rumble.type = 'sine';
      rumble.frequency.setValueAtTime(70, t);
      rumble.frequency.exponentialRampToValueAtTime(30, t + 0.6);
      rGain.gain.setValueAtTime(0.3, t);
      rGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      rumble.connect(rGain);
      rGain.connect(this.sfxGain);
      rumble.start(t);
      rumble.stop(t + 0.62);
    } catch {
      // ignore
    }
  }

  public playVictory() {
    this.initContext();
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    try {
      const t = this.ctx.currentTime;
      // Majestic triumphal chord sequence
      const chord = [293.66, 370.00, 440.00, 587.33]; // D major
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(t);
        osc.stop(t + 1.25);
      });
    } catch {
      // ignore
    }
  }
}

export const audioSystem = new ChronoAudioSystem();
