/**
 * Rigorous physical and atmospheric calculations for Mars
 * References: NASA Planetary Fact Sheet, Mars Climate Database (LMD/ESA),
 * Viking/Pathfinder/Curiosity/Perseverance meteorological packages.
 */

// Universal Physical Constants
export const MARS_CONSTANTS = {
  MEAN_RADIUS_KM: 3389.5,
  POLAR_RADIUS_KM: 3376.2,
  EQUATORIAL_RADIUS_KM: 3396.2,
  MASS_KG: 6.4171e23,
  GRAVITY_MS2: 3.71,
  ROTATION_PERIOD_HOURS: 24.622962, // 24h 37m 22.66s sidereal
  SOL_DURATION_SECONDS: 88775.244,  // 24h 39m 35.244s mean solar day
  ORBITAL_PERIOD_DAYS: 686.98,      // Earth days
  ORBITAL_PERIOD_SOLS: 668.6,       // Martian sols
  SEMI_MAJOR_AXIS_AU: 1.52366,
  ECCENTRICITY: 0.0934,
  AXIAL_TILT_DEG: 25.19,
  MEAN_SURFACE_TEMP_K: 210,
  MEAN_SURFACE_PRESSURE_MBAR: 6.10, // 610 Pa
  SOLAR_IRRADIANCE_AU_W_M2: 1361,   // Solar constant at 1 AU
  GAS_CONSTANT_UNIVERSAL: 8.314462618,
  MARS_AIR_MOLAR_MASS_KG_MOL: 0.04334, // ~95.3% CO2 (0.044), 2.6% N2 (0.028), 1.9% Ar (0.040)
  ADIABATIC_INDEX_CO2: 1.29,          // Heat capacity ratio gamma
};

/**
 * Specific gas constant for Mars atmosphere: R_spec = R / M
 * ~ 191.84 J/(kg * K)
 */
export const MARS_SPECIFIC_GAS_CONSTANT =
  MARS_CONSTANTS.GAS_CONSTANT_UNIVERSAL / MARS_CONSTANTS.MARS_AIR_MOLAR_MASS_KG_MOL;

/**
 * Atmospheric scale height on Mars H = (R_spec * T) / g (in meters)
 * At standard 210 K, H is approximately 10.86 km
 */
export function calculateScaleHeightMeters(temperatureK = MARS_CONSTANTS.MEAN_SURFACE_TEMP_K) {
  const t = Math.max(50, temperatureK);
  return (MARS_SPECIFIC_GAS_CONSTANT * t) / MARS_CONSTANTS.GRAVITY_MS2;
}

/**
 * Calculate Mars atmospheric density (kg/m^3) using ideal gas law: rho = P / (R_spec * T)
 * @param {number} pressureMbar Pressure in millibar (1 mbar = 100 Pa)
 * @param {number} temperatureK Temperature in Kelvin
 */
export function calculateAtmosphericDensity(pressureMbar, temperatureK) {
  const pressurePa = Math.max(0.001, pressureMbar) * 100;
  const t = Math.max(50, temperatureK);
  return pressurePa / (MARS_SPECIFIC_GAS_CONSTANT * t);
}

/**
 * Calculate barometric pressure at given altitude above/below datum using Mars scale height
 * @param {number} altitudeKm Altitude in kilometers relative to datum (e.g. Olympus Mons is +21.9 km)
 * @param {number} surfacePressureMbar Baseline surface datum pressure (default ~6.1 mbar)
 * @param {number} temperatureK Mean column temperature
 */
export function calculatePressureAtAltitude(
  altitudeKm,
  surfacePressureMbar = MARS_CONSTANTS.MEAN_SURFACE_PRESSURE_MBAR,
  temperatureK = MARS_CONSTANTS.MEAN_SURFACE_TEMP_K
) {
  const hKm = calculateScaleHeightMeters(temperatureK) / 1000;
  return surfacePressureMbar * Math.exp(-altitudeKm / hKm);
}

/**
 * Calculate the speed of sound in the Martian atmosphere: c = sqrt(gamma * R_spec * T)
 * Returns speed in m/s (typically ~228 m/s at 210 K)
 */
export function calculateSpeedOfSound(temperatureK = MARS_CONSTANTS.MEAN_SURFACE_TEMP_K) {
  const t = Math.max(50, temperatureK);
  return Math.sqrt(MARS_CONSTANTS.ADIABATIC_INDEX_CO2 * MARS_SPECIFIC_GAS_CONSTANT * t);
}

/**
 * Calculate solar irradiance reaching top of Mars atmosphere based on orbital distance
 * @param {number} orbitalDistanceAu Orbital distance in AU (perihelion 1.381 AU to aphelion 1.666 AU)
 */
export function calculateSolarFlux(orbitalDistanceAu = MARS_CONSTANTS.SEMI_MAJOR_AXIS_AU) {
  const d = Math.max(0.5, orbitalDistanceAu);
  return MARS_CONSTANTS.SOLAR_IRRADIANCE_AU_W_M2 / (d * d);
}

/**
 * Direct solar transmittance through dust using Beer-Lambert law: T = exp(-tau / cos(zenithAngle))
 * @param {number} opticalDepth Dust optical depth (tau)
 * @param {number} solarZenithAngleRad Solar zenith angle in radians (0 = overhead sun)
 */
export function calculateDustTransmittance(opticalDepth, solarZenithAngleRad = 0.5) {
  const cosZenith = Math.max(0.1, Math.cos(solarZenithAngleRad));
  const tau = Math.max(0.01, opticalDepth);
  return Math.exp(-tau / cosZenith);
}

/**
 * Convert planetary coordinates (lat, lon) in degrees to 3D Cartesian coordinates on sphere of radius R
 * @param {number} lat Latitude (-90 to +90)
 * @param {number} lon Longitude (-180 to +180 or 0 to 360)
 * @param {number} radius Sphere radius
 * @returns {[number, number, number]}
 */
export function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

/**
 * Convert temperature between units
 */
export function convertTemperature(kelvin, targetUnit) {
  if (targetUnit === 'K') return kelvin;
  if (targetUnit === 'C') return kelvin - 273.15;
  return (kelvin - 273.15) * 1.8 + 32;
}

/**
 * Convert pressure between units
 */
export function convertPressure(mbar, targetUnit) {
  switch (targetUnit) {
    case 'mbar':
      return mbar;
    case 'Pa':
      return mbar * 100;
    case 'psi':
      return mbar * 0.01450377;
    case 'atm':
      return mbar / 1013.25;
    default:
      return mbar;
  }
}
