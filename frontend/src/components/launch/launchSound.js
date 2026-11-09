// Launch ceremony sound effects, synthesised with the Web Audio API (no audio files).
// Browsers only allow audio after a user gesture, so call unlock() from the
// LAUNCH click or key press before anything else.

export function createLaunchSound() {
  let ctx = null;
  let master = null;
  let noiseBuf = null;
  let muted = false;

  const unlock = () => {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;
    master.connect(comp).connect(ctx.destination);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  };

  const ready = () => ctx && !muted;

  const env = (gainNode, t, peak, attack, release) => {
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.exponentialRampToValueAtTime(peak, t + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  };

  const noise = (t, { type = "lowpass", freq = 1000, q = 1, peak = 0.5, attack = 0.005, release = 0.3, freqTo } = {}) => {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, t + attack + release);
    f.Q.value = q;
    const g = ctx.createGain();
    env(g, t, peak, attack, release);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random());
    src.stop(t + attack + release + 0.05);
  };

  const tone = (t, { type = "sine", freq = 440, freqTo, peak = 0.3, attack = 0.005, release = 0.4 } = {}) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (freqTo) o.frequency.exponentialRampToValueAtTime(freqTo, t + attack + release);
    const g = ctx.createGain();
    env(g, t, peak, attack, release);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + attack + release + 0.05);
  };

  return {
    unlock,
    setMuted(m) {
      muted = m;
      if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.05);
    },
    // Button press: a quick "power up" sweep.
    charge() {
      if (!ready()) return;
      const t = ctx.currentTime;
      tone(t, { type: "sawtooth", freq: 80, freqTo: 320, peak: 0.08, attack: 0.05, release: 0.8 });
      noise(t, { type: "bandpass", freq: 300, freqTo: 2500, q: 2, peak: 0.25, attack: 0.3, release: 0.5 });
    },
    // Rising whoosh under the whole countdown.
    riser(seconds) {
      if (!ready()) return;
      const t = ctx.currentTime;
      noise(t, { type: "bandpass", freq: 200, freqTo: 4000, q: 3, peak: 0.35, attack: seconds, release: 0.15 });
      tone(t, { type: "triangle", freq: 110, freqTo: 440, peak: 0.07, attack: seconds, release: 0.1 });
    },
    // Countdown beat: deep thump plus a bright ping; `level` 1..3 gets higher and louder.
    beat(level) {
      if (!ready()) return;
      const t = ctx.currentTime;
      tone(t, { freq: 120, freqTo: 45, peak: 0.6 + level * 0.1, attack: 0.004, release: 0.35 });
      tone(t, { freq: 660 * Math.pow(1.26, level - 1), peak: 0.18, attack: 0.004, release: 0.5 });
    },
    // Ignition: sub boom, noise blast and a shimmer of bells.
    boom() {
      if (!ready()) return;
      const t = ctx.currentTime;
      tone(t, { freq: 90, freqTo: 28, peak: 1, attack: 0.005, release: 1.8 });
      noise(t, { type: "lowpass", freq: 1800, freqTo: 120, peak: 0.9, attack: 0.005, release: 1.6 });
      noise(t, { type: "highpass", freq: 3000, peak: 0.25, attack: 0.002, release: 0.25 });
      [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) =>
        tone(t + 0.15 + i * 0.09, { type: "triangle", freq: f, peak: 0.07, attack: 0.01, release: 1.4 }),
      );
    },
    // Firework burst: a soft pop with crackle.
    pop() {
      if (!ready()) return;
      const t = ctx.currentTime;
      noise(t, { type: "lowpass", freq: 900 + Math.random() * 600, freqTo: 100, peak: 0.35, attack: 0.003, release: 0.5 });
      for (let i = 0; i < 6; i++)
        noise(t + 0.15 + Math.random() * 0.5, { type: "highpass", freq: 4000, peak: 0.06, attack: 0.001, release: 0.04 });
    },
    destroy() {
      ctx?.close();
      ctx = null;
    },
  };
}
