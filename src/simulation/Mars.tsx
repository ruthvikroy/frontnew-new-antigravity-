/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Realistic 3D Mars mesh with surface texturing, axial tilt, rotation, and atmospheric limb scattering
*/
import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { PerformanceManager } from './PerformanceManager';
import { AssetLoader } from './AssetLoader';
import { AtmosphereShaderMaterial } from './shaders/atmosphereShader';
import { SUN_DIRECTION } from './LightingSystem';

export interface MarsHandle {
  setPosition: (x: number, y: number, z: number) => void;
  getPosition: () => THREE.Vector3;
}

export const Mars = forwardRef<MarsHandle>((_, ref) => {
  const marsGroupRef = useRef<THREE.Group>(null);
  const marsMeshRef = useRef<THREE.Mesh>(null);
  const positionVec = useRef(new THREE.Vector3(13.5, 0, 0));

  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const showAtmosphere = useSimulationStore((state) => state.showAtmosphere);
  const quality = useSimulationStore((state) => state.quality);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const config = PerformanceManager.getConfig(quality);
  const textures = AssetLoader.getInstance().getTextures();

  const marsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textures.marsSurface,
      roughness: 0.82,
      metalness: 0.08,
      bumpScale: 0.035,
    });
  }, [textures]);

  const atmoMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunDirection: { value: SUN_DIRECTION },
        uAtmosphereColor: { value: new THREE.Color(0xf27052) },
        uGlowIntensity: { value: 0.9 },
      },
      vertexShader: AtmosphereShaderMaterial.vertexShader,
      fragmentShader: AtmosphereShaderMaterial.fragmentShader,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useImperativeHandle(ref, () => ({
    setPosition: (x: number, y: number, z: number) => {
      positionVec.current.set(x, y, z);
      if (marsGroupRef.current) {
        marsGroupRef.current.position.set(x, y, z);
      }
    },
    getPosition: () => positionVec.current.clone(),
  }));

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const rotDelta = delta * 0.075 * orbitalSpeed;
    if (marsMeshRef.current) {
      marsMeshRef.current.rotation.y += rotDelta;
    }
  });

  const marsTiltRad = (25.19 * Math.PI) / 180;
  const marsRadius = 0.532;

  return (
    <group
      ref={marsGroupRef}
      position={[13.5, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setFocusTarget('mars');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setActiveHoverBody('Mars');
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setActiveHoverBody(null);
      }}
    >
      <group rotation={[0, 0, marsTiltRad]}>
        <mesh ref={marsMeshRef} material={marsMaterial}>
          <sphereGeometry args={[marsRadius, config.earthSegments, config.earthSegments]} />
        </mesh>

        {showAtmosphere && (
          <mesh material={atmoMaterial}>
            <sphereGeometry args={[marsRadius * 1.025, config.earthSegments, config.earthSegments]} />
          </mesh>
        )}
      </group>
    </group>
  );
});

Mars.displayName = 'Mars';
// --- End of Mars.tsx ---
