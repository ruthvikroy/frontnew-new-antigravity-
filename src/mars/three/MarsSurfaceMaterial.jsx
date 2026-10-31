/**
 * Scientifically Grounded Mars Surface PBR Material
 * Supports:
 * - Natural Viking MDIM 2.1 Albedo Map
 * - USGS/NASA MOLA Topographic Hypsometric Color Map
 * - Shaded Relief Monochromatic Mode
 * - MOLA Bump & Normal mapping
 * - Silicate/Basaltic Roughness mapping
 */

import * as THREE from 'three';
import {
  createAuthenticMarsAlbedoTexture,
  createAuthenticMolaTopographyTexture,
  createAuthenticMolaBumpTexture,
  createAuthenticRoughnessTexture,
} from '../data/mars/surfaceTextures.js';

/**
 * Creates a Mars surface material with authentic planetary maps
 *
 * @param {Object} options
 * @param {string} options.layer - 'natural' | 'mola' | 'shaded_relief'
 * @param {number} options.elevationExaggeration - Bump intensity multiplier
 * @param {boolean} options.isLowPerformance - Software WebGL compatibility flag
 * @returns {THREE.MeshStandardMaterial}
 */
export function createMarsSurfaceMaterial({
  layer = 'natural',
  elevationExaggeration = 1.0,
  isLowPerformance = false,
} = {}) {
  const albedoTexture = createAuthenticMarsAlbedoTexture(isLowPerformance);
  const molaTexture = createAuthenticMolaTopographyTexture(isLowPerformance);
  const bumpTexture = createAuthenticMolaBumpTexture(isLowPerformance);
  const roughnessTexture = createAuthenticRoughnessTexture(isLowPerformance);

  let initialMap = albedoTexture;
  let initialColor = new THREE.Color(0xffffff);

  if (layer === 'mola') {
    initialMap = molaTexture;
  } else if (layer === 'shaded_relief') {
    initialMap = bumpTexture;
    initialColor = new THREE.Color(0xd0cfcd);
  }

  const material = new THREE.MeshStandardMaterial({
    map: initialMap,
    bumpMap: bumpTexture,
    bumpScale: 0.05 * Math.min(3.0, elevationExaggeration),
    roughnessMap: roughnessTexture,
    roughness: 0.84,
    metalness: 0.03,
    color: initialColor,
  });

  // Store textures on userData for dynamic runtime toggling without garbage collection delays
  material.userData = {
    albedoTexture,
    molaTexture,
    bumpTexture,
    roughnessTexture,
    currentLayer: layer,
  };

  return material;
}

/**
 * Update the active visual scientific layer on an existing Mars surface material
 *
 * @param {THREE.MeshStandardMaterial} material
 * @param {'natural' | 'mola' | 'shaded_relief'} layer
 */
export function setMarsMaterialLayer(material, layer) {
  if (!material || !material.userData) return;
  const { albedoTexture, molaTexture, bumpTexture } = material.userData;

  if (layer === 'mola') {
    material.map = molaTexture;
    material.color.setHex(0xffffff);
    material.roughness = 0.70;
  } else if (layer === 'shaded_relief') {
    material.map = bumpTexture;
    material.color.setHex(0xd4d2ce);
    material.roughness = 0.88;
  } else {
    // Natural Viking MDIM color
    material.map = albedoTexture;
    material.color.setHex(0xffffff);
    material.roughness = 0.84;
  }

  material.userData.currentLayer = layer;
  material.needsUpdate = true;
}
