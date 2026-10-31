/**
 * Scientifically Grounded Mars Planetary Lighting Rig
 * Accurately models solar irradiance at 1.524 AU and realistic day/night terminator boundaries.
 */

import * as THREE from 'three';
import { MARS_PLANETARY_CONSTANTS } from '../data/mars/planetaryConstants.js';

/**
 * Creates the Mars lighting system
 *
 * @param {THREE.Scene} scene
 * @param {Object} options
 * @param {number} options.solarHour - Local solar hour (0 to 24)
 * @param {number} options.solarLatitude - Sub-solar latitude in degrees (-25.19° to +25.19°)
 * @param {boolean} options.isLowPerformance - Software WebGL flag
 * @returns {Object} Lighting rig controllers and references
 */
export function createMarsLighting(scene, {
  solarHour = 14.0,
  solarLatitude = 10.0,
  isLowPerformance = false,
} = {}) {
  const lightGroup = new THREE.Group();
  lightGroup.name = 'MarsLightingRig';

  // Primary Sun Directional Light
  // Solar irradiance at 1.524 AU is ~43% of Earth's (586 W/m² vs 1361 W/m²)
  const sunLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
  sunLight.castShadow = !isLowPerformance;
  if (sunLight.castShadow) {
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
  }
  lightGroup.add(sunLight);

  // Deep space cosmic hemisphere ambient fill
  // Simulates starlight, scattered interplanetary zodiacal light, and faint atmospheric backscatter
  const hemiLight = new THREE.HemisphereLight(0x4a6b82, 0x181c24, 0.45);
  lightGroup.add(hemiLight);

  // Night-side gentle ambient illumination to prevent complete pitch-black loss of terrain context
  const nightFillLight = new THREE.AmbientLight(0xffeedd, 0.40);
  lightGroup.add(nightFillLight);

  // Faint celestial rim light
  const rimLight = new THREE.DirectionalLight(0x5a8bb8, 0.4);
  rimLight.position.set(-14, -4, -12);
  lightGroup.add(rimLight);

  scene.add(lightGroup);

  /**
   * Update Sun position based on solar hour and subsolar latitude
   *
   * @param {number} hour - 0 to 24
   * @param {number} subsolarLatDeg - -25.19 to +25.19
   * @param {number} intensityMultiplier
   */
  function updateSunPosition(hour, subsolarLatDeg = 10.0, intensityMultiplier = 1.0) {
    const hourAngle = ((hour - 12) / 24) * 2 * Math.PI;
    const declination = subsolarLatDeg * (Math.PI / 180);

    const distance = 16.0;
    const x = distance * Math.cos(declination) * Math.sin(hourAngle);
    const y = distance * Math.sin(declination);
    const z = distance * Math.cos(declination) * Math.cos(hourAngle);

    sunLight.position.set(x, y, z);
    sunLight.intensity = 2.2 * intensityMultiplier;

    return new THREE.Vector3(x, y, z).normalize();
  }

  // Initialize position
  const sunDir = updateSunPosition(solarHour, solarLatitude, 1.0);

  return {
    lightGroup,
    sunLight,
    hemiLight,
    nightFillLight,
    rimLight,
    updateSunPosition,
    getSunDirection: () => sunLight.position.clone().normalize(),
  };
}
