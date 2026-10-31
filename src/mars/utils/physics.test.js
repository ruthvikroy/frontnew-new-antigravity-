import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MARS_CONSTANTS,
  calculateScaleHeightMeters,
  calculateAtmosphericDensity,
  calculatePressureAtAltitude,
  calculateSpeedOfSound,
  calculateSolarFlux,
  calculateDustTransmittance,
  latLonToVector3,
  convertTemperature,
  convertPressure,
} from './physics.js';

test('atmospheric scale height calculates to expected ~10.86 km at 210K', () => {
  const hMeters = calculateScaleHeightMeters(210);
  const hKm = hMeters / 1000;
  assert.ok(hKm > 10.5 && hKm < 11.2, `Scale height ${hKm} km is within scientific bounds`);
});

test('atmospheric density at 6.1 mbar and 210 K is approx 0.015 kg/m^3', () => {
  const density = calculateAtmosphericDensity(6.1, 210);
  assert.ok(density > 0.014 && density < 0.016, `Density ${density} is approx 1/80th of Earth`);
});

test('barometric pressure drops exponentially with altitude', () => {
  const pSurface = calculatePressureAtAltitude(0, 6.1, 210);
  assert.equal(Math.round(pSurface * 100) / 100, 6.1);

  // At Olympus Mons summit (~21.9 km above datum), pressure should be ~0.8 mbar
  const pSummit = calculatePressureAtAltitude(21.9, 6.1, 210);
  assert.ok(pSummit > 0.7 && pSummit < 0.9, `Olympus Mons summit pressure ${pSummit} mbar`);
  assert.ok(pSummit < pSurface);

  // In deep canyon Valles Marineris (-7 km below datum), pressure should rise to ~11 mbar
  const pDeep = calculatePressureAtAltitude(-7.0, 6.1, 210);
  assert.ok(pDeep > 10.0 && pDeep < 13.0, `Valles Marineris floor pressure ${pDeep} mbar`);
  assert.ok(pDeep > pSurface);
});

test('speed of sound in Mars atmosphere is approximately 228 m/s at 210 K', () => {
  const speed = calculateSpeedOfSound(210);
  assert.ok(speed > 220 && speed < 240, `Speed of sound ${speed} m/s matches acoustic measurements`);
});

test('solar flux at mean orbit (1.524 AU) is ~586 W/m^2', () => {
  const flux = calculateSolarFlux(MARS_CONSTANTS.SEMI_MAJOR_AXIS_AU);
  assert.ok(flux > 570 && flux < 600, `Solar flux ${flux} W/m^2 matches expected range`);
});

test('dust transmittance attenuates with optical depth', () => {
  const clearTrans = calculateDustTransmittance(0.1);
  const stormTrans = calculateDustTransmittance(2.5);
  assert.ok(clearTrans > stormTrans, 'Clear skies transmit more light than dust storm');
  assert.ok(stormTrans < 0.1, 'Thick dust heavily dims sunlight');
});

test('latLonToVector3 maps poles and equator properly', () => {
  const [nx, ny, nz] = latLonToVector3(90, 0, 10);
  assert.ok(Math.abs(ny - 10) < 0.001, 'North pole maps to top Y');
  assert.ok(Math.abs(nx) < 0.001);
  assert.ok(Math.abs(nz) < 0.001);

  const [sx, sy, sz] = latLonToVector3(-90, 0, 10);
  assert.ok(Math.abs(sy - (-10)) < 0.001, 'South pole maps to bottom -Y');
});

test('temperature conversion handles K, C, and F correctly', () => {
  assert.equal(convertTemperature(273.15, 'C'), 0);
  assert.equal(convertTemperature(273.15, 'K'), 273.15);
  assert.equal(Math.round(convertTemperature(273.15, 'F')), 32);
});

test('pressure conversion handles mbar to Pa and atm', () => {
  assert.equal(convertPressure(10, 'Pa'), 1000);
  assert.equal(convertPressure(1013.25, 'atm'), 1);
});
