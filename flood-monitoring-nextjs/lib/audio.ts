/**
 * Realtime Web Audio API Siren Synthesizer for EWS Civil Defense / Flood Warning
 */
class SirenSynthesizer {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private isPlaying: boolean = false;

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Gain master
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      // Primary tone oscillator (sawtooth for penetrating industrial siren timbre)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(700, this.ctx.currentTime);

      // Secondary tone oscillator (sine for body)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(700, this.ctx.currentTime);

      // LFO for frequency sweep (0.5 Hz = 2 seconds per warble cycle)
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.5, this.ctx.currentTime);

      // LFO Gain to modulate pitch between 600Hz and 1000Hz (+/- 200Hz)
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.osc1.frequency);
      lfoGain.connect(this.osc2.frequency);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);

      this.osc1.start();
      this.osc2.start();
      this.lfo.start();

      this.isPlaying = true;
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  public stop() {
    if (!this.isPlaying) return;

    try {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      }
      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.lfo?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.lfo?.disconnect();
          this.ctx?.close();
        } catch (e) {}
        this.osc1 = null;
        this.osc2 = null;
        this.lfo = null;
        this.ctx = null;
        this.isPlaying = false;
      }, 350);
    } catch (e) {
      this.isPlaying = false;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const sirenPlayer = typeof window !== 'undefined' ? new SirenSynthesizer() : null;

