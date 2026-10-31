/**
 * Authenticated NASA Planetary Fact Sheet & IAU Cartographic Parameters for Mars
 * Sources:
 * - NASA Mars Global Surveyor (MGS) MOLA Science Team
 * - NASA Planetary Data System (PDS) Geosciences Node
 * - IAU/IAG Working Group on Cartographic Coordinates and Rotational Elements
 * - JPL Planetary Ephemeris DE440
 */

export const MARS_PLANETARY_CONSTANTS = {
  // Planetary Radii & Geometry (Oblate Spheroid)
  EQUATORIAL_RADIUS_KM: 3396.2,
  POLAR_RADIUS_KM: 3376.2,
  MEAN_RADIUS_KM: 3389.5,
  VOLUMETRIC_MEAN_RADIUS_KM: 3389.5,
  FLATTENING: 0.0058889, // f = (a - b) / a (Mars rotational oblateness)
  POLAR_FLATTENING_RATIO: 3376.2 / 3396.2, // b / a ~ 0.994111

  // Topographic Reference Datum (MOLA Aeroid)
  // MOLA zero elevation is defined by the average equatorial radius of 3,396.0 km
  // and equipotential gravity surface (Smith et al. 2001)
  MOLA_DATUM_RADIUS_KM: 3396.0,
  LOWEST_ELEVATION_KM: -8.2,   // Hellas Planitia floor
  HIGHEST_ELEVATION_KM: 21.9,  // Olympus Mons caldera summit
  TOTAL_RELIEF_RANGE_KM: 30.1, // Total dynamic vertical relief

  // Mass & Gravitational Dynamics
  MASS_KG: 6.4171e23,
  GRAVITATIONAL_CONSTANT_GM: 42828.3752, // km^3 / s^2
  SURFACE_GRAVITY_EQUATORIAL_MS2: 3.71,
  SURFACE_GRAVITY_POLAR_MS2: 3.75,
  ESCAPE_VELOCITY_KM_S: 5.03,

  // Rotational Dynamics & Orientation
  AXIAL_TILT_DEG: 25.19, // Obliquity to orbit
  NORTH_POLE_RIGHT_ASCENSION_DEG: 317.68143,
  NORTH_POLE_DECLINATION_DEG: 52.8865,
  PRIME_MERIDIAN_W0_DEG: 176.63, // Defined by crater Airy-0
  SIDEREAL_ROTATION_PERIOD_SECONDS: 88642.663, // 24h 37m 22.663s
  MEAN_SOLAR_DAY_SOL_SECONDS: 88775.244,       // 24h 39m 35.244s

  // Orbital Ephemeris
  SEMI_MAJOR_AXIS_AU: 1.523662,
  PERIHELION_AU: 1.3814,
  APHELION_AU: 1.6660,
  ECCENTRICITY: 0.093412,
  ORBITAL_PERIOD_EARTH_DAYS: 686.98,
  ORBITAL_PERIOD_SOLS: 668.6,
  ORBITAL_INCLINATION_DEG: 1.850,

  // Solar Radiation & Thermal Properties
  SOLAR_CONSTANT_1AU_W_M2: 1361.0,
  SOLAR_IRRADIANCE_MEAN_W_M2: 586.2,      // S_0 / (1.524)^2
  SOLAR_IRRADIANCE_PERIHELION_W_M2: 712.5, // High southern summer insolation
  SOLAR_IRRADIANCE_APHELION_W_M2: 490.1,   // Aphelion cooling
  GEOMETRIC_ALBEDO: 0.170,
  BOND_ALBEDO: 0.250,

  // Atmospheric Physical Characteristics
  MEAN_SURFACE_PRESSURE_MBAR: 6.10, // 610 Pa
  MIN_SURFACE_PRESSURE_MBAR: 4.0,   // High plateau winter
  MAX_SURFACE_PRESSURE_MBAR: 11.5,  // Deep Hellas/Valles floor
  SCALE_HEIGHT_KM: 10.86,
  ATMOSPHERIC_MASS_KG: 2.5e16,
};
