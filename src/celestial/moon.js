import * as THREE from 'three';

export function createMoonSystem(textures, sunDirection) {
  const moonGroup = new THREE.Group();

  // Artistic Moon scale for cinematic clarity & recognizable crater topography
  const moonRadius = 0.32;
  const moonGeometry = new THREE.SphereGeometry(moonRadius, 64, 64);

  const moonMaterial = new THREE.MeshStandardMaterial({
    map: textures.moonAlbedo,
    roughness: 0.92,
    metalness: 0.04,
  });

  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonGroup.add(moonMesh);

  // Artistic orbit radius for framing Earth & Moon side-by-side in viewport
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
    opacity: 0.18,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  // Initial angle placing Moon in upper right of Earth in Overview
  let currentOrbitAngle = 0.52;

  return {
    group: moonGroup,
    mesh: moonMesh,
    orbitLine,
    orbitRadius,
    getOrbitAngle() {
      return currentOrbitAngle;
    },
    update(dt, isPaused = false) {
      if (!isPaused) {
        currentOrbitAngle += dt * 0.015;
      }

      const x = Math.cos(currentOrbitAngle) * orbitRadius;
      const z = Math.sin(currentOrbitAngle) * orbitRadius;
      const y = Math.sin(currentOrbitAngle) * Math.sin(inclinationAngle) * orbitRadius;

      moonMesh.position.set(x, y, z);
      moonMesh.rotation.y = currentOrbitAngle + Math.PI * 0.5;

      if (textures.moonAlbedo && moonMaterial.map !== textures.moonAlbedo) {
        moonMaterial.map = textures.moonAlbedo;
        moonMaterial.needsUpdate = true;
      }
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    getPosition() {
      return moonMesh.position.clone();
    },
    dispose() {
      moonGeometry.dispose();
      moonMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
    },
  };
}
