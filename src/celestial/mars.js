import * as THREE from 'three';
import { MARS_LANDMARKS, areographicToCartesian, MARS_ATMOSPHERE_CONFIG, MARS_3D_TEXTURE_MODES } from '../data/marsLandmarks.js';
import { createPhotorealisticMarsTextures, applyMarsTextureMode } from './photorealisticMars.js';

/**
 * 5-octave 3D Fractional Brownian Motion (fBm) shader for Martian water-ice cirrus clouds,
 * aphelion equatorial cloud belt, Tharsis orographic plumes, and polar hood CO2 clouds.
 */
const marsCloudVertexShader = `
  varying vec3 vNormalWorld;
  varying vec3 vViewPosition;
  varying vec3 vLocalDir;

  void main() {
    vLocalDir = normalize(position);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const marsCloudFragmentShader = `
  uniform vec3 uSunDir;
  uniform float uTime;
  uniform float uCloudOpacity;
  uniform float uCloudDriftSpeed;
  uniform float uDustIntensity;
  uniform vec3 uWarmCloudColor;
  uniform vec3 uIceCloudColor;
  uniform vec3 uDustShellColor;
  uniform vec3 uTwilightColor;

  varying vec3 vNormalWorld;
  varying vec3 vViewPosition;
  varying vec3 vLocalDir;

  float hash31(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3D(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(hash31(i + vec3(0,0,0)), hash31(i + vec3(1,0,0)), f.x),
        mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x),
        f.y
      ),
      mix(
        mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
        mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm3D(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    mat3 rot = mat3(
      0.00,  0.80,  0.60,
     -0.80,  0.36, -0.48,
     -0.60, -0.48,  0.64
    );
    for (int i = 0; i < 5; i++) {
      v += a * noise3D(p);
      p = rot * p * 2.04 + vec3(1.7, 9.2, 3.4);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 normal = normalize(vNormalWorld);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(uSunDir);

    float driftAngle = uTime * 0.045 * uCloudDriftSpeed;
    float ca = cos(driftAngle);
    float sa = sin(driftAngle);
    vec3 driftedPos = vec3(
      ca * vLocalDir.x + sa * vLocalDir.z,
      vLocalDir.y + sin(uTime * 0.015 * uCloudDriftSpeed) * 0.03,
     -sa * vLocalDir.x + ca * vLocalDir.z
    );

    vec3 stretchedCoord = vec3(driftedPos.x * 2.8, driftedPos.y * 5.2, driftedPos.z * 2.8);

    vec3 warp = vec3(
      fbm3D(stretchedCoord + vec3(uTime * 0.018 * uCloudDriftSpeed, 0.0, 0.0)),
      fbm3D(stretchedCoord + vec3(0.0, uTime * 0.012 * uCloudDriftSpeed, 4.1)),
      fbm3D(stretchedCoord + vec3(2.3, 0.0, -uTime * 0.016 * uCloudDriftSpeed))
    );

    float rawCloud = fbm3D(stretchedCoord * 1.45 + warp * 1.15);
    float fineWisps = fbm3D(stretchedCoord * 3.6 - warp * 0.85);
    float combinedNoise = mix(rawCloud, fineWisps, 0.38);

    float lat = abs(vLocalDir.y);
    float equatorialBelt = exp(-pow((lat - 0.14) / 0.28, 2.0));
    float polarHood = smoothstep(0.68, 0.92, lat) * 0.85;
    float orographicWave = exp(-length(vLocalDir - normalize(vec3(-0.65, 0.25, -0.55))) * 3.2) * 0.55;

    float cloudMask = smoothstep(0.44, 0.74, combinedNoise + equatorialBelt * 0.14 + polarHood * 0.16 + orographicWave * 0.22);

    float sunDot = dot(normal, sunDir);
    float dayFactor = smoothstep(-0.18, 0.35, sunDot);
    float terminatorBand = exp(-pow((sunDot - 0.02) / 0.22, 2.0));

    float viewDot = clamp(dot(normal, viewDir), 0.0, 1.0);
    float fresnelRim = pow(1.0 - viewDot, 2.35);
    float baseShellAlpha = (0.045 + fresnelRim * 0.34) * clamp(uDustIntensity * 1.25, 0.18, 0.95) * smoothstep(-0.35, 0.25, sunDot);

    vec3 cloudTint = mix(uWarmCloudColor, uIceCloudColor, clamp(equatorialBelt + polarHood, 0.0, 1.0));
    cloudTint = mix(cloudTint, uTwilightColor, terminatorBand * 0.52);

    vec3 shellColor = mix(uDustShellColor, uTwilightColor, terminatorBand * 0.45 + fresnelRim * 0.25);

    float finalCloudAlpha = cloudMask * uCloudOpacity * (0.15 + 0.85 * dayFactor) * 0.62;
    float totalAlpha = clamp(baseShellAlpha + finalCloudAlpha, 0.0, 0.82);

    vec3 finalRGB = mix(shellColor, cloudTint, clamp(finalCloudAlpha / max(totalAlpha, 0.001), 0.0, 1.0));
    finalRGB *= (0.18 + 0.82 * smoothstep(-0.28, 0.45, sunDot));

    gl_FragColor = vec4(finalRGB, totalAlpha);
  }
`;

/**
 * Outer Atmospheric Limb Scattering Halo (BackSide Rayleigh/Mie limb glow)
 */
const marsOuterAtmoVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const marsOuterAtmoFragmentShader = `
  uniform vec3 uSunDir;
  uniform vec3 uDustColor;
  uniform vec3 uTwilightBlue;
  uniform float uDustOpacity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - max(0.0, dot(vNormal, vViewDir));
    float fresnel = pow(rim, 2.75);
    float sunDot = dot(vNormal, normalize(uSunDir));
    float daySide = smoothstep(-0.35, 0.45, sunDot);
    float terminator = smoothstep(-0.28, 0.05, sunDot) * (1.0 - smoothstep(0.05, 0.45, sunDot));
    vec3 scatterColor = mix(uDustColor, uTwilightBlue, terminator * 0.65);
    float alpha = fresnel * daySide * uDustOpacity;
    gl_FragColor = vec4(scatterColor, alpha);
  }
`;

/**
 * Helper to build a high-contrast canvas billboard badge for checkpoints
 */
function createCheckpointBadgeCanvas(text, subtext, color = '#F5D000') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  // Semi-transparent pill background
  ctx.fillStyle = 'rgba(8, 12, 20, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 64, 12);
  ctx.fill();
  ctx.stroke();

  // Glow dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(32, 40, 8, 0, Math.PI * 2);
  ctx.fill();

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(text, 50, 36);

  if (subtext) {
    ctx.fillStyle = color;
    ctx.font = 'bold 15px monospace';
    ctx.fillText(subtext, 50, 56);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function createMarsSystem(textures, sunDirection) {
  const marsSystemGroup = new THREE.Group();
  const marsTiltGroup = new THREE.Group();
  // Mars 25.19° obliquity to orbit
  marsTiltGroup.rotation.z = THREE.MathUtils.degToRad(25.19);
  marsSystemGroup.add(marsTiltGroup);

  const marsSpinGroup = new THREE.Group();
  marsTiltGroup.add(marsSpinGroup);

  const marsRadius = 0.532;

  // 1. Photorealistic Multi-Scale PBR Mars Sphere
  const marsPbrTextures = createPhotorealisticMarsTextures(false);

  const marsGeometry = new THREE.SphereGeometry(marsRadius, 96, 96);
  const marsMaterial = new THREE.MeshStandardMaterial({
    map: marsPbrTextures.diffuseMap || textures.marsAlbedo || null,
    bumpMap: marsPbrTextures.bumpMap || textures.marsBump || null,
    bumpScale: 0.052,
    normalMap: marsPbrTextures.normalMap || null,
    normalScale: new THREE.Vector2(0.48, 0.48),
    roughnessMap: marsPbrTextures.roughnessMap || null,
    roughness: 0.86,
    metalness: 0.04,
  });

  const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
  marsMesh.userData = { bodyId: 'mars' };
  marsMesh.castShadow = true;
  marsMesh.receiveShadow = true;
  marsSpinGroup.add(marsMesh);

  // 2. Procedural Drifting Martian Clouds & Atmospheric Shell
  const cloudLayerGeo = new THREE.SphereGeometry(
    marsRadius * MARS_ATMOSPHERE_CONFIG.cloudLayerRadiusRatio,
    64,
    64
  );

  const cloudMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: sunDirection.clone() },
      uTime: { value: 0 },
      uCloudOpacity: { value: MARS_ATMOSPHERE_CONFIG.defaultCloudOpacity },
      uCloudDriftSpeed: { value: MARS_ATMOSPHERE_CONFIG.defaultCloudDriftSpeed },
      uDustIntensity: { value: MARS_ATMOSPHERE_CONFIG.defaultDustIntensity },
      uWarmCloudColor: { value: new THREE.Color('#fff5eb') },
      uIceCloudColor: { value: new THREE.Color('#dbeafe') },
      uDustShellColor: { value: new THREE.Color('#e06d44') },
      uTwilightColor: { value: new THREE.Color('#60a5fa') },
    },
    vertexShader: marsCloudVertexShader,
    fragmentShader: marsCloudFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const cloudMesh = new THREE.Mesh(cloudLayerGeo, cloudMaterial);
  marsSpinGroup.add(cloudMesh);

  // 3. Outer Atmospheric Limb Scattering Halo (BackSide)
  const outerAtmoGeo = new THREE.SphereGeometry(
    marsRadius * MARS_ATMOSPHERE_CONFIG.outerHaloRadiusRatio,
    48,
    48
  );

  const outerAtmoMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: sunDirection.clone() },
      uDustColor: { value: new THREE.Color('#d95b2b') },
      uTwilightBlue: { value: new THREE.Color('#3b82f6') },
      uDustOpacity: { value: 0.45 },
    },
    vertexShader: marsOuterAtmoVertexShader,
    fragmentShader: marsOuterAtmoFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });

  const outerAtmoMesh = new THREE.Mesh(outerAtmoGeo, outerAtmoMaterial);
  marsTiltGroup.add(outerAtmoMesh);

  // 4. Interactive 3D Mars Landmark Checkpoints (Jezero, Gale, Olympus Mons, etc.)
  const landmarkGroup = new THREE.Group();
  const pulsingRings = [];
  const beaconBeams = [];

  MARS_LANDMARKS.forEach((lm) => {
    const coords = areographicToCartesian(
      lm.areographic.latitudeDeg,
      lm.areographic.longitudeDeg,
      marsRadius
    );
    const posVec = new THREE.Vector3(coords.x, coords.y, coords.z);
    const norm = posVec.clone().normalize();
    const colorHex = new THREE.Color(lm.color || '#ef4444').getHex();

    // A. Vertical glowing light beacon beam
    const beamHeight = 0.085;
    const beamGeo = new THREE.CylinderGeometry(0.0035, 0.0055, beamHeight, 10);
    const beamMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(posVec).add(norm.clone().multiplyScalar(beamHeight * 0.5));
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
    beam.userData = { landmarkId: lm.id, bodyId: 'mars' };
    landmarkGroup.add(beam);
    beaconBeams.push({ mesh: beam, baseHeight: beamHeight, id: lm.id });

    // B. Pulsating radar beacon ring
    const ringGeo = new THREE.RingGeometry(0.012, 0.024, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(posVec).multiplyScalar(1.006);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), norm);
    ring.userData = { landmarkId: lm.id, bodyId: 'mars' };
    landmarkGroup.add(ring);
    pulsingRings.push(ring);

    // C. Luminous waypoint node core (Never occluded)
    const coreGeo = new THREE.SphereGeometry(0.0065, 12, 12);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.copy(posVec).add(norm.clone().multiplyScalar(beamHeight));
    coreMesh.renderOrder = 1000;
    coreMesh.userData = { landmarkId: lm.id, bodyId: 'mars' };
    landmarkGroup.add(coreMesh);

    // D. Billboard label sprite tag
    const badgeTexture = createCheckpointBadgeCanvas(lm.shortName, lm.badge, lm.color);
    const spriteMat = new THREE.SpriteMaterial({
      map: badgeTexture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(posVec).add(norm.clone().multiplyScalar(beamHeight + 0.038));
    sprite.scale.set(0.09, 0.032, 1);
    sprite.renderOrder = 1001;
    sprite.userData = { landmarkId: lm.id, bodyId: 'mars' };
    landmarkGroup.add(sprite);

    // E. Generous click hitbox for seamless raycasting
    const hitbox = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitbox.position.copy(posVec).multiplyScalar(1.02);
    hitbox.userData = { landmarkId: lm.id, bodyId: 'mars' };
    landmarkGroup.add(hitbox);
  });

  marsSpinGroup.add(landmarkGroup);

  // 5. 2001 Mars Odyssey Orbiter (Polar Mapping Orbit)
  const odysseyGroup = new THREE.Group();
  const odysseyMeshGroup = new THREE.Group();

  // Bus
  const busGeo = new THREE.BoxGeometry(0.016, 0.016, 0.024);
  const busMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, roughness: 0.25 });
  const bus = new THREE.Mesh(busGeo, busMat);
  odysseyMeshGroup.add(bus);

  // Gold foil THEMIS instrument
  const themisGeo = new THREE.BoxGeometry(0.01, 0.01, 0.012);
  const themisMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
  const themis = new THREE.Mesh(themisGeo, themisMat);
  themis.position.set(0, 0, 0.016);
  odysseyMeshGroup.add(themis);

  // Solar Panels
  const panelGeo = new THREE.BoxGeometry(0.065, 0.002, 0.022);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4, metalness: 0.6 });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  odysseyMeshGroup.add(panel);

  odysseyGroup.add(odysseyMeshGroup);
  marsTiltGroup.add(odysseyGroup);

  // 6. Natural Satellites: Phobos & Deimos
  const phobosGroup = new THREE.Group();
  const phobosGeo = new THREE.DodecahedronGeometry(0.028, 1);
  const phobosMat = new THREE.MeshStandardMaterial({ color: 0x8a7f76, roughness: 0.94 });
  const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
  phobosGroup.add(phobosMesh);
  marsTiltGroup.add(phobosGroup);

  const deimosGroup = new THREE.Group();
  const deimosGeo = new THREE.DodecahedronGeometry(0.018, 1);
  const deimosMat = new THREE.MeshStandardMaterial({ color: 0x6e655d, roughness: 0.94 });
  const deimosMesh = new THREE.Mesh(deimosGeo, deimosMat);
  deimosGroup.add(deimosMesh);
  marsTiltGroup.add(deimosGroup);

  // 7. Mars Orbit Line around the Sun
  const orbitRadius = 4.6;
  const inclinationAngle = 1.85 * (Math.PI / 180);
  const orbitPoints = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * orbitRadius;
    const z = Math.sin(theta) * orbitRadius;
    const y = Math.sin(theta) * Math.sin(inclinationAngle) * orbitRadius;
    orbitPoints.push(new THREE.Vector3(x, y, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.28,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  let currentOrbitAngle = 2.45;
  let phobosAngle = 0.5;
  let deimosAngle = 2.1;
  let odysseyAngle = 0;
  let simulationTime = 0;

  return {
    group: marsSystemGroup,
    tiltGroup: marsTiltGroup,
    spinGroup: marsSpinGroup,
    mesh: marsMesh,
    material: marsMaterial,
    cloudMesh,
    cloudMaterial,
    landmarkGroup,
    orbitLine,
    orbitRadius,
    radius: marsRadius,
    update(dt, isPaused = false, selectedLandmarkId = null) {
      if (!isPaused) {
        simulationTime += dt;
        currentOrbitAngle += dt * 0.008;
        marsSpinGroup.rotation.y += dt * 0.0215; // 24.6h Sol rotation
        phobosAngle += dt * 0.16;
        deimosAngle += dt * 0.055;
        odysseyAngle += dt * 0.32; // Polar orbit
      }

      // Update cloud shader
      cloudMaterial.uniforms.uTime.value = simulationTime;

      // Position along solar orbit
      const x = Math.cos(currentOrbitAngle) * orbitRadius;
      const z = Math.sin(currentOrbitAngle) * orbitRadius;
      const y = Math.sin(currentOrbitAngle) * Math.sin(inclinationAngle) * orbitRadius;
      marsSystemGroup.position.set(x, y, z);

      // Phobos orbit (equatorial, r = 0.78)
      phobosMesh.position.set(
        Math.cos(phobosAngle) * 0.78,
        Math.sin(phobosAngle * 0.2) * 0.05,
        Math.sin(phobosAngle) * 0.78
      );
      phobosMesh.rotation.y += dt * 0.2;

      // Deimos orbit (equatorial, r = 1.18)
      deimosMesh.position.set(
        Math.cos(deimosAngle) * 1.18,
        Math.sin(deimosAngle * 0.15) * 0.08,
        Math.sin(deimosAngle) * 1.18
      );
      deimosMesh.rotation.y += dt * 0.1;

      // 2001 Mars Odyssey polar orbit (inclination ~93°)
      const odysseyR = marsRadius * 1.35;
      odysseyMeshGroup.position.set(
        Math.sin(odysseyAngle * 0.1) * 0.04,
        Math.sin(odysseyAngle) * odysseyR,
        Math.cos(odysseyAngle) * odysseyR
      );
      odysseyMeshGroup.rotation.x = odysseyAngle;

      // Animate checkpoint radar rings & active beacon surges
      pulsingRings.forEach((ring, idx) => {
        const pulse = 1.0 + Math.sin(simulationTime * 3.5 + idx * 1.1) * 0.35;
        ring.scale.set(pulse, pulse, 1);
        ring.material.opacity = 0.5 + Math.sin(simulationTime * 3.5 + idx * 1.1) * 0.35;
      });

      beaconBeams.forEach(({ mesh, baseHeight, id }) => {
        const isSelected = selectedLandmarkId === id;
        if (isSelected) {
          const surge = 1.8 + Math.sin(simulationTime * 5.0) * 0.4;
          mesh.scale.set(1.4, surge, 1.4);
          mesh.material.opacity = 1.0;
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
          mesh.material.opacity = 0.85;
        }
      });
    },
    setTextureMode(modeId) {
      applyMarsTextureMode(marsMaterial, modeId);
    },
    setCloudOpacity(val) {
      cloudMaterial.uniforms.uCloudOpacity.value = Number(val);
    },
    setCloudDriftSpeed(val) {
      cloudMaterial.uniforms.uCloudDriftSpeed.value = Number(val);
    },
    setDustIntensity(val) {
      cloudMaterial.uniforms.uDustIntensity.value = Number(val);
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    setLandmarksVisibility(visible) {
      landmarkGroup.visible = visible;
    },
    getPosition() {
      return marsSystemGroup.position.clone();
    },
    getLandmarkPosition(landmarkId) {
      const lm = MARS_LANDMARKS.find((l) => l.id === landmarkId);
      if (!lm) return null;
      const coords = areographicToCartesian(
        lm.areographic.latitudeDeg,
        lm.areographic.longitudeDeg,
        marsRadius
      );
      const localVec = new THREE.Vector3(coords.x, coords.y, coords.z);
      // Transform local position through spin, tilt, and system groups
      const worldVec = localVec.clone();
      worldVec.applyEuler(marsSpinGroup.rotation);
      worldVec.applyEuler(marsTiltGroup.rotation);
      worldVec.add(marsSystemGroup.position);
      return worldVec;
    },
    dispose() {
      marsGeometry.dispose();
      marsMaterial.dispose();
      cloudLayerGeo.dispose();
      cloudMaterial.dispose();
      outerAtmoGeo.dispose();
      outerAtmoMaterial.dispose();
      phobosGeo.dispose();
      phobosMat.dispose();
      deimosGeo.dispose();
      deimosMat.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      busGeo.dispose();
      busMat.dispose();
      themisGeo.dispose();
      themisMat.dispose();
      panelGeo.dispose();
      panelMat.dispose();
    },
  };
}
