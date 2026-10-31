/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Zustand state store for real-time Earth and Moon orbital simulation
*/
import { create } from 'zustand';
import { SimulationState, QualityLevel, FocusTarget } from './types';

export const useSimulationStore = create<SimulationState>((set) => ({
  isPlaying: true,
  orbitalSpeed: 1.0,
  focusTarget: 'system',
  showOrbits: true,
  showAtmosphere: true,
  quality: 'high',
  simulationEpoch: 0,
  isExpanded: false,
  isLoaded: false,
  loadingProgress: 0,
  activeHoverBody: null,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setOrbitalSpeed: (speed: number) => set({ orbitalSpeed: Math.max(0.1, Math.min(10.0, speed)) }),
  setFocusTarget: (target: FocusTarget) => set({ focusTarget: target }),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleAtmosphere: () => set((state) => ({ showAtmosphere: !state.showAtmosphere })),
  setQuality: (quality: QualityLevel) => set({ quality }),
  resetSimulation: () => set({
    simulationEpoch: 0,
    focusTarget: 'system',
    isPlaying: true,
    orbitalSpeed: 1.0,
  }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setIsLoaded: (loaded: boolean) => set({ isLoaded: loaded }),
  setLoadingProgress: (progress: number) => set({ loadingProgress: Math.min(100, progress) }),
  setActiveHoverBody: (body: string | null) => set({ activeHoverBody: body }),
  incrementEpoch: (deltaSeconds: number) => set((state) => ({
    simulationEpoch: state.simulationEpoch + deltaSeconds,
  })),
}));
// --- End of simulationStore.ts ---
