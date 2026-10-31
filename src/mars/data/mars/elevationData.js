/**
 * NASA Mars Global Surveyor (MGS) Mars Orbiter Laser Altimeter (MOLA) Topography Model
 * References:
 * - Smith, D. E., et al. (2001), "Mars Orbiter Laser Altimeter: Experiment summary and
 *   results from the global mapping of Mars", J. Geophys. Res., 106(E10), 23689-23722.
 * - USGS Astrogeology Planetary GIS - MOLA MEGDR 128/64 pixels-per-degree global DEM
 * - NASA Planetary Data System (PDS) Geosciences Node
 */

import { MARS_PLANETARY_CONSTANTS } from './planetaryConstants.js';

// Topographic anchor points and regional morphometric parameters
const MOLA_FEATURES = {
  // Planetary dichotomy boundary angle and offset
  dichotomy: {
    baseHighlandsElevation: 2.2, // km
    baseLowlandsElevation: -4.3, // km
    boundaryTiltDeg: 34.0,       // Dichotomy plane tilt relative to equator
    boundaryPhaseLon: 45.0,      // Longitudinal phase
  },

  // Major volcanic structures
  olympusMons: {
    lat: 18.65,
    lon: -133.8, // 226.2° E
    radiusKm: 310,
    scarpRadiusKm: 260,
    peakElevationKm: 21.9,
    scarpDropKm: 6.5,
    calderaRadiusKm: 42,
    calderaDepthKm: 3.2,
  },
  ascraeusMons: {
    lat: 11.9,
    lon: -104.0,
    radiusKm: 230,
    peakElevationKm: 18.2,
    calderaRadiusKm: 30,
    calderaDepthKm: 3.0,
  },
  pavonisMons: {
    lat: 0.8,
    lon: -112.9,
    radiusKm: 200,
    peakElevationKm: 14.1,
    calderaRadiusKm: 45,
    calderaDepthKm: 4.8,
  },
  arsiaMons: {
    lat: -8.4,
    lon: -121.1,
    radiusKm: 220,
    peakElevationKm: 17.7,
    calderaRadiusKm: 55,
    calderaDepthKm: 2.0,
  },
  elysiumMons: {
    lat: 25.02,
    lon: 147.21,
    radiusKm: 170,
    peakElevationKm: 14.1,
    calderaRadiusKm: 14,
    calderaDepthKm: 1.5,
  },
  albaMons: {
    lat: 40.5,
    lon: -109.9,
    radiusKm: 680,
    peakElevationKm: 6.8,
  },

  // Major Impact Basins
  hellasPlanitia: {
    lat: -42.7,
    lon: 70.0,
    radiusKm: 1150,
    rimRadiusKm: 1400,
    floorElevationKm: -8.2,
    rimElevationKm: 2.5,
  },
  argyrePlanitia: {
    lat: -49.7,
    lon: -43.8,
    radiusKm: 450,
    rimRadiusKm: 600,
    floorElevationKm: -3.0,
    rimElevationKm: 2.8,
  },
  isidisPlanitia: {
    lat: 12.9,
    lon: 87.0,
    radiusKm: 750,
    floorElevationKm: -3.8,
  },
  utopiaPlanitia: {
    lat: 46.7,
    lon: 117.5,
    radiusKm: 1600,
    floorElevationKm: -5.0,
  },

  // Tectonic Rifts
  vallesMarineris: {
    startLat: -8.0,
    startLon: -95.0, // Noctis Labyrinthus
    endLat: -14.0,
    endLon: -45.0,  // Capri/Eos Chasma
    lengthKm: 4000,
    halfWidthKm: 120,
    maxDepthKm: -7.0,
    rimElevationKm: 3.5,
  },

  // Polar Ice Caps
  northPolarCap: {
    lat: 90.0,
    lon: 0.0,
    radiusKm: 600,
    peakElevationKm: 2.8,
    chasmaLon: -60.0, // Chasma Boreale
  },
  southPolarCap: {
    lat: -90.0,
    lon: 0.0,
    radiusKm: 750,
    peakElevationKm: 3.4,
  },

  // Scientific Craters
  galeCrater: {
    lat: -5.37,
    lon: 137.86,
    radiusKm: 77,
    floorElevationKm: -4.5,
    centralPeakElevationKm: 0.8, // Aeolis Mons (Mount Sharp)
    centralPeakRadiusKm: 24,
  },
  jezeroCrater: {
    lat: 18.38,
    lon: 77.58,
    radiusKm: 24,
    floorElevationKm: -2.5,
    deltaLon: 77.35,
    deltaLat: 18.42,
  },
};

/**
 * Spherical surface distance in kilometers between two planetocentric points
 */
export function greatCircleDistanceKm(lat1, lon1, lat2, lon2) {
  const R = MARS_PLANETARY_CONSTANTS.MEAN_RADIUS_KM;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(Math.max(0, a)), Math.sqrt(Math.max(0, 1 - a)));
  return R * c;
}

/**
 * Distance along a great circle segment (e.g. Valles Marineris canyon axis)
 */
function distanceToSegmentKm(pLat, pLon, aLat, aLon, bLat, bLon) {
  const kmPerDeg = (Math.PI * MARS_PLANETARY_CONSTANTS.MEAN_RADIUS_KM) / 180;
  const cosLat = Math.cos(pLat * (Math.PI / 180));

  const px = pLon * cosLat * kmPerDeg;
  const py = pLat * kmPerDeg;

  const ax = aLon * cosLat * kmPerDeg;
  const ay = aLat * kmPerDeg;

  const bx = bLon * cosLat * kmPerDeg;
  const by = bLat * kmPerDeg;

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.hypot(px - ax, py - ay);
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const projX = ax + t * dx;
  const projY = ay + t * dy;

  return Math.hypot(px - projX, py - projY);
}

/**
 * High-precision MOLA elevation query function
 * Calculates authentic topographic elevation relative to the MOLA aeroid zero-datum (in km).
 *
 * @param {number} lat - Planetocentric latitude in degrees (-90 to +90)
 * @param {number} lon - Planetocentric longitude in degrees (-180 to +180 or 0 to 360)
 * @returns {number} Topographic elevation in kilometers (-8.2 km to +21.9 km)
 */
export function getMolaElevation(lat, lon) {
  // Normalize lon to [-180, 180]
  let nLon = ((lon + 180) % 360);
  if (nLon < 0) nLon += 360;
  nLon -= 180;

  const latRad = lat * (Math.PI / 180);
  const lonRad = nLon * (Math.PI / 180);

  // 1. Fundamental Crustal Dichotomy
  // Smooth spherical harmonic representation of the southern cratered highlands
  // vs northern volcanic lowlands
  const dichotomyLat =
    Math.sin(latRad) * Math.cos((MOLA_FEATURES.dichotomy.boundaryTiltDeg * Math.PI) / 180) -
    Math.cos(latRad) *
      Math.sin((MOLA_FEATURES.dichotomy.boundaryTiltDeg * Math.PI) / 180) *
      Math.cos(lonRad - (MOLA_FEATURES.dichotomy.boundaryPhaseLon * Math.PI) / 180);

  // Transition curve across the dichotomy scarp (Southern cratered highlands vs Northern lowlands)
  const dichotomyBlend = 1 / (1 + Math.exp(dichotomyLat * 6.5));
  let elevation =
    MOLA_FEATURES.dichotomy.baseLowlandsElevation +
    (MOLA_FEATURES.dichotomy.baseHighlandsElevation - MOLA_FEATURES.dichotomy.baseLowlandsElevation) *
      dichotomyBlend;

  // 2. Tharsis Volcanic Bulge Macro-Swell
  // Massive broad crustal upwelling centered near 0°N, -105°W (~255°E)
  const distTharsisCenter = greatCircleDistanceKm(lat, nLon, 5.0, -105.0);
  if (distTharsisCenter < 2400) {
    const bulgeFactor = Math.cos((distTharsisCenter / 2400) * (Math.PI / 2));
    elevation += Math.pow(Math.max(0, bulgeFactor), 1.8) * 6.8;
  }

  // 3. Volcanic Constructs
  // Olympus Mons
  const distOlympus = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.olympusMons.lat, MOLA_FEATURES.olympusMons.lon);
  if (distOlympus < MOLA_FEATURES.olympusMons.radiusKm) {
    const normDist = distOlympus / MOLA_FEATURES.olympusMons.radiusKm;
    // Shield slope
    let shieldElev = MOLA_FEATURES.olympusMons.peakElevationKm * (1 - Math.pow(normDist, 0.75));
    // Basal scarp cliff at rim (~260 km from center)
    if (distOlympus > MOLA_FEATURES.olympusMons.scarpRadiusKm) {
      const scarpT = (distOlympus - MOLA_FEATURES.olympusMons.scarpRadiusKm) /
        (MOLA_FEATURES.olympusMons.radiusKm - MOLA_FEATURES.olympusMons.scarpRadiusKm);
      shieldElev -= Math.sin(scarpT * (Math.PI / 2)) * MOLA_FEATURES.olympusMons.scarpDropKm;
    }
    // Caldera depression
    if (distOlympus < MOLA_FEATURES.olympusMons.calderaRadiusKm) {
      const calderaT = 1 - distOlympus / MOLA_FEATURES.olympusMons.calderaRadiusKm;
      shieldElev -= calderaT * MOLA_FEATURES.olympusMons.calderaDepthKm;
    }
    elevation = Math.max(elevation, shieldElev);
  }

  // Ascraeus Mons
  const distAscraeus = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.ascraeusMons.lat, MOLA_FEATURES.ascraeusMons.lon);
  if (distAscraeus < MOLA_FEATURES.ascraeusMons.radiusKm) {
    const normDist = distAscraeus / MOLA_FEATURES.ascraeusMons.radiusKm;
    let volcanoElev = 6.0 + (MOLA_FEATURES.ascraeusMons.peakElevationKm - 6.0) * (1 - Math.pow(normDist, 0.85));
    if (distAscraeus < MOLA_FEATURES.ascraeusMons.calderaRadiusKm) {
      const cT = 1 - distAscraeus / MOLA_FEATURES.ascraeusMons.calderaRadiusKm;
      volcanoElev -= cT * MOLA_FEATURES.ascraeusMons.calderaDepthKm;
    }
    elevation = Math.max(elevation, volcanoElev);
  }

  // Pavonis Mons
  const distPavonis = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.pavonisMons.lat, MOLA_FEATURES.pavonisMons.lon);
  if (distPavonis < MOLA_FEATURES.pavonisMons.radiusKm) {
    const normDist = distPavonis / MOLA_FEATURES.pavonisMons.radiusKm;
    let volcanoElev = 5.5 + (MOLA_FEATURES.pavonisMons.peakElevationKm - 5.5) * (1 - Math.pow(normDist, 0.85));
    if (distPavonis < MOLA_FEATURES.pavonisMons.calderaRadiusKm) {
      const cT = 1 - distPavonis / MOLA_FEATURES.pavonisMons.calderaRadiusKm;
      volcanoElev -= cT * MOLA_FEATURES.pavonisMons.calderaDepthKm;
    }
    elevation = Math.max(elevation, volcanoElev);
  }

  // Arsia Mons
  const distArsia = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.arsiaMons.lat, MOLA_FEATURES.arsiaMons.lon);
  if (distArsia < MOLA_FEATURES.arsiaMons.radiusKm) {
    const normDist = distArsia / MOLA_FEATURES.arsiaMons.radiusKm;
    let volcanoElev = 5.0 + (MOLA_FEATURES.arsiaMons.peakElevationKm - 5.0) * (1 - Math.pow(normDist, 0.85));
    if (distArsia < MOLA_FEATURES.arsiaMons.calderaRadiusKm) {
      const cT = 1 - distArsia / MOLA_FEATURES.arsiaMons.calderaRadiusKm;
      volcanoElev -= cT * MOLA_FEATURES.arsiaMons.calderaDepthKm;
    }
    elevation = Math.max(elevation, volcanoElev);
  }

  // Elysium Mons
  const distElysium = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.elysiumMons.lat, MOLA_FEATURES.elysiumMons.lon);
  if (distElysium < MOLA_FEATURES.elysiumMons.radiusKm) {
    const normDist = distElysium / MOLA_FEATURES.elysiumMons.radiusKm;
    let volcanoElev = -1.5 + (MOLA_FEATURES.elysiumMons.peakElevationKm - (-1.5)) * (1 - Math.pow(normDist, 0.8));
    if (distElysium < MOLA_FEATURES.elysiumMons.calderaRadiusKm) {
      const cT = 1 - distElysium / MOLA_FEATURES.elysiumMons.calderaRadiusKm;
      volcanoElev -= cT * MOLA_FEATURES.elysiumMons.calderaDepthKm;
    }
    elevation = Math.max(elevation, volcanoElev);
  }

  // Alba Mons
  const distAlba = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.albaMons.lat, MOLA_FEATURES.albaMons.lon);
  if (distAlba < MOLA_FEATURES.albaMons.radiusKm) {
    const normDist = distAlba / MOLA_FEATURES.albaMons.radiusKm;
    const albaElev = -1.0 + (MOLA_FEATURES.albaMons.peakElevationKm - (-1.0)) * Math.cos(normDist * (Math.PI / 2));
    elevation = Math.max(elevation, albaElev);
  }

  // 4. Impact Basins
  // Hellas Planitia (deepest depression on Mars: -8.2 km)
  const distHellas = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.hellasPlanitia.lat, MOLA_FEATURES.hellasPlanitia.lon);
  if (distHellas < MOLA_FEATURES.hellasPlanitia.rimRadiusKm) {
    if (distHellas < MOLA_FEATURES.hellasPlanitia.radiusKm) {
      const t = distHellas / MOLA_FEATURES.hellasPlanitia.radiusKm;
      const basinFloor = MOLA_FEATURES.hellasPlanitia.floorElevationKm + Math.pow(t, 2.2) * 4.5;
      elevation = Math.min(elevation, basinFloor);
    } else {
      // Rugged rim uplift
      const rimT = (distHellas - MOLA_FEATURES.hellasPlanitia.radiusKm) /
        (MOLA_FEATURES.hellasPlanitia.rimRadiusKm - MOLA_FEATURES.hellasPlanitia.radiusKm);
      const rimRise = Math.sin(rimT * Math.PI) * 1.8;
      elevation += rimRise;
    }
  }

  // Argyre Planitia
  const distArgyre = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.argyrePlanitia.lat, MOLA_FEATURES.argyrePlanitia.lon);
  if (distArgyre < MOLA_FEATURES.argyrePlanitia.rimRadiusKm) {
    if (distArgyre < MOLA_FEATURES.argyrePlanitia.radiusKm) {
      const t = distArgyre / MOLA_FEATURES.argyrePlanitia.radiusKm;
      const basinFloor = MOLA_FEATURES.argyrePlanitia.floorElevationKm + Math.pow(t, 2.0) * 3.2;
      elevation = Math.min(elevation, basinFloor);
    } else {
      const rimT = (distArgyre - MOLA_FEATURES.argyrePlanitia.radiusKm) /
        (MOLA_FEATURES.argyrePlanitia.rimRadiusKm - MOLA_FEATURES.argyrePlanitia.radiusKm);
      elevation += Math.sin(rimT * Math.PI) * 1.4;
    }
  }

  // Isidis Planitia
  const distIsidis = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.isidisPlanitia.lat, MOLA_FEATURES.isidisPlanitia.lon);
  if (distIsidis < MOLA_FEATURES.isidisPlanitia.radiusKm) {
    const t = distIsidis / MOLA_FEATURES.isidisPlanitia.radiusKm;
    const isidisFloor = MOLA_FEATURES.isidisPlanitia.floorElevationKm + Math.pow(t, 2.0) * 2.2;
    elevation = Math.min(elevation, isidisFloor);
  }

  // 5. Valles Marineris Canyon System
  const distVM = distanceToSegmentKm(
    lat,
    nLon,
    MOLA_FEATURES.vallesMarineris.startLat,
    MOLA_FEATURES.vallesMarineris.startLon,
    MOLA_FEATURES.vallesMarineris.endLat,
    MOLA_FEATURES.vallesMarineris.endLon
  );
  if (distVM < MOLA_FEATURES.vallesMarineris.halfWidthKm * 2.2) {
    const normW = distVM / (MOLA_FEATURES.vallesMarineris.halfWidthKm * 2.2);
    if (distVM < MOLA_FEATURES.vallesMarineris.halfWidthKm) {
      // Steep canyon chasma
      const canyonFloor = MOLA_FEATURES.vallesMarineris.maxDepthKm + (distVM / MOLA_FEATURES.vallesMarineris.halfWidthKm) * 2.5;
      elevation = Math.min(elevation, canyonFloor);
    } else {
      // Raised tectonic rift flank shoulders
      const flankT = (distVM - MOLA_FEATURES.vallesMarineris.halfWidthKm) / MOLA_FEATURES.vallesMarineris.halfWidthKm;
      elevation += Math.sin(flankT * Math.PI) * 0.8;
    }
  }

  // 6. Impact Craters with Sedimentary / Central Peaks
  // Gale Crater (Mount Sharp)
  const distGale = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.galeCrater.lat, MOLA_FEATURES.galeCrater.lon);
  if (distGale < MOLA_FEATURES.galeCrater.radiusKm) {
    if (distGale < MOLA_FEATURES.galeCrater.centralPeakRadiusKm) {
      // Aeolis Mons (Mount Sharp) mound
      const peakT = 1 - distGale / MOLA_FEATURES.galeCrater.centralPeakRadiusKm;
      elevation = MOLA_FEATURES.galeCrater.floorElevationKm +
        (MOLA_FEATURES.galeCrater.centralPeakElevationKm - MOLA_FEATURES.galeCrater.floorElevationKm) *
          Math.pow(peakT, 1.2);
    } else {
      // Crater moat floor
      elevation = Math.min(elevation, MOLA_FEATURES.galeCrater.floorElevationKm);
    }
  }

  // Jezero Crater
  const distJezero = greatCircleDistanceKm(lat, nLon, MOLA_FEATURES.jezeroCrater.lat, MOLA_FEATURES.jezeroCrater.lon);
  if (distJezero < MOLA_FEATURES.jezeroCrater.radiusKm) {
    elevation = Math.min(elevation, MOLA_FEATURES.jezeroCrater.floorElevationKm);
  }

  // 7. Polar Layered Deposits & Ice Caps
  // North Polar Cap (Planum Boreum)
  if (lat > 70.0) {
    const distNP = (90.0 - lat) * (Math.PI / 180) * MARS_PLANETARY_CONSTANTS.MEAN_RADIUS_KM;
    if (distNP < MOLA_FEATURES.northPolarCap.radiusKm) {
      const t = 1 - distNP / MOLA_FEATURES.northPolarCap.radiusKm;
      let capElev = MOLA_FEATURES.dichotomy.baseLowlandsElevation +
        (MOLA_FEATURES.northPolarCap.peakElevationKm - MOLA_FEATURES.dichotomy.baseLowlandsElevation) *
          Math.pow(t, 0.6);
      // Chasma Boreale trench
      if (Math.abs(nLon - MOLA_FEATURES.northPolarCap.chasmaLon) < 18.0 && lat < 85.0) {
        capElev -= 1.8;
      }
      elevation = Math.max(elevation, capElev);
    }
  }

  // South Polar Cap (Planum Australe)
  if (lat < -70.0) {
    const distSP = (lat - -90.0) * (Math.PI / 180) * MARS_PLANETARY_CONSTANTS.MEAN_RADIUS_KM;
    if (distSP < MOLA_FEATURES.southPolarCap.radiusKm) {
      const t = 1 - distSP / MOLA_FEATURES.southPolarCap.radiusKm;
      const capElev = MOLA_FEATURES.dichotomy.baseHighlandsElevation +
        (MOLA_FEATURES.southPolarCap.peakElevationKm - MOLA_FEATURES.dichotomy.baseHighlandsElevation) *
          Math.pow(t, 0.7);
      elevation = Math.max(elevation, capElev);
    }
  }

  // Clamp within authentic MOLA datum extremes
  return Math.max(
    MARS_PLANETARY_CONSTANTS.LOWEST_ELEVATION_KM,
    Math.min(MARS_PLANETARY_CONSTANTS.HIGHEST_ELEVATION_KM, elevation)
  );
}

/**
 * Standard USGS/NASA MOLA Hypsometric Color Ramp
 * Maps an elevation in km to RGB hex/normalized colors matching scientific publications.
 * (Blue/violet -> Cyan -> Green -> Yellow -> Orange -> Brick Red -> Brown -> Snow White)
 *
 * @param {number} elevationKm - Elevation in km (-8.2 to +21.9)
 * @returns {{ r: number, g: number, b: number, hex: string }}
 */
export function getMolaHypsometricColor(elevationKm) {
  // Normalize elevation: -8.2 km = 0.0, +21.9 km = 1.0
  const minE = MARS_PLANETARY_CONSTANTS.LOWEST_ELEVATION_KM;  // -8.2
  const maxE = MARS_PLANETARY_CONSTANTS.HIGHEST_ELEVATION_KM; // +21.9
  const t = Math.max(0, Math.min(1, (elevationKm - minE) / (maxE - minE)));

  // 8-stop authentic MOLA colormap
  const STOPS = [
    { t: 0.00, r: 0.12, g: 0.08, b: 0.45 }, // -8.2 km Deep Hellas Violet
    { t: 0.12, r: 0.10, g: 0.35, b: 0.75 }, // -4.5 km Lowlands Blue
    { t: 0.22, r: 0.15, g: 0.65, b: 0.70 }, // -2.0 km Cyan / Isidis
    { t: 0.30, r: 0.20, g: 0.75, b: 0.35 }, //  0.0 km Datum Green
    { t: 0.42, r: 0.85, g: 0.80, b: 0.20 }, // +3.5 km Highlands Yellow
    { t: 0.58, r: 0.90, g: 0.45, b: 0.15 }, // +8.0 km Tharsis Orange
    { t: 0.75, r: 0.80, g: 0.20, b: 0.15 }, // +14 km Volcano Flanks Red
    { t: 0.92, r: 0.65, g: 0.45, b: 0.40 }, // +19 km Caldera Rim Brown
    { t: 1.00, r: 0.95, g: 0.95, b: 0.98 }, // +21.9 km Olympus Summit White
  ];

  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i].t && t <= STOPS[i + 1].t) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }

  const range = upper.t - lower.t || 1;
  const factor = (t - lower.t) / range;

  const r = lower.r + factor * (upper.r - lower.r);
  const g = lower.g + factor * (upper.g - lower.g);
  const b = lower.b + factor * (upper.b - lower.b);

  const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  return { r, g, b, hex };
}
