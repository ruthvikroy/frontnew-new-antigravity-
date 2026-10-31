/**
 * Scientifically Grounded Mars Terrain Geometry
 * Generates an oblate spheroid with MOLA topographic vertex displacement.
 *
 * Parameters:
 * - Equatorial Radius: 3,396.2 km (scaled to 3D world units, default 3.0)
 * - Polar Radius: 3,376.2 km (flattening ratio b/a = 0.994111)
 * - MOLA Vertex Displacement: derived from getMolaElevation(lat, lon)
 */

import * as THREE from 'three';
import { MARS_PLANETARY_CONSTANTS } from '../data/mars/planetaryConstants.js';
import { getMolaElevation } from '../data/mars/elevationData.js';

/**
 * Creates a Mars planetary terrain geometry
 *
 * @param {Object} options
 * @param {number} options.radius - Base equatorial radius in world units (default 3.0)
 * @param {number} options.elevationExaggeration - Topographic exaggeration multiplier (1.0 = true scale, 3.0 = enhanced, 6.0 = structural)
 * @param {boolean} options.isOblate - Apply rotational oblateness flattening (default true)
 * @param {boolean} options.isLowPerformance - Reduce segment resolution for software WebGL
 * @returns {THREE.BufferGeometry}
 */
export function createMarsTerrainGeometry({
  radius = 3.0,
  elevationExaggeration = 1.0,
  isOblate = true,
  isLowPerformance = false,
} = {}) {
  const widthSegments = isLowPerformance ? 64 : 128;
  const heightSegments = isLowPerformance ? 64 : 128;

  // Base spherical geometry
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const posAttr = geometry.attributes.position;
  const uvAttr = geometry.attributes.uv;

  const count = posAttr.count;
  const polarRatio = isOblate ? MARS_PLANETARY_CONSTANTS.POLAR_FLATTENING_RATIO : 1.0;
  const kmToWorldUnits = radius / MARS_PLANETARY_CONSTANTS.EQUATORIAL_RADIUS_KM;

  const vertex = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    // Derive lat and lon from UV coordinates for perfect texture alignment
    // u: [0, 1] corresponds to longitude [-180°, +180°]
    // v: [0, 1] corresponds to latitude [-90°, +90°] (Three.js uv.y goes from south pole 0 to north pole 1)
    const u = uvAttr.getX(i);
    const v = uvAttr.getY(i);

    const lon = (u - 0.5) * 360.0;
    const lat = (v - 0.5) * 180.0;

    // Sample MOLA elevation in kilometers
    const elevationKm = getMolaElevation(lat, lon);

    // Compute radial topographic displacement
    const radialDelta = elevationKm * elevationExaggeration * kmToWorldUnits;

    // Normalize direction
    const length = vertex.length();
    if (length > 0) {
      vertex.multiplyScalar((radius + radialDelta) / length);
    }

    // Apply oblateness flattening strictly along Y polar axis
    vertex.y *= polarRatio;

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}
