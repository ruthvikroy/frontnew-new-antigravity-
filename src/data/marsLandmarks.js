/**
 * Mars Areographic Landmarks, Exploration Sites, and 3D Texture Modes
 * Sourced from NASA / JPL-Caltech / MSSS / MOLA / Perseverance / Curiosity / Odyssey missions.
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

export const MARS_3D_TEXTURE_MODES = [
  {
    id: 'global-mola',
    name: 'Global MOLA + Viking/MRO 3D',
    label: 'Global MOLA + Viking/MRO 3D',
    shortLabel: 'Global MOLA 3D',
    instrument: 'Viking & MGS MOLA Altimeter',
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
    id: 'jezero-perseverance',
    name: 'Jezero Crater — Perseverance',
    shortName: 'Jezero (Perseverance)',
    badge: 'M2020',
    title: 'Jezero Crater (Perseverance Rover)',
    category: 'Mars 2020 Rover Site',
    categoryLabel: 'Rover Exploration Site',
    color: '#ef4444',
    lat: 18.38,
    lon: 77.58,
    coords: '18.38°N, 77.58°E • Elev -2.5 km',
    areographic: { latitudeDeg: 18.38, longitudeDeg: 77.58 },
    description:
      'Ancient 45 km lakebed and Neretva Vallis river channel where Perseverance surveyed wind-sculpted ventifacts, perched rocks, Mastcam-Z stereo core pairs (ZCAM10053), and "Cheyava Falls" (PIA26344).',
    referenceImage: '/assets/mars_reference/mars_ref_1_ventifacts.jpg',
    image: '/assets/mars_reference/mars_ref_1_ventifacts.jpg',
    referenceCredit: 'NASA / JPL-Caltech / MSSS / ASU (Mastcam-Z Ventifacts & ZCAM10053)',
    catalogId: 'PIA26344 · ZCAM',
    missionName: 'Perseverance Mastcam-Z & SuperCam Suite',
    elevationKm: '-2.5 km Ancient Delta',
    featureDescription:
      'Wind-sculpted perched ventifacts, Mastcam-Z stereo cored bedrock, Kodiak cross-bedded sandstone, and Cheyava Falls drill site.',
    preferredTextureMode: 'zcam-stereo-dem',
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
    shortName: 'Gale (Curiosity)',
    badge: 'MSL',
    title: 'Gale Crater (Curiosity Rover)',
    category: 'MSL Rover Landing Site',
    categoryLabel: 'Rover Exploration Site',
    color: '#f97316',
    lat: -5.4,
    lon: 137.8,
    coords: '5.4°S, 137.8°E • Aeolis Mons +5.5 km',
    areographic: { latitudeDeg: -5.4, longitudeDeg: 137.8 },
    description:
      '154 km impact basin hosting 5.5 km-high Aeolis Mons (Mount Sharp), presenting layered sulfate hillside scree slopes, bedrock escarpments, and Marias Pass silica deposits.',
    referenceImage: '/assets/mars_reference/mars_ref_2_hillside.jpg',
    image: '/assets/mars_reference/mars_ref_2_hillside.jpg',
    referenceCredit: 'NASA / JPL-Caltech / MSSS (Mount Sharp Layered Scree & Strata)',
    catalogId: 'PIA19808',
    missionName: 'Mars Science Laboratory Curiosity Rover',
    elevationKm: '+5.5 km Aeolis Mons Peak',
    featureDescription:
      'Sulfate-clay transition strata, Marias Pass high-silica outcrop, and central Mount Sharp massif.',
    preferredTextureMode: 'jezero-strata',
    specs: {
      Diameter: '154.0 km',
      'Central Peak': 'Mount Sharp (5.5 km)',
      Target: 'Buckskin (Sol 1060)',
      Instrument: 'MAHLI Self-Portrait',
    },
  },
  {
    id: 'olympus-tharsis',
    name: 'Olympus Mons & Orographic Clouds',
    shortName: 'Olympus Mons',
    badge: 'SHIELD',
    title: 'Olympus Mons Caldera',
    category: 'Shield Volcano & Cloud Plume',
    categoryLabel: 'Volcanic Caldera',
    color: '#eab308',
    lat: 18.65,
    lon: -133.8,
    coords: '18.65°N, 133.8°W • Elev +21.9 km',
    areographic: { latitudeDeg: 18.65, longitudeDeg: -133.8 },
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
    preferredTextureMode: 'scam-rmi-micro',
    specs: {
      Height: '21.9 km (72,000 ft)',
      Width: '624 km Shield Base',
      Caldera: '80 km Nested Complex',
      Meteorology: 'Orographic Ice Plume',
    },
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris Canyon',
    shortName: 'Valles Marineris',
    badge: 'RIFT',
    title: 'Valles Marineris Canyon System',
    category: 'Tectonic Rift System',
    categoryLabel: 'Equatorial Chasma',
    color: '#06b6d4',
    lat: -13.9,
    lon: -59.2,
    coords: '13.9°S, 59.2°W • Depth -7.0 km',
    areographic: { latitudeDeg: -13.9, longitudeDeg: -59.2 },
    description:
      'Colossal tectonic canyon system stretching over 4,000 km along the Martian equator and plunging up to 7 km deep beneath morning water-ice cloud wisps.',
    referenceImage: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
    image: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
    referenceCredit: 'NASA / MRO HiRISE & Surface Imaging (Cross-Bedded Strata Outcrop)',
    catalogId: 'NASA-MARS-GLOBAL',
    missionName: 'Viking & Mars Global Surveyor Mosaic',
    elevationKm: '-7.0 km Chasma Floor',
    featureDescription:
      'Layered sedimentary chasmata walls, fault scarps, and ferric-oxide canyon plateaus.',
    preferredTextureMode: 'global-mola',
    specs: {
      Length: '4,000 km',
      'Max Depth': '7.0 km',
      Dataset: 'MOLA + Viking Mosaic',
      Atmosphere: 'Morning Ice Fog',
    },
  },
  {
    id: 'planum-australe-odyssey',
    name: 'Planum Australe — Mars Odyssey',
    shortName: 'Planum Australe',
    badge: 'ODY',
    title: 'Planum Australe South Pole',
    category: 'Polar Ice Cap & Odyssey Track',
    categoryLabel: 'Polar Ice Sheet',
    color: '#38bdf8',
    lat: -82.5,
    lon: 160.0,
    coords: '82.5°S, 160.0°E • Elev +3.0 km',
    areographic: { latitudeDeg: -82.5, longitudeDeg: 160.0 },
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
    preferredTextureMode: 'global-mola',
    specs: {
      Thickness: '3.0 km CO2 + H2O Ice',
      Orbiter: '2001 Mars Odyssey',
      Instrument: 'THEMIS IR / GRS',
      Catalog: 'PIA04816',
    },
  },
  {
    id: 'chryse-horizon',
    name: 'MEDA SkyCam & Chryse Limb',
    shortName: 'MEDA Limb',
    badge: 'SKYCAM',
    title: 'MEDA SkyCam Atmospheric Limb',
    category: 'Atmospheric Optics & Rovers',
    categoryLabel: 'Atmospheric Horizon',
    color: '#a855f7',
    lat: 22.4,
    lon: -38.7,
    coords: '22.4°N, 38.7°W • Scale Height 11.1 km',
    areographic: { latitudeDeg: 22.4, longitudeDeg: -38.7 },
    description:
      'Outflow basin and atmospheric limb showcasing Mars’s thin semi-transparent CO2 envelope, drifting water-ice cirrus clouds, and MEDA SkyCam solar scattering.',
    referenceImage: '/assets/mars_reference/mars_ref_4_boulder_field.jpg',
    image: '/assets/mars_reference/mars_ref_4_boulder_field.jpg',
    referenceCredit: 'NASA / Surface Imaging (Basaltic Boulder Field on Regolith)',
    catalogId: 'MEDA-SKY-LIMB',
    missionName: 'Perseverance MEDA & MSL Atmospheric Optics',
    elevationKm: '-3.6 km Outflow Limb',
    featureDescription:
      'Semi-transparent atmospheric shell, drifting procedural cirrus clouds, and Rayleigh/Mie twilight rim.',
    preferredTextureMode: 'jezero-strata',
    specs: {
      'Surface Pressure': '6.1 mbar (95.3% CO2)',
      'Cloud Altitude': '25–30 km H2O/CO2 Ice',
      Sensor: 'MEDA SkyCam Fisheye',
      Scattering: 'Butterscotch / Blue Limb',
    },
  },
];

export const MARS_LOCATIONS_MAP = new Map(
  MARS_LANDMARKS.map((lm) => [lm.id, lm])
);

/**
 * Converts areographic latitude/longitude to 3D Cartesian coordinates on a sphere of radius R.
 */
export function areographicToCartesian(latDeg, lonDeg, radius = 1.0) {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

