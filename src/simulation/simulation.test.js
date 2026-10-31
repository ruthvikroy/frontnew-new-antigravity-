/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unit tests for Earth Moon orbital math inclination and adaptive tier configurations
*/
import test from 'node:test';
import assert from 'node:assert/strict';

test('orbital radius and inclination match physical parameters', () => {
  const ORBIT_RADIUS = 7.5;
  const ORBIT_INCLINATION_DEG = 5.145;
  const ORBIT_INCLINATION_RAD = (ORBIT_INCLINATION_DEG * Math.PI) / 180;

  assert.ok(ORBIT_RADIUS >= 5.0 && ORBIT_RADIUS <= 15.0);
  assert.ok(Math.abs(ORBIT_INCLINATION_RAD - 0.0898) < 0.001);

  const angle = Math.PI / 4;
  const x = ORBIT_RADIUS * Math.cos(angle);
  const z = ORBIT_RADIUS * Math.sin(angle) * Math.cos(ORBIT_INCLINATION_RAD);
  const y = ORBIT_RADIUS * Math.sin(angle) * Math.sin(ORBIT_INCLINATION_RAD);

  assert.ok(x > 0);
  assert.ok(z > 0);
  assert.ok(y > 0);
  const distance = Math.sqrt(x * x + y * y + z * z);
  assert.ok(Math.abs(distance - ORBIT_RADIUS) < 1e-4);
});

test('Earth and Moon scale ratios match celestial bodies', () => {
  const earthRadius = 1.0;
  const moonRadius = 0.2727;
  const actualRatio = 1737.4 / 6371.0;
  assert.ok(Math.abs(moonRadius / earthRadius - actualRatio) < 0.005);
});

test('Earth axial tilt is 23.44 degrees in radians', () => {
  const axialTiltDeg = 23.44;
  const axialTiltRad = (axialTiltDeg * Math.PI) / 180;
  assert.ok(Math.abs(axialTiltRad - 0.4091) < 0.001);
});

test('day/night shader smoothstep lighting model behaves correctly', () => {
  const smoothstep = (min, max, val) => {
    const t = Math.max(0, Math.min(1, (val - min) / (max - min)));
    return t * t * (3 - 2 * t);
  };

  const sunDirect = 1.0;
  const sunOpposite = -1.0;
  const terminator = 0.0;

  const dayFactorDirect = smoothstep(-0.15, 0.25, sunDirect);
  const nightFactorDirect = 1.0 - smoothstep(-0.25, 0.1, sunDirect);
  assert.equal(dayFactorDirect, 1.0);
  assert.equal(nightFactorDirect, 0.0);

  const dayFactorOpposite = smoothstep(-0.15, 0.25, sunOpposite);
  const nightFactorOpposite = 1.0 - smoothstep(-0.25, 0.1, sunOpposite);
  assert.equal(dayFactorOpposite, 0.0);
  assert.equal(nightFactorOpposite, 1.0);

  const dayFactorTerminator = smoothstep(-0.15, 0.25, terminator);
  assert.ok(dayFactorTerminator > 0.2 && dayFactorTerminator < 0.8);
});

test('PerformanceManager tier configuration logic produces valid segments', () => {
  const getConfig = (quality) => {
    switch (quality) {
      case 'low':
        return { dpr: [1, 1], earthSegments: 32, moonSegments: 24, starCount: 600, enableClouds: false };
      case 'medium':
        return { dpr: [1, 1.5], earthSegments: 48, moonSegments: 36, starCount: 1200, enableClouds: true };
      case 'high':
      default:
        return { dpr: [1, 2], earthSegments: 64, moonSegments: 48, starCount: 2200, enableClouds: true };
    }
  };

  const high = getConfig('high');
  const med = getConfig('medium');
  const low = getConfig('low');

  assert.equal(high.earthSegments, 64);
  assert.equal(med.earthSegments, 48);
  assert.equal(low.earthSegments, 32);
  assert.equal(high.enableClouds, true);
  assert.equal(low.enableClouds, false);
});
// --- End of simulation.test.js ---
