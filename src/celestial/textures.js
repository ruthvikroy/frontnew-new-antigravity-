import * as THREE from 'three';

const TEXTURE_URLS = {
  earthDay: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  earthSpecular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  earthNormal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  earthLights: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  moonAlbedo: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
};

// Procedural fallback generators for zero-downtime rendering
function createFallbackEarthDayCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Oceans
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 256);
  oceanGrad.addColorStop(0, '#102742');
  oceanGrad.addColorStop(0.5, '#0b1d36');
  oceanGrad.addColorStop(1, '#102742');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 512, 256);

  // Continents (approximate procedural landmasses)
  ctx.fillStyle = '#2f5938';
  ctx.beginPath();
  // Americas
  ctx.ellipse(130, 90, 45, 30, -0.2, 0, Math.PI * 2);
  ctx.ellipse(160, 160, 35, 55, 0.2, 0, Math.PI * 2);
  // Eurasia & Africa
  ctx.ellipse(320, 80, 75, 35, 0.1, 0, Math.PI * 2);
  ctx.ellipse(300, 140, 40, 50, 0, 0, Math.PI * 2);
  // Australia
  ctx.ellipse(420, 180, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ice caps
  ctx.fillStyle = '#eef5ff';
  ctx.fillRect(0, 0, 512, 20);
  ctx.fillRect(0, 236, 512, 20);

  return canvas;
}

function createFallbackCloudsCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, 512, 256);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';

  for (let i = 0; i < 40; i++) {
    const cx = (Math.sin(i * 1.7) * 0.5 + 0.5) * 512;
    const cy = 40 + (Math.cos(i * 2.3) * 0.5 + 0.5) * 176;
    const rw = 30 + (i % 5) * 15;
    const rh = 10 + (i % 3) * 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function createFallbackLightsCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#ffd175';
  for (let i = 0; i < 300; i++) {
    const rx = 100 + Math.random() * 320;
    const ry = 60 + Math.random() * 120;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function createFallbackMoonCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(0, 0, 512, 256);

  // Maria (dark basalt plains)
  ctx.fillStyle = '#6e7075';
  ctx.beginPath();
  ctx.ellipse(200, 100, 70, 50, 0.1, 0, Math.PI * 2);
  ctx.ellipse(280, 120, 50, 40, -0.2, 0, Math.PI * 2);
  ctx.ellipse(150, 140, 40, 35, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Craters (light rings)
  for (let i = 0; i < 80; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    const r = 2 + Math.random() * 7;
    ctx.strokeStyle = 'rgba(235, 235, 240, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return canvas;
}

function createFallbackMarsCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#b8532f';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#65311e';
  ctx.beginPath();
  ctx.ellipse(320, 110, 55, 35, 0.2, 0, Math.PI * 2);
  ctx.ellipse(190, 75, 45, 30, -0.1, 0, Math.PI * 2);
  ctx.ellipse(380, 160, 60, 40, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#431f13';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(110, 140);
  ctx.bezierCurveTo(150, 145, 180, 138, 220, 148);
  ctx.stroke();

  ctx.fillStyle = '#f5f5f7';
  ctx.beginPath();
  ctx.ellipse(256, 10, 55, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(256, 246, 40, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

export function loadCelestialTextures() {
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  const earthDayFallback = new THREE.CanvasTexture(createFallbackEarthDayCanvas());
  earthDayFallback.colorSpace = THREE.SRGBColorSpace;

  const earthCloudsFallback = new THREE.CanvasTexture(createFallbackCloudsCanvas());
  earthCloudsFallback.colorSpace = THREE.SRGBColorSpace;

  const earthLightsFallback = new THREE.CanvasTexture(createFallbackLightsCanvas());
  earthLightsFallback.colorSpace = THREE.SRGBColorSpace;

  const moonAlbedoFallback = new THREE.CanvasTexture(createFallbackMoonCanvas());
  moonAlbedoFallback.colorSpace = THREE.SRGBColorSpace;

  const marsFallback = new THREE.CanvasTexture(createFallbackMarsCanvas());
  marsFallback.colorSpace = THREE.SRGBColorSpace;

  const textures = {
    earthDay: earthDayFallback,
    earthClouds: earthCloudsFallback,
    earthLights: earthLightsFallback,
    earthSpecular: null,
    earthNormal: null,
    moonAlbedo: moonAlbedoFallback,
    marsAlbedo: marsFallback,
    marsBump: null,
  };

  const loadSafe = (key, url, isColor = true) => {
    loader.load(
      url,
      (loadedTex) => {
        if (isColor) {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
        }
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        textures[key] = loadedTex;
      },
      undefined,
      (err) => {
        console.warn(`[Celestial] Texture fallback retained for ${key}:`, err?.message || err);
      }
    );
  };

  loadSafe('earthDay', TEXTURE_URLS.earthDay, true);
  loadSafe('earthSpecular', TEXTURE_URLS.earthSpecular, false);
  loadSafe('earthNormal', TEXTURE_URLS.earthNormal, false);
  loadSafe('earthClouds', TEXTURE_URLS.earthClouds, true);
  loadSafe('earthLights', TEXTURE_URLS.earthLights, true);
  loadSafe('moonAlbedo', TEXTURE_URLS.moonAlbedo, true);

  return textures;
}
