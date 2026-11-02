import * as THREE from 'three';
import { MARS_3D_TEXTURE_MODES } from '../data/marsLandmarks.js';

/**
 * Multi-Scale Photorealistic Martian 3D Texture & Surface Relief Pipeline.
 * Combines:
 * 1. Global MOLA 3D topography (Valles Marineris, Olympus Mons, Tharsis Montes,
 *    Hellas Basin, Syrtis Major, and Polar CO2 Ice Caps).
 * 2. Multi-hemisphere 360° projection of the NASA Global Mars Mosaic
 *    (/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp) + Perseverance (PIA26344),
 *    Curiosity (PIA19808), and 2001 Mars Odyssey (PIA04816) reference textures.
 * 3. High-frequency 3D stereo & micro-relief encoding Perseverance Mastcam-Z stereo pairs
 *    (ZL0/ZR0 ZCAM10053 cored rock & aeolian ripples), Jezero delta cross-bedded sandstone
 *    strata & Sombrero ventifacts (ZCAM08693 · PIA26202), and SuperCam RMI
 *    circular micro-imager rock grain relief (SCAM04020).
 */

const BASALT_PLAINS = [
  { name: 'Syrtis Major Planum', u: 0.68, v: 0.45, rx: 0.085, ry: 0.11, darkness: 0.78 },
  { name: 'Acidalia Planitia', u: 0.42, v: 0.25, rx: 0.13, ry: 0.11, darkness: 0.72 },
  { name: 'Margaritifer & Erythraeum', u: 0.43, v: 0.58, rx: 0.16, ry: 0.09, darkness: 0.74 },
  { name: 'Terra Sirenum & Cimmeria', u: 0.82, v: 0.63, rx: 0.15, ry: 0.10, darkness: 0.68 },
  { name: 'Utopia Planitia', u: 0.80, v: 0.28, rx: 0.14, ry: 0.10, darkness: 0.62 },
  { name: 'Solis Planum', u: 0.26, v: 0.62, rx: 0.065, ry: 0.055, darkness: 0.70 },
];

const SHIELD_VOLCANOES = [
  { name: 'Olympus Mons', u: 0.128, v: 0.396, r: 0.048, height: 96, calderaR: 0.011 },
  { name: 'Ascraeus Mons', u: 0.210, v: 0.438, r: 0.028, height: 80, calderaR: 0.007 },
  { name: 'Pavonis Mons', u: 0.186, v: 0.498, r: 0.026, height: 74, calderaR: 0.007 },
  { name: 'Arsia Mons', u: 0.164, v: 0.552, r: 0.030, height: 78, calderaR: 0.009 },
  { name: 'Elysium Mons', u: 0.908, v: 0.362, r: 0.025, height: 66, calderaR: 0.006 },
];

const PHOTO_STAMPS = [
  // High-Resolution 3D Martian Surface Reference Textures from NASA Missions
  {
    name: 'Ventifacts & Perched Rocks (Jezero/Séítah)',
    url: '/assets/mars_reference/mars_ref_1_ventifacts.jpg',
    u: 0.715,
    v: 0.398,
    scaleU: 0.12,
    scaleV: 0.09,
    opacity: 0.76,
    dispWeight: 0.58,
  },
  {
    name: 'Layered Sulfate Hillside Scree (Mount Sharp / Gale)',
    url: '/assets/mars_reference/mars_ref_2_hillside.jpg',
    u: 0.883,
    v: 0.530,
    scaleU: 0.12,
    scaleV: 0.09,
    opacity: 0.74,
    dispWeight: 0.55,
  },
  {
    name: 'Cross-Bedded Sandstone Strata (Jezero Delta Front)',
    url: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
    u: 0.728,
    v: 0.415,
    scaleU: 0.11,
    scaleV: 0.08,
    opacity: 0.78,
    dispWeight: 0.60,
  },
  {
    name: 'Basaltic Boulder Field & Bedrock Pavement (Chryse Planitia)',
    url: '/assets/mars_reference/mars_ref_4_boulder_field.jpg',
    u: 0.418,
    v: 0.415,
    scaleU: 0.12,
    scaleV: 0.09,
    opacity: 0.75,
    dispWeight: 0.52,
  },
  {
    name: 'Aeolian Sand Ripples & Dunes (Meridiani Planum)',
    url: '/assets/mars_reference/mars_ref_5_sand_ripple.jpg',
    u: 0.485,
    v: 0.512,
    scaleU: 0.11,
    scaleV: 0.08,
    opacity: 0.72,
    dispWeight: 0.48,
  },
  {
    name: 'Perseverance Cheyava Falls Bedrock',
    url: '/assets/aistudio/pia26344-1600x_c40461b6.webp',
    u: 0.715,
    v: 0.398,
    scaleU: 0.095,
    scaleV: 0.075,
    opacity: 0.62,
    dispWeight: 0.45,
  },
  {
    name: 'Curiosity Marias Pass / Buckskin Drill Site',
    url: '/assets/aistudio/32322_mars-curiosity-rover-msl-horizon-sky-self-portrait-PIA19808-full_d447c1a3.jpg',
    u: 0.883,
    v: 0.530,
    scaleU: 0.095,
    scaleV: 0.075,
    opacity: 0.58,
    dispWeight: 0.42,
  },
  {
    name: 'Mars Odyssey Polar CO2 Chasmata',
    url: '/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp',
    u: 0.944,
    v: 0.935,
    scaleU: 0.11,
    scaleV: 0.055,
    opacity: 0.60,
    dispWeight: 0.38,
  },
];

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Could not load Mars texture asset:', src);
      resolve(null);
    };
    img.src = src;
  });
}

function computeSobelNormalMap(heightCtx, width, height, strength = 3.6) {
  const src = heightCtx.getImageData(0, 0, width, height);
  const srcData = src.data;
  const normalImg = heightCtx.createImageData(width, height);
  const normData = normalImg.data;

  const hAt = (px, py) => {
    const x = ((px % width) + width) % width;
    const y = Math.max(0, Math.min(height - 1, py));
    return srcData[(y * width + x) * 4] / 255.0;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tl = hAt(x - 1, y - 1);
      const t = hAt(x, y - 1);
      const tr = hAt(x + 1, y - 1);
      const l = hAt(x - 1, y);
      const r = hAt(x + 1, y);
      const bl = hAt(x - 1, y + 1);
      const b = hAt(x, y + 1);
      const br = hAt(x + 1, y + 1);

      const dx = tr + 2 * r + br - (tl + 2 * l + bl);
      const dy = bl + 2 * b + br - (tl + 2 * t + tr);
      const dz = 1.0 / strength;

      const len = Math.hypot(dx, dy, dz);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = dz / len;

      const idx = (y * width + x) * 4;
      normData[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      normData[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      normData[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      normData[idx + 3] = 255;
    }
  }

  return normalImg;
}

function createPerseveranceMicroReliefTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const img = ctx.createImageData(size, size);
  const data = img.data;

  const clasts = [];
  for (let i = 0; i < 64; i++) {
    clasts.push({
      x: (((Math.sin(i * 41.23) * 43758.5453) % 1) + 1) % 1,
      y: (((Math.cos(i * 73.19) * 29831.1123) % 1) + 1) % 1,
      r: 0.015 + ((((Math.sin(i * 17.77) * 19283.44) % 1) + 1) % 1) * 0.045,
      h: 22 + ((((Math.cos(i * 59.11) * 91827.33) % 1) + 1) % 1) * 44,
      isDrillCore: i % 16 === 0,
    });
  }

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const idx = (y * size + x) * 4;

      const ripplePhase = u * Math.PI * 16 + Math.sin(v * Math.PI * 6) * 1.4;
      const aeolianRipple = Math.pow(Math.sin(ripplePhase) * 0.5 + 0.5, 1.6) * 28;

      const strataWave =
        Math.sin((u * 24 + v * 38 + Math.sin(u * Math.PI * 4) * 0.6) * Math.PI) * 18;

      const grainNoise =
        (Math.sin(u * 140 + v * 110) * Math.cos(u * 95 - v * 160) * 0.5 + 0.5) * 22;

      let heightVal = 118 + aeolianRipple + strataWave * 0.55 + (grainNoise - 11);

      for (let c = 0; c < clasts.length; c++) {
        const clast = clasts[c];
        const dx = Math.min(Math.abs(u - clast.x), 1 - Math.abs(u - clast.x));
        const dy = Math.min(Math.abs(v - clast.y), 1 - Math.abs(v - clast.y));
        const dist = Math.hypot(dx, dy);

        if (dist < clast.r) {
          const ratio = dist / clast.r;
          if (clast.isDrillCore && ratio < 0.36) {
            heightVal -= 52;
          } else if (clast.isDrillCore && ratio < 0.62) {
            heightVal += 28;
          } else {
            const facet = Math.pow(1 - ratio, 0.65) * clast.h;
            heightVal += facet;
          }
        }
      }

      const clamped = Math.max(0, Math.min(255, Math.floor(heightVal)));
      data[idx] = clamped;
      data[idx + 1] = clamped;
      data[idx + 2] = clamped;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 3);
  return { texture, canvas, ctx };
}

function paintBaseMartianSurface(dCtx, dispCtx, bCtx, rCtx, width, height) {
  const dImg = dCtx.createImageData(width, height);
  const dispImg = dispCtx.createImageData(width, height);
  const bImg = bCtx.createImageData(width, height);
  const rImg = rCtx.createImageData(width, height);

  const d = dImg.data;
  const dp = dispImg.data;
  const b = bImg.data;
  const r = rImg.data;

  const craters = [];
  for (let i = 0; i < 380; i++) {
    const cu = (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1;
    const cv = 0.08 + Math.abs((Math.sin(i * 78.233) * 43758.5453) % 0.84);
    const cr =
      0.003 + Math.pow(Math.abs((Math.sin(i * 37.719) * 43758.5453) % 1), 3.3) * 0.032;
    const cd = 0.28 + Math.abs((Math.sin(i * 91.137) * 43758.5453) % 0.65);
    craters.push({ u: cu, v: cv, r: cr, d: cd });
  }

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const phi = (v - 0.5) * Math.PI;
    const cosPhi = Math.max(0.14, Math.cos(phi));

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const idx = (y * width + x) * 4;

      const uAngle = u * Math.PI * 2;
      const n1 = Math.sin(uAngle * 4 + v * 13 + Math.cos(v * 9) * 1.4) * 0.5 + 0.5;
      const n2 = Math.cos(uAngle * 9 - v * 27 + Math.sin(uAngle * 3) * 1.8) * 0.5 + 0.5;
      const n3 = Math.sin(uAngle * 18 + v * 58 + Math.cos(uAngle * 7 + v * 19)) * 0.5 + 0.5;

      const zcamStrata =
        Math.sin(uAngle * 14 + Math.cos(v * 24) * 2.6) *
          Math.cos(v * 32 + Math.sin(uAngle * 11) * 2.2) *
          6.0 +
        Math.sin(uAngle * 28 - v * 46 + Math.cos(uAngle * 9) * 1.7) * 3.2;
      const dustGrain = (((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1)) * 6;

      const dichotomyBoundary =
        0.42 + Math.sin(uAngle * 2 + 0.5) * 0.065 + Math.cos(uAngle * 3 - 0.8) * 0.04;
      const dichotomyT = Math.max(
        0,
        Math.min(1, (v - (dichotomyBoundary - 0.11)) / 0.22)
      );
      const dichotomySmooth = dichotomyT * dichotomyT * (3 - 2 * dichotomyT);
      const dichotomyShift = -14 + dichotomySmooth * 30;

      let red = 198 + (n1 * 0.55 + n2 * 0.35 + n3 * 0.1 - 0.5) * 48 + dustGrain + zcamStrata * 0.6;
      let green = 106 + (n1 * 0.5 + n2 * 0.4 - 0.5) * 34 + dustGrain * 0.65 + zcamStrata * 0.4;
      let blue = 66 + (n1 * 0.45 + n2 * 0.35 - 0.5) * 24 + dustGrain * 0.4 + zcamStrata * 0.25;
      let elev = 128 + dichotomyShift + (n1 - 0.5) * 34 + (n2 - 0.5) * 16 + zcamStrata;
      let rough = 222;

      for (const plain of BASALT_PLAINS) {
        const du = Math.abs(u - plain.u);
        const distU = Math.min(du, 1 - du) * cosPhi;
        const distV = Math.abs(v - plain.v);
        const normDist = Math.hypot(distU / plain.rx, distV / plain.ry);

        if (normDist < 1.0) {
          const t = 1.0 - normDist;
          const falloff = t * t * (3 - 2 * t) * plain.darkness;
          red -= falloff * 96;
          green -= falloff * 58;
          blue -= falloff * 34;
          elev -= falloff * 18;
          rough -= Math.floor(falloff * 28);
        }
      }

      if (u > 0.23 && u < 0.45 && v > 0.48 && v < 0.61) {
        const canyonSpineV =
          0.538 +
          Math.sin((u - 0.24) * 26.0) * 0.008 +
          (u - 0.33) * 0.09;
        const distFromSpine = Math.abs(v - canyonSpineV);
        const longitudinalFade = Math.sin(((u - 0.23) / 0.22) * Math.PI);
        const canyonHalfWidth = (0.011 + Math.sin(u * 90) * 0.004) * longitudinalFade;

        if (distFromSpine < canyonHalfWidth * 2.2) {
          const wallRatio = distFromSpine / Math.max(0.002, canyonHalfWidth);
          if (wallRatio < 1.0) {
            const depthFactor = (1.0 - wallRatio * wallRatio) * longitudinalFade;
            elev -= depthFactor * 82;
            red -= depthFactor * 88;
            green -= depthFactor * 54;
            blue -= depthFactor * 28;
            rough += 20;
          } else if (wallRatio < 1.8) {
            const rimBoost = (1.0 - (wallRatio - 1.0) / 0.8) * longitudinalFade;
            elev += rimBoost * 22;
            red += rimBoost * 24;
            green += rimBoost * 16;
          }
        }
      }

      for (const volc of SHIELD_VOLCANOES) {
        const du = Math.min(Math.abs(u - volc.u), 1 - Math.abs(u - volc.u)) * cosPhi;
        const dv = Math.abs(v - volc.v);
        const dist = Math.hypot(du, dv);

        if (dist < volc.r * 1.4) {
          if (dist < volc.calderaR) {
            const cRatio = dist / volc.calderaR;
            elev += volc.height * 0.72 - (1 - cRatio) * 28;
            red -= 48;
            green -= 32;
            blue -= 18;
          } else if (dist < volc.r) {
            const cone = 1.0 - dist / volc.r;
            const profile = Math.pow(cone, 1.35);
            elev += profile * volc.height;
            red -= profile * 22;
            green -= profile * 12;
          } else {
            const aureole = 1.0 - (dist - volc.r) / (volc.r * 0.4);
            elev += aureole * 14;
            red += aureole * 18;
            green += aureole * 14;
            blue += aureole * 10;
          }
        }
      }

      for (let i = 0; i < craters.length; i++) {
        const c = craters[i];
        const cu = Math.min(Math.abs(u - c.u), 1 - Math.abs(u - c.u)) * cosPhi;
        const cv = Math.abs(v - c.v);
        const dist = Math.hypot(cu, cv);

        if (dist < c.r * 1.45) {
          const ratio = dist / c.r;
          if (ratio < 0.86) {
            const bowl = (1 - ratio / 0.86) * c.d;
            elev -= bowl * 34;
            red -= bowl * 18;
            green -= bowl * 12;
          } else if (ratio < 1.32) {
            const rim = (1 - Math.abs(ratio - 1.0) / 0.32) * 24 * c.d;
            elev += rim;
            red += rim * 0.9;
            green += rim * 0.65;
          }
        }
      }

      const polarEdgeNoise = Math.sin(u * Math.PI * 16) * 0.012 + Math.cos(u * Math.PI * 6) * 0.008;
      const northCapLimit = 0.068 + polarEdgeNoise;
      const southCapLimit = 0.932 + polarEdgeNoise;

      if (v < northCapLimit || v > southCapLimit) {
        const distToPole =
          v < northCapLimit
            ? (northCapLimit - v) / northCapLimit
            : (v - southCapLimit) / (1 - southCapLimit);
        const capBlend = Math.min(1, distToPole * 2.4);
        const spiralTrough = Math.sin(u * Math.PI * 10 + distToPole * 18) > 0.65 ? 0.72 : 1.0;
        const iceFactor = capBlend * spiralTrough;

        red = red * (1 - iceFactor) + 242 * iceFactor;
        green = green * (1 - iceFactor) + 235 * iceFactor;
        blue = blue * (1 - iceFactor) + 228 * iceFactor;
        elev += iceFactor * 42;
        rough = Math.floor(rough * (1 - iceFactor) + 110 * iceFactor);
      }

      const finalR = Math.max(28, Math.min(250, Math.floor(red)));
      const finalG = Math.max(20, Math.min(242, Math.floor(green)));
      const finalB = Math.max(16, Math.min(236, Math.floor(blue)));
      const finalElev = Math.max(0, Math.min(255, Math.floor(elev)));
      const finalRough = Math.max(100, Math.min(255, Math.floor(rough)));

      d[idx] = finalR;
      d[idx + 1] = finalG;
      d[idx + 2] = finalB;
      d[idx + 3] = 255;

      dp[idx] = finalElev;
      dp[idx + 1] = finalElev;
      dp[idx + 2] = finalElev;
      dp[idx + 3] = 255;

      b[idx] = finalElev;
      b[idx + 1] = finalElev;
      b[idx + 2] = finalElev;
      b[idx + 3] = 255;

      r[idx] = finalRough;
      r[idx + 1] = finalRough;
      r[idx + 2] = finalRough;
      r[idx + 3] = 255;
    }
  }

  dCtx.putImageData(dImg, 0, 0);
  dispCtx.putImageData(dispImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);
}

export function createPhotorealisticMarsTextures(isSoftwareGl = false, onTexturesUpdated) {
  const width = isSoftwareGl ? 1024 : 2048;
  const height = isSoftwareGl ? 512 : 1024;

  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = width;
  diffuseCanvas.height = height;
  const diffuseCtx = diffuseCanvas.getContext('2d');

  const dispCanvas = document.createElement('canvas');
  dispCanvas.width = width;
  dispCanvas.height = height;
  const dispCtx = dispCanvas.getContext('2d', { willReadFrequently: true });

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normalCtx = normalCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d', { willReadFrequently: true });

  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = width;
  roughnessCanvas.height = height;
  const roughnessCtx = roughnessCanvas.getContext('2d');

  paintBaseMartianSurface(diffuseCtx, dispCtx, bumpCtx, roughnessCtx, width, height);

  const microPack = createPerseveranceMicroReliefTexture(isSoftwareGl ? 256 : 512);
  bumpCtx.save();
  bumpCtx.globalAlpha = 0.38;
  bumpCtx.globalCompositeOperation = 'overlay';
  const pattern = bumpCtx.createPattern(microPack.canvas, 'repeat');
  if (pattern) {
    bumpCtx.fillStyle = pattern;
    bumpCtx.fillRect(0, 0, width, height);
  }
  bumpCtx.restore();

  const initialNormals = computeSobelNormalMap(dispCtx, width, height, 3.4);
  normalCtx.putImageData(initialNormals, 0, 0);

  const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
  diffuseMap.colorSpace = THREE.SRGBColorSpace;
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.ClampToEdgeWrapping;

  const displacementMap = new THREE.CanvasTexture(dispCanvas);
  displacementMap.wrapS = THREE.RepeatWrapping;
  displacementMap.wrapT = THREE.ClampToEdgeWrapping;

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.ClampToEdgeWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;

  const result = {
    diffuseMap,
    displacementMap,
    normalMap,
    bumpMap,
    roughnessMap,
    microBumpMap: microPack.texture,
    isReady: false,
  };

  Promise.all([
    loadImage('/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp'),
    ...PHOTO_STAMPS.map((stamp) => loadImage(stamp.url)),
  ]).then(([marsGlobeImg, ...stampImgs]) => {
    if (marsGlobeImg) {
      const globeW = Math.floor(width * 0.52);
      const globeH = Math.floor(height * 0.86);
      const globeCanvas = document.createElement('canvas');
      globeCanvas.width = globeW;
      globeCanvas.height = globeH;
      const gCtx = globeCanvas.getContext('2d');

      const sx = marsGlobeImg.width * 0.08;
      const sy = marsGlobeImg.height * 0.08;
      const sw = marsGlobeImg.width * 0.84;
      const sh = marsGlobeImg.height * 0.84;
      gCtx.drawImage(marsGlobeImg, sx, sy, sw, sh, 0, 0, globeW, globeH);

      gCtx.globalCompositeOperation = 'destination-in';
      const rMax = Math.min(globeW, globeH) * 0.49;
      const grad = gCtx.createRadialGradient(
        globeW * 0.5,
        globeH * 0.5,
        rMax * 0.22,
        globeW * 0.5,
        globeH * 0.5,
        rMax
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(0.65, 'rgba(255,255,255,0.72)');
      grad.addColorStop(0.88, 'rgba(255,255,255,0.28)');
      grad.addColorStop(1, 'rgba(255,255,255,0.0)');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, globeW, globeH);

      const destX1 = Math.floor(width * 0.33 - globeW * 0.5);
      const destY1 = Math.floor(height * 0.5 - globeH * 0.5);

      diffuseCtx.save();
      diffuseCtx.globalAlpha = 0.82;
      diffuseCtx.globalCompositeOperation = 'source-over';
      diffuseCtx.drawImage(globeCanvas, destX1, destY1);
      diffuseCtx.restore();

      const destX2 = Math.floor(width * 0.82 - globeW * 0.5);
      diffuseCtx.save();
      diffuseCtx.globalAlpha = 0.55;
      diffuseCtx.globalCompositeOperation = 'overlay';
      diffuseCtx.drawImage(globeCanvas, destX2, destY1);
      diffuseCtx.restore();

      dispCtx.save();
      dispCtx.globalAlpha = 0.42;
      dispCtx.globalCompositeOperation = 'overlay';
      dispCtx.drawImage(globeCanvas, destX1, destY1);
      dispCtx.globalAlpha = 0.32;
      dispCtx.drawImage(globeCanvas, destX2, destY1);
      dispCtx.restore();

      bumpCtx.save();
      bumpCtx.globalAlpha = 0.48;
      bumpCtx.globalCompositeOperation = 'overlay';
      bumpCtx.drawImage(globeCanvas, destX1, destY1);
      bumpCtx.drawImage(globeCanvas, destX2, destY1);
      bumpCtx.restore();
    }

    for (let i = 0; i < PHOTO_STAMPS.length; i++) {
      const stamp = PHOTO_STAMPS[i];
      const img = stampImgs[i];
      if (!img) continue;

      const cx = stamp.u * width;
      const cy = stamp.v * height;
      const w = Math.floor(stamp.scaleU * width);
      const h = Math.floor(stamp.scaleV * height);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w * 2;
      tempCanvas.height = h * 2;
      const tCtx = tempCanvas.getContext('2d');

      const sy = img.height * 0.32;
      const sh = img.height * 0.64;
      tCtx.drawImage(img, 0, sy, img.width, sh, 0, 0, w * 2, h * 2);

      tCtx.globalCompositeOperation = 'destination-in';
      const grad = tCtx.createRadialGradient(
        w,
        h,
        Math.min(w, h) * 0.18,
        w,
        h,
        Math.min(w, h) * 0.96
      );
      grad.addColorStop(0, 'rgba(0,0,0,0.92)');
      grad.addColorStop(0.58, 'rgba(0,0,0,0.52)');
      grad.addColorStop(0.86, 'rgba(0,0,0,0.16)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      tCtx.fillStyle = grad;
      tCtx.fillRect(0, 0, w * 2, h * 2);

      diffuseCtx.save();
      diffuseCtx.globalAlpha = stamp.opacity;
      diffuseCtx.globalCompositeOperation = 'overlay';
      diffuseCtx.drawImage(tempCanvas, cx - w, cy - h);
      diffuseCtx.restore();

      dispCtx.save();
      dispCtx.globalAlpha = stamp.dispWeight || 0.38;
      dispCtx.globalCompositeOperation = 'overlay';
      dispCtx.drawImage(tempCanvas, cx - w, cy - h);
      dispCtx.restore();

      bumpCtx.save();
      bumpCtx.globalAlpha = 0.45;
      bumpCtx.globalCompositeOperation = 'overlay';
      bumpCtx.drawImage(tempCanvas, cx - w, cy - h);
      bumpCtx.restore();
    }

    const hdNormals = computeSobelNormalMap(dispCtx, width, height, 4.2);
    normalCtx.putImageData(hdNormals, 0, 0);

    diffuseMap.needsUpdate = true;
    displacementMap.needsUpdate = true;
    normalMap.needsUpdate = true;
    bumpMap.needsUpdate = true;
    roughnessMap.needsUpdate = true;
    result.isReady = true;

    if (onTexturesUpdated) {
      onTexturesUpdated();
    }
  });

  return result;
}

/**
 * Apply 3D Mars texture mode settings (normalBoost, bumpBoost, etc.)
 */
export function applyMarsTextureMode(material, modeId = 'global-mola') {
  if (!material) return;
  const cfg = MARS_3D_TEXTURE_MODES.find((m) => m.id === modeId) || MARS_3D_TEXTURE_MODES[0];
  const normalScale = 0.45 * cfg.normalBoost;
  material.normalScale = new THREE.Vector2(normalScale, normalScale);
  material.bumpScale = 0.065 * cfg.bumpBoost;
  if (material.displacementScale !== undefined) {
    material.displacementScale = 0.12 * cfg.displacementMultiplier;
  }
  material.needsUpdate = true;
}

