/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Dynamic game-like camera flight controller with WASD thrusters, warp boost, target tracking, and orbit constraints for Earth, Moon, and Mars
*/
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { FocusTarget } from './types';

interface CameraControllerProps {
  moonPositionRef: React.MutableRefObject<THREE.Vector3>;
  marsPositionRef: React.MutableRefObject<THREE.Vector3>;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  moonPositionRef,
  marsPositionRef,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const focusTarget = useSimulationStore((state) => state.focusTarget);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const togglePlay = useSimulationStore((state) => state.togglePlay);
  const setIsWarping = useSimulationStore((state) => state.setIsWarping);
  const setFlightVelocity = useSimulationStore((state) => state.setFlightVelocity);

  const currentTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamOffset = useRef(new THREE.Vector3(0, 4.5, 14.5));
  const manualOffset = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  // Active keyboard state
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (focusTarget === 'earth') {
      desiredCamOffset.current.set(0, 0.8, 3.2);
    } else if (focusTarget === 'moon') {
      desiredCamOffset.current.set(0, 0.35, 1.35);
    } else if (focusTarget === 'mars') {
      desiredCamOffset.current.set(0, 0.55, 2.1);
    } else {
      desiredCamOffset.current.set(0, 5.0, 16.5);
    }
    // Smooth reset manual offset on target switch
    manualOffset.current.set(0, 0, 0);
  }, [focusTarget]);

  // Global keydown / keyup handlers for dynamic game flight
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      keys.current[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'Digit1') {
        setFocusTarget('system');
      } else if (e.code === 'Digit2') {
        setFocusTarget('earth');
      } else if (e.code === 'Digit3') {
        setFocusTarget('moon');
      } else if (e.code === 'Digit4') {
        setFocusTarget('mars');
      } else if (e.code === 'KeyR') {
        manualOffset.current.set(0, 0, 0);
        velocity.current.set(0, 0, 0);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [setFocusTarget, togglePlay]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Check Warp speed
    const isShift = !!(keys.current['ShiftLeft'] || keys.current['ShiftRight']);
    setIsWarping(isShift);

    const accel = isShift ? 18.0 : 6.0;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // Flight Thrusters (WASD / QE)
    const moveInput = new THREE.Vector3(0, 0, 0);
    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveInput.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveInput.sub(forward);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveInput.add(right);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveInput.sub(right);
    if (keys.current['KeyE']) moveInput.y += 1;
    if (keys.current['KeyQ']) moveInput.y -= 1;

    if (moveInput.lengthSq() > 0) {
      moveInput.normalize();
      velocity.current.addScaledVector(moveInput, accel * delta);
    }

    // Apply inertia damping
    const damping = Math.pow(0.85, delta * 60);
    velocity.current.multiplyScalar(damping);
    manualOffset.current.addScaledVector(velocity.current, delta);

    // Dynamic flight speed readout
    const currentSpeed = (29.78 + velocity.current.length() * (isShift ? 45.0 : 12.0)).toFixed(2);
    setFlightVelocity(parseFloat(currentSpeed));

    // Dynamic camera target
    let targetDest = new THREE.Vector3(0, 0, 0);
    if (focusTarget === 'moon') {
      targetDest.copy(moonPositionRef.current);
    } else if (focusTarget === 'mars') {
      targetDest.copy(marsPositionRef.current);
    }

    currentTargetPos.current.lerp(targetDest, delta * 3.5);
    controlsRef.current.target.copy(currentTargetPos.current);

    const lerpSpeed = Math.min(1.0, delta * 2.5);
    const idealCamPos = currentTargetPos.current
      .clone()
      .add(desiredCamOffset.current)
      .add(manualOffset.current);

    camera.position.lerp(idealCamPos, lerpSpeed * 0.4);

    // Warp camera FOV kick
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isShift ? 52 : 42;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 4);
      camera.updateProjectionMatrix();
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.8}
      maxDistance={45.0}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      panSpeed={0.5}
      enablePan={false}
    />
  );
};

// --- End of CameraController.tsx ---
