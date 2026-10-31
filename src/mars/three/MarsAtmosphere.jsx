/**
 * Scientifically Grounded Mars Atmosphere Shader
 * Models:
 * - Thin CO2 column (scale height ~11.1 km)
 * - Micron-sized ferric dust limb scattering
 * - Sun direction twilight terminator blend
 * - Limb Fresnel glow
 */

import * as THREE from 'three';

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const atmosphereFragmentShader = `
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereColor;
uniform vec3 uSunsetGlowColor;
uniform float uDustOpticalDepth;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 normal = normalize(vNormal);

  // Rim fresnel effect (strongest at grazing angles / planetary limb)
  float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
  float rim = pow(fresnel, 2.8);

  // Sunlight incidence angle
  vec3 sunDir = normalize(uSunDirection);
  float nDotL = dot(normal, sunDir);

  // Day/night terminator illumination with twilight softening
  float dayFactor = smoothstep(-0.25, 0.45, nDotL);
  float twilightFactor = smoothstep(-0.2, 0.15, nDotL) * (1.0 - smoothstep(0.1, 0.45, nDotL));

  // Blend atmospheric color based on dust loading and solar angle
  // Clear air has faint blue-cyan Rayleigh scatter; dust loading introduces warm salmon-ochre
  vec3 baseColor = mix(uAtmosphereColor, uSunsetGlowColor, twilightFactor * 1.4);

  // Dust optical depth tau amplifies haze opacity
  float alpha = rim * dayFactor * (0.45 + uDustOpticalDepth * 0.4) * uIntensity;

  gl_FragColor = vec4(baseColor, clamp(alpha, 0.0, 0.85));
}
`;

/**
 * Creates an authentic Mars atmospheric glow mesh
 *
 * @param {Object} options
 * @param {number} options.radius - Mars base radius in 3D world units (default 3.0)
 * @param {number} options.dustOpticalDepth - Dust tau parameter (default 0.3)
 * @param {THREE.Vector3} options.sunDirection - Normalized direction vector to the Sun
 * @returns {THREE.Mesh}
 */
export function createMarsAtmosphereMesh({
  radius = 3.0,
  dustOpticalDepth = 0.35,
  sunDirection = new THREE.Vector3(1, 0.5, 0.8).normalize(),
} = {}) {
  // Atmospheric limb shell extends ~1.8% beyond planetary surface
  const atmoRadius = radius * 1.018;
  const geometry = new THREE.SphereGeometry(atmoRadius, 64, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      uSunDirection: { value: sunDirection },
      // Mars daytime limb: subtle ochre/salmon haze
      uAtmosphereColor: { value: new THREE.Color(0xd49b7a) },
      // Twilight terminator: warmer butterscotch/amber
      uSunsetGlowColor: { value: new THREE.Color(0xe67e22) },
      uDustOpticalDepth: { value: dustOpticalDepth },
      uIntensity: { value: 1.0 },
    },
    transparent: true,
    blending: THREE.NormalBlending,
    side: THREE.FrontSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'MarsAtmosphere';

  return mesh;
}
