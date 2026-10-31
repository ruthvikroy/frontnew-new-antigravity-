import {
  LUNAR_LANDMARKS,
  APOLLO_LANDING_SITES,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  ALL_LUNAR_LOCATIONS,
  LUNAR_LOCATIONS_MAP,
} from '../data/lunarLandmarks.js';

export {
  LUNAR_LANDMARKS,
  APOLLO_LANDING_SITES,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  ALL_LUNAR_LOCATIONS,
  LUNAR_LOCATIONS_MAP,
};

export const LUNAR_AXIAL_TILT_RAD = (1.5424 * Math.PI) / 180; // 1.54° axial tilt relative to ecliptic

/**
 * Calculates current lunar rotation angle around polar axis in radians.
 */
export function calculateAxialRotation(
  elapsedSeconds,
  speedMultiplier = 1.0,
  basePeriodSeconds = 120
) {
  if (basePeriodSeconds <= 0) return 0;
  const angularVelocity = (2 * Math.PI) / basePeriodSeconds;
  return (elapsedSeconds * speedMultiplier * angularVelocity) % (2 * Math.PI);
}

/**
 * Calculate the sub-solar point in selenographic coordinates (lon, lat in degrees)
 */
export function calculateSubsolarPoint(sunAngleRad, moonRotationRad) {
  const relAngle = sunAngleRad - moonRotationRad;
  let lonDeg = (relAngle * 180) / Math.PI;
  lonDeg = ((lonDeg + 180) % 360) - 180;
  if (lonDeg < -180) lonDeg += 360;
  const latDeg = ((LUNAR_AXIAL_TILT_RAD * 180) / Math.PI) * Math.sin(sunAngleRad);
  return {
    longitudeDeg: Number(lonDeg.toFixed(2)),
    latitudeDeg: Number(latDeg.toFixed(2)),
  };
}

/**
 * Converts selenographic latitude & longitude (degrees) to 3D Cartesian coordinates on a sphere of radius R.
 */
export function selenographicToCartesian(latDeg, lonDeg, radius = 3.0) {
  const latRad = (latDeg * Math.PI) / 180;
  const lonRad = (lonDeg * Math.PI) / 180;
  const y = radius * Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const x = radius * cosLat * Math.sin(lonRad);
  const z = radius * cosLat * Math.cos(lonRad);
  return { x, y, z };
}

/**
 * Computes lunar phase appearance based on angle between Sun vector and Observer vector.
 */
export function calculateLunarPhase(sunAngleRad, observerAngleRad) {
  let angle = Math.abs(sunAngleRad - observerAngleRad) % (2 * Math.PI);
  if (angle > Math.PI) {
    angle = 2 * Math.PI - angle;
  }
  const phaseAngleDeg = (angle * 180) / Math.PI;
  const illuminationFraction = (1 + Math.cos(angle)) / 2;

  let phaseName = 'Full Moon';
  if (illuminationFraction < 0.03) {
    phaseName = 'New Moon';
  } else if (illuminationFraction < 0.47) {
    phaseName = sunAngleRad - observerAngleRad > 0 ? 'Waxing Crescent' : 'Waning Crescent';
  } else if (illuminationFraction <= 0.53) {
    phaseName = sunAngleRad - observerAngleRad > 0 ? 'First Quarter' : 'Last Quarter';
  } else if (illuminationFraction < 0.97) {
    phaseName = sunAngleRad - observerAngleRad > 0 ? 'Waxing Gibbous' : 'Waning Gibbous';
  }

  return {
    phaseName,
    illuminationFraction: Number(illuminationFraction.toFixed(3)),
    phaseAngleDeg: Number(phaseAngleDeg.toFixed(1)),
  };
}

/**
 * Calculates 3D orbital position from simplified Keplerian orbital elements at time t.
 */
export function calculateOrbitalPosition(orbit, timeSeconds) {
  const M = orbit.meanMotion * timeSeconds;
  const E = M + orbit.eccentricity * Math.sin(M);
  const v =
    2 *
    Math.atan2(
      Math.sqrt(1 + orbit.eccentricity) * Math.sin(E / 2),
      Math.sqrt(1 - orbit.eccentricity) * Math.cos(E / 2)
    );
  const r = orbit.semiMajorAxis * (1 - orbit.eccentricity * Math.cos(E));
  const u = v + orbit.argumentOfPeriapsisRad;
  const xOrb = r * Math.cos(u);
  const yOrb = r * Math.sin(u);
  const cosNode = Math.cos(orbit.longitudeOfAscendingNodeRad);
  const sinNode = Math.sin(orbit.longitudeOfAscendingNodeRad);
  const cosInc = Math.cos(orbit.inclinationRad);
  const sinInc = Math.sin(orbit.inclinationRad);
  const x = xOrb * cosNode - yOrb * sinNode * cosInc;
  const y = yOrb * sinInc;
  const z = xOrb * sinNode + yOrb * cosNode * cosInc;
  return { x, y, z };
}

/**
 * Tumbles a space rock across 3 axes based on its chaotic angular velocity vector.
 */
export function calculateTumble(currentRot, angularVelocity, dt) {
  const TWO_PI = Math.PI * 2;
  return {
    x: (currentRot.x + angularVelocity.x * dt) % TWO_PI,
    y: (currentRot.y + angularVelocity.y * dt) % TWO_PI,
    z: (currentRot.z + angularVelocity.z * dt) % TWO_PI,
  };
}

/**
 * Formats time or period for telemetry display.
 */
export function formatTelemetryTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
}
