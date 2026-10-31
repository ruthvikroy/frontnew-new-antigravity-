import { convertTemperature, convertPressure } from '../../utils/physics.js';

export const MARS_TELEMETRY = [
  {
    id: 'mean_radius',
    name: 'Mean Radius',
    value: 3389.5,
    unit: 'km',
    category: 'physical',
    explanation:
      'Mars volumetric mean radius is 3,389.5 km (~53.2% of Earth). The equatorial radius is 3,396.2 km while the polar radius is 3,376.2 km due to oblate rotational flattening (f = 0.00589).',
    evidenceType: 'Observed',
    source: 'NASA Planetary Data System / MGS MOLA Radiometry',
    earthComparisonRatio: 0.532,
    format: (val, unit) => {
      if (unit === 'imperial') {
        return { value: (val * 0.621371).toLocaleString('en-US', { maximumFractionDigits: 1 }), unit: 'mi' };
      }
      if (unit === 'scientific') {
        return { value: (val * 1000).toExponential(3), unit: 'm' };
      }
      return { value: val.toLocaleString('en-US', { maximumFractionDigits: 1 }), unit: 'km' };
    },
  },
  {
    id: 'mass',
    name: 'Planetary Mass',
    value: 6.4171e23,
    unit: 'kg',
    category: 'physical',
    explanation:
      'Mars mass is approximately 6.42 × 10²³ kg, approximately 10.7% of Earth mass (5.972 × 10²⁴ kg). Its uncompressed density of 3.93 g/cm³ indicates a smaller metallic core fraction than Earth.',
    evidenceType: 'Observed',
    source: 'Radio Science Doppler Tracking (Mariner 9, Viking, MRO)',
    earthComparisonRatio: 0.107,
    format: (val, unit) => {
      if (unit === 'imperial') {
        return { value: (val * 2.20462).toExponential(3), unit: 'lbs' };
      }
      return { value: val.toExponential(3), unit: 'kg' };
    },
  },
  {
    id: 'surface_gravity',
    name: 'Mean Surface Gravity',
    value: 3.71,
    unit: 'm/s²',
    category: 'physical',
    explanation:
      'Mean equatorial surface gravity is 3.71 m/s² (~0.379 g). An astronaut weighing 80 kg on Earth experiences an apparent weight equivalent to ~30.3 kg on Mars.',
    evidenceType: 'Observed',
    source: 'Orbital Perturbation Analysis / InSight Accelerometer',
    earthComparisonRatio: 0.379,
    format: (val, unit) => {
      if (unit === 'imperial') {
        return { value: (val * 3.28084).toFixed(2), unit: 'ft/s²' };
      }
      if (unit === 'scientific') {
        return { value: (val / 9.80665).toFixed(3), unit: 'g₀' };
      }
      return { value: val.toFixed(2), unit: 'm/s²' };
    },
  },
  {
    id: 'surface_temperature',
    name: 'Mean Surface Temp',
    value: 210,
    unit: 'K',
    category: 'atmospheric',
    explanation:
      'Mean global surface temperature is ~210 K (-63 °C / -81 °F). Due to low thermal inertia and thin atmosphere, temperatures range from 140 K (-133 °C) at winter poles to 305 K (+32 °C) at equatorial noon in perihelion.',
    evidenceType: 'Observed',
    source: 'Curiosity REMS / Perseverance MEDA In-situ Telemetry',
    earthComparisonRatio: 0.729,
    format: (val, unit) => {
      if (unit === 'imperial') {
        return { value: convertTemperature(val, 'F').toFixed(1), unit: '°F' };
      }
      if (unit === 'metric') {
        return { value: convertTemperature(val, 'C').toFixed(1), unit: '°C' };
      }
      return { value: val.toFixed(1), unit: 'K' };
    },
  },
  {
    id: 'atmospheric_pressure',
    name: 'Mean Surface Pressure',
    value: 6.10,
    unit: 'mbar',
    category: 'atmospheric',
    explanation:
      'Mean surface pressure is 6.10 mbar (~610 Pa, less than 1% of Earth 1,013 mbar). Pressure varies seasonally by ~30% as up to 25% of atmospheric CO₂ freezes onto the winter polar caps.',
    evidenceType: 'Observed',
    source: 'Viking Lander 1/2 Barometry & InSight APSS',
    earthComparisonRatio: 0.006,
    format: (val, unit) => {
      if (unit === 'imperial') {
        return { value: convertPressure(val, 'psi').toFixed(4), unit: 'psi' };
      }
      if (unit === 'scientific') {
        return { value: convertPressure(val, 'Pa').toFixed(0), unit: 'Pa' };
      }
      return { value: val.toFixed(2), unit: 'mbar' };
    },
  },
  {
    id: 'solar_day',
    name: 'Solar Day (Sol)',
    value: 24.6598,
    unit: 'hours',
    category: 'orbital',
    explanation:
      'Mean Martian solar day (Sol) is 24 hours, 39 minutes, 35.244 seconds (88,775.244 s), only ~2.7% longer than an Earth day. The sidereal rotation period is 24h 37m 22.66s.',
    evidenceType: 'Observed',
    source: 'IAU Working Group on Cartographic Coordinates & Rotational Elements',
    earthComparisonRatio: 1.027,
    format: (val, unit) => {
      if (unit === 'scientific') {
        return { value: '88,775', unit: 'sec' };
      }
      return { value: '24h 39m 35s', unit: 'sol' };
    },
  },
  {
    id: 'orbital_period',
    name: 'Orbital Period',
    value: 686.98,
    unit: 'days',
    category: 'orbital',
    explanation:
      'Mars completes one revolution around the Sun in 686.98 Earth solar days (equivalent to 668.6 Martian sols, or ~1.88 Earth tropical years).',
    evidenceType: 'Observed',
    source: 'JPL Planetary Ephemeris DE440',
    earthComparisonRatio: 1.881,
    format: (val, unit) => {
      if (unit === 'scientific') {
        return { value: '668.6', unit: 'sols' };
      }
      if (unit === 'imperial') {
        return { value: '1.881', unit: 'Earth yrs' };
      }
      return { value: val.toFixed(1), unit: 'Earth days' };
    },
  },
  {
    id: 'axial_tilt',
    name: 'Axial Obliquity',
    value: 25.19,
    unit: 'degrees',
    category: 'orbital',
    explanation:
      'Mars rotational axis is tilted 25.19° relative to its orbital plane (comparable to Earth 23.44°). Mars therefore experiences four distinct seasons, but their durations are asymmetric due to high orbital eccentricity (e = 0.0934).',
    evidenceType: 'Observed',
    source: 'JPL DE440 / MRO Radio Science',
    earthComparisonRatio: 1.075,
    format: (val) => {
      return { value: val.toFixed(2), unit: '°' };
    },
  },
];
