import * as THREE from 'three';
import { calculateOrbitalPosition, calculateTumble } from './orbitalMath.js';

/**
 * Creates spherical UVs for arbitrary displaced polyhedral geometry
 * so procedural 3D textures map cleanly across Phobos, Deimos, and Martian Trojan asteroids.
 */
function assignSphericalUVs(geometry) {
  const pos = geometry.attributes.position;
  const count = pos.count;
  const uvs = new Float32Array(count * 2);
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const u = 0.5 + Math.atan2(v.z, v.x) / (2 * Math.PI);
    const w = 0.5 - Math.asin(Math.max(-1, Math.min(1, v.y))) / Math.PI;
    uvs[i * 2] = u;
    uvs[i * 2 + 1] = w;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
}

/**
 * Computes Tangent-Space Sobel Normal Map from a height canvas
 */
function computeSobelNormalMap(heightCtx, width, height, strength = 3.5) {
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

/**
 * Procedural Martian Moon & Asteroid 3D Texture Generator:
 * Synthesizes diffuse/albedo, height/bump, tangent-space normal, and roughness maps
 * for Phobos (grooved carbonaceous regolith + Stickney ejecta), Deimos (smooth reddish regolith),
 * and Olivine-rich Martian Trojan asteroids.
 */
function createAsteroidTextures(type = 'phobos', resolution = 512) {
  const width = resolution;
  const height = resolution;

  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = width;
  diffuseCanvas.height = height;
  const dCtx = diffuseCanvas.getContext('2d');

  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = width;
  heightCanvas.height = height;
  const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const nCtx = normalCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d');

  const dImg = dCtx.createImageData(width, height);
  const hImg = hCtx.createImageData(width, height);
  const rImg = rCtx.createImageData(width, height);

  const d = dImg.data;
  const h = hImg.data;
  const r = rImg.data;

  let baseR, baseG, baseB, baseRough;
  if (type === 'deimos') {
    baseR = 138;
    baseG = 114;
    baseB = 98;
    baseRough = 215;
  } else if (type === 'trojan') {
    baseR = 152;
    baseG = 104;
    baseB = 82;
    baseRough = 195;
  } else {
    baseR = 104;
    baseG = 92;
    baseB = 84;
    baseRough = 232;
  }

  const asteroidPits = [];
  const pitCount = type === 'deimos' ? 18 : 38;
  for (let i = 0; i < pitCount; i++) {
    asteroidPits.push({
      x: ((Math.sin(i * 92.17) * 43758.5453) % 1 + 1) % 1,
      y: ((Math.cos(i * 47.33) * 23421.6312) % 1 + 1) % 1,
      radius:
        i === 0 && type === 'phobos'
          ? 0.16
          : 0.03 + Math.pow(((Math.sin(i * 19.81) * 31415.92) % 1 + 1) % 1, 2) * 0.075,
      depth:
        i === 0 && type === 'phobos'
          ? 0.95
          : 0.35 + (((Math.cos(i * 12.37) * 12345.67) % 1 + 1) % 1) * 0.55,
    });
  }

  for (let y = 0; y < height; y++) {
    const ny = y / height;
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const idx = (y * width + x) * 4;

      const n1 = Math.sin(nx * 18.0 + ny * 12.0) * 0.5 + 0.5;
      const n2 = Math.cos(nx * 36.0 - ny * 24.0) * 0.5 + 0.5;
      const n3 = Math.sin(nx * 72.0 + ny * 64.0) * 0.5 + 0.5;
      const microRegolith = ((Math.sin(nx * 400 + ny * 400) * 43758.5453) % 1) * 12;

      let grooveIndent = 0;
      if (type === 'phobos') {
        const grooveWave = Math.abs(Math.sin((nx * 24.0 + ny * 14.0) * Math.PI));
        grooveIndent = grooveWave < 0.12 ? (1 - grooveWave / 0.12) * 26 : 0;
      }

      let rockHeight =
        128 + (n1 * 0.5 + n2 * 0.35 + n3 * 0.15 - 0.5) * 74 - grooveIndent;
      let rockAlbedo =
        (n1 * 0.45 + n2 * 0.35 + n3 * 0.2 - 0.5) * 42 + microRegolith - grooveIndent * 0.4;
      let roughness = baseRough + (n2 - 0.5) * 30;

      for (let p = 0; p < asteroidPits.length; p++) {
        const pit = asteroidPits[p];
        const dx = Math.min(Math.abs(nx - pit.x), 1 - Math.abs(nx - pit.x));
        const dy = Math.abs(ny - pit.y);
        const dist = Math.hypot(dx, dy);

        if (dist < pit.radius * 1.4) {
          const ratio = dist / pit.radius;
          if (ratio < 0.85) {
            const pitFalloff = 1 - ratio / 0.85;
            rockHeight -= pitFalloff * 48 * pit.depth;
            rockAlbedo -= pitFalloff * 24 * pit.depth;
            roughness += pitFalloff * 18;
          } else if (ratio < 1.3) {
            const rimEffect = (1 - Math.abs(ratio - 1.0) / 0.3) * 24 * pit.depth;
            rockHeight += rimEffect;
            rockAlbedo += rimEffect * 0.85;
          }
        }
      }

      const finalR = Math.max(18, Math.min(245, Math.floor(baseR + rockAlbedo)));
      const finalG = Math.max(16, Math.min(240, Math.floor(baseG + rockAlbedo * 0.92)));
      const finalB = Math.max(14, Math.min(235, Math.floor(baseB + rockAlbedo * 0.84)));
      const finalH = Math.max(0, Math.min(255, Math.floor(rockHeight)));
      const finalRough = Math.max(30, Math.min(255, Math.floor(roughness)));

      d[idx] = finalR;
      d[idx + 1] = finalG;
      d[idx + 2] = finalB;
      d[idx + 3] = 255;

      h[idx] = finalH;
      h[idx + 1] = finalH;
      h[idx + 2] = finalH;
      h[idx + 3] = 255;

      r[idx] = finalRough;
      r[idx + 1] = finalRough;
      r[idx + 2] = finalRough;
      r[idx + 3] = 255;
    }
  }

  dCtx.putImageData(dImg, 0, 0);
  hCtx.putImageData(hImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const normalData = computeSobelNormalMap(hCtx, width, height, 3.6);
  nCtx.putImageData(normalData, 0, 0);

  const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
  diffuseMap.colorSpace = THREE.SRGBColorSpace;
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(heightCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  return {
    diffuseMap,
    bumpMap,
    normalMap,
    roughnessMap,
  };
}

/**
 * Creates irregular procedural potato-shaped moon/asteroid geometry (Phobos / Deimos)
 */
function createProceduralRockGeometry(radius, detail = 2, isPhobos = false) {
  const geom = new THREE.IcosahedronGeometry(radius, detail);
  const posAttr = geom.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    const noise =
      Math.sin(vertex.x * 3.8 + vertex.y * 2.2) * 0.20 +
      Math.cos(vertex.y * 4.4 + vertex.z * 3.2) * 0.15 +
      Math.sin(vertex.z * 5.2 + vertex.x * 4.8) * 0.11;

    const craterDist1 = Math.hypot(vertex.x - radius * 0.52, vertex.y - radius * 0.25);
    const craterRadius1 = isPhobos ? radius * 0.75 : radius * 0.6;
    const craterDepth1 = isPhobos ? -0.32 : -0.2;
    const crater1 =
      craterDist1 < craterRadius1 ? craterDepth1 * (1 - craterDist1 / craterRadius1) : 0;

    const elongation =
      1.0 + (vertex.x / radius) * 0.22 - (vertex.y / radius) * 0.12;

    const displacement = Math.max(0.62, elongation + noise + crater1);
    vertex.multiplyScalar(displacement);
    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geom.computeVertexNormals();
  assignSphericalUVs(geom);
  return geom;
}

/**
 * Creates a composite 9-part 3D model of the 2001 Mars Odyssey Orbiter (PIA04816),
 * directly modeled after the user's uploaded reference image:
 * /assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp
 */
function createMarsOdysseyOrbiterMesh() {
  const group = new THREE.Group();

  // 1. Main Gold MLI Foil Spacecraft Bus (Primary Silhouette)
  const busGeom = new THREE.BoxGeometry(0.28, 0.22, 0.22);
  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xd99b26,
    metalness: 0.9,
    roughness: 0.26,
  });
  const busMesh = new THREE.Mesh(busGeom, goldFoilMat);
  group.add(busMesh);

  // 2. Upper Rounded Equipment Deck Dome
  const domeGeom = new THREE.SphereGeometry(0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const domeMesh = new THREE.Mesh(domeGeom, goldFoilMat);
  domeMesh.position.set(0, 0.11, 0);
  group.add(domeMesh);

  // 3. White Thermal Louver Radiator Plates (contrast with gold MLI as in PIA04816)
  const louverGeom = new THREE.BoxGeometry(0.08, 0.10, 0.23);
  const louverMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.15,
    roughness: 0.65,
  });
  const louverMesh = new THREE.Mesh(louverGeom, louverMat);
  louverMesh.position.set(-0.08, 0.01, 0);
  group.add(louverMesh);

  // 4. Three-Panel Asymmetric Solar Array Wing (Secondary Read)
  const solarWingGroup = new THREE.Group();
  solarWingGroup.position.set(-0.24, 0.02, 0);

  const solarCellMat = new THREE.MeshStandardMaterial({
    color: 0x2c1e26,
    metalness: 0.72,
    roughness: 0.18,
  });
  const solarFrameMat = new THREE.MeshStandardMaterial({
    color: 0xb8864b,
    metalness: 0.8,
    roughness: 0.35,
  });

  const panelPositionsY = [0.26, 0.0, -0.26];
  for (let i = 0; i < 3; i++) {
    const py = panelPositionsY[i];
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.012), solarFrameMat);
    frameMesh.position.set(0, py, 0);
    solarWingGroup.add(frameMesh);

    const cellMesh = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.21, 0.016), solarCellMat);
    cellMesh.position.set(0, py, 0);
    solarWingGroup.add(cellMesh);
  }
  group.add(solarWingGroup);

  // 5. High-Gain Parabolic Dish Antenna on Vertical Mast (Top-Right in PIA04816)
  const mastGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.34, 8);
  const strutMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.25,
  });
  const mastMesh = new THREE.Mesh(mastGeom, strutMat);
  mastMesh.position.set(0.14, 0.24, -0.04);
  group.add(mastMesh);

  const dishGeom = new THREE.ConeGeometry(0.14, 0.06, 20, 1, true);
  const dishMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.45,
    roughness: 0.38,
    side: THREE.DoubleSide,
  });
  const dishMesh = new THREE.Mesh(dishGeom, dishMat);
  dishMesh.position.set(0.08, 0.38, -0.02);
  dishMesh.rotation.x = Math.PI * 0.42;
  dishMesh.rotation.z = -0.2;
  group.add(dishMesh);

  // 6. Extended Gamma Ray Spectrometer (GRS) Boom & Sensor Head (Left Boom in PIA04816)
  const boomGeom = new THREE.CylinderGeometry(0.009, 0.009, 0.56, 8);
  const boomMesh = new THREE.Mesh(boomGeom, strutMat);
  boomMesh.position.set(-0.26, -0.06, 0.16);
  boomMesh.rotation.z = Math.PI * 0.42;
  boomMesh.rotation.y = 0.35;
  group.add(boomMesh);

  const grsHeadGeom = new THREE.SphereGeometry(0.055, 14, 12);
  const grsHeadMesh = new THREE.Mesh(grsHeadGeom, goldFoilMat);
  grsHeadMesh.position.set(-0.52, -0.14, 0.26);
  group.add(grsHeadMesh);

  // 7. THEMIS Optical Camera Cylinder (Accent Detail)
  const themisGeom = new THREE.CylinderGeometry(0.032, 0.036, 0.12, 12);
  const themisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.2,
  });
  const themisMesh = new THREE.Mesh(themisGeom, themisMat);
  themisMesh.position.set(0.06, -0.13, 0.06);
  group.add(themisMesh);

  group.scale.setScalar(1.32);
  return group;
}

export class DebrisSystem {
  constructor(scene, isSoftwareGl = false, initialMode = 'minimal') {
    this.entities = [];
    this.group = new THREE.Group();
    this.microOrbits = [];
    this.dummyMatrix = new THREE.Matrix4();
    this.dummyPos = new THREE.Vector3();
    this.dummyQuat = new THREE.Quaternion();
    this.dummyScale = new THREE.Vector3();
    this.texturesList = [];

    scene.add(this.group);

    // 1. Generate specialized 3D procedural textures for Phobos, Deimos & Martian Trojans
    this.textures = {
      phobos: createAsteroidTextures('phobos', isSoftwareGl ? 256 : 512),
      deimos: createAsteroidTextures('deimos', isSoftwareGl ? 256 : 512),
      trojan: createAsteroidTextures('trojan', isSoftwareGl ? 256 : 512),
    };
    this.texturesList.push(this.textures.phobos, this.textures.deimos, this.textures.trojan);

    // 2. Create prominent Martian Moons (Phobos, Deimos) & 2001 Mars Odyssey Orbiter
    this.createHeroDebris(isSoftwareGl);

    // 3. Minimal Co-Orbital Trojan Dust / Asteroid Swarm (kept very sparse & small)
    this.totalMicrometeorites = isSoftwareGl ? 10 : 16;
    const microGeom = createProceduralRockGeometry(0.042, 1, false);
    const microMat = new THREE.MeshStandardMaterial({
      map: this.textures.phobos.diffuseMap,
      normalMap: this.textures.phobos.normalMap,
      normalScale: new THREE.Vector2(1.6, 1.6),
      bumpMap: this.textures.phobos.bumpMap,
      bumpScale: 0.06,
      roughnessMap: this.textures.phobos.roughnessMap,
      roughness: 0.92,
      metalness: 0.08,
    });

    this.instancedMicrometeorites = new THREE.InstancedMesh(
      microGeom,
      microMat,
      this.totalMicrometeorites
    );
    this.instancedMicrometeorites.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMicrometeorites.frustumCulled = false;
    this.group.add(this.instancedMicrometeorites);

    for (let i = 0; i < this.totalMicrometeorites; i++) {
      const radius = 6.8 + Math.random() * 6.5;
      const inclination = (Math.random() - 0.5) * 0.45 + 0.08;
      const speed = (0.03 + Math.random() * 0.04) * (Math.random() > 0.15 ? 1 : -1);

      this.microOrbits.push({
        semiMajorAxis: radius,
        eccentricity: 0.02 + Math.random() * 0.08,
        inclinationRad: inclination,
        longitudeOfAscendingNodeRad: Math.random() * Math.PI * 2,
        argumentOfPeriapsisRad: Math.random() * Math.PI * 2,
        meanMotion: speed,
      });

      const tint = 0.65 + Math.random() * 0.35;
      this.instancedMicrometeorites.setColorAt(
        i,
        new THREE.Color(tint * 0.68, tint * 0.48, tint * 0.38)
      );
    }
    if (this.instancedMicrometeorites.instanceColor) {
      this.instancedMicrometeorites.instanceColor.needsUpdate = true;
    }

    // Apply initial visibility immediately (defaults to 'minimal' — zero asteroid swarm clutter)
    this.setVisibleDebris(initialMode);
  }

  createHeroDebris(isSoftwareGl) {
    const debrisDefs = [
      {
        id: 'odyssey-orbiter',
        name: '2001 Mars Odyssey Orbiter (PIA04816)',
        type: 'spacecraft',
        radius: 0.32,
        semiMajorAxis: 4.55,
        eccentricity: 0.01,
        inclination: 1.38,
        nodeRad: 0.4,
        periapsisRad: 1.1,
        speed: 0.11,
        scale: 0.95,
        altitudeKm: 400,
      },
      {
        id: 'phobos-moon',
        name: 'Phobos (Inner Moon · Stickney Crater)',
        type: 'phobos',
        radius: 0.28,
        semiMajorAxis: 6.1,
        eccentricity: 0.0151,
        inclination: 0.08,
        nodeRad: 0.8,
        periapsisRad: 0.4,
        speed: 0.085,
        scale: 0.9,
        altitudeKm: 5989,
      },
      {
        id: 'deimos-moon',
        name: 'Deimos (Outer Captured Moon)',
        type: 'deimos',
        radius: 0.2,
        semiMajorAxis: 9.2,
        eccentricity: 0.0003,
        inclination: -0.14,
        nodeRad: 2.1,
        periapsisRad: 1.6,
        speed: 0.048,
        scale: 0.82,
        altitudeKm: 20069,
      },
      {
        id: 'eureka-trojan',
        name: '5261 Eureka (Mars L5 Trojan Asteroid)',
        type: 'trojan',
        radius: 0.22,
        semiMajorAxis: 11.2,
        eccentricity: 0.065,
        inclination: 0.36,
        nodeRad: 3.8,
        periapsisRad: 2.4,
        speed: 0.036,
        scale: 0.85,
        altitudeKm: 34500,
      },
      {
        id: 'mro-relay',
        name: 'Mars Reconnaissance Relay Bus',
        type: 'spacecraft',
        radius: 0.24,
        semiMajorAxis: 5.05,
        eccentricity: 0.02,
        inclination: -1.25,
        nodeRad: 4.7,
        periapsisRad: 0.9,
        speed: -0.092,
        scale: 0.78,
        altitudeKm: 320,
      },
    ];

    for (const def of debrisDefs) {
      let mesh;

      if (def.type === 'spacecraft') {
        mesh = createMarsOdysseyOrbiterMesh();
        mesh.scale.multiplyScalar(def.scale);
      } else {
        const isPhobos = def.type === 'phobos';
        const geom = createProceduralRockGeometry(def.radius, isSoftwareGl ? 2 : 3, isPhobos);
        const tex = this.textures[def.type] || this.textures.phobos;

        const mat = new THREE.MeshStandardMaterial({
          map: tex.diffuseMap,
          normalMap: tex.normalMap,
          normalScale: new THREE.Vector2(2.4, 2.4),
          bumpMap: tex.bumpMap,
          bumpScale: 0.14,
          roughnessMap: tex.roughnessMap,
          roughness: 0.88,
          metalness: 0.08,
        });

        mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }

      const velocityKmS = def.type === 'spacecraft' ? 3.42 : def.type === 'phobos' ? 2.14 : 1.35;
      mesh.userData = {
        id: def.id,
        title: def.name,
        name: def.name,
        category: def.type === 'spacecraft' ? 'NASA Mars Orbiter' : 'Martian Natural Satellite',
        coords: `Orbital Altitude ${def.altitudeKm.toLocaleString()} km • ${velocityKmS} km/s`,
        image:
          def.id === 'odyssey-orbiter'
            ? '/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp'
            : undefined,
        stereoDatasetId: def.id === 'odyssey-orbiter' ? 'PIA04816 THEMIS/GRS' : 'JPL Ephemeris',
        description:
          def.id === 'odyssey-orbiter'
            ? 'Longest-operating spacecraft in Mars orbit (PIA04816), mapping global mineralogy and polar water-ice with THEMIS and the 6-meter Gamma Ray Spectrometer boom.'
            : def.id === 'phobos-moon'
            ? 'Innermost and larger Martian moon orbiting just 5,989 km above the surface, dominated by the 9 km Stickney impact crater.'
            : def.id === 'deimos-moon'
            ? 'Outer captured asteroid-like moon in a near-circular 20,069 km equatorial orbit.'
            : 'Martian orbital reconnaissance and co-orbital body.',
        specs: {
          Altitude: `${def.altitudeKm.toLocaleString()} km`,
          Velocity: `${velocityKmS} km/s`,
          Inclination: `${((def.inclination * 180) / Math.PI).toFixed(1)}°`,
          Eccentricity: def.eccentricity.toFixed(4),
        },
      };

      this.group.add(mesh);

      const orbit = {
        semiMajorAxis: def.semiMajorAxis,
        eccentricity: def.eccentricity,
        inclinationRad: def.inclination,
        longitudeOfAscendingNodeRad: def.nodeRad,
        argumentOfPeriapsisRad: def.periapsisRad,
        meanMotion: def.speed,
      };

      this.entities.push({
        id: def.id,
        name: def.name,
        type: def.type,
        mesh,
        orbit,
        rotation: { x: 0.2, y: 0.5, z: 0.1 },
        angularVelocity:
          def.type === 'spacecraft'
            ? { x: 0.04, y: 0.18, z: 0.02 }
            : { x: 0.25, y: 0.45, z: 0.18 },
        scale: def.scale,
        altitudeKm: def.altitudeKm,
        velocityKmS,
      });
    }
  }

  getInteractiveMeshes() {
    return this.entities.filter(e => e.mesh.visible).map(e => e.mesh);
  }

  update(timeSeconds, dt, speedMultiplier = 1.0) {
    const simTime = timeSeconds * speedMultiplier;
    const simDt = dt * speedMultiplier;

    for (const entity of this.entities) {
      const pos = calculateOrbitalPosition(entity.orbit, simTime);
      entity.mesh.position.set(pos.x, pos.y, pos.z);

      entity.rotation = calculateTumble(entity.rotation, entity.angularVelocity, simDt);
      entity.mesh.rotation.set(entity.rotation.x, entity.rotation.y, entity.rotation.z);
    }

    if (this.instancedMicrometeorites.visible) {
      for (let i = 0; i < this.totalMicrometeorites; i++) {
        const orbit = this.microOrbits[i];
        const pos = calculateOrbitalPosition(orbit, simTime);
        this.dummyPos.set(pos.x, pos.y, pos.z);

        this.dummyQuat.setFromEuler(
          new THREE.Euler(
            simTime * 0.4 + i,
            simTime * 0.3 + i * 2,
            simTime * 0.2 + i * 3
          )
        );

        const s = 0.5 + (i % 4) * 0.12;
        this.dummyScale.set(s, s, s);

        this.dummyMatrix.compose(this.dummyPos, this.dummyQuat, this.dummyScale);
        this.instancedMicrometeorites.setMatrixAt(i, this.dummyMatrix);
      }

      this.instancedMicrometeorites.instanceMatrix.needsUpdate = true;
    }
  }

  setVisibleDebris(mode) {
    if (mode === 'none') {
      this.instancedMicrometeorites.visible = false;
      this.entities.forEach(e => {
        e.mesh.visible = false;
      });
    } else if (mode === 'minimal') {
      this.instancedMicrometeorites.visible = false;
      this.entities.forEach((e, idx) => {
        e.mesh.visible = idx < 2; // Only 2001 Mars Odyssey + Phobos
      });
    } else if (mode === 'notable' || mode === 'asteroids') {
      this.instancedMicrometeorites.visible = false;
      this.entities.forEach(e => {
        e.mesh.visible = true;
      });
    } else {
      this.instancedMicrometeorites.visible = true;
      this.entities.forEach(e => {
        e.mesh.visible = true;
      });
    }
  }

  dispose() {
    this.entities.forEach(e => {
      e.mesh.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    });

    this.instancedMicrometeorites.geometry.dispose();
    if (Array.isArray(this.instancedMicrometeorites.material)) {
      this.instancedMicrometeorites.material.forEach(m => m.dispose());
    } else {
      this.instancedMicrometeorites.material.dispose();
    }

    this.texturesList.forEach(pack => {
      pack.diffuseMap.dispose();
      pack.bumpMap.dispose();
      pack.normalMap.dispose();
      pack.roughnessMap.dispose();
    });
  }
}
