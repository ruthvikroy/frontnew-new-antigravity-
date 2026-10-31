/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Multi-layer 3D Earth mesh with day night blending clouds and atmospheric limb scattering
*/
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { PerformanceManager } from './PerformanceManager';
import { AssetLoader } from './AssetLoader';
import { EarthShaderMaterial } from './shaders/earthShader';
import { AtmosphereShaderMaterial } from './shaders/atmosphereShader';
import { SUN_DIRECTION } from './LightingSystem';

export const Earth: React.FC = () => {
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);

  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const showAtmosphere = useSimulationStore((state) => state.showAtmosphere);
  const quality = useSimulationStore((state) => state.quality);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const config = PerformanceManager.getConfig(quality);
  const textures = AssetLoader.getInstance().getTextures();

  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uDayTexture: { value: textures.earthDay },
        uNightTexture: { value: textures.earthNight },
        uSpecularTexture: { value: textures.earthSpecular },
        uSunDirection: { value: SUN_DIRECTION },
        uAtmosphereColor: { value: new THREE.Color(0x5ca0ff) },
      },
      vertexShader: EarthShaderMaterial.vertexShader,
      fragmentShader: EarthShaderMaterial.fragmentShader,
    });
  }, [textures]);

  const atmoMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunDirection: { value: SUN_DIRECTION },
        uAtmosphereColor: { value: new THREE.Color(0x3884ff) },
        uGlowIntensity: { value: 1.25 },
      },
      vertexShader: AtmosphereShaderMaterial.vertexShader,
      fragmentShader: AtmosphereShaderMaterial.fragmentShader,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const rotDelta = delta * 0.08 * orbitalSpeed;

    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += rotDelta;
    }
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += rotDelta * 1.15;
    }
  });

  const axialTiltRad = (23.44 * Math.PI) / 180;

  return (
    <group
      ref={earthGroupRef}
      rotation={[0, 0, axialTiltRad]}
      onClick={(e) => {
        e.stopPropagation();
        setFocusTarget('earth');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setActiveHoverBody('Earth');
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setActiveHoverBody(null);
      }}
    >
      <mesh ref={earthMeshRef} material={earthMaterial}>
        <sphereGeometry args={[1.0, config.earthSegments, config.earthSegments]} />
      </mesh>

      {config.enableClouds && (
        <mesh ref={cloudsMeshRef}>
          <sphereGeometry args={[1.012, config.earthSegments, config.earthSegments]} />
          <meshStandardMaterial
            map={textures.earthClouds}
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {showAtmosphere && config.enableAtmosphereGlow && (
        <mesh material={atmoMaterial}>
          <sphereGeometry args={[1.045, config.earthSegments, config.earthSegments]} />
        </mesh>
      )}
    </group>
  );
};
// --- End of Earth.tsx ---
