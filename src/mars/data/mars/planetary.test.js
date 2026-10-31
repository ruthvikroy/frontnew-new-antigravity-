import test from 'node:test';
import assert from 'node:assert/strict';
import { MARS_PLANETARY_CONSTANTS } from './planetaryConstants.js';
import { latLonToOblateVector3, vector3ToLatLon, calculateGreatCircleDistanceKm } from './coordinateSystem.js';
import { getMolaElevation, getMolaHypsometricColor, greatCircleDistanceKm } from './elevationData.js';
import { MARS_GEOLOGICAL_FEATURES } from './geologicalFeatures.js';

test('Mars planetary constants match official IAU/NASA values', () => {
  assert.equal(MARS_PLANETARY_CONSTANTS.EQUATORIAL_RADIUS_KM, 3396.2);
  assert.equal(MARS_PLANETARY_CONSTANTS.POLAR_RADIUS_KM, 3376.2);
  assert.equal(MARS_PLANETARY_CONSTANTS.MEAN_RADIUS_KM, 3389.5);
  assert.equal(MARS_PLANETARY_CONSTANTS.LOWEST_ELEVATION_KM, -8.2);
  assert.equal(MARS_PLANETARY_CONSTANTS.HIGHEST_ELEVATION_KM, 21.9);
  assert.ok(Math.abs(MARS_PLANETARY_CONSTANTS.AXIAL_TILT_DEG - 25.19) < 0.01);
});

test('MOLA elevation returns Olympus Mons peak near ~21.9 km', () => {
  const elev = getMolaElevation(18.65, -133.8);
  assert.ok(elev > 18.0 && elev <= 21.9, `Olympus Mons peak elevation ${elev} km`);
});

test('MOLA elevation returns Hellas Planitia floor near -8.2 km', () => {
  const elev = getMolaElevation(-42.7, 70.0);
  assert.ok(elev >= -8.2 && elev < -6.0, `Hellas Planitia floor elevation ${elev} km`);
});

test('MOLA elevation reflects planetary crustal dichotomy', () => {
  // Southern cratered highlands (e.g. Terra Sabaea)
  const highlandElev = getMolaElevation(-20.0, 30.0);
  // Northern volcanic lowlands (e.g. Vastitas Borealis)
  const lowlandElev = getMolaElevation(65.0, 30.0);
  assert.ok(highlandElev > lowlandElev, `Highlands ${highlandElev} km > Lowlands ${lowlandElev} km`);
});

test('MOLA hypsometric color ramp returns scientific colors across elevations', () => {
  const hellasColor = getMolaHypsometricColor(-8.2);
  assert.ok(hellasColor.b > hellasColor.r, 'Deep basin has blue/violet prominence');

  const summitColor = getMolaHypsometricColor(21.9);
  assert.ok(summitColor.r > 0.9 && summitColor.g > 0.9 && summitColor.b > 0.9, 'Summit color is near snow-white');
});

test('latLonToOblateVector3 compresses polar axis by flattening ratio', () => {
  const [eqX, eqY, eqZ] = latLonToOblateVector3(0, 0, 3.0, 0, 1.0);
  const [polX, polY, polZ] = latLonToOblateVector3(90, 0, 3.0, 0, 1.0);

  // At equator, length on XZ plane is 3.0
  assert.ok(Math.abs(Math.hypot(eqX, eqZ) - 3.0) < 0.001);
  // At pole, length along Y axis is flattened by 3376.2 / 3396.2 (~2.9823)
  assert.ok(Math.abs(polY - 3.0 * (3376.2 / 3396.2)) < 0.001);
});

test('MARS_GEOLOGICAL_FEATURES contains all major authentic landmarks', () => {
  const ids = MARS_GEOLOGICAL_FEATURES.map((f) => f.id);
  assert.ok(ids.includes('olympus_mons'));
  assert.ok(ids.includes('valles_marineris'));
  assert.ok(ids.includes('gale_crater'));
  assert.ok(ids.includes('jezero_crater'));
  assert.ok(ids.includes('hellas_planitia'));
  assert.ok(ids.includes('argyre_planitia'));
  assert.ok(ids.includes('planum_boreum'));
  assert.ok(ids.includes('planum_australe'));
});
