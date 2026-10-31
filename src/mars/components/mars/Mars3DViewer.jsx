import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useMarsStore } from '../../store/useMarsStore.js';
import { MARS_PLANETARY_CONSTANTS } from '../../data/mars/planetaryConstants.js';
import { latLonToOblateVector3 } from '../../data/mars/coordinateSystem.js';
import { createMarsGlobe } from '../../three/MarsGlobe.jsx';
import { createMarsLighting } from '../../three/MarsLighting.jsx';
import {
  RotateCcw,
  Play,
  Pause,
  Sun,
  Layers,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Mountain,
  Globe2,
} from 'lucide-react';

export const Mars3DViewer = ({ compact = false }) => {
  const containerRef = useRef(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const {
    isRotating,
    setIsRotating,
    rotationSpeed,
    setRotationSpeed,
    lightIntensity,
    setLightIntensity,
    showAtmosphere,
    setShowAtmosphere,
    showTexture,
    setShowTexture,
    showStars,
    setShowStars,
    surfaceLayer,
    setSurfaceLayer,
    elevationExaggeration,
    setElevationExaggeration,
    isOblate,
    setIsOblate,
    selectedLocation,
    setSelectedLocation,
    cameraResetNonce,
    atmosphere,
    selectedScenarioId,
    solarTime,
  } = useMarsStore();

  // Keep mutable references for render loop to avoid re-initializing WebGL canvas
  const stateRef = useRef({
    isRotating,
    rotationSpeed,
    lightIntensity,
    showAtmosphere,
    showTexture,
    showStars,
    surfaceLayer,
    elevationExaggeration,
    isOblate,
    selectedScenarioId,
    dustOpticalDepth: atmosphere.dustOpticalDepth,
    localSolarHour: solarTime.localSolarHour,
    solarLongitudeLs: solarTime.solarLongitudeLs,
  });

  useEffect(() => {
    stateRef.current.isRotating = isRotating;
    stateRef.current.rotationSpeed = rotationSpeed;
    stateRef.current.lightIntensity = lightIntensity;
    stateRef.current.showAtmosphere = showAtmosphere;
    stateRef.current.showTexture = showTexture;
    stateRef.current.showStars = showStars;
    stateRef.current.surfaceLayer = surfaceLayer;
    stateRef.current.elevationExaggeration = elevationExaggeration;
    stateRef.current.isOblate = isOblate;
    stateRef.current.selectedScenarioId = selectedScenarioId;
    stateRef.current.dustOpticalDepth = atmosphere.dustOpticalDepth;
    stateRef.current.localSolarHour = solarTime.localSolarHour;
    stateRef.current.solarLongitudeLs = solarTime.solarLongitudeLs;
  }, [
    isRotating,
    rotationSpeed,
    lightIntensity,
    showAtmosphere,
    showTexture,
    showStars,
    surfaceLayer,
    elevationExaggeration,
    isOblate,
    selectedScenarioId,
    atmosphere.dustOpticalDepth,
    solarTime.localSolarHour,
    solarTime.solarLongitudeLs,
  ]);

  // Target camera state for smooth transitions
  const targetCameraPos = useRef(new THREE.Vector3(0, 1.6, 10.5));
  const currentCameraPos = useRef(new THREE.Vector3(0, 1.6, 10.5));
  const targetPlanetRotationY = useRef(0);
  const planetRotationY = useRef(0);
  const isTransitioning = useRef(false);

  // Globe reference for layer and geometry updates
  const globeRef = useRef(null);
  const lightingRef = useRef(null);

  // Handle Layer change dynamically
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.setLayer(surfaceLayer);
    }
  }, [surfaceLayer]);

  // Handle Elevation Exaggeration or Oblateness change
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.updateTerrainGeometry(elevationExaggeration, isOblate);
    }
  }, [elevationExaggeration, isOblate]);

  // Trigger fly-to when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      const targetRad = -THREE.MathUtils.degToRad(selectedLocation.lon);
      targetPlanetRotationY.current = targetRad;

      targetCameraPos.current.set(0, THREE.MathUtils.degToRad(selectedLocation.lat) * 2.8, 7.8);
      isTransitioning.current = true;
    }
  }, [selectedLocation]);

  // Handle camera reset
  useEffect(() => {
    if (cameraResetNonce > 0) {
      targetCameraPos.current.set(0, 1.6, 10.5);
      isTransitioning.current = true;
    }
  }, [cameraResetNonce]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js directives
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030508);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(currentCameraPos.current);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map via PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 2. Lighting Rig
    const lighting = createMarsLighting(scene, {
      solarHour: solarTime.localSolarHour,
      solarLatitude: 10.0,
      isLowPerformance: isSoftwareGl,
    });
    lightingRef.current = lighting;

    // 3. Scientifically Accurate Mars Globe
    const MARS_RADIUS = 3.0;
    const globe = createMarsGlobe({
      radius: MARS_RADIUS,
      elevationExaggeration: stateRef.current.elevationExaggeration,
      isOblate: stateRef.current.isOblate,
      layer: stateRef.current.surfaceLayer,
      isLowPerformance: isSoftwareGl,
    });
    globeRef.current = globe;
    scene.add(globe.tiltGroup);

    // 4. Starfield Background
    const starCount = isSoftwareGl ? 600 : 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 45.0 + Math.random() * 20.0;
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // 5. Interactive Drag & Zoom Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraDistance = 10.5;
    let polarAngle = 0.16;

    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();
    let startPointerX = 0;
    let startPointerY = 0;

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      isTransitioning.current = false;
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        planetRotationY.current += deltaX * 0.005;
        targetPlanetRotationY.current = planetRotationY.current;

        polarAngle = Math.max(-1.1, Math.min(1.1, polarAngle - deltaY * 0.004));
        targetCameraPos.current.y = polarAngle * 3.5;
        targetCameraPos.current.z = Math.cos(polarAngle) * cameraDistance;
      } else {
        raycaster.setFromCamera(mouseCoord, camera);
        const intersects = raycaster.intersectObjects(globe.geography.interactiveObjects);
        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData.feature;
          setHoveredLocation(hovered);
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredLocation(null);
          renderer.domElement.style.cursor = 'grab';
        }
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;

      const dragDistance = Math.hypot(e.clientX - startPointerX, e.clientY - startPointerY);
      if (dragDistance < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseCoord, camera);
        const intersects = raycaster.intersectObjects(globe.geography.interactiveObjects);
        if (intersects.length > 0) {
          const feature = intersects[0].object.userData.feature;
          if (feature) {
            setSelectedLocation(feature);
          }
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraDistance = Math.max(4.6, Math.min(18.0, cameraDistance + e.deltaY * 0.008));
      targetCameraPos.current.z = Math.cos(polarAngle) * cameraDistance;
      isTransitioning.current = true;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Handle Window Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 6. Animation and Render Loop (Paced per Three.js directives)
    let animationFrameId = 0;
    let isDisposed = false;
    let lastTime = performance.now();

    const afterDraw = (cb) => {
      const gl = renderer.getContext();
      const sync =
        gl && typeof gl.fenceSync === 'function'
          ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
          : null;
      if (!sync) {
        animationFrameId = window.setTimeout(cb, 50);
        return;
      }
      gl.flush();
      let polls = 0;
      const poll = () => {
        if (isDisposed) return;
        polls++;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED && polls < 12) {
          animationFrameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 50);
        }
      };
      animationFrameId = window.setTimeout(poll, 6);
    };

    const tick = () => {
      if (isDisposed) return;

      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const {
        isRotating: rotating,
        rotationSpeed: speed,
        lightIntensity: lightInt,
        showAtmosphere: showAtmo,
        showTexture: showTex,
        showStars: showSt,
        selectedScenarioId: scenario,
        dustOpticalDepth: dustTau,
        localSolarHour: sHour,
        solarLongitudeLs: sLs,
      } = stateRef.current;

      // Update planetary rotation
      if (rotating && !isDragging) {
        planetRotationY.current += 0.08 * speed * delta;
        targetPlanetRotationY.current = planetRotationY.current;
      }

      if (isTransitioning.current) {
        currentCameraPos.current.lerp(targetCameraPos.current, 0.06);
        camera.position.copy(currentCameraPos.current);

        planetRotationY.current = THREE.MathUtils.damp(
          planetRotationY.current,
          targetPlanetRotationY.current,
          4.0,
          delta
        );

        if (currentCameraPos.current.distanceTo(targetCameraPos.current) < 0.02) {
          isTransitioning.current = false;
        }
      } else {
        camera.position.lerp(targetCameraPos.current, 0.08);
      }

      globe.rotationY = planetRotationY.current;
      camera.lookAt(0, 0, 0);

      // Sub-solar declination varies with solar longitude Ls (axial tilt 25.19°)
      const subsolarLatDeg =
        MARS_PLANETARY_CONSTANTS.AXIAL_TILT_DEG * Math.sin(sLs * (Math.PI / 180));
      const sunDir = lighting.updateSunPosition(
        sHour,
        subsolarLatDeg,
        lightInt * (scenario === 'global_storm' ? 0.35 : 1.0)
      );

      // Visibility toggles
      globe.terrainMesh.visible = showTex;
      globe.atmosphereMesh.visible = showAtmo;
      starMesh.visible = showSt;

      // Atmospheric extinction & scenario colors
      globe.update(delta, false, 1.0, sunDir);

      if (globe.atmosphereMesh.material.uniforms) {
        const uIntensity = Math.min(2.0, 0.65 + dustTau * 0.4);
        globe.atmosphereMesh.material.uniforms.uIntensity.value = uIntensity;
        globe.atmosphereMesh.material.uniforms.uDustOpticalDepth.value = dustTau;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // 7. Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationFrameId);

      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      globe.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();

      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  const handleResetCamera = useCallback(() => {
    useMarsStore.getState().triggerCameraReset();
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col select-none overflow-hidden bg-[#030508]">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        data-testid="mars-3d-canvas-container"
      />

      {hoveredLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/95 border border-amber-500/50 text-slate-200 text-xs font-mono rounded-xl shadow-2xl pointer-events-none flex flex-col items-center gap-1 animate-fade-in backdrop-blur-md z-30">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{hoveredLocation.name}</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {hoveredLocation.category || hoveredLocation.type}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              Elev:{' '}
              <strong className="text-amber-400">
                {hoveredLocation.elevationKm > 0 ? `+${hoveredLocation.elevationKm}` : hoveredLocation.elevationKm} km
              </strong>
            </span>
            <span>·</span>
            <span>
              Lat: {hoveredLocation.lat > 0 ? `${hoveredLocation.lat}°N` : `${Math.abs(hoveredLocation.lat)}°S`}
            </span>
            <span>·</span>
            <span>
              Lon: {hoveredLocation.lon > 0 ? `${hoveredLocation.lon}°E` : `${Math.abs(hoveredLocation.lon)}°W`}
            </span>
          </div>
          <span className="text-[10px] text-amber-400/80 mt-0.5">Click feature to inspect</span>
        </div>
      )}

      {/* Real-time Scientific Telemetry Watermark */}
      <div className="absolute top-20 left-3 pointer-events-none hidden md:flex flex-col gap-1 text-[11px] font-mono text-slate-400 bg-slate-950/85 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-md shadow-xl z-10 max-w-[270px]">
        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
          <Globe2 className="w-3.5 h-3.5" />
          <span>NASA MOLA / USGS ASTROGEOLOGY</span>
        </div>
        <div className="flex justify-between gap-4 text-[10px] text-slate-300">
          <span>Axial Tilt:</span>
          <span className="text-amber-300">25.19° (Oblate b/a=0.994)</span>
        </div>
        <div className="flex justify-between gap-4 text-[10px] text-slate-300">
          <span>Datum Range:</span>
          <span className="text-amber-300">-8.2 km (Hellas) to +21.9 km (Olympus)</span>
        </div>
        <div className="flex justify-between gap-4 text-[10px] text-slate-300">
          <span>Relief Mode:</span>
          <span className="text-amber-300 font-semibold">{elevationExaggeration}x Exaggeration</span>
        </div>
      </div>

      {/* Collapsible Unified Bottom Control Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[96%] max-w-3xl z-20 transition-all duration-300 ease-in-out">
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="px-4 py-1 bg-slate-900/90 border-t border-x border-slate-800 text-slate-300 hover:text-white text-xs font-mono rounded-t-lg shadow-md transition-colors flex items-center gap-1.5 backdrop-blur-md"
            aria-label={hudCollapsed ? 'Expand 3D controls' : 'Collapse 3D controls'}
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Show Planetary 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {!hudCollapsed && (
          <div className="bg-slate-950/95 border border-slate-800/90 rounded-xl p-3 shadow-2xl backdrop-blur-md text-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Rotation and Camera reset */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isRotating
                      ? 'bg-amber-600/20 border-amber-500/50 text-amber-300 hover:bg-amber-600/30'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label={isRotating ? 'Pause rotation' : 'Resume rotation'}
                >
                  {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRotating ? 'Pause' : 'Rotate'}</span>
                </button>

                <button
                  onClick={handleResetCamera}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Reset Camera View"
                  aria-label="Reset Camera View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scientific Map Layer Selector */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0">
                <button
                  onClick={() => setSurfaceLayer('natural')}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    surfaceLayer === 'natural'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Viking MDIM 2.1 Authentic Albedo Mosaic"
                >
                  Natural Color
                </button>
                <button
                  onClick={() => setSurfaceLayer('mola')}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    surfaceLayer === 'mola'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="MOLA Topographic Hypsometric Colormap"
                >
                  MOLA Topo
                </button>
                <button
                  onClick={() => setSurfaceLayer('shaded_relief')}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    surfaceLayer === 'shaded_relief'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Hillshade Monochromatic Topography"
                >
                  Shaded Relief
                </button>
              </div>

              {/* Topographic Exaggeration Selector */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0">
                <Mountain className="w-3.5 h-3.5 text-amber-400 ml-1 mr-0.5" />
                <span className="text-[10px] font-mono text-slate-400 mr-1">Relief:</span>
                {[1.0, 3.0, 6.0].map((exag) => (
                  <button
                    key={exag}
                    onClick={() => setElevationExaggeration(exag)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      elevationExaggeration === exag
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={
                      exag === 1.0
                        ? '1:1 True Physical Vertical Scale'
                        : exag === 3.0
                        ? '3x Enhanced Vertical Relief'
                        : '6x Structural Geomorphology Exaggeration'
                    }
                  >
                    {exag}x
                  </button>
                ))}
              </div>

              {/* Oblate Spheroid Toggle */}
              <button
                onClick={() => setIsOblate(!isOblate)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors whitespace-nowrap ${
                  isOblate
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title="Toggle Oblate Spheroid (b/a = 0.99411) vs Spherical Model"
              >
                {isOblate ? 'Oblate (f=0.0059)' : 'Spherical'}
              </button>

              {/* Quick Feature Toggles */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <button
                  onClick={() => setShowAtmosphere(!showAtmosphere)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap ${
                    showAtmosphere
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle Atmospheric Limb Glow"
                  aria-label="Toggle Atmosphere"
                >
                  Atmo
                </button>

                <button
                  onClick={() => setShowStars(!showStars)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap ${
                    showStars
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle Celestial Background Stars"
                  aria-label="Toggle Stars"
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Stars
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 pointer-events-none hidden md:flex flex-col items-end gap-1 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm">
        <span>DRAG TO ROTATE PLANET</span>
        <span>SCROLL TO ZOOM IN / OUT</span>
        <span className="text-amber-400/90">CLICK PINS TO INSPECT GEOLOGY</span>
      </div>
    </div>
  );
};
