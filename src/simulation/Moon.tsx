/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Realistic 3D Moon mesh with crater terminator shading and tidal locking
*/
import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { PerformanceManager } from './PerformanceManager';
import { AssetLoader } from './AssetLoader';
import { MoonShaderMaterial } from './shaders/moonShader';
import { SUN_DIRECTION } from './LightingSystem';

export interface MoonHandle {
  setPosition: (x: number, y: number, z: number) => void;
  getPosition: () => THREE.Vector3;
}

export const Moon = forwardRef<MoonHandle>((_, ref) => {
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const positionVec = useRef(new THREE.Vector3(7.5, 0, 0));

  const quality = useSimulationStore((state) => state.quality);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const config = PerformanceManager.getConfig(quality);
  const textures = AssetLoader.getInstance().getTextures();

  const moonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSurfaceTexture: { value: textures.moonSurface },
        uSunDirection: { value: SUN_DIRECTION },
      },
      vertexShader: MoonShaderMaterial.vertexShader,
      fragmentShader: MoonShaderMaterial.fragmentShader,
    });
  }, [textures]);

  useImperativeHandle(ref, () => ({
    setPosition: (x: number, y: number, z: number) => {
      positionVec.current.set(x, y, z);
      if (moonMeshRef.current) {
        moonMeshRef.current.position.set(x, y, z);
        moonMeshRef.current.lookAt(0, 0, 0);
      }
    },
    getPosition: () => positionVec.current.clone(),
  }));

  return (
    <mesh
      ref={moonMeshRef}
      position={[7.5, 0, 0]}
      material={moonMaterial}
      onClick={(e) => {
        e.stopPropagation();
        setFocusTarget('moon');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setActiveHoverBody('Moon');
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setActiveHoverBody(null);
      }}
    >
      <sphereGeometry args={[0.2727, config.moonSegments, config.moonSegments]} />
    </mesh>
  );
});

Moon.displayName = 'Moon';
// --- End of Moon.tsx ---
