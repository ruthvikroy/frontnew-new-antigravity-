import * as THREE from 'three';

const marsAtmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const marsAtmosphereFragmentShader = `
precision highp float;

varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform vec3 uSunDirection;
uniform vec3 uAtmosphereColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    float sunDot = dot(normal, sunDir);
    float rim = 1.0 - max(dot(normal, viewDir), 0.0);

    float glow = pow(rim, 3.2) * max(sunDot * 0.7 + 0.3, 0.0);
    gl_FragColor = vec4(uAtmosphereColor * 1.3, glow * 0.65);
}
`;

export function createMarsSystem(textures, sunDirection) {
  const marsSystemGroup = new THREE.Group();
  const marsTiltGroup = new THREE.Group();
  marsTiltGroup.rotation.z = THREE.MathUtils.degToRad(25.19);
  marsSystemGroup.add(marsTiltGroup);

  const marsRadius = 0.532;
  const marsGeometry = new THREE.SphereGeometry(marsRadius, 64, 64);

  const marsMaterial = new THREE.MeshStandardMaterial({
    map: textures.marsAlbedo || null,
    bumpMap: textures.marsBump || null,
    bumpScale: 0.045,
    roughness: 0.82,
    metalness: 0.03,
  });

  const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
  marsTiltGroup.add(marsMesh);

  const atmoGeometry = new THREE.SphereGeometry(marsRadius * 1.022, 48, 48);
  const atmoMaterial = new THREE.ShaderMaterial({
    vertexShader: marsAtmosphereVertexShader,
    fragmentShader: marsAtmosphereFragmentShader,
    uniforms: {
      uSunDirection: { value: sunDirection },
      uAtmosphereColor: { value: new THREE.Color(0xf27052) },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
  marsTiltGroup.add(atmoMesh);

  const phobosGroup = new THREE.Group();
  const phobosGeo = new THREE.SphereGeometry(0.024, 16, 16);
  const phobosMat = new THREE.MeshStandardMaterial({ color: 0x8a7f76, roughness: 0.95 });
  const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
  phobosGroup.add(phobosMesh);
  marsTiltGroup.add(phobosGroup);

  const deimosGroup = new THREE.Group();
  const deimosGeo = new THREE.SphereGeometry(0.016, 16, 16);
  const deimosMat = new THREE.MeshStandardMaterial({ color: 0x6e655d, roughness: 0.95 });
  const deimosMesh = new THREE.Mesh(deimosGeo, deimosMat);
  deimosGroup.add(deimosMesh);
  marsTiltGroup.add(deimosGroup);

  const orbitRadius = 4.6;
  const inclinationAngle = 1.85 * (Math.PI / 180);
  const orbitPoints = [];
  const segments = 96;
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
    opacity: 0.24,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  let currentOrbitAngle = 2.45;
  let phobosAngle = 0;
  let deimosAngle = 1.8;

  return {
    group: marsSystemGroup,
    mesh: marsMesh,
    orbitLine,
    orbitRadius,
    radius: marsRadius,
    update(dt, isPaused = false) {
      if (!isPaused) {
        currentOrbitAngle += dt * 0.008;
        marsMesh.rotation.y += dt * 0.0215;
        phobosAngle += dt * 0.14;
        deimosAngle += dt * 0.05;
      }

      const x = Math.cos(currentOrbitAngle) * orbitRadius;
      const z = Math.sin(currentOrbitAngle) * orbitRadius;
      const y = Math.sin(currentOrbitAngle) * Math.sin(inclinationAngle) * orbitRadius;

      marsSystemGroup.position.set(x, y, z);

      phobosMesh.position.set(
        Math.cos(phobosAngle) * 0.76,
        Math.sin(phobosAngle * 0.3) * 0.08,
        Math.sin(phobosAngle) * 0.76
      );

      deimosMesh.position.set(
        Math.cos(deimosAngle) * 1.15,
        Math.sin(deimosAngle * 0.2) * 0.12,
        Math.sin(deimosAngle) * 1.15
      );

      if (textures.marsAlbedo && marsMaterial.map !== textures.marsAlbedo) {
        marsMaterial.map = textures.marsAlbedo;
        marsMaterial.needsUpdate = true;
      }
      if (textures.marsBump && marsMaterial.bumpMap !== textures.marsBump) {
        marsMaterial.bumpMap = textures.marsBump;
        marsMaterial.needsUpdate = true;
      }
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    getPosition() {
      return marsSystemGroup.position.clone();
    },
    dispose() {
      marsGeometry.dispose();
      marsMaterial.dispose();
      atmoGeometry.dispose();
      atmoMaterial.dispose();
      phobosGeo.dispose();
      phobosMat.dispose();
      deimosGeo.dispose();
      deimosMat.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
    },
  };
}
