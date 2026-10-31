import * as THREE from 'three';

const starVertexShader = `
attribute float aSize;
attribute vec3 aColor;
attribute float aPhase;
attribute float aSpeed;

uniform float uTime;
uniform float uDPR;

varying vec3 vColor;
varying float vAlpha;

void main() {
    vColor = aColor;
    
    // Gentle twinkling sine wave
    float twinkle = sin(uTime * aSpeed + aPhase) * 0.35 + 0.65;
    vAlpha = twinkle;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * uDPR * (280.0 / -mvPosition.z) * twinkle;
}
`;

const starFragmentShader = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;

void main() {
    // Soft circular point sprite
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    if (distSq > 0.25) discard;
    
    float intensity = smoothstep(0.25, 0.0, distSq);
    gl_FragColor = vec4(vColor, intensity * vAlpha);
}
`;

export function createStarField(count = 3500) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);

  const starPalettes = [
    new THREE.Color(0xf2f4f8), // Pure crisp white
    new THREE.Color(0xc3d8ff), // Subtle stellar blue
    new THREE.Color(0x8bbcff), // Cyan-blue
    new THREE.Color(0xffe8c9), // Warm stellar gold
    new THREE.Color(0xdce6ff), // Cool white
  ];

  for (let i = 0; i < count; i++) {
    // Distribute on large spherical shell
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const radius = 120 + Math.random() * 280;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const col = starPalettes[Math.floor(Math.random() * starPalettes.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    sizes[i] = 1.0 + Math.random() * 2.2;
    phases[i] = Math.random() * Math.PI * 2.0;
    speeds[i] = 0.4 + Math.random() * 1.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uDPR: { value: Math.min(window.devicePixelRatio || 1, 2) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  // Subtle background deep nebula sphere
  const nebulaGeo = new THREE.SphereGeometry(450, 32, 32);
  const nebulaMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vWorldPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3 vWorldPosition;
      void main() {
        vec3 dir = normalize(vWorldPosition);
        // Very faint cosmic dust variation
        float dust = sin(dir.x * 3.0) * sin(dir.y * 2.0 + dir.z * 1.5);
        vec3 deepCosmic = mix(vec3(0.008, 0.012, 0.024), vec3(0.002, 0.003, 0.006), dust * 0.5 + 0.5);
        gl_FragColor = vec4(deepCosmic, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);

  const group = new THREE.Group();
  group.add(nebulaMesh);
  group.add(points);

  return {
    group,
    update(time) {
      material.uniforms.uTime.value = time;
    },
    setDPR(dpr) {
      material.uniforms.uDPR.value = dpr;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
    },
  };
}
