import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTempSwing,
  calculateRatio,
  calculateMetricDiff,
  calculateLunarWeight,
  calculateLunarJumpHeight,
  filterLocationPairs,
  sortLocationPairs,
  formatCoordinates,
} from './comparator.js';

const mockPairs = [
  {
    id: 'pair-1',
    title: 'High Altitude Observatories',
    category: 'extreme-terrains',
    categoryLabel: 'Extreme Terrains',
    thematicParallels: 'High altitude and atmospheric thinness',
    earth: {
      id: 'e1',
      name: 'Mauna Kea Observatory',
      designation: 'MKO-HAW-01',
      latitude: 19.82,
      longitude: -155.46,
      coordinatesFormatted: '19.82° N, 155.46° W',
      region: 'Hawaii, USA',
      summary: 'Dormant volcano shield summit',
      scientificSignificance: 'Clear sub-millimeter astronomy',
      imageUrl: '',
      imageAlt: 'Mauna Kea',
      terrainType: 'Volcanic Summit',
      metrics: {
        elevationMeters: 4207,
        tempMinCelsius: -4,
        tempMaxCelsius: 14,
        gravityMps2: 9.80,
        atmosphereKpa: 60.5,
        dayNightCycleHours: 24,
        radiationMsvYear: 3.5,
        commDelaySeconds: 0.001,
      },
    },
    moon: {
      id: 'm1',
      name: 'Mons Huygens',
      designation: 'M-HUY-01',
      latitude: 19.92,
      longitude: -2.86,
      coordinatesFormatted: '19.92° N, 2.86° W',
      region: 'Montes Apenninus',
      summary: 'Tallest lunar mountain massif',
      scientificSignificance: 'Deep mantle uplift basalt',
      imageUrl: '',
      imageAlt: 'Mons Huygens',
      terrainType: 'Massif Ridge',
      metrics: {
        elevationMeters: 5500,
        tempMinCelsius: -173,
        tempMaxCelsius: 118,
        gravityMps2: 1.62,
        atmosphereKpa: 0.000000000001,
        dayNightCycleHours: 708,
        radiationMsvYear: 380,
        commDelaySeconds: 1.28,
      },
    },
  },
  {
    id: 'pair-2',
    title: 'Polar Ice Traps',
    category: 'research-bases',
    categoryLabel: 'Research Bases',
    thematicParallels: 'Cold trap volatile preservation',
    earth: {
      id: 'e2',
      name: 'McMurdo Station',
      designation: 'MCM-ANT-02',
      latitude: -77.85,
      longitude: 166.66,
      coordinatesFormatted: '77.85° S, 166.66° E',
      region: 'Ross Island, Antarctica',
      summary: 'Antarctic primary research station',
      scientificSignificance: 'Sub-ice biology and climate cores',
      imageUrl: '',
      imageAlt: 'McMurdo Station',
      terrainType: 'Polar Volcanic Rock',
      metrics: {
        elevationMeters: 24,
        tempMinCelsius: -50,
        tempMaxCelsius: 3,
        gravityMps2: 9.83,
        atmosphereKpa: 100.8,
        dayNightCycleHours: 24,
        radiationMsvYear: 2.4,
        commDelaySeconds: 0.002,
      },
    },
    moon: {
      id: 'm2',
      name: 'Shackleton Crater',
      designation: 'SHK-POL-02',
      latitude: -89.9,
      longitude: 0.0,
      coordinatesFormatted: '89.90° S, 0.00° E',
      region: 'South Pole Peak of Eternal Light',
      summary: 'Permanently shadowed cryogenic crater',
      scientificSignificance: 'Water ice regolith reserves',
      imageUrl: '',
      imageAlt: 'Shackleton Crater',
      terrainType: 'Cryogenic Impact Crater',
      metrics: {
        elevationMeters: -4200,
        tempMinCelsius: -246,
        tempMaxCelsius: -150,
        gravityMps2: 1.62,
        atmosphereKpa: 0.000000000001,
        dayNightCycleHours: 708,
        radiationMsvYear: 420,
        commDelaySeconds: 1.28,
      },
    },
  },
];

test('getTempSwing computes difference between min and max', () => {
  assert.equal(getTempSwing(-173, 118), 291);
  assert.equal(getTempSwing(-50, 3), 53);
});

test('calculateRatio produces rounded ratio', () => {
  assert.equal(calculateRatio(9.81, 1.62), 6.06);
  assert.equal(calculateRatio(10, 0), 0);
});

test('calculateMetricDiff computes delta and percentage', () => {
  const result = calculateMetricDiff(100, 20);
  assert.equal(result.delta, 80);
  assert.equal(result.earthLarger, true);
  assert.equal(result.percentageDiff, 80);
});

test('calculateLunarWeight calculates 1/6th gravity weight', () => {
  assert.equal(calculateLunarWeight(70), 11.6);
  assert.equal(calculateLunarWeight(0), 0);
});

test('calculateLunarJumpHeight calculates jump height in lunar gravity', () => {
  assert.equal(calculateLunarJumpHeight(50), 302.8);
});

test('formatCoordinates returns formatted astronomical string', () => {
  assert.equal(formatCoordinates(19.82, -155.46), '19.82° N, 155.46° W');
  assert.equal(formatCoordinates(-89.9, 0), '89.90° S, 0.00° E');
});

test('filterLocationPairs filters by category and search query', () => {
  const filteredCategory = filterLocationPairs(mockPairs, 'extreme-terrains', '');
  assert.equal(filteredCategory.length, 1);
  assert.equal(filteredCategory[0].id, 'pair-1');

  const filteredSearch = filterLocationPairs(mockPairs, 'all', 'shackleton');
  assert.equal(filteredSearch.length, 1);
  assert.equal(filteredSearch[0].id, 'pair-2');
});

test('sortLocationPairs sorts by name and temperature swing', () => {
  const sortedNameAsc = sortLocationPairs(mockPairs, 'name', 'asc');
  assert.equal(sortedNameAsc[0].title, 'High Altitude Observatories');

  const sortedTempDesc = sortLocationPairs(mockPairs, 'temperature-swing', 'desc');
  assert.equal(sortedTempDesc[0].id, 'pair-1');
});
