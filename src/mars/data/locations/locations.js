/**
 * Authenticated NASA / USGS Planetary Science Gazetteer & Surface Locations
 * Sources:
 * - IAU Working Group for Planetary System Nomenclature (WGPSN)
 * - NASA Mars Global Surveyor (MOLA), Mars Odyssey (THEMIS), MRO (HiRISE/CRISM)
 * - USGS Astrogeology Science Center Mars Nomenclature Gazetteer
 */

import { MARS_GEOLOGICAL_FEATURES } from '../mars/geologicalFeatures.js';

export const MARS_LOCATIONS = MARS_GEOLOGICAL_FEATURES.map((feat) => ({
  id: feat.id,
  name: feat.name,
  type: feat.category,
  lat: feat.lat,
  lon: feat.lon,
  elevationKm: feat.elevationKm,
  diameterKm: feat.diameterKm,
  description: feat.description,
  geologicalSignificance: feat.geologicalSignificance,
  missionInfo: feat.orbitalMissions,
  sourceReference: `USGS Astrogeology / MOLA Topography Model (${feat.surfaceMineralogy || 'NASA PDS'})`,
  surfaceMineralogy: feat.surfaceMineralogy,
  geologicalEpoch: feat.geologicalEpoch,
}));

export default MARS_LOCATIONS;
