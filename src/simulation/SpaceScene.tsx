/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unified React Three Fiber space scene wrapper with adaptive DPR and asset preloading
*/
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { PerformanceManager } from './PerformanceManager';
import { LightingSystem } from './LightingSystem';
import { StarField } from './StarField';
import { OrbitalSystem } from './OrbitalSystem';
import { CameraController } from './CameraController';
import { SimulationUI } from './SimulationUI';

function LoadingPlaceholder() {
  const loadingProgress = useSimulationStore((state) => state.loadingProgress);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/95 select-none font-mono-code text-xs">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#F5D000] border-t-transparent animate-spin rounded-full shadow-[0_0_15px_rgba(245,208,0,0.3)]" />
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#F5D000] animate-pulse" />
          <span className="tracking-[0.25em] text-[#F1F1F1] uppercase font-bold text-[10px]">
            INITIALIZING SOLAR SYSTEM
          </span>
          <span className="text-[#F5D000] font-bold text-[10px]">
            {loadingProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface SpaceSceneProps {
  embedded?: boolean;
  className?: string;
}

export const SpaceScene: React.FC<SpaceSceneProps> = ({
  embedded = true,
  className = 'w-full h-full',
}) => {
  const quality = useSimulationStore((state) => state.quality);
  const isLoaded = useSimulationStore((state) => state.isLoaded);
  const moonPositionRef = useRef(new THREE.Vector3(7.5, 0, 0));

  const config = PerformanceManager.getConfig(quality);

  return (
    <div className={`relative ${className} overflow-hidden bg-[#050505]`}>
      {!isLoaded && <LoadingPlaceholder />}

      <Canvas
        camera={{ position: [0, 3.5, 9.5], fov: 45, near: 0.1, far: 500 }}
        dpr={config.dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <LightingSystem />
          <StarField />
          <OrbitalSystem
            onMoonPositionUpdate={(pos) => {
              moonPositionRef.current.copy(pos);
            }}
          />
          <CameraController moonPositionRef={moonPositionRef} />
        </Suspense>
      </Canvas>

      <SimulationUI embedded={embedded} />
    </div>
  );
};
// --- End of SpaceScene.tsx ---
