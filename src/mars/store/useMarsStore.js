import { create } from 'zustand';
import { MARS_LOCATIONS } from '../data/locations/locations.js';
import { MARS_TELEMETRY } from '../data/mars/telemetry.js';

const DEFAULT_ATMOSPHERE = {
  pressureMbar: 6.10,
  temperatureKelvin: 210,
  co2Concentration: 95.32,
  dustOpticalDepth: 0.15,
  windSpeedMs: 5.0,
  altitudeKm: 0,
};

export const useMarsStore = create((set) => ({
  activePage: 'simulation',
  unitSystem: 'metric',
  selectedLocation: MARS_LOCATIONS[0],
  selectedMetricId: MARS_TELEMETRY[0].id,
  isRotating: true,
  rotationSpeed: 0.8,
  lightIntensity: 1.25,
  showAtmosphere: true,
  showTexture: true,
  showStars: true,
  surfaceLayer: 'natural', // 'natural' | 'mola' | 'shaded_relief'
  elevationExaggeration: 1.0, // 1.0 (true scale), 3.0 (enhanced), 6.0 (geomorphology)
  isOblate: true,
  cameraResetNonce: 0,
  flyToLocation: null,

  atmosphere: { ...DEFAULT_ATMOSPHERE },
  selectedScenarioId: 'clear_nominal',

  solarTime: {
    isPlaying: true,
    speedMultiplier: 60, // 1 real sec = 1 simulated min
    localSolarHour: 14.2, // ~14:12 local afternoon
    solarLongitudeLs: 71.0, // Northern summer
    referenceLongitude: 0.0,
  },

  selectedComparisonId: 'radius',

  setActivePage: (activePage) => set({ activePage }),
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setSelectedMetricId: (selectedMetricId) => set({ selectedMetricId }),
  setIsRotating: (isRotating) => set({ isRotating }),
  setRotationSpeed: (rotationSpeed) => set({ rotationSpeed }),
  setLightIntensity: (lightIntensity) => set({ lightIntensity }),
  setShowAtmosphere: (showAtmosphere) => set({ showAtmosphere }),
  setShowTexture: (showTexture) => set({ showTexture }),
  setShowStars: (showStars) => set({ showStars }),
  setSurfaceLayer: (surfaceLayer) => set({ surfaceLayer }),
  setElevationExaggeration: (elevationExaggeration) => set({ elevationExaggeration }),
  setIsOblate: (isOblate) => set({ isOblate }),
  triggerCameraReset: () => set((state) => ({ cameraResetNonce: state.cameraResetNonce + 1 })),
  triggerFlyToLocation: (loc) => set({ selectedLocation: loc, flyToLocation: loc }),

  setAtmosphereParam: (key, value) =>
    set((state) => ({
      atmosphere: { ...state.atmosphere, [key]: value },
    })),

  resetAtmosphereToReference: () =>
    set({
      atmosphere: { ...DEFAULT_ATMOSPHERE },
      selectedScenarioId: 'clear_nominal',
    }),

  setScenario: (scenarioId) => {
    let opticalDepth = 0.15;
    let wind = 5;
    if (scenarioId === 'local_dust_devils') {
      opticalDepth = 0.45;
      wind = 12;
    } else if (scenarioId === 'regional_storm') {
      opticalDepth = 1.25;
      wind = 22;
    } else if (scenarioId === 'global_storm') {
      opticalDepth = 3.80;
      wind = 32;
    } else if (scenarioId === 'aphelion_cloud_belt') {
      opticalDepth = 0.28;
      wind = 7;
    }
    set((state) => ({
      selectedScenarioId: scenarioId,
      atmosphere: {
        ...state.atmosphere,
        dustOpticalDepth: opticalDepth,
        windSpeedMs: wind,
      },
    }));
  },

  setSolarTimePlaying: (isPlaying) =>
    set((state) => ({ solarTime: { ...state.solarTime, isPlaying } })),

  setSolarTimeSpeed: (speedMultiplier) =>
    set((state) => ({ solarTime: { ...state.solarTime, speedMultiplier } })),

  setLocalSolarHour: (localSolarHour) =>
    set((state) => ({ solarTime: { ...state.solarTime, localSolarHour: (localSolarHour + 24) % 24 } })),

  setSolarLongitudeLs: (solarLongitudeLs) =>
    set((state) => ({ solarTime: { ...state.solarTime, solarLongitudeLs: (solarLongitudeLs + 360) % 360 } })),

  setReferenceLongitude: (referenceLongitude) =>
    set((state) => ({ solarTime: { ...state.solarTime, referenceLongitude } })),

  advanceSolarTime: (deltaSeconds) =>
    set((state) => {
      if (!state.solarTime.isPlaying) return state;
      const deltaSolarHours = (deltaSeconds * state.solarTime.speedMultiplier) / 3698.9685;
      const nextHour = (state.solarTime.localSolarHour + deltaSolarHours) % 24;

      const deltaLs = (deltaSolarHours / 24 / 668.6) * 360;
      const nextLs = (state.solarTime.solarLongitudeLs + deltaLs) % 360;

      return {
        solarTime: {
          ...state.solarTime,
          localSolarHour: nextHour,
          solarLongitudeLs: nextLs,
        },
      };
    }),

  setSelectedComparisonId: (selectedComparisonId) => set({ selectedComparisonId }),
}));
