/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: GLSL shader material for Earth atmospheric limb scattering and Fresnel rim glow
*/
import * as THREE from 'three';

export const AtmosphereShaderMaterial = {
  uniforms: {
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
    uAtmosphereColor: { value: new THREE.Color(0x3884ff) },
    uGlowIntensity: { value: 1.15 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uSunDirection;
    uniform vec3 uAtmosphereColor;
    uniform float uGlowIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
      fresnel = pow(fresnel, 2.8) * uGlowIntensity;

      float sunDot = dot(normalize(vNormal), normalize(uSunDirection));
      float sunFactor = smoothstep(-0.25, 0.45, sunDot);

      vec3 finalColor = uAtmosphereColor * fresnel * (sunFactor * 0.85 + 0.15);
      float alpha = clamp(fresnel * (sunFactor * 0.95 + 0.05), 0.0, 1.0);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};
// --- End of atmosphereShader.ts ---
