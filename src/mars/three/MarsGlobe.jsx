/**
 * Master Mars Globe Assembly
 * Unifies:
 * - Mars Axial Tilt (25.19°)
 * - Oblate Spheroid Geometry with MOLA Topographic Elevation Displacement
 * - Multi-layer Surface PBR Material (Natural Viking MDIM, MOLA Hypsometric, Shaded Relief)
 * - Atmospheric Limb Glow Shader
 * - Authentic Planetary Geography Markers
 */

import * as THREE from 'three';
import { MARS_PLANETARY_CONSTANTS } from '../data/mars/planetaryConstants.js';
import { createMarsTerrainGeometry } from './MarsTerrain.jsx';
import { createMarsSurfaceMaterial, setMarsMaterialLayer } from './MarsSurfaceMaterial.jsx';
import { createMarsAtmosphereMesh } from './MarsAtmosphere.jsx';
import { createMarsGeographyPins } from './MarsGeography.jsx';

/**
 * Creates the complete Mars planetary globe assembly
 *
 * @param {Object} options
 * @param {number} options.radius - Base equatorial radius in world units (default 3.0)
 * @param {number} options.elevationExaggeration - 1.0 (true scale), 3.0 (enhanced), 6.0 (geomorphology)
 * @param {boolean} options.isOblate - Enable oblate spheroid flattening (b/a = 0.994111)
 * @param {string} options.layer - 'natural' | 'mola' | 'shaded_relief'
 * @param {boolean} options.isLowPerformance - Software WebGL compatibility flag
 * @returns {Object} Globe controllers and mesh hierarchy
 */
export function createMarsGlobe({
  radius = 3.0,
  elevationExaggeration = 1.0,
  isOblate = true,
  layer = 'natural',
  isLowPerformance = false,
} = {}) {
  // Master tilt group oriented to Mars axial tilt (25.19°)
  const tiltGroup = new THREE.Group();
  tiltGroup.name = 'MarsTiltGroup';
  tiltGroup.rotation.z = THREE.MathUtils.degToRad(-MARS_PLANETARY_CONSTANTS.AXIAL_TILT_DEG);

  // Rotating planet group
  const planetGroup = new THREE.Group();
  planetGroup.name = 'MarsPlanetGroup';
  tiltGroup.add(planetGroup);

  // 1. Terrain Mesh
  let terrainGeometry = createMarsTerrainGeometry({
    radius,
    elevationExaggeration,
    isOblate,
    isLowPerformance,
  });

  const surfaceMaterial = createMarsSurfaceMaterial({
    layer,
    elevationExaggeration,
    isLowPerformance,
  });

  const terrainMesh = new THREE.Mesh(terrainGeometry, surfaceMaterial);
  terrainMesh.name = 'MarsSurfaceTerrain';
  terrainMesh.castShadow = !isLowPerformance;
  terrainMesh.receiveShadow = !isLowPerformance;
  planetGroup.add(terrainMesh);

  // 2. Atmosphere Glow Mesh
  const atmosphereMesh = createMarsAtmosphereMesh({
    radius,
    dustOpticalDepth: 0.35,
  });
  planetGroup.add(atmosphereMesh);

  // 3. Geography Markers
  const geography = createMarsGeographyPins({
    radius,
    elevationExaggeration,
  });
  planetGroup.add(geography.group);

  let currentExaggeration = elevationExaggeration;
  let currentOblate = isOblate;

  /**
   * Rebuilds terrain geometry when exaggeration or oblateness mode changes
   */
  function updateTerrainGeometry(newExaggeration, newOblate = currentOblate) {
    currentExaggeration = newExaggeration;
    currentOblate = newOblate;

    // Dispose old geometry
    terrainMesh.geometry.dispose();

    terrainMesh.geometry = createMarsTerrainGeometry({
      radius,
      elevationExaggeration: currentExaggeration,
      isOblate: currentOblate,
      isLowPerformance,
    });

    surfaceMaterial.bumpScale = 0.05 * Math.min(3.0, currentExaggeration);

    geography.updatePositions(radius, currentExaggeration);
  }

  /**
   * Switch the visual scientific layer
   */
  function setLayer(newLayer) {
    setMarsMaterialLayer(surfaceMaterial, newLayer);
  }

  /**
   * Animation update step
   */
  function update(delta, isRotating = true, speedMultiplier = 1.0, sunDirection = null) {
    if (isRotating) {
      // Mars sidereal rotation is ~24.62 hours
      // Base rotation step: 0.05 rad/sec scaled by speedMultiplier
      planetGroup.rotation.y += delta * 0.06 * speedMultiplier;
    }

    if (sunDirection && atmosphereMesh.material.uniforms?.uSunDirection) {
      atmosphereMesh.material.uniforms.uSunDirection.value.copy(sunDirection);
    }
  }

  /**
   * Resource disposal
   */
  function dispose() {
    terrainMesh.geometry.dispose();
    surfaceMaterial.dispose();
    atmosphereMesh.geometry.dispose();
    atmosphereMesh.material.dispose();
  }

  return {
    tiltGroup,
    planetGroup,
    terrainMesh,
    surfaceMaterial,
    atmosphereMesh,
    geography,
    updateTerrainGeometry,
    setLayer,
    update,
    dispose,
    get rotationY() {
      return planetGroup.rotation.y;
    },
    set rotationY(val) {
      planetGroup.rotation.y = val;
    },
  };
}
