/**
 * Mathematical models for Martian axial rotation, areographic coordinates,
 * atmospheric scale height & procedural cloud drift kinematics, multi-scale 3D
 * surface texture profiles, natural satellite orbits (Phobos & Deimos), and
 * spacecraft trajectories (2001 Mars Odyssey).
 */

export const GENAI_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
];

export const NASA_MARS_VIDEO_META = {
  videoId: 'Q_P0swqaZDk',
  startSeconds: 27,
  title: 'NASA Mars Exploration: Rovers, Orbiters & Ancient Water on the Red Planet',
  embedUrl: 'https://www.youtube.com/embed/Q_P0swqaZDk?start=27&rel=0',
  watchUrl: 'https://www.youtube.com/watch?v=Q_P0swqaZDk&t=27s',
  sourcePortalUrl: 'https://science.nasa.gov/mars/',
  credit: 'NASA / Jet Propulsion Laboratory (science.nasa.gov)',
  summary:
    'Official NASA Science briefing exploring how Perseverance (Jezero Crater), Curiosity (Gale Crater), and Mars Odyssey examine distinct geological eras of Martian history, ancient river deltas, and potential biosignatures.',
};

/**
 * Physical parameters for Mars's thin CO2 atmosphere (95.3% CO2, 2.6% N2, 1.9% Ar)
 * and high-altitude water-ice / CO2-ice procedural cloud shell.
 */
export const MARS_ATMOSPHERE_CONFIG = {
  surfacePressureMbar: 6.1,
  scaleHeightKm: 11.1,
  cloudAltitudeKm: 28.5,
  cloudLayerRadiusRatio: 1.015,
  outerHaloRadiusRatio: 1.038,
  defaultCloudOpacity: 0.65,
  defaultCloudDriftSpeed: 1.0,
  defaultDustIntensity: 0.42,
};

/**
 * 3D Surface Texture Modes synthesized from the uploaded NASA Mars & Perseverance
 * instrument suites (Global Mosaic, Mastcam-Z Stereo ZL0/ZR0 pairs, SuperCam RMI, MEDA SkyCam).
 */
export const MARS_3D_TEXTURE_MODES = [
  {
    id: 'global-mola',
    name: 'Global MOLA + Viking/MRO 3D',
    label: 'Global MOLA + Viking/MRO 3D',
    shortLabel: 'Global MOLA 3D',
    instrument: 'Viking & MGS MOLA Altimeter (1-mars-nasa-gov-jpg)',
    catalogCode: 'MOLA-GLOBAL',
    datasetBadge: '1-mars-nasa-gov-jpg',
    normalBoost: 1.0,
    bumpBoost: 1.0,
    displacementMultiplier: 1.0,
    microRepeat: 6.0,
    description:
      'Full-globe 3D topographic displacement of Valles Marineris, Olympus Mons, and Syrtis Major fused with NASA global mosaic photography.',
  },
  {
    id: 'zcam-stereo-dem',
    name: 'Mastcam-Z Stereo DEM & Core',
    label: 'Mastcam-Z Stereo DEM & Core',
    shortLabel: 'Mastcam-Z Stereo 3D',
    instrument: 'Perseverance Mastcam-Z Stereo Pairs (ZL0/ZR0 ZCAM10053)',
    catalogCode: 'ZCAM-10053-DEM',
    datasetBadge: 'ZL0/ZR0 ZCAM10053',
    normalBoost: 1.65,
    bumpBoost: 1.9,
    displacementMultiplier: 1.18,
    microRepeat: 12.0,
    description:
      'High-relief 3D stereo reconstruction from Perseverance ZL0/ZR0 pairs featuring fractured regolith blocks, aeolian sand ripples, and 16mm drill core holes.',
  },
  {
    id: 'jezero-strata',
    name: 'Jezero Cross-Bedded Strata',
    label: 'Jezero Cross-Bedded Strata',
    shortLabel: 'Jezero Strata 3D',
    instrument: 'Mastcam-Z Outcrop & Conjunction Deck (ZCAM08693 · PIA26202)',
    catalogCode: 'ZCAM-08693-STRATA',
    datasetBadge: 'ZCAM08693 · PIA26202',
    normalBoost: 1.52,
    bumpBoost: 1.75,
    displacementMultiplier: 1.12,
    microRepeat: 10.0,
    description:
      'Stratified deltaic sandstone laminae, Kodiak butte escarpments, wind-carved Sombrero ventifacts (ZCAM08750), and rounded alluvial boulder fields.',
  },
  {
    id: 'scam-rmi-micro',
    name: 'SuperCam RMI Micro-Bedrock',
    label: 'SuperCam RMI Micro-Bedrock',
    shortLabel: 'SuperCam RMI 3D',
    instrument: 'SuperCam Remote Micro-Imager & MEDA (SCAM04020 · MEDA00000)',
    catalogCode: 'SCAM-04020-RMI',
    datasetBadge: 'SCAM04020 · MEDA00000',
    normalBoost: 1.85,
    bumpBoost: 2.25,
    displacementMultiplier: 1.08,
    microRepeat: 18.0,
    description:
      'Ultra-crisp sub-millimeter 3D vesicular rock texture, mineral grain facets, and laser micro-pits paired with MEDA SkyCam optical scattering.',
  },
];

export const MARS_LANDMARKS = [
  {
    id: 'valles-marineris',
    name: 'Valles Marineris Canyon',
    title: 'Valles Marineris Canyon',
    category: 'Tectonic Rift System',
    lat: -13.9,
    lon: -59.2,
    coords: '13.9°S, 59.2°W • Depth -7.0 km',
    areographic: { latitudeDeg: -13.9, longitudeDeg: -59.2 },
    selenographic: { latitudeDeg: -13.9, longitudeDeg: -59.2 },
    description:
      'Colossal tectonic canyon system stretching over 4,000 km along the Martian equator and plunging up to 7 km deep beneath morning water-ice cloud wisps.',
    referenceImage: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    image: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    referenceCredit: 'NASA / USGS Global Mars Mosaic (1-mars-nasa-gov-jpg)',
    catalogId: 'NASA-MARS-GLOBAL',
    missionName: 'Viking & Mars Global Surveyor Mosaic',
    elevationKm: '-7.0 km Chasma Floor',
    featureDescription:
      'Layered sedimentary chasmata walls, fault scarps, and ferric-oxide canyon plateaus.',
    idealSunAngleDeg: 58,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: '1-mars-nasa-gov-jpg.webp',
    specs: {
      Length: '4,000 km',
      'Max Depth': '7.0 km',
      Dataset: 'MOLA + Viking Mosaic',
      Atmosphere: 'Morning Ice Fog',
    },
  },
  {
    id: 'jezero-perseverance',
    name: 'Jezero Crater — Perseverance',
    title: 'Jezero Crater (Perseverance)',
    category: 'Mars 2020 Rover Site',
    lat: 18.38,
    lon: 77.58,
    coords: '18.38°N, 77.58°E • Elev -2.5 km',
    areographic: { latitudeDeg: 18.38, longitudeDeg: 77.58 },
    selenographic: { latitudeDeg: 18.38, longitudeDeg: 77.58 },
    description:
      'Ancient 45 km lakebed and Neretva Vallis river channel where Perseverance captured Mastcam-Z stereo core pairs (ZCAM10053), SuperCam RMI micro-textures (SCAM04020), and "Cheyava Falls" (PIA26344).',
    referenceImage: '/assets/aistudio/pia26344-1600x_c40461b6.webp',
    image: '/assets/aistudio/pia26344-1600x_c40461b6.webp',
    referenceCredit: 'NASA / JPL-Caltech / MSSS / ASU (PIA26344 · ZCAM10053)',
    catalogId: 'PIA26344 · ZCAM',
    missionName: 'Perseverance Mastcam-Z & SuperCam Suite',
    elevationKm: '-2.5 km Ancient Delta',
    featureDescription:
      'Mastcam-Z ZL0/ZR0 stereo cored bedrock, Kodiak cross-bedded sandstone (ZCAM08693), and Cheyava Falls drill site.',
    idealSunAngleDeg: 72,
    preferredTextureMode: 'zcam-stereo-dem',
    stereoDatasetId: 'ZCAM10053 / SCAM04020 / PIA26202',
    specs: {
      Diameter: '45.0 km',
      'Rover Sol': 'Sol 1218 (PIA26344)',
      'Stereo Pair': 'ZL0/ZR0 ZCAM10053',
      'Micro-Imager': 'SuperCam SCAM04020',
    },
  },
  {
    id: 'gale-curiosity',
    name: 'Gale Crater — Curiosity',
    title: 'Gale Crater (Curiosity)',
    category: 'MSL Rover Landing Site',
    lat: -5.4,
    lon: 137.8,
    coords: '5.4°S, 137.8°E • Aeolis Mons +5.5 km',
    areographic: { latitudeDeg: -5.4, longitudeDeg: 137.8 },
    selenographic: { latitudeDeg: -5.4, longitudeDeg: 137.8 },
    description:
      '154 km impact basin hosting 5.5 km-high Aeolis Mons (Mount Sharp), where Curiosity drilled the "Buckskin" rock target in Marias Pass.',
    referenceImage:
      '/assets/aistudio/32322_mars-curiosity-rover-msl-horizon-sky-self-portrait-PIA19808-full_d447c1a3.jpg',
    image:
      '/assets/aistudio/32322_mars-curiosity-rover-msl-horizon-sky-self-portrait-PIA19808-full_d447c1a3.jpg',
    referenceCredit: 'NASA / JPL-Caltech / MSSS (PIA19808)',
    catalogId: 'PIA19808',
    missionName: 'Mars Science Laboratory Curiosity Rover',
    elevationKm: '+5.5 km Aeolis Mons Peak',
    featureDescription:
      'Sulfate-clay transition strata, Marias Pass high-silica outcrop, and central Mount Sharp massif.',
    idealSunAngleDeg: 85,
    preferredTextureMode: 'jezero-strata',
    stereoDatasetId: 'MSL-PIA19808-MAHLI',
    specs: {
      Diameter: '154.0 km',
      'Central Peak': 'Mount Sharp (5.5 km)',
      Target: 'Buckskin (Sol 1060)',
      Instrument: 'MAHLI Self-Portrait',
    },
  },
  {
    id: 'planum-australe-odyssey',
    name: 'Planum Australe — Mars Odyssey',
    title: 'Planum Australe South Pole',
    category: 'Polar Ice Cap & Odyssey Track',
    lat: -82.5,
    lon: 160.0,
    coords: '82.5°S, 160.0°E • Elev +3.0 km',
    areographic: { latitudeDeg: -82.5, longitudeDeg: 160.0 },
    selenographic: { latitudeDeg: -82.5, longitudeDeg: 160.0 },
    description:
      'Layered CO2 and water-ice south polar cap surveyed from polar orbit by the 2001 Mars Odyssey THEMIS and Gamma Ray Spectrometer beneath polar hood clouds.',
    referenceImage: '/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp',
    image: '/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp',
    referenceCredit: 'NASA / JPL-Caltech (PIA04816)',
    catalogId: 'PIA04816',
    missionName: '2001 Mars Odyssey Orbiter',
    elevationKm: '+3.0 km Polar Ice Cap',
    featureDescription:
      'Spiral CO2 ice troughs, frosted polar scarps, and Odyssey polar thermal mapping track.',
    idealSunAngleDeg: 95,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: 'THEMIS-PIA04816',
    specs: {
      Thickness: '3.0 km CO2 + H2O Ice',
      Orbiter: '2001 Mars Odyssey',
      Instrument: 'THEMIS IR / GRS',
      Catalog: 'PIA04816',
    },
  },
  {
    id: 'olympus-tharsis',
    name: 'Olympus Mons & Orographic Clouds',
    title: 'Olympus Mons Caldera',
    category: 'Shield Volcano & Cloud Plume',
    lat: 18.65,
    lon: -133.8,
    coords: '18.65°N, 133.8°W • Elev +21.9 km',
    areographic: { latitudeDeg: 18.65, longitudeDeg: -133.8 },
    selenographic: { latitudeDeg: 18.65, longitudeDeg: -133.8 },
    description:
      'Largest volcano in the Solar System rising 21.9 km above the Martian datum, generating dense lee-wave water-ice cloud plumes in the upper atmosphere.',
    referenceImage: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    image: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    referenceCredit: 'NASA / MOLA & Viking Orbiter Global Survey',
    catalogId: 'MOLA-THARSIS',
    missionName: 'Mars Global Surveyor / Viking',
    elevationKm: '+21.9 km Summit Caldera',
    featureDescription:
      'Nested 80 km summit caldera complex, 8 km basal cliff aureole, and orographic water-ice clouds.',
    idealSunAngleDeg: 45,
    preferredTextureMode: 'scam-rmi-micro',
    stereoDatasetId: 'MOLA-THARSIS-3D',
    specs: {
      Height: '21.9 km (72,000 ft)',
      Width: '624 km Shield Base',
      Caldera: '80 km Nested Complex',
      Meteorology: 'Orographic Ice Plume',
    },
  },
  {
    id: 'chryse-horizon',
    name: 'MEDA SkyCam & Chryse Limb',
    title: 'MEDA SkyCam Atmospheric Limb',
    category: 'Atmospheric Optics & Rovers',
    lat: 22.4,
    lon: -38.7,
    coords: '22.4°N, 38.7°W • Scale Height 11.1 km',
    areographic: { latitudeDeg: 22.4, longitudeDeg: -38.7 },
    selenographic: { latitudeDeg: 22.4, longitudeDeg: -38.7 },
    description:
      'Outflow basin and atmospheric limb showcasing Mars’s thin semi-transparent CO2 envelope, drifting water-ice cirrus clouds, and MEDA SkyCam solar scattering.',
    referenceImage:
      '/assets/aistudio/32322_mars-curiosity-rover-msl-horizon-sky-self-portrait-PIA19808-full_d447c1a3.jpg',
    image:
      '/assets/aistudio/32322_mars-curiosity-rover-msl-horizon-sky-self-portrait-PIA19808-full_d447c1a3.jpg',
    referenceCredit: 'NASA / JPL-Caltech / MEDA SkyCam (MEDA00000 · PIA19808)',
    catalogId: 'MEDA-SKY-LIMB',
    missionName: 'Perseverance MEDA & MSL Atmospheric Optics',
    elevationKm: '-3.6 km Outflow Limb',
    featureDescription:
      'Semi-transparent atmospheric shell, drifting procedural cirrus clouds, and Rayleigh/Mie twilight rim.',
    idealSunAngleDeg: 130,
    preferredTextureMode: 'jezero-strata',
    stereoDatasetId: 'WSM_2020_0846277167_MEDA00000',
    specs: {
      'Surface Pressure': '6.1 mbar (95.3% CO2)',
      'Cloud Altitude': '25–30 km H2O/CO2 Ice',
      Sensor: 'MEDA SkyCam Fisheye',
      Scattering: 'Butterscotch / Blue Limb',
    },
  },
];

// Export alias for compatibility
export const LUNAR_LANDMARKS = MARS_LANDMARKS;

/**
 * Mars's true axial tilt (obliquity to orbit) is 25.19 degrees (~0.439648 radians),
 * producing distinct Martian seasons and polar ice cap variations similar to Earth.
 */
export const MARS_AXIAL_TILT_RAD = (25.19 * Math.PI) / 180;
export const LUNAR_AXIAL_TILT_RAD = MARS_AXIAL_TILT_RAD;

/**
 * 1 Martian Sidereal Day (Sol) = 24 hours 37 minutes 22.66 seconds (88,642.66 seconds).
 */
export const MARS_SIDEREAL_SOL_SECONDS = 88642.66;

/**
 * Calculates the current Martian rotation angle around its polar axis in radians.
 */
export function calculateAxialRotation(
  elapsedSeconds,
  speedMultiplier = 1.0,
  basePeriodSeconds = 120
) {
  if (basePeriodSeconds <= 0) return 0;
  const angularVelocity = (2 * Math.PI) / basePeriodSeconds;
  return (elapsedSeconds * speedMultiplier * angularVelocity) % (2 * Math.PI);
}

/**
 * Computes the 3D position of the Sun from a solar longitude angle (in degrees) and distance.
 */
export function computeSunPosition(sunAngleDeg = 38, distance = 25) {
  const rad = (Number(sunAngleDeg) * Math.PI) / 180;
  const y = Math.sin(rad * 0.7) * (distance * 0.28);
  const horiz = Math.sqrt(Math.max(1, distance * distance - y * y));
  return {
    x: horiz * Math.cos(rad),
    y,
    z: horiz * Math.sin(rad),
  };
}

/**
 * Computes the continuous zonal (east-west) and meridional (north-south) drift offsets
 * for the procedural Martian water-ice cloud shader relative to the planetary surface.
 */
export function computeCloudDriftOffset(
  elapsedSeconds,
  cloudDriftSpeed = 1.0,
  planetRotationRad = 0
) {
  const safeSpeed = Math.max(0, Number(cloudDriftSpeed) || 0);
  // Super-rotating zonal trade wind phase + subtle meridional wave oscillation
  const zonalPhaseRad =
    (elapsedSeconds * 0.018 * safeSpeed + planetRotationRad * 0.14) % (2 * Math.PI);
  const meridionalPhaseRad = Math.sin(elapsedSeconds * 0.006 * safeSpeed) * 0.18;
  // Approximate high-altitude Martian wind velocity in m/s (typical 15-45 m/s at 25 km altitude)
  const windVelocityMps = Number((22.4 * safeSpeed).toFixed(1));
  const cloudCoverPct = Math.round(38 + Math.sin(elapsedSeconds * 0.05 + 0.6) * 8);

  return {
    zonalPhaseRad: Number(zonalPhaseRad.toFixed(4)),
    meridionalPhaseRad: Number(meridionalPhaseRad.toFixed(4)),
    shaderTime: Number((elapsedSeconds * safeSpeed).toFixed(3)),
    windVelocityMps,
    cloudCoverPct,
  };
}

/**
 * Calculate the sub-solar point in areographic coordinates (lon, lat in degrees)
 * from the sun's direction vector relative to Mars's rotation and 25.19° axial obliquity.
 */
export function calculateSubsolarPoint(sunAngleRad, planetRotationRad) {
  const relAngle = sunAngleRad - planetRotationRad;
  let lonDeg = (relAngle * 180) / Math.PI;
  lonDeg = ((lonDeg + 180) % 360) - 180;
  if (lonDeg < -180) lonDeg += 360;

  const latDeg = ((MARS_AXIAL_TILT_RAD * 180) / Math.PI) * Math.sin(sunAngleRad);

  return {
    longitudeDeg: Number(lonDeg.toFixed(2)),
    latitudeDeg: Number(latDeg.toFixed(2)),
  };
}

/**
 * Converts areographic latitude & longitude (degrees) to 3D Cartesian coordinates on a sphere of radius R.
 */
export function areographicToCartesian(latDeg, lonDeg, radius = 3.0) {
  const latRad = (latDeg * Math.PI) / 180;
  const lonRad = (lonDeg * Math.PI) / 180;

  // Y is polar axis, X & Z are equatorial plane
  const y = radius * Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const x = radius * cosLat * Math.sin(lonRad);
  const z = radius * cosLat * Math.cos(lonRad);

  return { x, y, z };
}

export const latLonToVector3 = areographicToCartesian;
export const selenographicToCartesian = areographicToCartesian;

/**
 * Computes Martian solar illumination phase appearance based on angle between Sun vector and Observer vector.
 */
export function calculateMarsPhase(sunAngleRad, observerAngleRad) {
  let angle = Math.abs(sunAngleRad - observerAngleRad) % (2 * Math.PI);
  if (angle > Math.PI) {
    angle = 2 * Math.PI - angle;
  }

  const phaseAngleDeg = (angle * 180) / Math.PI;
  const illuminationFraction = (1 + Math.cos(angle)) / 2;

  let phaseName = 'Opposition (Full Disk)';
  if (illuminationFraction < 0.03) {
    phaseName = 'Solar Conjunction (Limb Halo)';
  } else if (illuminationFraction < 0.47) {
    phaseName =
      sunAngleRad - observerAngleRad > 0 ? 'Waxing Crescent Limb' : 'Waning Crescent Limb';
  } else if (illuminationFraction <= 0.53) {
    phaseName =
      sunAngleRad - observerAngleRad > 0 ? 'Eastern Quadrature' : 'Western Quadrature';
  } else if (illuminationFraction < 0.97) {
    phaseName =
      sunAngleRad - observerAngleRad > 0 ? 'Morning Gibbous' : 'Evening Gibbous';
  }

  return {
    phaseName,
    illuminationFraction: Number(illuminationFraction.toFixed(3)),
    phaseAngleDeg: Number(phaseAngleDeg.toFixed(1)),
  };
}

export const calculateLunarPhase = calculateMarsPhase;

/**
 * Calculates 3D orbital position from simplified Keplerian orbital elements at time t.
 */
export function calculateOrbitalPosition(orbit, timeSeconds) {
  const M = orbit.meanMotion * timeSeconds;
  const E = M + orbit.eccentricity * Math.sin(M);

  const v =
    2 *
    Math.atan2(
      Math.sqrt(1 + orbit.eccentricity) * Math.sin(E / 2),
      Math.sqrt(1 - orbit.eccentricity) * Math.cos(E / 2)
    );

  const r = orbit.semiMajorAxis * (1 - orbit.eccentricity * Math.cos(E));

  const u = v + orbit.argumentOfPeriapsisRad;
  const xOrb = r * Math.cos(u);
  const yOrb = r * Math.sin(u);

  const cosNode = Math.cos(orbit.longitudeOfAscendingNodeRad);
  const sinNode = Math.sin(orbit.longitudeOfAscendingNodeRad);
  const cosInc = Math.cos(orbit.inclinationRad);
  const sinInc = Math.sin(orbit.inclinationRad);

  const x = xOrb * cosNode - yOrb * sinNode * cosInc;
  const y = yOrb * sinInc;
  const z = xOrb * sinNode + yOrb * cosNode * cosInc;

  return { x, y, z };
}

/**
 * Tumbles a satellite or asteroid across 3 axes based on its angular velocity vector.
 */
export function calculateTumble(currentRot, angularVelocity, dt) {
  const TWO_PI = Math.PI * 2;
  return {
    x: (currentRot.x + angularVelocity.x * dt) % TWO_PI,
    y: (currentRot.y + angularVelocity.y * dt) % TWO_PI,
    z: (currentRot.z + angularVelocity.z * dt) % TWO_PI,
  };
}

/**
 * Formats time or period for telemetry display (MM:SS.ms).
 */
export function formatTelemetryTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(
    millis
  ).padStart(2, '0')}`;
}

/**
 * Formats elapsed simulation time into Coordinated Mars Time (Sol + MTC HH:MM).
 * 1 full rotation (140s base period) = 1 Martian Sol (24h 39m 35s solar day).
 */
export function formatMarsSolTime(elapsedSeconds, basePeriodSeconds = 140) {
  const safePeriod = basePeriodSeconds > 0 ? basePeriodSeconds : 140;
  const totalSols = elapsedSeconds / safePeriod;
  const solNumber = Math.floor(totalSols) + 1218; // Anchored to Perseverance Sol 1218 (PIA26344)
  const solFraction = totalSols - Math.floor(totalSols);
  const marsHoursTotal = solFraction * 24.6597;
  const hours = Math.floor(marsHoursTotal);
  const minutes = Math.floor((marsHoursTotal - hours) * 60);
  return `SOL ${solNumber} · ${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )} MTC`;
}
