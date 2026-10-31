/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unified Earth Moon Mars orbital mechanics coordinator and elliptical path rendering
*/
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore';
import { Earth } from './Earth';
import { Moon, MoonHandle } from './Moon';
import { Mars, MarsHandle } from './Mars';

export const ORBIT_RADIUS = 7.5;
export const ORBIT_INCLINATION_RAD = (5.145 * Math.PI) / 180;
export const MARS_ORBIT_RADIUS = 13.5;
export const MARS_ORBIT_INCLINATION_RAD = (1.85 * Math.PI) / 180;

interface OrbitalSystemProps {
  onMoonPositionUpdate?: (pos: THREE.Vector3) => void;
  onMarsPositionUpdate?: (pos: THREE.Vector3) => void;
}

export const OrbitalSystem: React.FC<OrbitalSystemProps> = ({
  onMoonPositionUpdate,
  onMarsPositionUpdate,
}) => {
  const moonRef = useRef<MoonHandle>(null);
  const marsRef = useRef<MarsHandle>(null);
  const angleRef = useRef<number>(0);
  const marsAngleRef = useRef<number>(2.45);

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

  const marsOrbitLineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = MARS_ORBIT_RADIUS * Math.cos(theta);
      const z = MARS_ORBIT_RADIUS * Math.sin(theta) * Math.cos(MARS_ORBIT_INCLINATION_RAD);
      const y = MARS_ORBIT_RADIUS * Math.sin(theta) * Math.sin(MARS_ORBIT_INCLINATION_RAD);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const marsOrbitMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.32,
      linewidth: 1,
    });
  }, []);

  useEffect(() => {
    return () => {
      orbitLineGeometry.dispose();
      orbitMaterial.dispose();
      marsOrbitLineGeometry.dispose();
      marsOrbitMaterial.dispose();
    };
  }, [orbitLineGeometry, orbitMaterial, marsOrbitLineGeometry, marsOrbitMaterial]);

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const dt = delta * orbitalSpeed;
    angleRef.current += dt * 0.12;
    marsAngleRef.current += dt * 0.055;
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

    const mx = MARS_ORBIT_RADIUS * Math.cos(marsAngleRef.current);
    const mz = MARS_ORBIT_RADIUS * Math.sin(marsAngleRef.current) * Math.cos(MARS_ORBIT_INCLINATION_RAD);
    const my = MARS_ORBIT_RADIUS * Math.sin(marsAngleRef.current) * Math.sin(MARS_ORBIT_INCLINATION_RAD);

    if (marsRef.current) {
      marsRef.current.setPosition(mx, my, mz);
      if (onMarsPositionUpdate) {
        onMarsPositionUpdate(marsRef.current.getPosition());
      }
    }
  });

  return (
    <group>
      <Earth />
      <Moon ref={moonRef} />
      <Mars ref={marsRef} />
      {showOrbits && (
        <>
          <primitive object={new THREE.Line(orbitLineGeometry, orbitMaterial)} />
          <primitive object={new THREE.Line(marsOrbitLineGeometry, marsOrbitMaterial)} />
        </>
      )}
    </group>
  );
};
// --- End of OrbitalSystem.tsx ---
