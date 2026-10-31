/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: High-performance instanced background starfield and subtle deep space dust
*/
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { PerformanceManager } from './PerformanceManager';

export const StarField: React.FC = () => {
  const quality = useSimulationStore((state) => state.quality);
  const config = PerformanceManager.getConfig(quality);

  const [positions, colors, sizes] = useMemo(() => {
    const count = config.starCount;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const tempColor = new THREE.Color();
    const starPalette = [0xffffff, 0xd8e8ff, 0xfff2d4, 0xb8d4ff, 0xffe6c7];

    for (let i = 0; i < count; i++) {
      const radius = 120 + Math.random() * 80;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const hex = starPalette[Math.floor(Math.random() * starPalette.length)];
      tempColor.setHex(hex);
      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      sz[i] = 1.0 + Math.random() * 2.2;
    }

    return [pos, col, sz];
  }, [config.starCount]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        vertexColors
        transparent
        opacity={0.88}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
// --- End of StarField.tsx ---
