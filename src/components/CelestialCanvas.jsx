/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: WebGL canvas for Earth and Moon 3D simulation with pinpoint reference images
*/

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { loadCelestialTextures } from '../celestial/textures.js';
import { createStarField } from '../celestial/starfield.js';
import { createEarthSystem } from '../celestial/earth.js';
import { createMoonSystem } from '../celestial/moon.js';
import { createMarsSystem } from '../celestial/mars.js';
import { ALL_LUNAR_LOCATIONS, LUNAR_LOCATIONS_MAP } from '../data/lunarLandmarks.js';
import { selenographicToCartesian } from '../utils/orbitalMath.js';

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
}) {
  const canvasRef = useRef(null);
  const interactionRef = useRef(onUserInteracted);
  interactionRef.current = onUserInteracted;

  const onSelectBodyRef = useRef(onSelectBody);
  onSelectBodyRef.current = onSelectBody;

  const onSelectLandmarkRef = useRef(onSelectLandmarkId);
  onSelectLandmarkRef.current = onSelectLandmarkId;

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const showOrbitsRef = useRef(showOrbits);
  showOrbitsRef.current = showOrbits;

  const showLandingSitesRef = useRef(showLandingSites);
  showLandingSitesRef.current = showLandingSites;

  const landmarkIdRef = useRef(selectedLandmarkId);
  landmarkIdRef.current = selectedLandmarkId;

  const resetTriggerRef = useRef(resetTrigger);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x020306, 1.0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 2000);

    // Initial Overview composition
    const baseOverviewPos = new THREE.Vector3(0.5, 0.25, 4.0);
    const currentCamPos = baseOverviewPos.clone();
    const targetCamPos = baseOverviewPos.clone();
    const currentLookAt = new THREE.Vector3(0.35, 0, 0);
    const targetLookAt = new THREE.Vector3(0.35, 0, 0);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // Primary Solar Directional Light
    const sunDirection = new THREE.Vector3(6.5, 2.5, 5.0).normalize();
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.copy(sunDirection.clone().multiplyScalar(100));
    scene.add(sunLight);

    // Space ambient fill
    const ambientLight = new THREE.AmbientLight(0x080c14, 0.2);
    scene.add(ambientLight);

    // Starfield & Cosmic Nebula
    const starfield = createStarField(width <= 768 ? 2200 : 3800);
    scene.add(starfield.group);

    // Celestial Bodies (Earth & Moon)
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
    scene.add(mars.group);
    scene.add(mars.orbitLine);

    const landmarkGroup = new THREE.Group();
    const moonR = 0.32;

    for (const lm of ALL_LUNAR_LOCATIONS) {
      const coords = selenographicToCartesian(
        lm.selenographic.latitudeDeg,
        lm.selenographic.longitudeDeg,
        moonR
      );
      const posVec = new THREE.Vector3(coords.x, coords.y, coords.z);
      const isApollo = lm.category === 'apollo';
      const isRobotic = lm.category === 'robotic';
      const color = lm.pinColor || (isApollo ? 0xf59e0b : isRobotic ? 0x10b981 : 0x38bdf8);

      const pinMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isApollo ? 0.95 : 0.8,
      });

      const pinHeight = isApollo ? 0.045 : 0.032;
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(isApollo ? 0.0025 : 0.0018, 0.001, pinHeight, 6),
        pinMat
      );
      pin.position.copy(posVec).multiplyScalar(1.03);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), posVec.clone().normalize());
      pin.userData = { landmarkId: lm.id };

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(isApollo ? 0.01 : 0.006, isApollo ? 0.018 : 0.012, 16),
        pinMat
      );
      ring.position.copy(posVec).multiplyScalar(1.008);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), posVec.clone().normalize());
      ring.userData = { landmarkId: lm.id };

      landmarkGroup.add(pin);
      landmarkGroup.add(ring);

      if (isApollo) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.0035, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfffbeb })
        );
        dot.position.copy(posVec).multiplyScalar(1.07);
        dot.userData = { landmarkId: lm.id };
        landmarkGroup.add(dot);
      }
    }
    moon.mesh.add(landmarkGroup);

    const debrisGroup = new THREE.Group();
    const debrisList = [];
    const debrisMat = new THREE.MeshStandardMaterial({
      color: 0x444955,
      roughness: 0.95,
      metalness: 0.05,
    });

    for (let i = 0; i < 9; i++) {
      const geom = new THREE.DodecahedronGeometry(0.03 + Math.random() * 0.04, 1);
      const mesh = new THREE.Mesh(geom, debrisMat);
      const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      const r = 2.9 + Math.random() * 0.8;
      const y = (Math.random() - 0.5) * 0.4;
      mesh.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      debrisGroup.add(mesh);
      debrisList.push({
        mesh,
        angle,
        r,
        speed: 0.008 + Math.random() * 0.012,
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.5,
          Math.random() * 0.5,
          Math.random() * 0.5
        ),
      });
    }
    scene.add(debrisGroup);

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
        if (moveDist < 7) {
          const mouseRay = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2.0 - 1.0,
            -(e.clientY / window.innerHeight) * 2.0 + 1.0
          );
          raycaster.setFromCamera(mouseRay, camera);
          const intersects = raycaster.intersectObjects(landmarkGroup.children, true);
          if (intersects.length > 0) {
            for (const hit of intersects) {
              const hitId = hit.object?.userData?.landmarkId;
              if (hitId) {
                onSelectLandmarkRef.current(hitId);
                break;
              }
            }
          } else {
            const bodyHits = raycaster.intersectObjects([mars.mesh, earth.surfaceMesh, moon.mesh], true);
            if (bodyHits.length > 0) {
              const bodyId = bodyHits[0].object?.userData?.bodyId;
              if (bodyId) {
                onSelectBodyRef.current(bodyId);
              }
            }
          }
        }
      }
      isDragging = false;
    };

    // Touch: touchstart and touchmove feed the exact same mouse position
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

      // Check reset
      if (resetTriggerRef.current !== resetTrigger) {
        resetTriggerRef.current = resetTrigger;
        orbitRotationX = 0;
        orbitRotationY = 0;
        rotationVelocityX = 0;
        rotationVelocityY = 0;
        gazeTarget.set(0, 0);
      }

      // Apply drag momentum with smooth friction
      orbitRotationY += rotationVelocityY;
      orbitRotationX += rotationVelocityX;
      rotationVelocityX *= 0.92;
      rotationVelocityY *= 0.92;

      // Smooth gaze tracking
      currentGaze.lerp(gazeTarget, 0.055);

      starfield.update(accumulatedTime);
      earth.update(dt, camera, isPausedRef.current);
      moon.update(dt, isPausedRef.current);
      mars.update(dt, isPausedRef.current);
      moon.setOrbitVisibility(showOrbitsRef.current);
      mars.setOrbitVisibility(showOrbitsRef.current);
      landmarkGroup.visible = showLandingSitesRef.current;

      if (!isPausedRef.current) {
        for (const deb of debrisList) {
          deb.angle += dt * deb.speed;
          deb.mesh.position.x = Math.cos(deb.angle) * deb.r;
          deb.mesh.position.z = Math.sin(deb.angle) * deb.r;
          deb.mesh.rotation.x += dt * deb.rotSpeed.x;
          deb.mesh.rotation.y += dt * deb.rotSpeed.y;
        }
      }

      const mode = viewModeRef.current;
      const currentLandmark = landmarkIdRef.current;
      const moonPos = moon.getPosition();

      const parallaxX = mouseNorm.x * 0.12 + currentGaze.x;
      const parallaxY = -mouseNorm.y * 0.1 + currentGaze.y;

      if (currentLandmark) {
        const lm = LUNAR_LOCATIONS_MAP.get(currentLandmark);
        if (lm) {
          const coords = selenographicToCartesian(
            lm.selenographic.latitudeDeg,
            lm.selenographic.longitudeDeg,
            moonR
          );
          const localVec = new THREE.Vector3(coords.x, coords.y, coords.z);
          localVec.applyEuler(moon.mesh.rotation);
          const worldPos = moon.mesh.position.clone().add(localVec);
          const normal = localVec.clone().normalize();

          targetCamPos.copy(worldPos).add(normal.multiplyScalar(0.44));
          targetCamPos.x += parallaxX * 0.12;
          targetCamPos.y += parallaxY * 0.12;
          targetLookAt.copy(worldPos);
        } else {
          const offset = new THREE.Vector3(0.35, 0.15, 0.55);
          targetCamPos.copy(moonPos).add(offset);
          targetLookAt.copy(moonPos);
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
        const offset = new THREE.Vector3(0.5, 0.2, 0.8);
        targetCamPos.copy(moonPos).add(offset);
        targetCamPos.x += parallaxX * 0.25;
        targetCamPos.y += parallaxY * 0.25;
        targetLookAt.copy(moonPos);
        targetLookAt.x += currentGaze.x * 0.2;
        targetLookAt.y += currentGaze.y * 0.2;
      } else if (mode === 'mars') {
        const marsPos = mars.getPosition();
        const offset = new THREE.Vector3(0.55, 0.25, 1.25);
        targetCamPos.copy(marsPos).add(offset);
        targetCamPos.x += parallaxX * 0.25;
        targetCamPos.y += parallaxY * 0.25;
        targetLookAt.copy(marsPos);
        targetLookAt.x += currentGaze.x * 0.2;
        targetLookAt.y += currentGaze.y * 0.2;
      } else if (mode === 'orbit') {
        targetCamPos.set(0.5 + parallaxX, 6.2 + orbitRotationX + parallaxY, 4.6);
        targetLookAt.set(0.6 + currentGaze.x * 0.4, currentGaze.y * 0.4, 0);
      }

      currentCamPos.lerp(targetCamPos, 0.04);
      currentLookAt.lerp(targetLookAt, 0.045);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      starfield.dispose();
      earth.dispose();
      moon.dispose();
      mars.dispose();
      debrisMat.dispose();
      debrisList.forEach((d) => d.mesh.geometry.dispose());
      renderer.dispose();
    };
  }, [resetTrigger]);

  return (
    <canvas
      id="space"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
      style={{ zIndex: 0, touchAction: 'none' }}
    />
  );
}

/* --- End of CelestialCanvas.jsx --- */
