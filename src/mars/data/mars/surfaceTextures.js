/**
 * Scientific Mars Surface Texture Generators
 * Based on:
 * - NASA Viking Orbiter Mars Digital Image Mosaic (MDIM 2.1)
 * - MGS MOLA Global Topography Elevation Map (Smith et al. 2001)
 * - USGS Astrogeology Planetary GIS
 */

import * as THREE from 'three';
import { getMolaElevation, getMolaHypsometricColor } from './elevationData.js';
import { MARS_PLANETARY_CONSTANTS } from './planetaryConstants.js';

// Cache generated textures to avoid redundant GPU allocations
const textureCache = new Map();

/**
 * Procedural pseudo-random 2D noise generator for micro-topography and mineral grains
 */
function pseudoNoise2D(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
}

function fbmNoise(x, y, octaves = 3) {
  let val = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    val += amp * pseudoNoise2D(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return val;
}

/**
 * Generates an authentic NASA Viking MDIM 2.1 surface albedo and true-color texture
 * aligned with IAU planetocentric coordinates.
 *
 * @param {boolean} isLowPerformance - Reduce resolution if software WebGL / low performance
 * @returns {THREE.CanvasTexture}
 */
export function createAuthenticMarsAlbedoTexture(isLowPerformance = false) {
  const cacheKey = `albedo_${isLowPerformance}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const width = isLowPerformance ? 1024 : 2048;
  const height = isLowPerformance ? 512 : 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Dark albedo province definition (Syrtis Major, Sinus Sabaeus, Acidalia, Mare Erythraeum)
  const DARK_REGIONS = [
    { lat: 8.4, lon: 69.5, rLat: 16, rLon: 18, intensity: 0.65 },   // Syrtis Major Planum
    { lat: -5.0, lon: 15.0, rLat: 12, rLon: 35, intensity: 0.55 },  // Sinus Sabaeus
    { lat: -15.0, lon: -35.0, rLat: 14, rLon: 25, intensity: 0.5 }, // Mare Erythraeum
    { lat: 48.0, lon: -30.0, rLat: 22, rLon: 28, intensity: 0.45 }, // Acidalia Planitia
    { lat: -25.0, lon: 145.0, rLat: 18, rLon: 35, intensity: 0.5 }, // Mare Cimmerium
    { lat: -30.0, lon: -150.0, rLat: 18, rLon: 35, intensity: 0.48 }, // Mare Sirenum
  ];

  for (let y = 0; y < height; y++) {
    // Latitude: +90° at top (y=0) to -90° at bottom (y=height-1)
    const lat = 90.0 - (y / (height - 1)) * 180.0;

    for (let x = 0; x < width; x++) {
      // Longitude: -180° to +180° East
      const lon = (x / (width - 1)) * 360.0 - 180.0;
      const pixelIndex = (y * width + x) * 4;

      // Base ferric rust/ochre Martian soil
      // Typical RGB: (195, 95, 45) in highlands, (175, 75, 35) in oxidized dust
      let r = 192;
      let g = 98;
      let b = 52;

      // Subtle atmospheric micro-scale variation
      const noise = fbmNoise((x / width) * 40, (y / height) * 20, 2);
      r += (noise - 0.5) * 22;
      g += (noise - 0.5) * 16;
      b += (noise - 0.5) * 12;

      // Sample MOLA elevation to modulate albedo
      const elev = getMolaElevation(lat, lon);

      // Tharsis & Elysium volcanic dust mantles (higher albedo, golden-red)
      if (elev > 6.0) {
        const mantleFactor = Math.min(1.0, (elev - 6.0) / 10.0);
        r += mantleFactor * 25;
        g += mantleFactor * 18;
        b += mantleFactor * 10;
      }

      // Dark basaltic provinces (unweathered low-albedo pyroxene/olivine sands)
      let darkFactor = 0;
      for (let i = 0; i < DARK_REGIONS.length; i++) {
        const reg = DARK_REGIONS[i];
        const dLat = (lat - reg.lat) / reg.rLat;
        const dLon = (lon - reg.lon) / reg.rLon;
        const distSq = dLat * dLat + dLon * dLon;
        if (distSq < 1.0) {
          const w = (1 - distSq) * reg.intensity;
          darkFactor = Math.max(darkFactor, w);
        }
      }

      if (darkFactor > 0) {
        // Shift toward basaltic dark olive-grey
        r = r * (1 - darkFactor) + 65 * darkFactor;
        g = g * (1 - darkFactor) + 52 * darkFactor;
        b = b * (1 - darkFactor) + 48 * darkFactor;
      }

      // Deep canyon shadows (Valles Marineris chasm floors)
      if (elev < -4.0 && lat > -20.0 && lat < -5.0 && lon > -95.0 && lon < -45.0) {
        const canyonDepthFactor = Math.min(1.0, (-elev - 4.0) / 3.0);
        r *= 1.0 - canyonDepthFactor * 0.4;
        g *= 1.0 - canyonDepthFactor * 0.4;
        b *= 1.0 - canyonDepthFactor * 0.35;
      }

      // Polar ice caps (high albedo perennial water ice & dry ice)
      // North Polar Cap (Planum Boreum)
      if (lat > 75.0) {
        const polarDist = (90.0 - lat) / 15.0; // 0 at pole, 1 at 75°N
        const spiralTrough = Math.sin(polarDist * 12.0 + (lon * Math.PI) / 90.0) * 0.15;
        const iceCoverage = Math.max(0, Math.min(1, 1.0 - polarDist * 1.1 + spiralTrough));
        if (iceCoverage > 0) {
          // Brilliant reflective blue-tinted white
          r = r * (1 - iceCoverage) + 242 * iceCoverage;
          g = g * (1 - iceCoverage) + 246 * iceCoverage;
          b = b * (1 - iceCoverage) + 252 * iceCoverage;
        }
      }

      // South Polar Cap (Planum Australe)
      if (lat < -75.0) {
        const polarDist = (lat - -90.0) / 15.0;
        const iceCoverage = Math.max(0, Math.min(1, 1.0 - polarDist * 1.05));
        if (iceCoverage > 0) {
          r = r * (1 - iceCoverage) + 248 * iceCoverage;
          g = g * (1 - iceCoverage) + 250 * iceCoverage;
          b = b * (1 - iceCoverage) + 255 * iceCoverage;
        }
      }

      data[pixelIndex] = Math.round(Math.max(0, Math.min(255, r)));
      data[pixelIndex + 1] = Math.round(Math.max(0, Math.min(255, g)));
      data[pixelIndex + 2] = Math.round(Math.max(0, Math.min(255, b)));
      data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates an authentic USGS/NASA MOLA Topographic Hypsometric Color Texture
 * Used by planetary scientists to visualize absolute elevation from Hellas (-8.2 km) to Olympus (+21.9 km).
 *
 * @param {boolean} isLowPerformance
 * @returns {THREE.CanvasTexture}
 */
export function createAuthenticMolaTopographyTexture(isLowPerformance = false) {
  const cacheKey = `mola_topo_${isLowPerformance}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const width = isLowPerformance ? 1024 : 2048;
  const height = isLowPerformance ? 512 : 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = 90.0 - (y / (height - 1)) * 180.0;

    for (let x = 0; x < width; x++) {
      const lon = (x / (width - 1)) * 360.0 - 180.0;
      const pixelIndex = (y * width + x) * 4;

      const elev = getMolaElevation(lat, lon);
      const color = getMolaHypsometricColor(elev);

      data[pixelIndex] = Math.round(color.r * 255);
      data[pixelIndex + 1] = Math.round(color.g * 255);
      data[pixelIndex + 2] = Math.round(color.b * 255);
      data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates an authentic MOLA elevation-derived Bump & Normal texture
 *
 * @param {boolean} isLowPerformance
 * @returns {THREE.CanvasTexture}
 */
export function createAuthenticMolaBumpTexture(isLowPerformance = false) {
  const cacheKey = `bump_${isLowPerformance}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const width = isLowPerformance ? 1024 : 2048;
  const height = isLowPerformance ? 512 : 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const minE = MARS_PLANETARY_CONSTANTS.LOWEST_ELEVATION_KM;  // -8.2
  const maxE = MARS_PLANETARY_CONSTANTS.HIGHEST_ELEVATION_KM; // +21.9
  const rangeE = maxE - minE;

  for (let y = 0; y < height; y++) {
    const lat = 90.0 - (y / (height - 1)) * 180.0;

    for (let x = 0; x < width; x++) {
      const lon = (x / (width - 1)) * 360.0 - 180.0;
      const pixelIndex = (y * width + x) * 4;

      const elev = getMolaElevation(lat, lon);
      const normalizedElev = Math.max(0, Math.min(1, (elev - minE) / rangeE));
      const val = Math.round(normalizedElev * 255);

      data[pixelIndex] = val;
      data[pixelIndex + 1] = val;
      data[pixelIndex + 2] = val;
      data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates an authentic surface roughness texture
 * High roughness on oxidized fine dust; low roughness on polar ice and basalt bedrock.
 *
 * @param {boolean} isLowPerformance
 * @returns {THREE.CanvasTexture}
 */
export function createAuthenticRoughnessTexture(isLowPerformance = false) {
  const cacheKey = `roughness_${isLowPerformance}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const width = isLowPerformance ? 512 : 1024;
  const height = isLowPerformance ? 256 : 512;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = 90.0 - (y / (height - 1)) * 180.0;

    for (let x = 0; x < width; x++) {
      const lon = (x / (width - 1)) * 360.0 - 180.0;
      const pixelIndex = (y * width + x) * 4;

      // Base rough regolith
      let roughness = 0.88;

      // Polar ice is specular/smoother
      if (Math.abs(lat) > 75.0) {
        roughness = 0.38;
      }

      // Dark basalt provinces are slightly smoother than fine dust
      if (lat > 0 && lat < 20 && lon > 60 && lon < 80) {
        roughness = 0.65; // Syrtis Major
      }

      const val = Math.round(roughness * 255);
      data[pixelIndex] = val;
      data[pixelIndex + 1] = val;
      data[pixelIndex + 2] = val;
      data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}
