import test from 'node:test';
import assert from 'node:assert';
import {
  APOLLO_LANDING_SITES,
  LUNAR_LANDMARKS,
  ROBOTIC_LANDERS,
  ALL_LUNAR_LOCATIONS,
  LUNAR_LOCATIONS_MAP,
} from '../data/lunarLandmarks.js';
import { selenographicToCartesian } from './orbitalMath.js';

test('Apollo landing sites dataset integrity', async (t) => {
  await t.test('contains all 6 crewed Apollo landing missions', () => {
    assert.strictEqual(APOLLO_LANDING_SITES.length, 6);
    const missionNames = APOLLO_LANDING_SITES.map((m) => m.mission);
    assert.deepStrictEqual(missionNames, [
      'Apollo 11',
      'Apollo 12',
      'Apollo 14',
      'Apollo 15',
      'Apollo 16',
      'Apollo 17',
    ]);
  });

  await t.test('Apollo 11 has correct astronauts, coordinates, and landing date', () => {
    const apollo11 = APOLLO_LANDING_SITES.find((m) => m.id === 'apollo-11');
    assert.ok(apollo11);
    assert.ok(apollo11.landedAstronauts.some((a) => a.includes('Armstrong')));
    assert.ok(apollo11.landedAstronauts.some((a) => a.includes('Aldrin')));
    assert.strictEqual(apollo11.date, 'July 20, 1969');
    assert.ok(Math.abs(apollo11.selenographic.latitudeDeg - 0.674) < 0.01);
    assert.ok(Math.abs(apollo11.selenographic.longitudeDeg - 23.473) < 0.01);
  });

  await t.test('Apollo 17 has Harrison Schmitt (geologist) and Eugene Cernan', () => {
    const apollo17 = APOLLO_LANDING_SITES.find((m) => m.id === 'apollo-17');
    assert.ok(apollo17);
    assert.ok(apollo17.landedAstronauts.some((a) => a.includes('Cernan')));
    assert.ok(apollo17.landedAstronauts.some((a) => a.includes('Schmitt')));
    assert.strictEqual(apollo17.samplesReturnedKg, 110.52);
  });

  await t.test('All lunar location IDs are unique across unified registry', () => {
    const ids = ALL_LUNAR_LOCATIONS.map((loc) => loc.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size);
    assert.strictEqual(LUNAR_LOCATIONS_MAP.size, ALL_LUNAR_LOCATIONS.length);
  });

  await t.test('selenographicToCartesian converts coordinates onto lunar sphere surface', () => {
    const radius = 0.32;
    for (const loc of ALL_LUNAR_LOCATIONS) {
      const { x, y, z } = selenographicToCartesian(
        loc.selenographic.latitudeDeg,
        loc.selenographic.longitudeDeg,
        radius
      );
      const computedR = Math.sqrt(x * x + y * y + z * z);
      assert.ok(
        Math.abs(computedR - radius) < 1e-4,
        `Expected radius ${radius}, got ${computedR} for ${loc.id}`
      );
    }
  });

  await t.test('Robotic landers include historic pioneers', () => {
    const roboticIds = ROBOTIC_LANDERS.map((r) => r.id);
    assert.ok(roboticIds.includes('luna-2'));
    assert.ok(roboticIds.includes('luna-9'));
    assert.ok(roboticIds.includes('surveyor-3'));
    assert.ok(roboticIds.includes('change-4'));
    assert.ok(roboticIds.includes('chandrayaan-3'));
  });
});
