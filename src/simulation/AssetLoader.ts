/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Progressive texture asset loader with zero-delay procedural fallbacks
*/
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';

export interface CelestialTextures {
  earthDay: THREE.Texture;
  earthNight: THREE.Texture;
  earthClouds: THREE.Texture;
  earthSpecular: THREE.Texture;
  moonSurface: THREE.Texture;
}

const REMOTE_URLS = {
  earthDay: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  earthNight: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  earthSpecular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  moonSurface: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
};

function createEarthDayCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 256);
    oceanGrad.addColorStop(0, '#0d1f38');
    oceanGrad.addColorStop(0.5, '#07152b');
    oceanGrad.addColorStop(1, '#0d1f38');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#2d5236';
    ctx.beginPath();
    ctx.ellipse(135, 90, 48, 32, -0.2, 0, Math.PI * 2);
    ctx.ellipse(165, 160, 36, 56, 0.2, 0, Math.PI * 2);
    ctx.ellipse(325, 80, 80, 38, 0.1, 0, Math.PI * 2);
    ctx.ellipse(305, 145, 42, 52, 0, 0, Math.PI * 2);
    ctx.ellipse(425, 180, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e5f0ff';
    ctx.fillRect(0, 0, 512, 18);
    ctx.fillRect(0, 238, 512, 18);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createEarthNightCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#010204';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#ffcf70';
    for (let i = 0; i < 350; i++) {
      const rx = 100 + Math.random() * 320;
      const ry = 60 + Math.random() * 125;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createEarthCloudsCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 40; i++) {
      const cx = (Math.sin(i * 1.7) * 0.5 + 0.5) * 512;
      const cy = 40 + (Math.cos(i * 2.3) * 0.5 + 0.5) * 176;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 28 + (i % 5) * 16, 10 + (i % 3) * 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return new THREE.CanvasTexture(canvas);
}

function createEarthSpecularCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(65, 45, 24, 16, -0.2, 0, Math.PI * 2);
    ctx.ellipse(82, 80, 18, 28, 0.2, 0, Math.PI * 2);
    ctx.ellipse(162, 40, 40, 19, 0.1, 0, Math.PI * 2);
    ctx.ellipse(152, 72, 21, 26, 0, 0, Math.PI * 2);
    ctx.ellipse(212, 90, 13, 11, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createMoonSurfaceCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#6e7075';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#42454b';
    ctx.beginPath();
    ctx.arc(170, 90, 45, 0, Math.PI * 2);
    ctx.arc(220, 130, 35, 0, Math.PI * 2);
    ctx.arc(260, 95, 30, 0, Math.PI * 2);
    ctx.arc(140, 140, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8f9298';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, 2 + Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class AssetLoader {
  private static instance: AssetLoader | null = null;
  private textures: CelestialTextures;
  private loader: THREE.TextureLoader;

  private constructor() {
    this.loader = new THREE.TextureLoader();
    this.textures = {
      earthDay: createEarthDayCanvas(),
      earthNight: createEarthNightCanvas(),
      earthClouds: createEarthCloudsCanvas(),
      earthSpecular: createEarthSpecularCanvas(),
      moonSurface: createMoonSurfaceCanvas(),
    };
    this.loadRemote();
  }

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  public getTextures(): CelestialTextures {
    return this.textures;
  }

  private loadRemote() {
    const keys = Object.keys(REMOTE_URLS) as (keyof CelestialTextures)[];
    let loadedCount = 0;
    const total = keys.length;

    keys.forEach((key) => {
      this.loader.load(
        REMOTE_URLS[key],
        (loadedTex) => {
          if (key === 'earthDay' || key === 'earthNight' || key === 'moonSurface') {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
          }
          loadedTex.generateMipmaps = true;
          this.textures[key].dispose();
          this.textures[key] = loadedTex;
          loadedCount++;
          useSimulationStore.getState().setLoadingProgress(Math.round((loadedCount / total) * 100));
          if (loadedCount === total) useSimulationStore.getState().setIsLoaded(true);
        },
        undefined,
        () => {
          loadedCount++;
          if (loadedCount === total) useSimulationStore.getState().setIsLoaded(true);
        }
      );
    });
  }

  public dispose() {
    Object.values(this.textures).forEach((tex) => tex.dispose());
    AssetLoader.instance = null;
  }
}
// --- End of AssetLoader.ts ---
