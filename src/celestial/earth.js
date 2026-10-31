import * as THREE from 'three';

const earthSurfaceVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const earthSurfaceFragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform sampler2D uDayMap;
uniform sampler2D uLightsMap;
uniform sampler2D uSpecularMap;
uniform vec3 uSunDirection;
uniform vec3 uCameraPosition;
uniform float uSunIntensity;
uniform float uAmbientIntensity;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    float sunDot = dot(normal, sunDir);

    // Smooth day/night terminator transitions
    float dayFactor = smoothstep(-0.10, 0.14, sunDot);
    float nightFactor = 1.0 - smoothstep(-0.18, 0.05, sunDot);

    vec4 dayTex = texture2D(uDayMap, vUv);
    vec4 lightsTex = texture2D(uLightsMap, vUv);
    vec4 specTex = texture2D(uSpecularMap, vUv);

    // Day lighting: diffuse + specular reflection on oceans
    vec3 lightReflect = reflect(-sunDir, normal);
    float specFactor = pow(max(dot(viewDir, lightReflect), 0.0), 28.0) * specTex.r;
    vec3 oceanSpecular = vec3(0.95, 0.98, 1.0) * specFactor * 1.4 * max(sunDot, 0.0);

    vec3 dayColor = dayTex.rgb * (max(sunDot, 0.0) * uSunIntensity + uAmbientIntensity) + oceanSpecular;

    // Night lighting: subtle golden/amber city lights only on dark hemisphere
    vec3 nightColor = lightsTex.rgb * vec3(1.15, 0.95, 0.7) * 1.8 * nightFactor;

    // Atmospheric scattering along the illuminated horizon
    float rim = 1.0 - max(dot(normal, viewDir), 0.0);
    vec3 atmosphericHaze = vec3(0.35, 0.68, 1.0) * pow(rim, 3.5) * max(sunDot * 0.75 + 0.25, 0.0) * 0.9;

    vec3 finalColor = mix(nightColor, dayColor, dayFactor) + atmosphericHaze;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const atmosphereFragmentShader = `
precision highp float;

varying vec3 vNormal;
varying vec3 vViewDir;

uniform vec3 uSunDirection;
uniform vec3 uAtmosphereColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    vec3 sunDir = normalize(uSunDirection);

    // View-dependent rim falloff on front-facing atmosphere sphere
    float vDot = max(dot(normal, viewDir), 0.0);
    float rim = pow(1.0 - vDot, 4.0);

    // Direct scattering toward sunward hemisphere
    float sunFacing = max(dot(normal, sunDir) * 0.65 + 0.35, 0.0);
    float intensity = rim * sunFacing * 1.2;

    if (intensity < 0.005) discard;

    gl_FragColor = vec4(uAtmosphereColor, intensity * 0.85);
}
`;

export function createEarthSystem(textures, sunDirection) {
  const earthGroup = new THREE.Group();

  // Axial tilt: 23.44 degrees (0.4091 rad)
  earthGroup.rotation.z = -0.4091;

  // 1. Earth Surface
  const earthGeometry = new THREE.SphereGeometry(1, 128, 128);
  const surfaceMaterial = new THREE.ShaderMaterial({
    vertexShader: earthSurfaceVertexShader,
    fragmentShader: earthSurfaceFragmentShader,
    uniforms: {
      uDayMap: { value: textures.earthDay },
      uLightsMap: { value: textures.earthLights },
      uSpecularMap: { value: textures.earthSpecular || textures.earthDay },
      uSunDirection: { value: sunDirection },
      uCameraPosition: { value: new THREE.Vector3() },
      uSunIntensity: { value: 1.35 },
      uAmbientIntensity: { value: 0.04 },
    },
  });

  const surfaceMesh = new THREE.Mesh(earthGeometry, surfaceMaterial);
  earthGroup.add(surfaceMesh);

  // 2. Clouds Layer
  const cloudsGeometry = new THREE.SphereGeometry(1.008, 96, 96);
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: textures.earthClouds,
    transparent: true,
    opacity: 0.75,
    blending: THREE.NormalBlending,
    roughness: 0.95,
    metalness: 0.0,
    depthWrite: false,
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  earthGroup.add(cloudsMesh);

  // 3. Subtle Atmospheric Scattering Layer (tight 1.014 front-side shell)
  const atmosphereGeometry = new THREE.SphereGeometry(1.014, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      uSunDirection: { value: sunDirection },
      uAtmosphereColor: { value: new THREE.Color(0x60aaff) },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earthGroup.add(atmosphereMesh);

  return {
    group: earthGroup,
    surfaceMesh,
    cloudsMesh,
    atmosphereMesh,
    update(dt, camera, isPaused = false) {
      if (!isPaused) {
        surfaceMesh.rotation.y += dt * 0.022;
        cloudsMesh.rotation.y += dt * 0.028;
      }

      surfaceMaterial.uniforms.uCameraPosition.value.copy(camera.position);
      surfaceMaterial.uniforms.uDayMap.value = textures.earthDay;
      surfaceMaterial.uniforms.uLightsMap.value = textures.earthLights;
      if (textures.earthSpecular) {
        surfaceMaterial.uniforms.uSpecularMap.value = textures.earthSpecular;
      }

      if (textures.earthClouds && cloudsMaterial.map !== textures.earthClouds) {
        cloudsMaterial.map = textures.earthClouds;
        cloudsMaterial.needsUpdate = true;
      }
    },
    dispose() {
      earthGeometry.dispose();
      cloudsGeometry.dispose();
      atmosphereGeometry.dispose();
      surfaceMaterial.dispose();
      cloudsMaterial.dispose();
      atmosphereMaterial.dispose();
    },
  };
}
