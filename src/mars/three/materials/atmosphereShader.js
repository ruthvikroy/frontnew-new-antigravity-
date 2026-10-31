import * as THREE from 'three';

/**
 * Atmospheric limb glow shader for Mars
 * Mars atmosphere produces a subtle reddish-amber to dusty tan glow with Rayleigh scattering
 */
export function createAtmosphereMaterial() {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPositionEye;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 eyePosition = modelViewMatrix * vec4(position, 1.0);
      vPositionEye = eyePosition.xyz;
      gl_Position = projectionMatrix * eyePosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPositionEye;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uPower;

    void main() {
      vec3 viewDirection = normalize(-vPositionEye);
      // Fresnel effect: intense at the grazing silhouette edge
      float dotProduct = dot(vNormal, viewDirection);
      float fresnel = clamp(1.0 - max(dotProduct, 0.0), 0.0, 1.0);
      float intensity = pow(fresnel, uPower) * uIntensity;

      // Soft falloff
      gl_FragColor = vec4(uColor, intensity);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(0xd97736) }, // Martian dust haze amber-orange
      uIntensity: { value: 0.85 },
      uPower: { value: 2.8 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
}
