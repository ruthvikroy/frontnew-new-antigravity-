/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Adaptive graphics tier detection and geometry subdivision manager
*/
import { QualityLevel } from './types';

export interface PerformanceConfig {
  dpr: [number, number];
  earthSegments: number;
  moonSegments: number;
  starCount: number;
  enableClouds: boolean;
  enableAtmosphereGlow: boolean;
}

export class PerformanceManager {
  public static detectRecommendedQuality(): QualityLevel {
    if (typeof window === 'undefined') return 'high';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return 'low';
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;

    if (isMobile || cores <= 4 || memory <= 4) {
      return 'medium';
    }

    return 'high';
  }

  public static getConfig(quality: QualityLevel): PerformanceConfig {
    switch (quality) {
      case 'low':
        return {
          dpr: [1, 1],
          earthSegments: 32,
          moonSegments: 24,
          starCount: 600,
          enableClouds: false,
          enableAtmosphereGlow: false,
        };
      case 'medium':
        return {
          dpr: [1, 1.5],
          earthSegments: 48,
          moonSegments: 36,
          starCount: 1200,
          enableClouds: true,
          enableAtmosphereGlow: true,
        };
      case 'high':
      default:
        return {
          dpr: [1, 2],
          earthSegments: 64,
          moonSegments: 48,
          starCount: 2200,
          enableClouds: true,
          enableAtmosphereGlow: true,
        };
    }
  }
}
// --- End of PerformanceManager.ts ---
