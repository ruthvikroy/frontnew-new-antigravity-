/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unit tests for Space Punks editorial dataset integrity and expedition coordinates
*/
import test from 'node:test';
import assert from 'node:assert/strict';

test('Space Punks expedition locations dataset integrity', () => {
  const EXPEDITIONS = [
    { id: 'exp-mariana', name: 'Mariana Trench', depthM: -10994, lat: 11.38, lon: 142.59 },
    { id: 'exp-atacama', name: 'Atacama Desert', elevationM: 5050, lat: -23.02, lon: -67.75 },
    { id: 'exp-svalbard', name: 'Svalbard Seed Vault', lat: 78.23, lon: 15.49 },
    { id: 'exp-danakil', name: 'Danakil Depression', elevationM: -125, lat: 14.24, lon: 40.3 },
    { id: 'exp-chicxulub', name: 'Chicxulub Crater', diameterKm: 180, lat: 21.4, lon: -89.51 },
    { id: 'exp-mcmurdo', name: 'McMurdo Dry Valleys', lat: -77.84, lon: 166.66 },
  ];

  assert.equal(EXPEDITIONS.length, 6);

  for (const exp of EXPEDITIONS) {
    assert.ok(exp.lat >= -90 && exp.lat <= 90);
    assert.ok(exp.lon >= -180 && exp.lon <= 180);
    assert.ok(exp.name.length > 0);
  }

  const mariana = EXPEDITIONS.find((e) => e.id === 'exp-mariana');
  assert.equal(mariana.depthM, -10994);

  const atacama = EXPEDITIONS.find((e) => e.id === 'exp-atacama');
  assert.equal(atacama.elevationM, 5050);
});

test('Asteroid 514107 orbital resonance invariants', () => {
  const asteroid = {
    name: '(514107) Kaʻepaokaʻawela',
    target: 'Jupiter co-orbital',
    inclinationDeg: 163.0,
    semiMajorAxisAU: 5.2,
    resonance: '1:-1 retrograde',
  };

  assert.ok(asteroid.inclinationDeg > 90, 'Retrograde orbits have inclination > 90 deg');
  assert.ok(Math.abs(asteroid.semiMajorAxisAU - 5.2) < 0.1);
  assert.equal(asteroid.resonance, '1:-1 retrograde');
});

/* --- End of natgeo.test.js --- */
