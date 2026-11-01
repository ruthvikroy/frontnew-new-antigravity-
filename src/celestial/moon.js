import * as THREE from 'three';
import { ALL_LUNAR_LOCATIONS, selenographicToCartesian } from '../data/lunarLandmarks.js';

function createLunarBadgeCanvas(text, subtext, color = '#F5D000') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(10, 15, 24, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 64, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(32, 40, 8, 0, Math.PI * 2);
  ctx.fill();

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

export function createMoonSystem(textures, sunDirection) {
  const moonGroup = new THREE.Group();

  const moonRadius = 0.32;
  const moonGeometry = new THREE.SphereGeometry(moonRadius, 64, 64);

  // Dynamic bump & roughness mapping for photorealistic crater relief
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: textures.moonAlbedo || null,
    bumpMap: textures.moonAlbedo || null,
    bumpScale: 0.036,
    roughness: 0.88,
    metalness: 0.04,
  });

  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.userData = { bodyId: 'moon' };
  moonMesh.castShadow = true;
  moonMesh.receiveShadow = true;
  moonGroup.add(moonMesh);

  // High-Visibility 3D Lunar Landmark Checkpoints (Apollo Landing Sites, Robotic Landers, Maria)
  const landmarkGroup = new THREE.Group();
  const pulsingRings = [];
  const beaconBeams = [];

  for (const lm of ALL_LUNAR_LOCATIONS) {
    const coords = selenographicToCartesian(
      lm.selenographic.latitudeDeg,
      lm.selenographic.longitudeDeg,
      moonRadius
    );
    const posVec = new THREE.Vector3(coords.x, coords.y, coords.z);
    const norm = posVec.clone().normalize();
    const isApollo = lm.category === 'apollo';
    const isRobotic = lm.category === 'robotic';

    const colorHex = lm.pinColor
      ? new THREE.Color(lm.pinColor).getHex()
      : isApollo
      ? 0xf5d000 // Brilliant gold for Apollo
      : isRobotic
      ? 0x10b981 // Emerald for Robotic
      : 0x38bdf8; // Cyan for Maria & Landmarks

    const colorCss = isApollo ? '#f5d000' : isRobotic ? '#10b981' : '#38bdf8';

    // 1. Vertical glowing light beacon beam
    const beamHeight = isApollo ? 0.075 : 0.055;
    const beamGeo = new THREE.CylinderGeometry(0.003, 0.0045, beamHeight, 8);
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
    beam.userData = { landmarkId: lm.id, bodyId: 'moon' };
    landmarkGroup.add(beam);
    beaconBeams.push({ mesh: beam, baseHeight: beamHeight, id: lm.id });

    // 2. Pulsating radar beacon ring on surface
    const ringGeo = new THREE.RingGeometry(0.008, 0.018, 20);
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
    ring.userData = { landmarkId: lm.id, bodyId: 'moon' };
    landmarkGroup.add(ring);
    pulsingRings.push(ring);

    // 3. Luminous glowing waypoint core node (Always visible, depthTest: false)
    const coreGeo = new THREE.SphereGeometry(isApollo ? 0.0055 : 0.0042, 10, 10);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.copy(posVec).add(norm.clone().multiplyScalar(beamHeight));
    coreMesh.renderOrder = 1000;
    coreMesh.userData = { landmarkId: lm.id, bodyId: 'moon' };
    landmarkGroup.add(coreMesh);

    // 4. Billboard badge sprite tag
    const badgeText = isApollo
      ? lm.mission.replace('Apollo ', 'A')
      : lm.mission || lm.name.split(' ')[0];
    const subBadge = isApollo ? 'APOLLO' : isRobotic ? 'LANDER' : 'MARE';
    const badgeTexture = createLunarBadgeCanvas(badgeText, subBadge, colorCss);
    const spriteMat = new THREE.SpriteMaterial({
      map: badgeTexture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(posVec).add(norm.clone().multiplyScalar(beamHeight + 0.028));
    sprite.scale.set(0.07, 0.024, 1);
    sprite.renderOrder = 1001;
    sprite.userData = { landmarkId: lm.id, bodyId: 'moon' };
    landmarkGroup.add(sprite);

    // 5. Generous hitbox for reliable raycasting & clicks
    const hitbox = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitbox.position.copy(posVec).multiplyScalar(1.02);
    hitbox.userData = { landmarkId: lm.id, bodyId: 'moon' };
    landmarkGroup.add(hitbox);
  }

  moonMesh.add(landmarkGroup);

  // Orbit line around Earth
  const orbitRadius = 2.15;
  const inclinationAngle = 5.14 * (Math.PI / 180);
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
    color: 0x8bbcff,
    transparent: true,
    opacity: 0.22,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  let currentOrbitAngle = 0.52;
  let simulationTime = 0;

  return {
    group: moonGroup,
    mesh: moonMesh,
    material: moonMaterial,
    landmarkGroup,
    orbitLine,
    orbitRadius,
    radius: moonRadius,
    getOrbitAngle() {
      return currentOrbitAngle;
    },
    update(dt, isPaused = false, selectedLandmarkId = null) {
      if (!isPaused) {
        simulationTime += dt;
        currentOrbitAngle += dt * 0.015;
      }

      const x = Math.cos(currentOrbitAngle) * orbitRadius;
      const z = Math.sin(currentOrbitAngle) * orbitRadius;
      const y = Math.sin(currentOrbitAngle) * Math.sin(inclinationAngle) * orbitRadius;

      moonMesh.position.set(x, y, z);
      // Synchronous tidal locking rotation facing Earth
      moonMesh.rotation.y = currentOrbitAngle + Math.PI * 0.5;

      // Animate checkpoint radar rings
      pulsingRings.forEach((ring, idx) => {
        const pulse = 1.0 + Math.sin(simulationTime * 3.5 + idx * 0.9) * 0.35;
        ring.scale.set(pulse, pulse, 1);
        ring.material.opacity = 0.45 + Math.sin(simulationTime * 3.5 + idx * 0.9) * 0.4;
      });

      // Animate selected beacon surge
      beaconBeams.forEach(({ mesh, baseHeight, id }) => {
        const isSelected = selectedLandmarkId === id;
        if (isSelected) {
          const surge = 1.8 + Math.sin(simulationTime * 5.0) * 0.4;
          mesh.scale.set(1.4, surge, 1.4);
          mesh.material.opacity = 1.0;
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
          mesh.material.opacity = 0.9;
        }
      });

      if (textures.moonAlbedo && moonMaterial.map !== textures.moonAlbedo) {
        moonMaterial.map = textures.moonAlbedo;
        moonMaterial.bumpMap = textures.moonAlbedo;
        moonMaterial.needsUpdate = true;
      }
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    setLandmarksVisibility(visible) {
      landmarkGroup.visible = visible;
    },
    getPosition() {
      return moonMesh.position.clone();
    },
    getLandmarkPosition(landmarkId) {
      const lm = ALL_LUNAR_LOCATIONS.find((l) => l.id === landmarkId);
      if (!lm) return null;
      const coords = selenographicToCartesian(
        lm.selenographic.latitudeDeg,
        lm.selenographic.longitudeDeg,
        moonRadius
      );
      const localVec = new THREE.Vector3(coords.x, coords.y, coords.z);
      const worldVec = localVec.clone();
      worldVec.applyEuler(moonMesh.rotation);
      worldVec.add(moonMesh.position);
      return worldVec;
    },
    dispose() {
      moonGeometry.dispose();
      moonMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
    },
  };
}
