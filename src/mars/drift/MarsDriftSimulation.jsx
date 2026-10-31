import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPhotorealisticMarsTextures } from './proceduralMars';
import { DebrisSystem } from './DebrisField';
import { audioEngine } from './AudioEngine';
import {
  computeSunPosition,
  latLonToVector3,
  MARS_LANDMARKS,
  MARS_ATMOSPHERE_CONFIG,
  MARS_3D_TEXTURE_MODES,
  computeCloudDriftOffset
} from './orbitalMath';

export default function MarsDriftSimulation({
  isPaused,
  timeSpeed,
  sunAngle,
  dustIntensity = 0.42,
  cloudOpacity = 0.65,
  cloudDriftSpeed = 1.0,
  reliefScale = 1.0,
  textureMode = 'global-mola',
  debrisMode = 'minimal',
  cameraPreset,
  selectedObject,
  onSelectObject,
  onClearPreset,
  isAudioMuted,
  onFpsUpdate,
  onWebglError,
  onTelemetryUpdate
}) {
  const mountRef = useRef(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const propsRef = useRef({
    isPaused,
    timeSpeed,
    sunAngle,
    dustIntensity,
    cloudOpacity,
    cloudDriftSpeed,
    reliefScale,
    textureMode,
    debrisMode,
    cameraPreset,
    selectedObject,
    isAudioMuted
  });

  useEffect(() => {
    propsRef.current = {
      isPaused,
      timeSpeed,
      sunAngle,
      dustIntensity,
      cloudOpacity,
      cloudDriftSpeed,
      reliefScale,
      textureMode,
      debrisMode,
      cameraPreset,
      selectedObject,
      isAudioMuted
    };
  }, [
    isPaused,
    timeSpeed,
    sunAngle,
    dustIntensity,
    cloudOpacity,
    cloudDriftSpeed,
    reliefScale,
    textureMode,
    debrisMode,
    cameraPreset,
    selectedObject,
    isAudioMuted
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04060c');
    scene.fog = new THREE.FogExp2('#070b14', 0.0042);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    let renderer;
    let isSoftwareGl = false;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });

      const gl = renderer.getContext();
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const rendererStr = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      isSoftwareGl = /SwiftShader|Software|llvmpipe/i.test(rendererStr);

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isSoftwareGl ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.error('WebGL initialization failed:', err);
      if (onWebglError) onWebglError(err.message || 'WebGL Context Error');
      return;
    }

    const sunLight = new THREE.DirectionalLight('#fff2e4', 3.9);
    sunLight.position.set(22, 6, 15);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 48;
    const d = 8.5;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Subtle rusty-cobalt shadow bounce light for nightside geological readability
    const earthshineLight = new THREE.DirectionalLight('#1e3a8a', 0.34);
    earthshineLight.position.set(-18, -6, -12);
    scene.add(earthshineLight);

    const hemiLight = new THREE.HemisphereLight('#fda4af', '#0f172a', 0.24);
    scene.add(hemiLight);

    // 2. Mars Globe with 25.19° Axial Obliquity, MOLA 3D Relief, and Perseverance 3D Surface Textures
    const marsTiltGroup = new THREE.Group();
    marsTiltGroup.rotation.z = THREE.MathUtils.degToRad(25.19);
    scene.add(marsTiltGroup);

    const marsSpinGroup = new THREE.Group();
    marsTiltGroup.add(marsSpinGroup);

    const marsTextures = createPhotorealisticMarsTextures(isSoftwareGl);
    const marsRadius = 3.0;
    const segments = isSoftwareGl ? 48 : 96;
    const marsGeo = new THREE.SphereGeometry(marsRadius, segments, segments);

    const marsMat = new THREE.MeshStandardMaterial({
      map: marsTextures.diffuseMap,
      bumpMap: marsTextures.bumpMap,
      bumpScale: 0.085,
      displacementMap: marsTextures.displacementMap,
      displacementScale: 0.16,
      displacementBias: -0.055,
      roughnessMap: marsTextures.roughnessMap,
      roughness: 0.88,
      metalness: 0.06,
      normalMap: marsTextures.normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45)
    });

    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsMesh.castShadow = true;
    marsMesh.receiveShadow = true;
    marsMesh.name = 'Mars';
    marsMesh.userData = {
      id: 'mars-globe',
      title: 'Mars (Sol IV — Areographic Globe)',
      category: 'Planetary Body',
      coords: 'Obliquity 25.19° • Mean Radius 3,389.5 km',
      elevation: 'MOLA Dynamic Range: 29.5 km',
      description:
        'Fourth planet from the Sun featuring the crustal dichotomy between smooth northern lowlands (Vastitas Borealis), cratered southern highlands, the Tharsis volcanic province, Valles Marineris, and Perseverance stereo micro-textures.',
      specs: {
        'Equatorial Radius': '3,396.2 km',
        'Sidereal Sol': '24h 37m 22.7s',
        'Atmosphere': '95.3% CO2, 2.6% N2, 1.9% Ar',
        'Surface Gravity': '3.721 m/s² (0.38 g)'
      }
    };
    marsSpinGroup.add(marsMesh);

    // 3. Thin, Semi-Transparent Atmosphere & Shader-Based Drifting Procedural Cloud Layer
    // Sits closely around the Mars globe (1.015x radius) and renders both a thin semi-transparent
    // atmospheric envelope and a 3D spherical fBm cloud pattern that drifts slowly over the surface.
    const cloudLayerGeo = new THREE.SphereGeometry(
      marsRadius * MARS_ATMOSPHERE_CONFIG.cloudLayerRadiusRatio,
      48,
      48
    );

    const cloudAtmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uSunDir: { value: new THREE.Vector3(1, 0, 0) },
        uTime: { value: 0 },
        uCloudOpacity: { value: propsRef.current.cloudOpacity },
        uCloudDriftSpeed: { value: propsRef.current.cloudDriftSpeed },
        uDustIntensity: { value: propsRef.current.dustIntensity },
        uWarmCloudColor: { value: new THREE.Color('#fff5eb') },
        uIceCloudColor: { value: new THREE.Color('#dbeafe') },
        uDustShellColor: { value: new THREE.Color('#e06d44') },
        uTwilightColor: { value: new THREE.Color('#60a5fa') }
      },
      vertexShader: `
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
      `,
      fragmentShader: `
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

        // Seamless 3D value noise on sphere (zero UV seam artifacts)
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

        // 5-octave 3D Fractional Brownian Motion forwispy Martian cirrus & dust plumes
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

          // Rotate 3D sampling coordinate slowly around Mars Y axis for zonal easterly/westerly drift
          float driftAngle = uTime * 0.045 * uCloudDriftSpeed;
          float ca = cos(driftAngle);
          float sa = sin(driftAngle);
          vec3 driftedPos = vec3(
            ca * vLocalDir.x + sa * vLocalDir.z,
            vLocalDir.y + sin(uTime * 0.015 * uCloudDriftSpeed) * 0.03,
           -sa * vLocalDir.x + ca * vLocalDir.z
          );

          // Anisotropic zonal stretching (Martian jet streams stretch clouds east-west)
          vec3 stretchedCoord = vec3(driftedPos.x * 2.8, driftedPos.y * 5.2, driftedPos.z * 2.8);

          // Domain warping for curling cyclonic spiral wakes & MEDA SkyCam wave clouds
          vec3 warp = vec3(
            fbm3D(stretchedCoord + vec3(uTime * 0.018 * uCloudDriftSpeed, 0.0, 0.0)),
            fbm3D(stretchedCoord + vec3(0.0, uTime * 0.012 * uCloudDriftSpeed, 4.1)),
            fbm3D(stretchedCoord + vec3(2.3, 0.0, -uTime * 0.016 * uCloudDriftSpeed))
          );

          float rawCloud = fbm3D(stretchedCoord * 1.45 + warp * 1.15);
          float fineWisps = fbm3D(stretchedCoord * 3.6 - warp * 0.85);
          float combinedNoise = mix(rawCloud, fineWisps, 0.38);

          // Latitude weighting: Aphelion Cloud Belt (-20° to +25°), Orographic Tharsis plumes, and Polar Hoods
          float lat = abs(vLocalDir.y);
          float equatorialBelt = exp(-pow((lat - 0.14) / 0.28, 2.0));
          float polarHood = smoothstep(0.68, 0.92, lat) * 0.85;
          // Tharsis & Olympus Mons localized orographic condensation plume
          float orographicWave = exp(-length(vLocalDir - normalize(vec3(-0.65, 0.25, -0.55))) * 3.2) * 0.55;

          float cloudMask = smoothstep(0.44, 0.74, combinedNoise + equatorialBelt * 0.14 + polarHood * 0.16 + orographicWave * 0.22);

          // Approximate 3D cloud self-shadowing & drop shadow along solar vector
          vec3 sunSampleOffset = stretchedCoord * 1.45 + warp * 1.15 + sunDir * 0.12;
          float shadowSample = fbm3D(sunSampleOffset);
          float cloudRelief = clamp((combinedNoise - shadowSample) * 2.8 + 0.5, 0.0, 1.0);

          // Solar illumination & terminator twilight scattering
          float sunDot = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.18, 0.35, sunDot);
          float terminatorBand = exp(-pow((sunDot - 0.02) / 0.22, 2.0));

          // Thin semi-transparent atmospheric shell (Fresnel limb + subtle global haze)
          float viewDot = clamp(dot(normal, viewDir), 0.0, 1.0);
          float fresnelRim = pow(1.0 - viewDot, 2.35);
          float baseShellAlpha = (0.045 + fresnelRim * 0.34) * clamp(uDustIntensity * 1.25, 0.18, 0.95) * smoothstep(-0.35, 0.25, sunDot);

          // Combine ice cloud tint (equatorial/polar CO2/H2O cirrus) with warm dust storm plumes
          vec3 cloudTint = mix(uWarmCloudColor, uIceCloudColor, clamp(equatorialBelt + polarHood, 0.0, 1.0));
          cloudTint = mix(cloudTint, uTwilightColor, terminatorBand * 0.52);
          cloudTint *= (0.72 + 0.42 * cloudRelief);

          vec3 shellColor = mix(uDustShellColor, uTwilightColor, terminatorBand * 0.45 + fresnelRim * 0.25);

          float finalCloudAlpha = cloudMask * uCloudOpacity * (0.15 + 0.85 * dayFactor) * 0.62;
          float totalAlpha = clamp(baseShellAlpha + finalCloudAlpha, 0.0, 0.82);

          vec3 finalRGB = mix(shellColor, cloudTint, clamp(finalCloudAlpha / max(totalAlpha, 0.001), 0.0, 1.0));
          finalRGB *= (0.18 + 0.82 * smoothstep(-0.28, 0.45, sunDot));

          gl_FragColor = vec4(finalRGB, totalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide
    });

    const cloudAtmosphereMesh = new THREE.Mesh(cloudLayerGeo, cloudAtmosphereMat);
    marsSpinGroup.add(cloudAtmosphereMesh);

    // 4. Outer Atmospheric Limb Scattering Halo (BackSide Rayleigh/Mie limb glow)
    const atmoGeo = new THREE.SphereGeometry(
      marsRadius * MARS_ATMOSPHERE_CONFIG.outerHaloRadiusRatio,
      64,
      64
    );
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {
        uSunDir: { value: new THREE.Vector3(1, 0, 0) },
        uDustColor: { value: new THREE.Color('#d95b2b') },
        uTwilightBlue: { value: new THREE.Color('#3b82f6') },
        uDustOpacity: { value: 0.42 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
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
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    marsTiltGroup.add(atmosphereMesh);

    // 5. Interactive 3D Surface Landmark Pins (Anchored to Mars Spin Group)
    const landmarkMeshes = [];
    const pinGeo = new THREE.SphereGeometry(0.052, 16, 16);
    const haloGeo = new THREE.RingGeometry(0.075, 0.115, 24);

    MARS_LANDMARKS.forEach((landmark) => {
      const pos = latLonToVector3(landmark.lat, landmark.lon, marsRadius + 0.055);
      const pinGroup = new THREE.Group();
      pinGroup.position.set(pos.x, pos.y, pos.z);

      const normal = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

      const isRoverSite = landmark.category.includes('Rover');
      const pinMat = new THREE.MeshBasicMaterial({
        color: isRoverSite ? '#3b82f6' : '#ef4444'
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);

      const haloMat = new THREE.MeshBasicMaterial({
        color: isRoverSite ? '#60a5fa' : '#f87171',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      pinGroup.add(pinMesh);
      pinGroup.add(haloMesh);

      pinMesh.userData = {
        ...landmark,
        isLandmark: true,
        haloMesh
      };

      marsSpinGroup.add(pinGroup);
      landmarkMeshes.push(pinMesh);
    });

    // 6. Deep Space Starfield
    const starsCount = 2800;
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const r = 85 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const temp = Math.random();
      const color = new THREE.Color();
      if (temp > 0.82) {
        color.setHex(0xbfdbfe);
      } else if (temp > 0.4) {
        color.setHex(0xf8fafc);
      } else {
        color.setHex(0xfecdd3);
      }
      color.multiplyScalar(0.45 + Math.random() * 0.55);

      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: true
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 7. Martian Orbital System (Initialized in Minimal Mode by default)
    const debrisSystem = new DebrisSystem(scene, isSoftwareGl, propsRef.current.debrisMode);

    // 8. Selection Reticle Ring
    const reticleGeo = new THREE.RingGeometry(0.32, 0.36, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: '#ef4444',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.visible = false;
    scene.add(reticleMesh);

    // 9. Spherical Camera Orbit & Landmark Tracking State
    const camState = {
      theta: 0.45,
      phi: 1.38,
      radius: 9.6,
      targetTheta: 0.45,
      targetPhi: 1.38,
      targetRadius: 9.6,
      lookAt: new THREE.Vector3(0, 0, 0),
      targetLookAt: new THREE.Vector3(0, 0, 0),
      isDragging: false,
      dragDistance: 0,
      prevX: 0,
      prevY: 0,
      trackedMesh: null
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e) => {
      if (e.target !== renderer.domElement) return;
      camState.isDragging = true;
      camState.dragDistance = 0;
      camState.prevX = e.clientX;
      camState.prevY = e.clientY;
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (camState.isDragging) {
        const dx = e.clientX - camState.prevX;
        const dy = e.clientY - camState.prevY;
        camState.dragDistance += Math.hypot(dx, dy);

        camState.targetTheta -= dx * 0.0055;
        camState.targetPhi = Math.max(
          0.2,
          Math.min(Math.PI - 0.2, camState.targetPhi - dy * 0.0055)
        );

        camState.prevX = e.clientX;
        camState.prevY = e.clientY;
        return;
      }

      const pickables = [...landmarkMeshes, ...debrisSystem.getInteractiveMeshes()];
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(pickables, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        renderer.domElement.style.cursor = 'pointer';
        const worldPos = new THREE.Vector3();
        hit.getWorldPosition(worldPos);
        const projected = worldPos.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(projected.y * 0.5) + 0.5) * window.innerHeight;
        setHoveredLabel({
          title: hit.userData.title || hit.userData.name,
          category: hit.userData.category || hit.userData.subtitle,
          x,
          y
        });
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredLabel(null);
      }
    };

    const onPointerUp = (e) => {
      if (!camState.isDragging) return;
      camState.isDragging = false;

      if (camState.dragDistance < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const pickables = [
          ...landmarkMeshes,
          ...debrisSystem.getInteractiveMeshes(),
          marsMesh
        ];
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(pickables, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (!propsRef.current.isAudioMuted) {
            audioEngine.playLockTone();
          }

          if (hit === marsMesh) {
            camState.trackedMesh = null;
            camState.targetLookAt.set(0, 0, 0);
            camState.targetRadius = 9.4;
            onSelectObject(marsMesh.userData);
          } else {
            camState.trackedMesh = hit;
            camState.targetRadius = hit.userData.isLandmark ? 4.35 : 3.2;
            onSelectObject(hit.userData);
          }
        } else {
          camState.trackedMesh = null;
          camState.targetLookAt.set(0, 0, 0);
          onSelectObject(null);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      camState.targetRadius = Math.max(
        4.1,
        Math.min(28.0, camState.targetRadius + e.deltaY * 0.0055)
      );
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Expose deterministic inspection & test hooks for Playwright verification
    window.__marsSim = {
      selectLandmarkById: (id) => {
        const found = landmarkMeshes.find((m) => m.userData.id === id);
        if (found) {
          camState.trackedMesh = found;
          camState.targetRadius = 4.35;
          onSelectObject(found.userData);
          return true;
        }
        const craft = debrisSystem
          .getInteractiveMeshes()
          .find((m) => m.userData.id === id);
        if (craft) {
          camState.trackedMesh = craft;
          camState.targetRadius = 3.2;
          onSelectObject(craft.userData);
          return true;
        }
        return false;
      },
      getSceneState: () => ({
        marsRotationY: Number(marsSpinGroup.rotation.y.toFixed(4)),
        cameraRadius: Number(camState.radius.toFixed(2)),
        trackedId: camState.trackedMesh?.userData?.id || null,
        reliefScale: propsRef.current.reliefScale,
        dustIntensity: propsRef.current.dustIntensity,
        cloudOpacity: propsRef.current.cloudOpacity,
        cloudDriftSpeed: propsRef.current.cloudDriftSpeed,
        textureMode: propsRef.current.textureMode,
        debrisMode: propsRef.current.debrisMode,
        visibleAsteroids: debrisSystem.instancedMicrometeorites.visible
          ? debrisSystem.totalMicrometeorites
          : 0,
        cloudDriftOffset: computeCloudDriftOffset(
          accumulatedTime,
          propsRef.current.cloudDriftSpeed,
          marsSpinGroup.rotation.y
        )
      })
    };

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    let telemetryTimer = 0;
    let accumulatedTime = 0;
    let animationFrameId;

    const tick = (now) => {
      animationFrameId = requestAnimationFrame(tick);

      const rawDt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      frameCount++;
      fpsAccumulator += rawDt;
      telemetryTimer += rawDt;

      if (fpsAccumulator >= 0.5) {
        const currentFps = Math.round(frameCount / fpsAccumulator);
        if (onFpsUpdate) onFpsUpdate(currentFps);
        frameCount = 0;
        fpsAccumulator = 0;
      }

      const {
        isPaused: paused,
        timeSpeed: speed,
        sunAngle: sAngle,
        dustIntensity: dust,
        cloudOpacity: cOpacity,
        cloudDriftSpeed: cDriftSpeed,
        reliefScale: relief,
        textureMode: texMode,
        debrisMode: dMode,
        cameraPreset: preset,
        selectedObject: selObj
      } = propsRef.current;

      // Apply camera or landmark presets triggered from HUD
      if (preset) {
        if (preset.landmarkId) {
          const targetPin = landmarkMeshes.find(
            (m) => m.userData.id === preset.landmarkId
          );
          if (targetPin) {
            camState.trackedMesh = targetPin;
            camState.targetRadius = 4.4;
            onSelectObject(targetPin.userData);
          }
        } else if (preset.craftId) {
          const targetCraft = debrisSystem
            .getInteractiveMeshes()
            .find((m) => m.userData.id === preset.craftId);
          if (targetCraft) {
            camState.trackedMesh = targetCraft;
            camState.targetRadius = 3.2;
            onSelectObject(targetCraft.userData);
          }
        } else {
          camState.trackedMesh = null;
          camState.targetLookAt.set(0, 0, 0);
          if (preset.theta !== undefined) camState.targetTheta = preset.theta;
          if (preset.phi !== undefined) camState.targetPhi = preset.phi;
          if (preset.radius !== undefined) camState.targetRadius = preset.radius;
        }
        if (onClearPreset) onClearPreset();
      }

      if (!selObj && camState.trackedMesh) {
        camState.trackedMesh = null;
        camState.targetLookAt.set(0, 0, 0);
      } else if (selObj && selObj.id) {
        const matchingPin = landmarkMeshes.find((m) => m.userData.id === selObj.id);
        const matchingCraft = debrisSystem
          .getInteractiveMeshes()
          .find((m) => m.userData.id === selObj.id);
        const target = matchingPin || matchingCraft;
        if (target && camState.trackedMesh !== target) {
          camState.trackedMesh = target;
        }
      }

      // Update Sun ephemeris & atmospheric shader uniforms
      const sunPos = computeSunPosition(sAngle, 25);
      sunLight.position.set(sunPos.x, sunPos.y, sunPos.z);
      earthshineLight.position.set(-sunPos.x * 0.7, -sunPos.y * 0.5, -sunPos.z * 0.7);

      const sunDirNorm = new THREE.Vector3(sunPos.x, sunPos.y, sunPos.z).normalize();

      // Update Outer Halo & Inner Semi-Transparent Drifting Cloud Layer
      atmoMat.uniforms.uSunDir.value.copy(sunDirNorm);
      atmoMat.uniforms.uDustOpacity.value = 0.16 + dust * 0.65;

      cloudAtmosphereMat.uniforms.uSunDir.value.copy(sunDirNorm);
      cloudAtmosphereMat.uniforms.uTime.value = accumulatedTime;
      cloudAtmosphereMat.uniforms.uCloudOpacity.value = cOpacity;
      cloudAtmosphereMat.uniforms.uCloudDriftSpeed.value = cDriftSpeed;
      cloudAtmosphereMat.uniforms.uDustIntensity.value = dust;

      // Apply 3D MOLA Topographic Relief + Perseverance 3D Surface Texture Mode
      const activeModeConfig =
        MARS_3D_TEXTURE_MODES.find((m) => m.id === texMode) || MARS_3D_TEXTURE_MODES[0];

      const effectiveDisplacement = 0.15 * relief * activeModeConfig.displacementMultiplier;
      marsMat.displacementScale = effectiveDisplacement;
      marsMat.displacementBias = -0.052 * relief * activeModeConfig.displacementMultiplier;
      marsMat.bumpScale = 0.085 * Math.max(0.25, relief) * activeModeConfig.bumpBoost;

      const normalStrength = 0.42 * activeModeConfig.normalBoost * Math.max(0.45, relief);
      marsMat.normalScale.set(normalStrength, normalStrength);

      debrisSystem.setVisibleDebris(dMode);

      const effectiveDt = paused ? 0 : rawDt * speed;
      accumulatedTime += effectiveDt;

      // Rotate Mars on its axis (Sidereal Sol: 24h 37m 22s)
      marsSpinGroup.rotation.y += effectiveDt * 0.055;
      starField.rotation.y += effectiveDt * 0.0025;

      // Pulse landmark rings
      landmarkMeshes.forEach((pin, idx) => {
        const halo = pin.userData.haloMesh;
        if (halo) {
          const pulse = 1 + Math.sin(now * 0.004 + idx) * 0.22;
          halo.scale.set(pulse, pulse, 1);
        }
      });

      debrisSystem.update(accumulatedTime, effectiveDt);

      // Update tracked object position
      if (camState.trackedMesh) {
        const targetWorldPos = new THREE.Vector3();
        camState.trackedMesh.getWorldPosition(targetWorldPos);
        camState.targetLookAt.copy(targetWorldPos);

        reticleMesh.visible = true;
        reticleMesh.position.copy(targetWorldPos);
        reticleMesh.lookAt(camera.position);
        const s = 1 + Math.sin(now * 0.006) * 0.08;
        reticleMesh.scale.set(s, s, 1);
      } else {
        reticleMesh.visible = false;
      }

      // Smoothly interpolate spherical camera coordinates
      const damping = 1 - Math.exp(-7.5 * rawDt);
      camState.theta += (camState.targetTheta - camState.theta) * damping;
      camState.phi += (camState.targetPhi - camState.phi) * damping;
      camState.radius += (camState.targetRadius - camState.radius) * damping;
      camState.lookAt.lerp(camState.targetLookAt, damping);

      const cx =
        camState.lookAt.x +
        camState.radius * Math.sin(camState.phi) * Math.sin(camState.theta);
      const cy = camState.lookAt.y + camState.radius * Math.cos(camState.phi);
      const cz =
        camState.lookAt.z +
        camState.radius * Math.sin(camState.phi) * Math.cos(camState.theta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(camState.lookAt);

      if (telemetryTimer >= 0.4 && onTelemetryUpdate) {
        telemetryTimer = 0;
        const areographicLon =
          (((THREE.MathUtils.radToDeg(marsSpinGroup.rotation.y) % 360) + 540) % 360) - 180;
        const driftInfo = computeCloudDriftOffset(
          accumulatedTime,
          cDriftSpeed,
          marsSpinGroup.rotation.y
        );
        onTelemetryUpdate({
          subSolarLon: areographicLon.toFixed(1),
          cameraAltitudeKm: Math.round((camState.radius - marsRadius) * 1129.8),
          dustOpticalDepth: (0.25 + dust * 1.65).toFixed(2),
          cloudCoverPct: driftInfo.cloudCoverPct
        });
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />

      {hoveredLabel && (
        <div
          className="pointer-events-none fixed z-20 px-2.5 py-1.5 rounded-md bg-slate-950/90 border border-red-500/40 backdrop-blur-md shadow-lg transform -translate-x-1/2 -translate-y-full -mt-3 transition-opacity duration-75"
          style={{ left: hoveredLabel.x, top: hoveredLabel.y }}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-red-400">
            {hoveredLabel.category}
          </div>
          <div className="text-xs font-medium text-zinc-100 whitespace-nowrap">
            {hoveredLabel.title}
          </div>
        </div>
      )}
    </div>
  );
}
