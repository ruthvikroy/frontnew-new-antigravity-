/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unified Earth Moon orbital mechanics coordinator and elliptical path rendering
*/
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { Earth } from './Earth';
import { Moon, MoonHandle } from './Moon';

export const ORBIT_RADIUS = 7.5;
export const ORBIT_INCLINATION_RAD = (5.145 * Math.PI) / 180;

interface OrbitalSystemProps {
  onMoonPositionUpdate?: (pos: THREE.Vector3) => void;
}

export const OrbitalSystem: React.FC<OrbitalSystemProps> = ({ onMoonPositionUpdate }) => {
  const moonRef = useRef<MoonHandle>(null);
  const angleRef = useRef<number>(0);

  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const showOrbits = useSimulationStore((state) => state.showOrbits);
  const incrementEpoch = useSimulationStore((state) => state.incrementEpoch);

  const orbitLineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = ORBIT_RADIUS * Math.cos(theta);
      const z = ORBIT_RADIUS * Math.sin(theta) * Math.cos(ORBIT_INCLINATION_RAD);
      const y = ORBIT_RADIUS * Math.sin(theta) * Math.sin(ORBIT_INCLINATION_RAD);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const orbitMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xf5d000,
      transparent: true,
      opacity: 0.28,
      linewidth: 1,
    });
  }, []);

  useEffect(() => {
    return () => {
      orbitLineGeometry.dispose();
      orbitMaterial.dispose();
    };
  }, [orbitLineGeometry, orbitMaterial]);

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const dt = delta * orbitalSpeed;
    angleRef.current += dt * 0.12;
    incrementEpoch(dt);

    const x = ORBIT_RADIUS * Math.cos(angleRef.current);
    const z = ORBIT_RADIUS * Math.sin(angleRef.current) * Math.cos(ORBIT_INCLINATION_RAD);
    const y = ORBIT_RADIUS * Math.sin(angleRef.current) * Math.sin(ORBIT_INCLINATION_RAD);

    if (moonRef.current) {
      moonRef.current.setPosition(x, y, z);
      if (onMoonPositionUpdate) {
        onMoonPositionUpdate(moonRef.current.getPosition());
      }
    }
  });

  return (
    <group>
      <Earth />
      <Moon ref={moonRef} />
      {showOrbits && (
        <primitive object={new THREE.Line(orbitLineGeometry, orbitMaterial)} />
      )}
    </group>
  );
};
// --- End of OrbitalSystem.tsx ---
