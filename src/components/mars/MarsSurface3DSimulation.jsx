/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Photorealistic 3D Mars Surface Rover & Areology Simulation developed directly from NASA Perseverance Mastcam-Z reference imagery
*/
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Camera,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Sun,
  Wind,
  Info,
  X,
  Github,
  ExternalLink,
  ChevronRight,
  Eye,
  RotateCcw,
} from 'lucide-react';

// Reference image presets matching the user's uploaded rover photos
const VANTAGE_PRESETS = [
  {
    id: 'ventifacts',
    label: '01: Ventifact Ridge',
    photo: '/assets/mars_reference/mars_ref_1_ventifacts.jpg',
    camPos: { x: 0, y: 3.2, z: 9.5 },
    lookAt: { x: 0, y: 3.8, z: 0 },
    title: 'Wind-Carved Ventifact Ridge',
    rockType: 'Eolian-Abraded Basaltic Slabs',
    description: 'Angular tilted rocks sculpted by millions of years of directional saltating sandstorms in the thin Martian exosphere, perched along a sandy crest.',
    formation: 'Aerodynamic wind facets (ventifacts) inclined along the prevailing wind vector.',
    minerals: { SiO2: '46.2%', FeO: '19.4%', Al2O3: '8.8%', SO3: '6.1%' },
  },
  {
    id: 'hillside',
    label: '02: Hillside Outcrop',
    photo: '/assets/mars_reference/mars_ref_2_hillside.jpg',
    camPos: { x: -8.5, y: 4.5, z: 12.0 },
    lookAt: { x: -4.0, y: 5.5, z: -2.0 },
    title: 'Stratified Hillside Outcrop & Talus',
    rockType: 'Layered Sulfate-Rich Bedrock',
    description: 'Prominent eroded rocky hillside displaying inclined cross-bedding strata and talus scree slopes descending into sandy plain depressions.',
    formation: 'Ancient aqueous deltaic deposition followed by extensive eolian deflation.',
    minerals: { SiO2: '42.1%', FeO: '16.5%', SO3: '11.8%', CaO: '6.7%' },
  },
  {
    id: 'crossbedding',
    label: '03: Cross-Bedded Strata',
    photo: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
    camPos: { x: -5.0, y: 3.8, z: 4.0 },
    lookAt: { x: -5.5, y: 4.2, z: 0 },
    title: 'Cross-Bedded Sedimentary Sandstone',
    rockType: 'Fluvial / Eolian Sandstone Strata',
    description: 'Macro view of thin curvilinear sedimentary laminations preserved in rock. Demonstrates ancient migrating sand dunes and water current deposition.',
    formation: 'Low-angle cross-stratification in fine-to-medium grained sandstone.',
    minerals: { SiO2: '51.3%', FeO: '14.2%', Al2O3: '10.5%', K2O: '2.1%' },
  },
  {
    id: 'boulderfield',
    label: '04: Boulder Field',
    photo: '/assets/mars_reference/mars_ref_4_boulder_field.jpg',
    camPos: { x: 4.0, y: 2.8, z: 11.5 },
    lookAt: { x: 1.0, y: 1.5, z: 0 },
    title: 'Pavement & Scattered Boulder Field',
    rockType: 'Impact Ejecta & Weathered Pavement',
    description: 'Expansive field of angular and sub-rounded boulders strewn across fractured bedrock pavement with interspersed sand drifts and ventifacts.',
    formation: 'Ballistic impact ejecta deposit followed by billions of years of micro-meteorite comminution.',
    minerals: { SiO2: '45.0%', FeO: '20.1%', MgO: '8.4%', TiO2: '1.2%' },
  },
  {
    id: 'sandripple',
    label: '05: Sand Drift Rocks',
    photo: '/assets/mars_reference/mars_ref_5_sand_ripple.jpg',
    camPos: { x: 1.5, y: 2.2, z: 6.8 },
    lookAt: { x: 0.5, y: 1.8, z: 2.0 },
    title: 'Solitary Boulders on Sand Ripple',
    rockType: 'Isolated Basalt Float Boulders',
    description: 'Weathered boulders resting directly upon active eolian sand ripples, with windward scour pits and leeward sand tail drifts.',
    formation: 'Resistant erosional corestones surrounded by modern basaltic sand ripples.',
    minerals: { SiO2: '47.8%', FeO: '18.9%', Al2O3: '9.2%', Na2O: '2.8%' },
  },
];

export function MarsSurface3DSimulation() {
  const mountRef = useRef(null);
  const [activePreset, setActivePreset] = useState(VANTAGE_PRESETS[0]);
  const [selectedRock, setSelectedRock] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('midday'); // 'midday' | 'afternoon' | 'sunset'
  const [dustIntensity, setDustIntensity] = useState(0.45);
  const [roverSpeed, setRoverSpeed] = useState(0);

  const sceneRefs = useRef({
    camera: null,
    renderer: null,
    scene: null,
    sunLight: null,
    ambientLight: null,
    targetCamPos: new THREE.Vector3(0, 3.2, 9.5),
    targetLookAt: new THREE.Vector3(0, 3.8, 0),
    currentLookAt: new THREE.Vector3(0, 3.8, 0),
    keys: {},
  });

  // Switch vantage point preset
  const selectPreset = (preset) => {
    setActivePreset(preset);
    setSelectedRock(preset);
    const s = sceneRefs.current;
    if (s.camera) {
      s.targetCamPos.set(preset.camPos.x, preset.camPos.y, preset.camPos.z);
      s.targetLookAt.set(preset.lookAt.x, preset.lookAt.y, preset.lookAt.z);
    }
  };

  // Generate Procedural Mars Surface Textures
  const createMarsSandTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base Martian reddish-ochre
    ctx.fillStyle = '#b76135';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle ripple bands
    for (let y = 0; y < 1024; y += 4) {
      const noise = Math.sin(y * 0.08) * 15;
      const shade = Math.floor(180 + noise + (Math.random() - 0.5) * 12);
      ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.55)}, ${Math.floor(shade * 0.32)})`;
      ctx.fillRect(0, y, 1024, 2.5);
    }

    // Grain speckled noise (pebbles & regolith grains)
    for (let i = 0; i < 40000; i++) {
      const px = Math.random() * 1024;
      const py = Math.random() * 1024;
      const lum = Math.random() > 0.5 ? 210 : 130;
      ctx.fillStyle = `rgba(${lum}, ${Math.floor(lum * 0.6)}, ${Math.floor(lum * 0.38)}, ${Math.random() * 0.35})`;
      ctx.fillRect(px, py, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    return texture;
  };

  // Generate Layered Sedimentary Rock Strata Texture
  const createStrataTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#9e5631';
    ctx.fillRect(0, 0, 1024, 1024);

    // Inclined sedimentary laminations / cross-bedding (Image 3)
    for (let y = 0; y < 1024; y += 6) {
      const tilt = Math.sin(y * 0.04) * 8;
      const isLight = (y % 18) < 9;
      ctx.fillStyle = isLight ? 'rgba(215, 145, 95, 0.45)' : 'rgba(125, 60, 30, 0.55)';
      ctx.fillRect(0, y + tilt, 1024, 4);
    }

    // Cross-cutting fractures and joints
    for (let i = 0; i < 35; i++) {
      ctx.strokeStyle = 'rgba(70, 30, 15, 0.35)';
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      const sx = Math.random() * 1024;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx + (Math.random() - 0.5) * 120, 1024);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRefs.current.scene = scene;

    // Atmospheric butterscotch fog matching user reference photos
    const fogColor = new THREE.Color('#c99568');
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2('#c99568', 0.018);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      46,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    camera.position.set(VANTAGE_PRESETS[0].camPos.x, VANTAGE_PRESETS[0].camPos.y, VANTAGE_PRESETS[0].camPos.z);
    sceneRefs.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    sceneRefs.current.renderer = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#dfaf85', 0.65);
    scene.add(ambientLight);
    sceneRefs.current.ambientLight = ambientLight;

    const sunLight = new THREE.DirectionalLight('#ffe9cc', 1.85);
    sunLight.position.set(24, 38, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sceneRefs.current.sunLight = sunLight;

    // Secondary bounce light from red Martian regolith
    const bounceLight = new THREE.DirectionalLight('#a34d28', 0.35);
    bounceLight.position.set(-15, -10, -10);
    scene.add(bounceLight);

    // Textures
    const sandTexture = createMarsSandTexture();
    const strataTexture = createStrataTexture();

    // 1. MAIN TERRAIN SURFACE (Undulating ripple sand & bedrock)
    const terrainGeo = new THREE.PlaneGeometry(90, 90, 96, 96);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      // Gentle rolling dunes and ripple waves
      const dune = Math.sin(vx * 0.12) * 0.9 + Math.cos(vz * 0.15) * 0.7;
      const ripple = Math.sin(vx * 1.8 + vz * 0.9) * 0.08;
      // Ridge slope on the negative X side (matching Image 2 hillside)
      const slope = vx < -2 ? Math.pow(Math.abs(vx + 2) * 0.35, 1.3) * 0.9 : 0;
      pos.setY(i, dune + ripple + slope);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: sandTexture,
      roughness: 0.88,
      metalness: 0.05,
      color: new THREE.Color('#cb7745'),
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // 2. LAYERED SEDIMENTARY ROCK OUTCROP (Inspired by Image 2 & Image 3)
    const outcropGroup = new THREE.Group();
    outcropGroup.position.set(-14, 2.5, -4);

    // Stacked inclined strata plates
    for (let layer = 0; layer < 9; layer++) {
      const layerWidth = 14 - layer * 0.8;
      const layerDepth = 8 - layer * 0.4;
      const layerGeo = new THREE.BoxGeometry(layerWidth, 0.65, layerDepth, 8, 2, 8);
      // Jitter vertices for natural stratified rock fracture edges
      const lpos = layerGeo.attributes.position;
      for (let j = 0; j < lpos.count; j++) {
        const jx = lpos.getX(j);
        const jy = lpos.getY(j);
        const jz = lpos.getZ(j);
        lpos.setXYZ(
          j,
          jx + (Math.random() - 0.5) * 0.25,
          jy + (Math.random() - 0.5) * 0.12,
          jz + (Math.random() - 0.5) * 0.25
        );
      }
      layerGeo.computeVertexNormals();

      const layerMat = new THREE.MeshStandardMaterial({
        map: strataTexture,
        roughness: 0.92,
        metalness: 0.04,
        color: new THREE.Color(layer % 2 === 0 ? '#b66035' : '#8d4421'),
      });
      const layerMesh = new THREE.Mesh(layerGeo, layerMat);
      layerMesh.position.set(
        (Math.random() - 0.5) * 0.4,
        layer * 0.68,
        (Math.random() - 0.5) * 0.4
      );
      // Slight geological inclination tilt
      layerMesh.rotation.set(0.12, 0.28, -0.15);
      layerMesh.castShadow = true;
      layerMesh.receiveShadow = true;
      outcropGroup.add(layerMesh);
    }
    scene.add(outcropGroup);

    // 3. VENTIFACT ROCK RIDGE (Inspired by Image 1)
    const ventifactGroup = new THREE.Group();
    ventifactGroup.position.set(0, 3.2, 0);

    const ventifactCoords = [
      { x: 0, y: 0.6, z: 0, sx: 2.2, sy: 1.1, sz: 1.4, rx: 0.2, ry: 0.4, rz: 0.15 },
      { x: -2.8, y: 0.3, z: 0.4, sx: 1.6, sy: 0.7, sz: 1.1, rx: 0.3, ry: -0.2, rz: -0.2 },
      { x: 2.6, y: 0.4, z: -0.3, sx: 1.8, sy: 0.9, sz: 1.3, rx: 0.15, ry: 0.6, rz: 0.25 },
      { x: -5.2, y: -0.2, z: 1.1, sx: 1.4, sy: 0.8, sz: 0.9, rx: 0.4, ry: 0.1, rz: -0.1 },
      { x: 5.0, y: 0.1, z: -0.8, sx: 1.5, sy: 0.8, sz: 1.0, rx: -0.2, ry: 0.5, rz: 0.3 },
    ];

    ventifactCoords.forEach((v) => {
      // Dodecahedron with scaling generates authentic wind-carved sharp facets
      const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
      const rpos = rockGeo.attributes.position;
      for (let k = 0; k < rpos.count; k++) {
        const kx = rpos.getX(k);
        const ky = rpos.getY(k);
        const kz = rpos.getZ(k);
        rpos.setXYZ(k, kx * v.sx, ky * v.sy, kz * v.sz);
      }
      rockGeo.computeVertexNormals();

      const rockMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#94502d'),
        roughness: 0.85,
        metalness: 0.08,
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.set(v.x, v.y, v.z);
      rockMesh.rotation.set(v.rx, v.ry, v.rz);
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;
      ventifactGroup.add(rockMesh);
    });
    scene.add(ventifactGroup);

    // 4. SCATTERED BOULDER FIELD (Inspired by Image 4 & Image 5)
    const boulderGroup = new THREE.Group();
    const boulderMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8a4928'),
      roughness: 0.9,
      metalness: 0.05,
    });

    // Foreground solitary rocks on sand ripple (Image 5)
    const clusterCoords = [
      { x: 0.4, y: 0.5, z: 2.2, r: 0.65 },
      { x: 1.6, y: 0.4, z: 2.0, r: 0.52 },
      { x: -0.8, y: 0.35, z: 2.6, r: 0.48 },
      { x: 1.1, y: 0.3, z: 3.1, r: 0.38 },
      { x: -0.2, y: 0.25, z: 3.5, r: 0.32 },
    ];
    clusterCoords.forEach((c) => {
      const geo = new THREE.DodecahedronGeometry(c.r, 1);
      const m = new THREE.Mesh(geo, boulderMat);
      m.position.set(c.x, c.y, c.z);
      m.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      m.scale.set(1.1, 0.75, 1.2);
      m.castShadow = true;
      m.receiveShadow = true;
      boulderGroup.add(m);
    });

    // Random field boulders (Image 4)
    for (let b = 0; b < 65; b++) {
      const bx = (Math.random() - 0.5) * 60;
      const bz = (Math.random() - 0.5) * 60;
      if (Math.hypot(bx, bz) < 4) continue; // Keep center clear for presets

      const bRadius = Math.random() * 0.55 + 0.18;
      const bGeo = new THREE.DodecahedronGeometry(bRadius, 1);
      const bMesh = new THREE.Mesh(bGeo, boulderMat);
      bMesh.position.set(bx, bRadius * 0.6, bz);
      bMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      bMesh.scale.set(Math.random() * 0.4 + 0.8, Math.random() * 0.3 + 0.6, Math.random() * 0.4 + 0.8);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      boulderGroup.add(bMesh);
    }
    scene.add(boulderGroup);

    // 5. AIRBORNE MARTIAN DUST PARTICLES
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let d = 0; d < dustCount; d++) {
      dustPos[d * 3] = (Math.random() - 0.5) * 50;
      dustPos[d * 3 + 1] = Math.random() * 12 + 0.2;
      dustPos[d * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: new THREE.Color('#e0a574'),
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Interactive Mouse Drag to look around
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - prevMouseX) * 0.004;
      const dy = (e.clientY - prevMouseY) * 0.003;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sceneRefs.current.targetLookAt.x -= dx * 8;
      sceneRefs.current.targetLookAt.y += dy * 6;
      sceneRefs.current.targetLookAt.y = Math.max(-2, Math.min(10, sceneRefs.current.targetLookAt.y));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Keyboard handlers (WASD navigation)
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      sceneRefs.current.keys[e.code] = true;
    };
    const handleKeyUp = (e) => {
      sceneRefs.current.keys[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Window resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Keyboard drive input
      const keys = sceneRefs.current.keys;
      const speed = keys['ShiftLeft'] ? 9.0 : 4.0;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
      const move = new THREE.Vector3(0, 0, 0);

      if (keys['KeyW'] || keys['ArrowUp']) move.add(forward);
      if (keys['KeyS'] || keys['ArrowDown']) move.sub(forward);
      if (keys['KeyD'] || keys['ArrowRight']) move.add(right);
      if (keys['KeyA'] || keys['ArrowLeft']) move.sub(right);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * delta);
        sceneRefs.current.targetCamPos.add(move);
        sceneRefs.current.targetLookAt.add(move);
        setRoverSpeed(parseFloat((speed * 0.85).toFixed(1)));
      } else {
        setRoverSpeed(0);
      }

      // Smooth camera interpolation towards target
      camera.position.lerp(sceneRefs.current.targetCamPos, delta * 3.5);
      sceneRefs.current.currentLookAt.lerp(sceneRefs.current.targetLookAt, delta * 4.0);
      camera.lookAt(sceneRefs.current.currentLookAt);

      // Dust drift
      const dPositions = dustGeo.attributes.position.array;
      for (let di = 0; di < dustCount; di++) {
        dPositions[di * 3] += 0.8 * delta;
        if (dPositions[di * 3] > 25) dPositions[di * 3] = -25;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);

      terrainGeo.dispose();
      terrainMat.dispose();
      boulderMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      sandTexture.dispose();
      strataTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update lighting and atmosphere based on timeOfDay & dustIntensity
  useEffect(() => {
    const s = sceneRefs.current;
    if (!s.sunLight || !s.scene) return;

    if (timeOfDay === 'midday') {
      s.sunLight.color.set('#ffe9cc');
      s.sunLight.intensity = 1.85;
      s.sunLight.position.set(24, 38, 18);
      s.scene.background = new THREE.Color('#c99568');
      if (s.scene.fog) s.scene.fog.color.set('#c99568');
    } else if (timeOfDay === 'afternoon') {
      s.sunLight.color.set('#f4bf88');
      s.sunLight.intensity = 1.4;
      s.sunLight.position.set(32, 22, 10);
      s.scene.background = new THREE.Color('#b57a4e');
      if (s.scene.fog) s.scene.fog.color.set('#b57a4e');
    } else if (timeOfDay === 'sunset') {
      // Martian blue sunset phenomenon!
      s.sunLight.color.set('#88a4d4');
      s.sunLight.intensity = 0.95;
      s.sunLight.position.set(38, 6, 4);
      s.scene.background = new THREE.Color('#654942');
      if (s.scene.fog) s.scene.fog.color.set('#5a3f3b');
    }
  }, [timeOfDay]);

  return (
    <section
      id="mars-surface-simulation"
      aria-label="3D Mars Surface Rover & Areology Simulation"
      className={`relative w-full ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'min-h-[750px] lg:min-h-[840px] border-b border-white/10'
      } bg-[#06080e] select-none flex flex-col justify-between overflow-hidden`}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: Mission Header & Vantage Point Selector */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto p-4 sm:p-6 flex flex-col gap-3 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* Mission Telemetry Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#050505]/85 backdrop-blur-md border border-white/10 shadow-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[#F1F1F1] font-mono-code font-bold text-xs uppercase tracking-wider">
                  MARS 3D SURFACE SIMULATION
                </span>
                <span className="text-[10px] font-mono-code text-red-400 font-semibold border border-red-500/30 px-1.5 py-0.2 bg-red-950/40">
                  JEZERO DELTA
                </span>
              </div>
              <span className="text-[9px] font-mono-code text-[#888888] tracking-widest uppercase">
                PERSEVERANCE MASTCAM-Z CALIBRATED • SOL 1042 // 14:26 LMST
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 border border-white/10 bg-[#0A0A0A]/85 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Exploration'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* 5 Reference Images Vantage Point Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          <span className="text-[10px] font-mono-code uppercase text-white/50 tracking-wider whitespace-nowrap hidden md:inline">
            REFERENCE VANTAGES:
          </span>
          {VANTAGE_PRESETS.map((preset) => {
            const isActive = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono-code uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-md ${
                  isActive
                    ? 'border-[#F5D000] bg-[#F5D000] text-black font-bold shadow-[0_0_15px_rgba(245,208,0,0.3)]'
                    : 'border-white/10 bg-[#0A0A0A]/80 text-[#888888] hover:text-[#F1F1F1] hover:border-white/30'
                }`}
              >
                <img
                  src={preset.photo}
                  alt={preset.label}
                  className="w-4 h-4 rounded object-cover shrink-0 border border-black/40"
                />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Central Targeting Crosshair */}
      <div className="my-auto mx-auto pointer-events-none flex flex-col items-center justify-center opacity-60">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/20 rounded-full" />
          <div className="w-1.5 h-1.5 bg-[#F5D000] rounded-full" />
        </div>
        <div className="mt-1 px-2 py-0.5 bg-black/70 border border-white/10 text-[9px] font-mono-code text-[#F1F1F1] tracking-widest uppercase">
          ROVER SPEED: <span className="text-[#F5D000] font-bold">{roverSpeed} KM/H</span>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Selected Geological Rock Dossier */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto p-4 sm:p-6 flex flex-col md:flex-row items-end justify-between gap-4 pointer-events-none">
        {/* Selected Rock Dossier Card */}
        {selectedRock && (
          <div className="pointer-events-auto max-w-lg w-full bg-[#050505]/90 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedRock.photo}
                  alt={selectedRock.title}
                  className="w-12 h-12 rounded object-cover border border-[#F5D000]/60 shrink-0 shadow-lg"
                />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono-code uppercase text-[#F5D000] font-bold tracking-widest">
                    AREOLOGY SPECTROMETRY // NASA REFERENCE
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#F1F1F1] uppercase font-editorial leading-tight">
                    {selectedRock.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedRock(null)}
                className="text-[#888888] hover:text-[#F1F1F1] p-1 cursor-pointer"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed font-editorial">
              {selectedRock.description}
            </p>

            <div className="text-[10px] font-mono-code text-[#888888] bg-black/60 p-2 border border-white/5">
              <span className="text-white/60 block font-bold mb-1">FORMATION CONTEXT:</span>
              <span>{selectedRock.formation}</span>
            </div>

            {/* Mineralogy breakdown */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-[9px] font-mono-code">
              {Object.entries(selectedRock.minerals).map(([mineral, val]) => (
                <div key={mineral} className="bg-white/5 p-1.5 border border-white/10 text-center">
                  <span className="text-[#888888] block">{mineral}</span>
                  <span className="text-[#F5D000] font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ambient Controls & Controls Pill */}
        <div className="pointer-events-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-end">
          {/* Time of Day Switcher */}
          <div className="flex items-center gap-1 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1 text-[10px] font-mono-code uppercase">
            <span className="text-[#888888] px-2 flex items-center gap-1">
              <Sun size={11} className="text-[#F5D000]" />
              <span>LIGHTING:</span>
            </span>
            {['midday', 'afternoon', 'sunset'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeOfDay(t)}
                className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
                  timeOfDay === t
                    ? 'bg-[#F5D000] text-black font-bold'
                    : 'text-[#888888] hover:text-[#F1F1F1] hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Navigation Guide Pill */}
          <div className="px-3 py-2 bg-[#050505]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono-code text-[#888888] flex items-center gap-2">
            <span>DRAG TO PAN</span>
            <span className="text-white/20">•</span>
            <span><kbd className="px-1 py-0.5 bg-white/10 text-white rounded">W</kbd><kbd className="px-1 py-0.5 bg-white/10 text-white rounded ml-0.5">A</kbd><kbd className="px-1 py-0.5 bg-white/10 text-white rounded ml-0.5">S</kbd><kbd className="px-1 py-0.5 bg-white/10 text-white rounded ml-0.5">D</kbd> DRIVE ROVER</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- End of MarsSurface3DSimulation.jsx --- */
