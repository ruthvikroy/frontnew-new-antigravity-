import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createEarthSystem } from '../celestial/earth.js';
import { createMoonSystem } from '../celestial/moon.js';
import { createMarsSystem } from '../celestial/mars.js';
import { createStarField } from '../celestial/starfield.js';
import { loadCelestialTextures } from '../celestial/textures.js';
import { ALL_LUNAR_LOCATIONS, LUNAR_LOCATIONS_MAP, selenographicToCartesian } from '../data/lunarLandmarks.js';
import { MARS_LANDMARKS, MARS_LOCATIONS_MAP, areographicToCartesian } from '../data/marsLandmarks.js';

export function CelestialCanvas({
  viewMode = 'overview',
  isPaused = false,
  showOrbits = true,
  showLandingSites = true,
  resetTrigger = 0,
  selectedLandmarkId = null,
  onSelectLandmarkId = () => {},
  onSelectBody = () => {},
  onUserInteracted = () => {},
  onFlightTelemetry = () => {},
  marsTextureMode = 'global-mola',
  marsCloudOpacity = 0.65,
  marsCloudDriftSpeed = 1.0,
  marsDustIntensity = 0.42,
}) {
  const mountRef = useRef(null);

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const showOrbitsRef = useRef(showOrbits);
  showOrbitsRef.current = showOrbits;

  const showLandingSitesRef = useRef(showLandingSites);
  showLandingSitesRef.current = showLandingSites;

  const onSelectLandmarkRef = useRef(onSelectLandmarkId);
  onSelectLandmarkRef.current = onSelectLandmarkId;

  const onSelectBodyRef = useRef(onSelectBody);
  onSelectBodyRef.current = onSelectBody;

  const onFlightTelemetryRef = useRef(onFlightTelemetry);
  onFlightTelemetryRef.current = onFlightTelemetry;

  const marsTextureModeRef = useRef(marsTextureMode);
  marsTextureModeRef.current = marsTextureMode;

  const marsCloudOpacityRef = useRef(marsCloudOpacity);
  marsCloudOpacityRef.current = marsCloudOpacity;

  const marsCloudDriftSpeedRef = useRef(marsCloudDriftSpeed);
  marsCloudDriftSpeedRef.current = marsCloudDriftSpeed;

  const marsDustIntensityRef = useRef(marsDustIntensity);
  marsDustIntensityRef.current = marsDustIntensity;

  const hasInteractedRef = useRef(false);
  const interactionRef = useRef(onUserInteracted);
  interactionRef.current = onUserInteracted;

  const resetTriggerRef = useRef(resetTrigger);
  const landmarkIdRef = useRef(selectedLandmarkId);
  landmarkIdRef.current = selectedLandmarkId;

  // Dedicated refs to dynamically update Mars when props change
  const marsSystemRef = useRef(null);

  useEffect(() => {
    if (marsSystemRef.current) {
      marsSystemRef.current.setTextureMode(marsTextureMode);
    }
  }, [marsTextureMode]);

  useEffect(() => {
    if (marsSystemRef.current) {
      marsSystemRef.current.setCloudOpacity(marsCloudOpacity);
    }
  }, [marsCloudOpacity]);

  useEffect(() => {
    if (marsSystemRef.current) {
      marsSystemRef.current.setCloudDriftSpeed(marsCloudDriftSpeed);
    }
  }, [marsCloudDriftSpeed]);

  useEffect(() => {
    if (marsSystemRef.current) {
      marsSystemRef.current.setDustIntensity(marsDustIntensity);
    }
  }, [marsDustIntensity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020308, 0.0035);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    const currentCamPos = new THREE.Vector3(0.8, 0.45, 5.2);
    const targetCamPos = new THREE.Vector3(0.8, 0.45, 5.2);
    const currentLookAt = new THREE.Vector3(0.35, 0, 0);
    const targetLookAt = new THREE.Vector3(0.35, 0, 0);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // Primary Solar Directional Light
    const sunDirection = new THREE.Vector3(6.5, 2.5, 5.0).normalize();
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.copy(sunDirection.clone().multiplyScalar(100));
    scene.add(sunLight);

    // Space ambient fill
    const ambientLight = new THREE.AmbientLight(0x0d121f, 0.38);
    scene.add(ambientLight);

    // Dynamic Moon Surface Lighting System
    // 1. Earthshine Light: Reflected sunlight from Earth onto Moon (soft cool azure)
    const earthshineLight = new THREE.DirectionalLight(0x5aa8ff, 1.25);
    scene.add(earthshineLight);

    // 2. Dynamic Lunar Key Light: grazing directional light for dramatic crater rims & maria depth
    const lunarKeyLight = new THREE.DirectionalLight(0xfff7ed, 1.75);
    scene.add(lunarKeyLight);

    // 3. Dynamic Lunar Rim Light: crisp silhouette separation against deep void
    const lunarRimLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    scene.add(lunarRimLight);

    // Starfield & Cosmic Nebula
    const starfield = createStarField(width <= 768 ? 2200 : 3800);
    scene.add(starfield.group);

    // Celestial Bodies (Earth, Moon, and 3D Textured Mars)
    const textures = loadCelestialTextures();
    const earth = createEarthSystem(textures, sunDirection);
    earth.surfaceMesh.userData = { bodyId: 'earth' };
    scene.add(earth.group);

    const moon = createMoonSystem(textures, sunDirection);
    moon.mesh.userData = { bodyId: 'moon' };
    scene.add(moon.group);
    scene.add(moon.orbitLine);

    const mars = createMarsSystem(textures, sunDirection);
    mars.mesh.userData = { bodyId: 'mars' };
    marsSystemRef.current = mars;
    scene.add(mars.group);
    scene.add(mars.orbitLine);

    // Initialize Mars with active props
    mars.setTextureMode(marsTextureModeRef.current);
    mars.setCloudOpacity(marsCloudOpacityRef.current);
    mars.setCloudDriftSpeed(marsCloudDriftSpeedRef.current);
    mars.setDustIntensity(marsDustIntensityRef.current);

    // Interaction & Game Dynamic Flight Controls
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    let orbitRotationX = 0;
    let orbitRotationY = 0;

    const mouseNorm = { x: 0, y: 0 };
    const gazeTarget = new THREE.Vector2(0, 0);
    const currentGaze = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();

    // 6-DOF Spacecraft Flight Dynamic State
    const shipVelocity = new THREE.Vector3(0, 0, 0);
    let isPiloting = false;
    const keysDown = {};

    const updatePointerPosition = (clientX, clientY) => {
      const ndcX = (clientX / window.innerWidth) * 2.0 - 1.0;
      const ndcY = -(clientY / window.innerHeight) * 2.0 + 1.0;

      mouseNorm.x = ndcX;
      mouseNorm.y = -ndcY;

      gazeTarget.set(ndcX * 0.22, ndcY * 0.16);
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      updatePointerPosition(e.clientX, e.clientY);
      interactionRef.current();
    };

    const handlePointerMove = (e) => {
      updatePointerPosition(e.clientX, e.clientY);

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        rotationVelocityY += dx * 0.003;
        rotationVelocityX += dy * 0.003;
      }
    };

    const handlePointerUp = (e) => {
      if (isDragging && e) {
        const moveDist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
        if (moveDist < 8) {
          const mouseRay = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2.0 - 1.0,
            -(e.clientY / window.innerHeight) * 2.0 + 1.0
          );
          raycaster.setFromCamera(mouseRay, camera);

          // Raycast all marked checkpoints (Moon + Mars)
          const allCheckpoints = [
            ...moon.landmarkGroup.children,
            ...mars.landmarkGroup.children,
          ];
          const intersects = raycaster.intersectObjects(allCheckpoints, true);

          if (intersects.length > 0) {
            for (const hit of intersects) {
              const hitId = hit.object?.userData?.landmarkId;
              const bodyId = hit.object?.userData?.bodyId || 'moon';
              if (hitId) {
                isPiloting = false;
                onSelectLandmarkRef.current(hitId, bodyId);
                return;
              }
            }
          }

          // Raycast planetary bodies
          const bodyHits = raycaster.intersectObjects(
            [mars.mesh, earth.surfaceMesh, moon.mesh],
            true
          );
          if (bodyHits.length > 0) {
            const bodyId = bodyHits[0].object?.userData?.bodyId;
            if (bodyId) {
              isPiloting = false;
              onSelectBodyRef.current(bodyId);
            }
          }
        }
      }
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerPosition(touch.clientX, touch.clientY);
        interactionRef.current();
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerPosition(touch.clientX, touch.clientY);
      }
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      keysDown[e.code] = true;

      if (
        [
          'KeyW',
          'KeyA',
          'KeyS',
          'KeyD',
          'KeyQ',
          'KeyE',
          'Space',
          'ShiftLeft',
          'ShiftRight',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(e.code)
      ) {
        interactionRef.current();
        e.preventDefault();
      }

      if (e.code === 'KeyR') {
        isPiloting = false;
        shipVelocity.set(0, 0, 0);
      }

      if (e.code === 'Digit1') {
        isPiloting = false;
        onSelectBodyRef.current('overview');
      } else if (e.code === 'Digit2') {
        isPiloting = false;
        onSelectBodyRef.current('earth');
      } else if (e.code === 'Digit3') {
        isPiloting = false;
        onSelectBodyRef.current('moon');
      } else if (e.code === 'Digit4') {
        isPiloting = false;
        onSelectBodyRef.current('mars');
      }
    };

    const handleKeyUp = (e) => {
      keysDown[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      starfield.setDPR(dpr);
    };
    window.addEventListener('resize', handleResize);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Animation Loop
    let animId;
    let lastTime = performance.now();
    let accumulatedTime = 0;

    const animate = (now) => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (!isPausedRef.current) {
        accumulatedTime += dt;
      }

      if (resetTriggerRef.current !== resetTrigger) {
        resetTriggerRef.current = resetTrigger;
        orbitRotationX = 0;
        orbitRotationY = 0;
        rotationVelocityX = 0;
        rotationVelocityY = 0;
        shipVelocity.set(0, 0, 0);
        isPiloting = false;
        gazeTarget.set(0, 0);
      }

      orbitRotationY += rotationVelocityY;
      orbitRotationX += rotationVelocityX;
      rotationVelocityX *= 0.92;
      rotationVelocityY *= 0.92;

      currentGaze.lerp(gazeTarget, 0.055);

      starfield.update(accumulatedTime);
      earth.update(dt, camera, isPausedRef.current);

      const mode = viewModeRef.current;
      const currentLandmark = landmarkIdRef.current;

      moon.update(dt, isPausedRef.current, currentLandmark);
      mars.update(dt, isPausedRef.current, currentLandmark);

      moon.setOrbitVisibility(showOrbitsRef.current);
      mars.setOrbitVisibility(showOrbitsRef.current);

      moon.setLandmarksVisibility(showLandingSitesRef.current);
      mars.setLandmarksVisibility(showLandingSitesRef.current);

      const moonPos = moon.getPosition();
      const marsPos = mars.getPosition();

      // Dynamic Moon Surface Lighting Updates
      earthshineLight.position.copy(earth.group.position);
      earthshineLight.target = moon.mesh;

      if (mode === 'moon' || LUNAR_LOCATIONS_MAP.has(currentLandmark)) {
        // Dramatic lunar key light grazing crater rims
        lunarKeyLight.position.set(
          moonPos.x + 1.2,
          moonPos.y + 0.8,
          moonPos.z + 1.4
        );
        lunarKeyLight.target = moon.mesh;
        lunarKeyLight.intensity = 2.4;

        lunarRimLight.position.set(
          moonPos.x - 1.2,
          moonPos.y + 0.3,
          moonPos.z - 1.2
        );
        lunarRimLight.target = moon.mesh;
        lunarRimLight.intensity = 0.95;
      } else {
        lunarKeyLight.position.set(moonPos.x + 1.0, moonPos.y + 0.6, moonPos.z + 1.0);
        lunarKeyLight.target = moon.mesh;
        lunarKeyLight.intensity = 1.1;
        lunarRimLight.intensity = 0.4;
      }

      const parallaxX = mouseNorm.x * 0.12 + currentGaze.x;
      const parallaxY = -mouseNorm.y * 0.1 + currentGaze.y;

      // 6-DOF Spacecraft Flight Dynamic Thrusters
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
      const up = camera.up.clone().normalize();

      const isWarp = Boolean(keysDown['ShiftLeft'] || keysDown['ShiftRight']);
      const isBraking = Boolean(keysDown['Space']);
      const accelRate = (isWarp ? 0.075 : 0.022) * (dt * 60);

      let thrustActive = false;
      const thrustVector = new THREE.Vector3();

      if (keysDown['KeyW'] || keysDown['ArrowUp']) {
        thrustVector.add(forward);
        thrustActive = true;
      }
      if (keysDown['KeyS'] || keysDown['ArrowDown']) {
        thrustVector.sub(forward);
        thrustActive = true;
      }
      if (keysDown['KeyD'] || keysDown['ArrowRight']) {
        thrustVector.add(right);
        thrustActive = true;
      }
      if (keysDown['KeyA'] || keysDown['ArrowLeft']) {
        thrustVector.sub(right);
        thrustActive = true;
      }
      if (keysDown['KeyE']) {
        thrustVector.add(up);
        thrustActive = true;
      }
      if (keysDown['KeyQ']) {
        thrustVector.sub(up);
        thrustActive = true;
      }

      if (thrustActive) {
        isPiloting = true;
        thrustVector.normalize().multiplyScalar(accelRate);
        shipVelocity.add(thrustVector);
      }

      if (isBraking) {
        shipVelocity.multiplyScalar(0.85);
      } else {
        shipVelocity.multiplyScalar(0.972);
      }

      // Dynamic FOV for warp boost
      const targetFOV = isWarp && thrustActive ? 44 : 35;
      if (Math.abs(camera.fov - targetFOV) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.08);
        camera.updateProjectionMatrix();
      }

      // Camera Tracking Modes
      if (isPiloting) {
        targetCamPos.add(shipVelocity);
        targetLookAt.add(shipVelocity);
        if (targetCamPos.length() > 28) {
          targetCamPos.clampLength(0.6, 28);
        }
      } else if (currentLandmark) {
        // Check if selected landmark is on Moon or Mars
        const lunarLm = LUNAR_LOCATIONS_MAP.get(currentLandmark);
        const marsLm = MARS_LOCATIONS_MAP.get(currentLandmark);

        if (lunarLm) {
          const worldPos = moon.getLandmarkPosition(currentLandmark);
          if (worldPos) {
            const normal = worldPos.clone().sub(moonPos).normalize();
            targetCamPos.copy(worldPos).add(normal.multiplyScalar(0.48));
            targetCamPos.x += parallaxX * 0.12;
            targetCamPos.y += parallaxY * 0.12;
            targetLookAt.copy(worldPos);
          }
        } else if (marsLm) {
          const worldPos = mars.getLandmarkPosition(currentLandmark);
          if (worldPos) {
            const normal = worldPos.clone().sub(marsPos).normalize();
            targetCamPos.copy(worldPos).add(normal.multiplyScalar(0.85));
            targetCamPos.x += parallaxX * 0.16;
            targetCamPos.y += parallaxY * 0.16;
            targetLookAt.copy(worldPos);
          }
        }
      } else if (mode === 'overview') {
        const radius = 5.2;
        targetCamPos.set(
          0.8 + Math.sin(orbitRotationY) * 0.8 + parallaxX,
          0.45 + orbitRotationX * 0.6 + parallaxY,
          radius * Math.cos(orbitRotationY * 0.35)
        );
        targetLookAt.set(0.6 + currentGaze.x * 0.5, currentGaze.y * 0.5, 0);
      } else if (mode === 'earth') {
        const radius = 2.05;
        targetCamPos.set(
          Math.sin(orbitRotationY) * radius + parallaxX * 0.3,
          orbitRotationX * 0.8 + 0.12 + parallaxY * 0.3,
          Math.cos(orbitRotationY) * radius
        );
        targetLookAt.set(currentGaze.x * 0.3, currentGaze.y * 0.3, 0);
      } else if (mode === 'moon') {
        const offset = new THREE.Vector3(0.45, 0.2, 0.85);
        targetCamPos.copy(moonPos).add(offset);
        targetCamPos.x += parallaxX * 0.25;
        targetCamPos.y += parallaxY * 0.25;
        targetLookAt.copy(moonPos);
        targetLookAt.x += currentGaze.x * 0.2;
        targetLookAt.y += currentGaze.y * 0.2;
      } else if (mode === 'mars') {
        const offset = new THREE.Vector3(0.55, 0.28, 1.35);
        targetCamPos.copy(marsPos).add(offset);
        targetCamPos.x += parallaxX * 0.28;
        targetCamPos.y += parallaxY * 0.28;
        targetLookAt.copy(marsPos);
        targetLookAt.x += currentGaze.x * 0.25;
        targetLookAt.y += currentGaze.y * 0.25;
      } else if (mode === 'orbit') {
        targetCamPos.set(0.5 + parallaxX, 6.2 + orbitRotationX + parallaxY, 4.6);
        targetLookAt.set(0.6 + currentGaze.x * 0.4, currentGaze.y * 0.4, 0);
      }

      currentCamPos.lerp(targetCamPos, 0.05);
      currentLookAt.lerp(targetLookAt, 0.05);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      // Real-time Flight Dynamics Telemetry
      const speedKms = (shipVelocity.length() * 920).toFixed(1);
      const thrustMode = isBraking
        ? 'INERTIAL BRAKE'
        : isWarp && thrustActive
        ? 'WARP BOOST (3.5X)'
        : thrustActive
        ? 'FORWARD THRUST'
        : isPiloting
        ? 'ORBITAL DRIFT'
        : 'AUTOPILOT LOCK';

      const distEarth = camera.position.distanceTo(earth.group.position);
      const distMoon = camera.position.distanceTo(moonPos);
      const distMars = camera.position.distanceTo(marsPos);

      let targetBody = 'EARTH';
      let targetDistance = (distEarth * 6371).toFixed(0) + ' KM';
      let minDist = distEarth;

      if (distMoon < minDist) {
        minDist = distMoon;
        targetBody = 'MOON';
        targetDistance = (distMoon * 3844).toFixed(0) + ' KM';
      }
      if (distMars < minDist) {
        minDist = distMars;
        targetBody = 'MARS';
        targetDistance = (distMars * 0.32).toFixed(2) + ' AU';
      }

      onFlightTelemetryRef.current({
        speedKms,
        thrustMode,
        targetBody,
        targetDistance,
        isWarping: isWarp && thrustActive,
        isBraking,
        thrustActive,
        isPiloting,
        keysDown,
      });

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earth.dispose();
      moon.dispose();
      mars.dispose();
      starfield.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />;
}
