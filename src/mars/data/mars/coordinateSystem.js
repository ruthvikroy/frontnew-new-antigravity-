import { MARS_PLANETARY_CONSTANTS } from './planetaryConstants.js';

/**
 * IAU Planetocentric Coordinate System for Mars
 * Reference: Archinal et al. (2018), Report of the IAU/IAG Working Group
 * on Cartographic Coordinates and Rotational Elements.
 *
 * Coordinates:
 * - Planetocentric Latitude φ: -90° (South Pole) to +90° (North Pole)
 * - Planetocentric Longitude λ: 0° to 360° East (or -180° to +180° West)
 * - Reference Meridian λ=0° defined by the center of crater Airy-0 in Sinus Meridiani.
 */

/**
 * Convert Planetocentric Latitude and Longitude to 3D Cartesian coordinates
 * on an oblate spheroid of equatorial radius R_eq and flattening f.
 *
 * @param {number} lat - Latitude in degrees (-90 to +90)
 * @param {number} lon - Longitude in degrees (-180 to +180 or 0 to 360 East)
 * @param {number} radius - Base equatorial radius in 3D world units (default 3.0)
 * @param {number} elevationKm - Topographic elevation in km relative to MOLA datum
 * @param {number} elevationExaggeration - Topographic exaggeration multiplier (default 1.0)
 * @returns {[number, number, number]} [x, y, z] Cartesian vector
 */
export function latLonToOblateVector3(
  lat,
  lon,
  radius = 3.0,
  elevationKm = 0,
  elevationExaggeration = 1.0
) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Elevation delta relative to planetary radius
  // Elevation in km scaled to 3D world radius
  // Scale factor: world_units / km = radius / EQUATORIAL_RADIUS_KM
  const kmToWorldUnits = radius / MARS_PLANETARY_CONSTANTS.EQUATORIAL_RADIUS_KM;
  const radialDisplacement = elevationKm * elevationExaggeration * kmToWorldUnits;

  const currentRadius = radius + radialDisplacement;
  const polarScale = MARS_PLANETARY_CONSTANTS.POLAR_FLATTENING_RATIO; // 0.99411

  const x = -currentRadius * Math.sin(phi) * Math.cos(theta);
  // Apply oblateness flattening strictly along rotational Y axis
  const y = currentRadius * Math.cos(phi) * polarScale;
  const z = currentRadius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

/**
 * Convert 3D Cartesian point on Mars globe back to planetocentric Latitude and Longitude
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {{ lat: number, lon: number, distance: number }}
 */
export function vector3ToLatLon(x, y, z) {
  const polarScale = MARS_PLANETARY_CONSTANTS.POLAR_FLATTENING_RATIO;
  // Unflatten Y coordinate to recover true planetocentric latitude
  const unflattenedY = y / polarScale;
  const distance = Math.sqrt(x * x + unflattenedY * unflattenedY + z * z);

  if (distance === 0) return { lat: 0, lon: 0, distance: 0 };

  const phi = Math.acos(Math.max(-1, Math.min(1, unflattenedY / distance)));
  const lat = 90 - (phi * 180) / Math.PI;

  let lon = (Math.atan2(z, -x) * 180) / Math.PI - 180;
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;

  return { lat, lon, distance };
}

/**
 * Standard Great Circle Distance on Mars between two coordinates
 * Uses spherical haversine formula with Mars volumetric mean radius
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in kilometers
 */
export function calculateGreatCircleDistanceKm(lat1, lon1, lat2, lon2) {
  const r = MARS_PLANETARY_CONSTANTS.MEAN_RADIUS_KM;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
}
