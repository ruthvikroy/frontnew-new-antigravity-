import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAxialRotation,
  calculateSubsolarPoint,
  calculateMarsPhase,
  calculateOrbitalPosition,
  calculateTumble,
  formatTelemetryTime,
  formatMarsSolTime,
  computeCloudDriftOffset,
  MARS_AXIAL_TILT_RAD,
  MARS_ATMOSPHERE_CONFIG,
  MARS_3D_TEXTURE_MODES,
  areographicToCartesian,
  MARS_LANDMARKS,
  NASA_MARS_VIDEO_META,
  GENAI_SAFETY_SETTINGS,
} from './orbitalMath.js';

test('calculateAxialRotation calculates linear progress and wraps at 2π', () => {
  const period = 100;
  assert.equal(calculateAxialRotation(0, 1, period), 0);
  const half = calculateAxialRotation(50, 1, period);
  assert.ok(Math.abs(half - Math.PI) < 1e-5);
  const full = calculateAxialRotation(100, 1, period);
  assert.ok(Math.abs(full) < 1e-5);
});

test('calculateSubsolarPoint produces bounded coordinates within Martian 25.19° axial tilt', () => {
  const coord = calculateSubsolarPoint(Math.PI / 2, 0);
  assert.ok(coord.longitudeDeg >= -180 && coord.longitudeDeg <= 180);
  const maxLat = (MARS_AXIAL_TILT_RAD * 180) / Math.PI;
  assert.ok(Math.abs(maxLat - 25.19) < 0.01);
  assert.ok(Math.abs(coord.latitudeDeg - 25.19) < 0.05);
});

test('calculateMarsPhase returns accurate illumination fraction and Martian phase descriptors', () => {
  const full = calculateMarsPhase(0, 0);
  assert.equal(full.illuminationFraction, 1.0);
  assert.equal(full.phaseName, 'Opposition (Full Disk)');

  const conjunction = calculateMarsPhase(Math.PI, 0);
  assert.equal(conjunction.illuminationFraction, 0.0);
  assert.equal(conjunction.phaseName, 'Solar Conjunction (Limb Halo)');

  const quadrature = calculateMarsPhase(Math.PI / 2, 0);
  assert.ok(Math.abs(quadrature.illuminationFraction - 0.5) < 0.02);
  assert.equal(quadrature.phaseName, 'Eastern Quadrature');
});

test('calculateOrbitalPosition generates non-zero 3D coordinates for Phobos/Odyssey orbits', () => {
  const orbit = {
    semiMajorAxis: 5.2,
    eccentricity: 0.015,
    inclinationRad: 0.02,
    longitudeOfAscendingNodeRad: 0.1,
    argumentOfPeriapsisRad: 0.3,
    meanMotion: 0.12,
  };

  const pos0 = calculateOrbitalPosition(orbit, 0);
  const pos10 = calculateOrbitalPosition(orbit, 10);

  const dist0 = Math.hypot(pos0.x, pos0.y, pos0.z);
  assert.ok(dist0 > 4.8 && dist0 < 5.6);
  assert.notDeepEqual(pos0, pos10);
});

test('calculateTumble updates rotational orientation predictably', () => {
  const currentRot = { x: 0, y: 1.0, z: 2.0 };
  const angularVel = { x: 0.5, y: -0.2, z: 1.0 };
  const dt = 2;

  const nextRot = calculateTumble(currentRot, angularVel, dt);
  assert.ok(Math.abs(nextRot.x - 1.0) < 1e-4);
  assert.ok(Math.abs(nextRot.y - 0.6) < 1e-4);
  assert.ok(Math.abs(nextRot.z - 4.0) < 1e-4);
});

test('formatTelemetryTime and formatMarsSolTime format mission clocks accurately', () => {
  assert.equal(formatTelemetryTime(0), '00:00.00');
  assert.equal(formatTelemetryTime(65.42), '01:05.42');
  const solStr = formatMarsSolTime(0, 140);
  assert.ok(solStr.startsWith('SOL 1218'));
  assert.ok(solStr.endsWith('MTC'));
});

test('areographicToCartesian maps poles and equator properly on Mars sphere', () => {
  const northPole = areographicToCartesian(90, 0, 3.0);
  assert.ok(Math.abs(northPole.x) < 1e-4);
  assert.ok(Math.abs(northPole.y - 3.0) < 1e-4);
  assert.ok(Math.abs(northPole.z) < 1e-4);

  const prime = areographicToCartesian(0, 0, 3.0);
  assert.ok(Math.abs(prime.x) < 1e-4);
  assert.ok(Math.abs(prime.y) < 1e-4);
  assert.ok(Math.abs(prime.z - 3.0) < 1e-4);

  const testPoint = areographicToCartesian(18.38, 77.58, 3.0);
  const mag = Math.hypot(testPoint.x, testPoint.y, testPoint.z);
  assert.ok(Math.abs(mag - 3.0) < 1e-4);
});

test('computeCloudDriftOffset and MARS_ATMOSPHERE_CONFIG model thin atmosphere and drifting clouds', () => {
  assert.ok(MARS_ATMOSPHERE_CONFIG.cloudLayerRadiusRatio > 1.0);
  assert.ok(MARS_ATMOSPHERE_CONFIG.cloudLayerRadiusRatio < MARS_ATMOSPHERE_CONFIG.outerHaloRadiusRatio);

  const drift0 = computeCloudDriftOffset(0, 1.0, 0);
  const drift25 = computeCloudDriftOffset(25, 1.5, 0.4);
  assert.equal(drift0.zonalPhaseRad, 0);
  assert.ok(drift25.zonalPhaseRad > 0);
  assert.ok(drift25.windVelocityMps > drift0.windVelocityMps);

  assert.equal(MARS_3D_TEXTURE_MODES.length, 4);
  const modeIds = MARS_3D_TEXTURE_MODES.map(m => m.id);
  assert.deepEqual(modeIds, [
    'global-mola',
    'zcam-stereo-dem',
    'jezero-strata',
    'scam-rmi-micro',
  ]);
});

test('MARS_LANDMARKS and NASA_MARS_VIDEO_META reference all uploaded NASA images and Q_P0swqaZDk', () => {
  const ids = MARS_LANDMARKS.map(l => l.id);
  assert.ok(ids.includes('valles-marineris'));
  assert.ok(ids.includes('jezero-perseverance'));
  assert.ok(ids.includes('gale-curiosity'));
  assert.ok(ids.includes('planum-australe-odyssey'));
  assert.ok(ids.includes('olympus-tharsis'));
  assert.ok(ids.includes('chryse-horizon'));

  const images = MARS_LANDMARKS.map(l => l.referenceImage);
  assert.ok(images.includes('/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp'));
  assert.ok(images.includes('/assets/aistudio/pia26344-1600x_c40461b6.webp'));
  assert.ok(
    images.includes(
      '/assets/aistudio/32322_mars-curiosity-rover-msl-horizon-sky-self-portrait-PIA19808-full_d447c1a3.jpg'
    )
  );
  assert.ok(images.includes('/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp'));

  assert.equal(NASA_MARS_VIDEO_META.videoId, 'Q_P0swqaZDk');
  assert.equal(NASA_MARS_VIDEO_META.startSeconds, 27);
  assert.ok(GENAI_SAFETY_SETTINGS.every(s => s.threshold === 'BLOCK_NONE'));
});
