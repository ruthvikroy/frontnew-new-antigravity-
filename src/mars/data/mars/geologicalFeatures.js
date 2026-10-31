/**
 * NASA / USGS Planetary Gazetteer & Geological Features Database for Mars
 * References:
 * - IAU Working Group for Planetary System Nomenclature (WGPSN)
 * - USGS Astrogeology Science Center Mars Nomenclature Gazetteer
 * - NASA Mars Global Surveyor (MOLA), Mars Odyssey (THEMIS), and MRO (HiRISE/CRISM)
 */

export const MARS_GEOLOGICAL_FEATURES = [
  {
    id: 'olympus_mons',
    name: 'Olympus Mons',
    category: 'volcano',
    type: 'Shield Volcano (Mons)',
    lat: 18.65,
    lon: -133.8, // 226.2° E
    elevationKm: 21.9,
    diameterKm: 624,
    calderaDimensionsKm: '80 × 60',
    basalScarpHeightKm: 8.0,
    geologicalEpoch: 'Late Amazonian (youngest caldera flows ~25–100 Ma)',
    description:
      'The highest planetary mountain and volcanic shield in the Solar System. Rising 21.9 km above the MOLA datum, its footprint covers an area comparable to Poland or Arizona. Ringed by an abrupt 8-km-high basal cliff formed by catastrophic flank collapses.',
    geologicalSignificance:
      'Formed by basaltic hotspot effusive volcanism atop a stationary, thick lithospheric plate, allowing magma eruptions over hundreds of millions of years without tectonic plate displacement.',
    orbitalMissions: 'Mariner 9, Viking 1/2, Mars Express (HRSC), MRO (HiRISE, CTX)',
    surfaceMineralogy: 'Augite-rich basaltic lavas, plagioclase, localized dust mantling',
  },
  {
    id: 'ascraeus_mons',
    name: 'Ascraeus Mons',
    category: 'volcano',
    type: 'Shield Volcano (Mons)',
    lat: 11.9,
    lon: -104.0, // 256.0° E
    elevationKm: 18.2,
    diameterKm: 480,
    calderaDimensionsKm: '24 × 30',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Amazonian',
    description:
      'The northernmost and highest of the three Tharsis Montes shield volcanoes, rising to 18.2 km. Features complex nested calderas and pristine lava channels along its lower aprons.',
    geologicalSignificance:
      'Marks the northern apex of the Tharsis volcanic alignment, showing extensive glacial deposit morphologies on its western flanks.',
    orbitalMissions: 'Mars Express HRSC, MRO CTX/HiRISE',
    surfaceMineralogy: 'High-calcium pyroxene basalt with localized water ice cloud caps',
  },
  {
    id: 'pavonis_mons',
    name: 'Pavonis Mons',
    category: 'volcano',
    type: 'Shield Volcano (Mons)',
    lat: 0.8,
    lon: -112.9, // 247.1° E
    elevationKm: 14.1,
    diameterKm: 375,
    calderaDimensionsKm: '45 × 45',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Hesperian to Amazonian',
    description:
      'The central Tharsis Montes volcano situated almost precisely on the Martian equator (0.8°N). Features a single circular collapse caldera 4.8 km deep.',
    geologicalSignificance:
      'Equatorial location makes it a prime theoretical site for future planetary space elevators due to low gravity and high elevation above 99% of atmospheric column.',
    orbitalMissions: 'Viking Orbiter, Mars Odyssey, MRO',
    surfaceMineralogy: 'Basaltic flows, volcanic ash fall, and aeolian dust drifts',
  },
  {
    id: 'arsia_mons',
    name: 'Arsia Mons',
    category: 'volcano',
    type: 'Shield Volcano (Mons)',
    lat: -8.4,
    lon: -121.1, // 238.9° E
    elevationKm: 17.7,
    diameterKm: 435,
    calderaDimensionsKm: '110 × 110',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Amazonian',
    description:
      'The southernmost Tharsis shield volcano with the Solar System’s widest volcanic caldera, measuring over 110 km across. Features a prominent seasonal orographic water-ice cloud plume extending up to 1,800 km westward.',
    geologicalSignificance:
      'Hosts pit craters and skylights on its flanks that may lead into subterranean volcanic lava tubes, considered high-priority candidate shelters for human exploration.',
    orbitalMissions: 'MGS MOLA, Mars Odyssey THEMIS, Mars Express HRSC',
    surfaceMineralogy: 'Basalt, low-albedo volcanic sands, seasonal water ice frost',
  },
  {
    id: 'elysium_mons',
    name: 'Elysium Mons',
    category: 'volcano',
    type: 'Volcanic Shield (Mons)',
    lat: 25.02,
    lon: 147.21,
    elevationKm: 14.1,
    diameterKm: 240,
    calderaDimensionsKm: '14 × 14',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Hesperian to Amazonian',
    description:
      'The principal volcano of the Elysium province, the second major volcanic region of Mars, isolated in the northern volcanic lowlands.',
    geologicalSignificance:
      'Surrounded by Cerberus Fossae extensional fissures, the source of some of the youngest volcanic lava flows (<10 Ma) and catastrophic flood releases on Mars.',
    orbitalMissions: 'Mariner 9, Mars Global Surveyor, InSight SEIS seismometer (~1600 km away)',
    surfaceMineralogy: 'Tholeiitic basalt, olivine, volcanic tephra',
  },
  {
    id: 'valles_marineris',
    name: 'Valles Marineris',
    category: 'canyon',
    type: 'Extensional Chasma System',
    lat: -14.0,
    lon: -59.0, // 301.0° E
    elevationKm: -7.0,
    diameterKm: 4000,
    calderaDimensionsKm: 'Width up to 200 km',
    basalScarpHeightKm: 7.0,
    geologicalEpoch: 'Noachian to Hesperian tectonic opening',
    description:
      'A continental-scale grand canyon system stretching over 4,000 km across a quarter of Mars’ equatorial circumference, reaching depths of 7 to 10 km below adjacent Tharsis plateaus.',
    geologicalSignificance:
      'A tectonic rift system formed during Tharsis crustal upwelling, exposing stratified sedimentary sequences and hydrated sulfates (kieserite, gypsum) deposited in ancient standing water bodies.',
    orbitalMissions: 'Mariner 9 (1971 discovery), Viking, Mars Express OMEGA, MRO CRISM',
    surfaceMineralogy: 'Hydrated magnesium sulfates, iron oxides, pyroxene bedrock',
  },
  {
    id: 'hellas_planitia',
    name: 'Hellas Planitia',
    category: 'basin',
    type: 'Giant Impact Basin',
    lat: -42.7,
    lon: 70.0,
    elevationKm: -8.2,
    diameterKm: 2300,
    calderaDimensionsKm: 'Rim-to-rim 2,300 km',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Early Noachian (~4.1–3.8 Ga)',
    description:
      'The deepest and largest clearly visible impact basin on Mars, descending to -8.2 km below the MOLA datum. The atmospheric pressure at its floor reaches 12.4 mbar, nearly double the planetary mean.',
    geologicalSignificance:
      'Ancient basin whose impact restructured the Martian crust and antipodean volcanism; atmospheric density allows liquid water to theoretically persist at floor temperatures above 0°C without immediate boiling.',
    orbitalMissions: 'Viking, MGS MOLA, Mars Odyssey THEMIS, ExoMars TGO',
    surfaceMineralogy: 'Carbonates, phyllosilicates, thick dust deposits, seasonal $\\text{CO}_2$ frost',
  },
  {
    id: 'argyre_planitia',
    name: 'Argyre Planitia',
    category: 'basin',
    type: 'Impact Basin',
    lat: -49.7,
    lon: -43.8, // 316.2° E
    elevationKm: -3.0,
    diameterKm: 900,
    calderaDimensionsKm: 'Rim diameter ~1,200 km',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Early Noachian (~3.9 Ga)',
    description:
      'A well-preserved impact basin in the southern cratered highlands encircled by the rugged Nereidum and Charitum mountain ranges. Fed by several ancient inflow channels (Surius, Dzigai, and Palacopas Valles).',
    geologicalSignificance:
      'Demonstrates prolonged lacustrine and glacial activity, with evidence of paleolakes, eskers, and glacial moraines in the surrounding massifs.',
    orbitalMissions: 'MGS, Mars Express HRSC, MRO',
    surfaceMineralogy: 'Smectite clays, iron oxides, basaltic sand sheets',
  },
  {
    id: 'gale_crater',
    name: 'Gale Crater (Mount Sharp)',
    category: 'crater',
    type: 'Sedimentary Impact Crater',
    lat: -5.37,
    lon: 137.86,
    elevationKm: -4.5,
    diameterKm: 154,
    calderaDimensionsKm: 'Aeolis Mons summit +0.8 km',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Late Noachian / Early Hesperian (~3.7 Ga)',
    description:
      'An ancient impact crater featuring a 5.5-km-high central sedimentary mound, Aeolis Mons (Mount Sharp), exposing billions of years of depositional strata from lake sediments to dry aeolian sandstones.',
    geologicalSignificance:
      'NASA Curiosity rover landing site (August 2012). Confirmed long-lived neutral pH fluvio-lacustrine habitable environments, indigenous organic molecules, and fluctuating atmospheric methane.',
    orbitalMissions: 'MRO HiRISE/CRISM (site selection), Curiosity Rover in situ operations',
    surfaceMineralogy: 'Nontronite/saponite clays, hematite, calcium/magnesium sulfates',
  },
  {
    id: 'jezero_crater',
    name: 'Jezero Crater',
    category: 'crater',
    type: 'Deltaic Impact Crater',
    lat: 18.38,
    lon: 77.58,
    elevationKm: -2.5,
    diameterKm: 45,
    calderaDimensionsKm: 'Delta fan width ~8 km',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Late Noachian / Early Hesperian',
    description:
      'An ancient crater on the western margin of Isidis basin containing one of the most impeccably preserved river delta deposits on Mars, formed by the Neretva Vallis river breach.',
    geologicalSignificance:
      'NASA Mars 2020 Perseverance rover and Ingenuity helicopter landing site. Actively caching rock cores for the future Mars Sample Return mission to search for ancient biosignatures.',
    orbitalMissions: 'MRO HiRISE/CRISM, Perseverance Rover in situ',
    surfaceMineralogy: 'Magnesite carbonates, Fe/Mg smectite clays, olivine cumulate floor',
  },
  {
    id: 'planum_boreum',
    name: 'Planum Boreum (North Polar Cap)',
    category: 'polar',
    type: 'Polar Layered Deposits (PLD)',
    lat: 88.0,
    lon: 0.0,
    elevationKm: 2.8,
    diameterKm: 1000,
    calderaDimensionsKm: 'Ice volume ~1.6 million km³',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Late Amazonian to Present (cyclical insolation layering)',
    description:
      'The permanent northern ice cap composed of water ice with a thin seasonal veneer of frozen carbon dioxide. Cut by spiral troughs and the massive Chasma Boreale canyon.',
    geologicalSignificance:
      'Preserves a high-resolution geological record of Martian climate and orbital obliquity oscillations over the last few million years, comparable to Earth’s Greenland and Antarctic ice sheets.',
    orbitalMissions: 'Viking 2, Mars Global Surveyor, Mars Odyssey, Mars Express SHARAD radar',
    surfaceMineralogy: 'Water ice (H₂O), seasonal dry ice (CO₂), atmospheric dust particulates',
  },
  {
    id: 'planum_australe',
    name: 'Planum Australe (South Polar Cap)',
    category: 'polar',
    type: 'Polar Layered Deposits & Residual CO₂ Cap',
    lat: -87.0,
    lon: 0.0,
    elevationKm: 3.4,
    diameterKm: 1400,
    calderaDimensionsKm: 'Residual dry ice slab 8 m thick',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Late Amazonian to Present',
    description:
      'The elevated southern polar ice cap resting at +3.4 km elevation. Unlike the northern cap, it retains a perennial surface layer of solid carbon dioxide ("dry ice") featuring distinctive "Swiss cheese" terrain pits.',
    geologicalSignificance:
      'SHARAD and MARSIS orbital radars detected massive subsurface reflections interpreted as extensive basal ice and possible subglacial briny liquid bodies.',
    orbitalMissions: 'MGS, Mars Express MARSIS, MRO SHARAD',
    surfaceMineralogy: 'Carbon dioxide ice (CO₂), water ice (H₂O), carbon dioxide gas geysers',
  },
  {
    id: 'syrtis_major',
    name: 'Syrtis Major Planum',
    category: 'volcano',
    type: 'Basaltic Volcanic Plateau',
    lat: 8.4,
    lon: 69.5,
    elevationKm: 1.0,
    diameterKm: 1300,
    calderaDimensionsKm: 'Nili & Meroe Paterae',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Hesperian',
    description:
      'The most prominent dark albedo feature visible from Earth-based telescopes since Christiaan Huygens sketched it in 1659. A low-relief volcanic shield with two nested calderas.',
    geologicalSignificance:
      'The low albedo is caused by wind-swept unweathered basaltic sands devoid of thick red dust mantling, exposing primordial Martian crustal minerals.',
    orbitalMissions: 'Historic Earth telescopes, Viking, MGS MOLA, Mars Express',
    surfaceMineralogy: 'Unaltered augite, plagioclase feldspar, and dacitic lavas',
  },
  {
    id: 'sinus_meridiani',
    name: 'Sinus Meridiani (Airy-0)',
    category: 'plains',
    type: 'Planetary Prime Meridian & Sedimentary Plains',
    lat: 0.0,
    lon: 0.0,
    elevationKm: -1.3,
    diameterKm: 1600,
    calderaDimensionsKm: 'Crater Airy-0 (0.5 km diameter)',
    basalScarpHeightKm: 0,
    geologicalEpoch: 'Noachian to Hesperian',
    description:
      'The geographic origin (0° Latitude, 0° Longitude) of Mars cartography, centered on crater Airy-0. Landing site of NASA Opportunity rover (MER-B) in 2004.',
    geologicalSignificance:
      'Opportunity discovered gray crystalline hematite spherules ("blueberries") and sulfate-cemented sandstones formed in groundwater-saturated acidic lakebeds.',
    orbitalMissions: 'Mariner 9 (defined meridian), Mars Global Surveyor (TES), Opportunity Rover',
    surfaceMineralogy: 'Gray crystalline hematite, jarosite sulfate, basaltic regolith',
  },
];
