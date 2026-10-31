/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Smooth camera controller with target interpolation and orbit constraints
*/
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';

interface CameraControllerProps {
  moonPositionRef: React.MutableRefObject<THREE.Vector3>;
}

export const CameraController: React.FC<CameraControllerProps> = ({ moonPositionRef }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const focusTarget = useSimulationStore((state) => state.focusTarget);
  const currentTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamOffset = useRef(new THREE.Vector3(0, 3.5, 9.5));

  useEffect(() => {
    if (focusTarget === 'earth') {
      desiredCamOffset.current.set(0, 0.8, 3.2);
    } else if (focusTarget === 'moon') {
      desiredCamOffset.current.set(0, 0.35, 1.35);
    } else {
      desiredCamOffset.current.set(0, 4.0, 11.5);
    }
  }, [focusTarget]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    let targetDest = new THREE.Vector3(0, 0, 0);
    if (focusTarget === 'moon') {
      targetDest.copy(moonPositionRef.current);
    }

    currentTargetPos.current.lerp(targetDest, delta * 3.5);
    controlsRef.current.target.copy(currentTargetPos.current);

    const lerpSpeed = Math.min(1.0, delta * 2.5);
    const idealCamPos = currentTargetPos.current.clone().add(desiredCamOffset.current);
    camera.position.lerp(idealCamPos, lerpSpeed * 0.4);

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.4}
      maxDistance={24.0}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      panSpeed={0.5}
      enablePan={false}
    />
  );
};
// --- End of CameraController.tsx ---
