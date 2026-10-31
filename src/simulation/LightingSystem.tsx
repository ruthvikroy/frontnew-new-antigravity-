/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Cinematic directional solar lighting system and subtle deep space bounce
*/
import React, { useRef } from 'react';
import * as THREE from 'three';

export const SUN_DIRECTION = new THREE.Vector3(1, 0, 0).normalize();

export const LightingSystem: React.FC = () => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        position={[30, 2, 5]}
        intensity={2.4}
        color={0xfffaed}
        castShadow={false}
      />
      <ambientLight intensity={0.04} color={0x141824} />
      <directionalLight
        position={[-30, -5, -10]}
        intensity={0.02}
        color={0x0b1020}
      />
    </>
  );
};
// --- End of LightingSystem.tsx ---
