/**
 * Procedural Space Ambient Sound Generator using Web Audio API.
 * Synthesizes a deep cosmic drone with binaural pulsation, plus telemetry audio blips.
 * 100% procedural, zero external audio assets.
 */
export class SpaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.oscs = [];
    this.filter = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm resonant lowpass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(260, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Sub-bass root drone (55Hz - A1)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime);
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.35, this.ctx.currentTime);
    osc1.connect(gain1);
    gain1.connect(this.filter);
    this.oscs.push(osc1);

    // Binaural beat drone (58Hz - creates a slow 3Hz cosmic pulse)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(58, this.ctx.currentTime);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.28, this.ctx.currentTime);
    osc2.connect(gain2);
    gain2.connect(this.filter);
    this.oscs.push(osc2);

    // Subtle ethereal 5th harmonic (164.8Hz - E3) with gentle detune
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(164.8, this.ctx.currentTime);
    const gain3 = this.ctx.createGain();
    gain3.gain.setValueAtTime(0.08, this.ctx.currentTime);
    osc3.connect(gain3);
    gain3.connect(this.filter);
    this.oscs.push(osc3);

    // LFO for filter cutoff breathing
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.oscs.push(lfo);

    this.oscs.forEach((osc) => {
      try {
        osc.start();
      } catch {
        // ignore
      }
    });
  }

  playBlip() {
    try {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext fallback
    }
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) {
      this.fadeTo(0.001, 1.2);
      this.isPlaying = false;
    } else {
      this.fadeTo(0.35, 2.0);
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  fadeTo(target, duration) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, target), now + duration);
  }

  getStatus() {
    return this.isPlaying;
  }

  dispose() {
    if (this.ctx) {
      this.oscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.ctx.close();
      this.ctx = null;
    }
  }
}
