import test from 'node:test';
import assert from 'node:assert/strict';

test('moon orbital coordinates match circular inclination formula', () => {
  const radius = 2.15;
  const incDeg = 5.14;
  const incRad = incDeg * (Math.PI / 180);
  const angle = 0.5 * Math.PI;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle) * Math.sin(incRad) * radius;

  assert.ok(Math.abs(x) < 1e-5);
  assert.ok(Math.abs(z - 2.15) < 1e-5);
  assert.ok(Math.abs(y - 2.15 * Math.sin(incRad)) < 1e-5);
  assert.ok(y > 0.18 && y < 0.21);
});

test('day/night terminator smoothstep thresholds', () => {
  const smoothstep = (min, max, value) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  // Full day side (sunDot = 0.8)
  const daySunDot = 0.8;
  const dayFactor = smoothstep(-0.10, 0.14, daySunDot);
  const nightFactor = 1.0 - smoothstep(-0.18, 0.05, daySunDot);
  assert.equal(dayFactor, 1.0);
  assert.equal(nightFactor, 0.0);

  // Full night side (sunDot = -0.8)
  const nightSunDot = -0.8;
  const dayFactorNight = smoothstep(-0.10, 0.14, nightSunDot);
  const nightFactorNight = 1.0 - smoothstep(-0.18, 0.05, nightSunDot);
  assert.equal(dayFactorNight, 0.0);
  assert.equal(nightFactorNight, 1.0);
});

test('camera view presets provide appropriate distances and bounds', () => {
  const PRESETS = {
    overview: { pos: [0.5, 0.25, 4.0], lookAt: [0.35, 0, 0] },
    earth: { pos: [0.0, 0.1, 1.95], lookAt: [0, 0, 0] },
    orbit: { pos: [0.3, 4.3, 3.4], lookAt: [0, 0, 0] },
    mars: { pos: [0.55, 0.25, 1.25], lookAt: [0, 0, 0] },
  };

  const overviewDist = Math.hypot(...PRESETS.overview.pos);
  assert.ok(overviewDist > 3.0 && overviewDist < 4.5);

  const earthDist = Math.hypot(...PRESETS.earth.pos);
  assert.ok(earthDist > 1.8 && earthDist < 2.2);

  assert.ok(PRESETS.orbit.pos[1] > 4.0);
  assert.ok(PRESETS.mars.pos[2] > 1.0);
});

test('mars orbital coordinates and inclination formula', () => {
  const radius = 4.6;
  const incDeg = 1.85;
  const incRad = incDeg * (Math.PI / 180);
  const angle = 0.5 * Math.PI;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle) * Math.sin(incRad) * radius;

  assert.ok(Math.abs(x) < 1e-5);
  assert.ok(Math.abs(z - 4.6) < 1e-5);
  assert.ok(Math.abs(y - 4.6 * Math.sin(incRad)) < 1e-5);
  assert.ok(y > 0.14 && y < 0.16);
});

test('mars physical proportional radius relative to Earth', () => {
  const earthRadiusKm = 6371;
  const marsRadiusKm = 3389.5;
  const ratio = marsRadiusKm / earthRadiusKm;
  assert.ok(Math.abs(ratio - 0.532) < 0.005);
});
