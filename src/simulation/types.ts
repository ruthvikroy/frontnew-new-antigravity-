/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: TypeScript type definitions for unified Earth and Moon 3D orbital simulation
*/
export type QualityLevel = 'high' | 'medium' | 'low';
export type FocusTarget = 'system' | 'earth' | 'moon';

export interface CelestialCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface SimulationState {
  isPlaying: boolean;
  orbitalSpeed: number;
  focusTarget: FocusTarget;
  showOrbits: boolean;
  showAtmosphere: boolean;
  quality: QualityLevel;
  simulationEpoch: number;
  isExpanded: boolean;
  isLoaded: boolean;
  loadingProgress: number;
  activeHoverBody: string | null;
  togglePlay: () => void;
  setOrbitalSpeed: (speed: number) => void;
  setFocusTarget: (target: FocusTarget) => void;
  toggleOrbits: () => void;
  toggleAtmosphere: () => void;
  setQuality: (quality: QualityLevel) => void;
  resetSimulation: () => void;
  toggleExpanded: () => void;
  setIsLoaded: (loaded: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setActiveHoverBody: (body: string | null) => void;
  incrementEpoch: (deltaSeconds: number) => void;
}
// --- End of types.ts ---
