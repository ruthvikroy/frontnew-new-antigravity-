/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: GLSL shader material for Moon crater detail and realistic lunar terminator response
*/
import * as THREE from 'three';

export const MoonShaderMaterial = {
  uniforms: {
    uSurfaceTexture: { value: null as THREE.Texture | null },
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uSurfaceTexture;
    uniform vec3 uSunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 sunDir = normalize(uSunDirection);

      float sunDot = dot(norm, sunDir);
      float directLight = clamp(sunDot, 0.0, 1.0);
      directLight = pow(directLight, 0.95);

      vec4 texColor = texture2D(uSurfaceTexture, vUv);

      float ambient = 0.015;
      vec3 finalColor = texColor.rgb * (directLight + ambient);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
// --- End of moonShader.ts ---
