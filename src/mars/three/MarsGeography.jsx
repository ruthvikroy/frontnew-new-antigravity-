/**
 * Authentic Mars Geological Feature Markers & Visual Pins
 * Integrates NASA/USGS Gazetteer entries with oblate spheroid terrain coordinates.
 */

import * as THREE from 'three';
import { MARS_GEOLOGICAL_FEATURES } from '../data/mars/geologicalFeatures.js';
import { latLonToOblateVector3 } from '../data/mars/coordinateSystem.js';

const CATEGORY_COLORS = {
  volcano: 0xff4d36, // Volcanic shield red-orange
  canyon: 0x38bdf8,  // Tectonic rift sky blue
  basin: 0xc084fc,   // Impact basin violet
  crater: 0xfbbf24,  // Sedimentary crater amber
  polar: 0xf1f5f9,   // Polar ice cap white
  plains: 0x34d399,  // Sedimentary plains emerald
};

/**
 * Creates the geographical feature pins group
 *
 * @param {Object} options
 * @param {number} options.radius - Base planet radius in 3D world units
 * @param {number} options.elevationExaggeration - Current topographic exaggeration multiplier
 * @returns {{ group: THREE.Group, updatePositions: Function, interactiveObjects: THREE.Mesh[] }}
 */
export function createMarsGeographyPins({
  radius = 3.0,
  elevationExaggeration = 1.0,
} = {}) {
  const group = new THREE.Group();
  group.name = 'MarsGeographyPins';

  const interactiveObjects = [];
  const pinMeshes = [];

  const sphereGeom = new THREE.SphereGeometry(0.065, 16, 16);
  const ringGeom = new THREE.RingGeometry(0.08, 0.11, 24);

  MARS_GEOLOGICAL_FEATURES.forEach((feature) => {
    const pinGroup = new THREE.Group();
    pinGroup.name = `Pin_${feature.id}`;

    const colorHex = CATEGORY_COLORS[feature.category] || 0xff7733;

    // Pin head sphere
    const pinMaterial = new THREE.MeshBasicMaterial({
      color: colorHex,
      toneMapped: false,
    });
    const pinMesh = new THREE.Mesh(sphereGeom, pinMaterial);
    pinMesh.userData = { feature, isPin: true };
    interactiveObjects.push(pinMesh);
    pinGroup.add(pinMesh);

    // Subtle beacon ring around the pin
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      toneMapped: false,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    pinGroup.add(ringMesh);

    // Stalk line connecting marker to surface
    const lineMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45,
    });
    const lineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const line = new THREE.Line(lineGeom, lineMat);
    group.add(line);

    group.add(pinGroup);

    pinMeshes.push({
      feature,
      pinGroup,
      ringMesh,
      line,
    });
  });

  /**
   * Recalculate pin 3D coordinates based on current planetary radius and elevation exaggeration
   */
  function updatePositions(currentRadius = 3.0, exaggeration = 1.0) {
    pinMeshes.forEach(({ feature, pinGroup, ringMesh, line }) => {
      // Pin hover offset slightly above true terrain
      const [px, py, pz] = latLonToOblateVector3(
        feature.lat,
        feature.lon,
        currentRadius,
        feature.elevationKm + 0.4,
        exaggeration
      );

      // Crust base point
      const [bx, by, bz] = latLonToOblateVector3(
        feature.lat,
        feature.lon,
        currentRadius,
        feature.elevationKm,
        exaggeration
      );

      pinGroup.position.set(px, py, pz);

      // Orient beacon ring to face outward along surface normal
      pinGroup.lookAt(px * 2, py * 2, pz * 2);

      // Update line points
      const positions = line.geometry.attributes.position;
      positions.setXYZ(0, bx, by, bz);
      positions.setXYZ(1, px, py, pz);
      positions.needsUpdate = true;
    });
  }

  // Initial positioning
  updatePositions(radius, elevationExaggeration);

  return {
    group,
    updatePositions,
    interactiveObjects,
    pinMeshes,
  };
}
