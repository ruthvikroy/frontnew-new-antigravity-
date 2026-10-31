/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: GLSL shader material for Earth day night specular blending and cloud shadow transitions
*/
import * as THREE from 'three';

export const EarthShaderMaterial = {
  uniforms: {
    uDayTexture: { value: null as THREE.Texture | null },
    uNightTexture: { value: null as THREE.Texture | null },
    uSpecularTexture: { value: null as THREE.Texture | null },
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
    uAtmosphereColor: { value: new THREE.Color(0x5ca0ff) },
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
    uniform sampler2D uDayTexture;
    uniform sampler2D uNightTexture;
    uniform sampler2D uSpecularTexture;
    uniform vec3 uSunDirection;
    uniform vec3 uAtmosphereColor;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 sunDir = normalize(uSunDirection);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);

      float sunDot = dot(norm, sunDir);

      vec4 dayColor = texture2D(uDayTexture, vUv);
      vec4 nightColor = texture2D(uNightTexture, vUv);
      vec4 specColor = texture2D(uSpecularTexture, vUv);

      float dayFactor = smoothstep(-0.15, 0.25, sunDot);
      float nightFactor = 1.0 - smoothstep(-0.25, 0.1, sunDot);

      vec3 halfDir = normalize(sunDir + viewDir);
      float spec = pow(max(dot(norm, halfDir), 0.0), 32.0);
      vec3 specularHighlight = vec3(1.0, 0.95, 0.85) * spec * specColor.r * 1.5 * dayFactor;

      float fresnel = 1.0 - max(dot(viewDir, norm), 0.0);
      fresnel = pow(fresnel, 3.5) * dayFactor * 0.45;
      vec3 atmoGlow = uAtmosphereColor * fresnel;

      vec3 dayLit = dayColor.rgb * max(sunDot, 0.05) + specularHighlight + atmoGlow;
      vec3 nightLit = nightColor.rgb * 1.35;

      vec3 finalColor = mix(nightLit, dayLit, dayFactor);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
// --- End of earthShader.ts ---
