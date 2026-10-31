/**
 * Calculates the temperature swing (max - min) in degrees Celsius.
 */
export function getTempSwing(min, max) {
  return Math.abs(max - min);
}

/**
 * Computes comparative ratio between Earth and Moon values.
 */
export function calculateRatio(earthVal, moonVal) {
  if (moonVal === 0) return 0;
  return Number((earthVal / moonVal).toFixed(2));
}

/**
 * Calculates percentage difference between Earth and Moon metrics.
 */
export function calculateMetricDiff(earthVal, moonVal) {
  const delta = earthVal - moonVal;
  const denominator = Math.max(Math.abs(earthVal), Math.abs(moonVal), 0.0001);
  const percentageDiff = Number(((Math.abs(delta) / denominator) * 100).toFixed(1));
  return {
    delta: Number(delta.toFixed(2)),
    percentageDiff,
    earthLarger: earthVal > moonVal,
  };
}

/**
 * Computes equivalent weight on Moon given Earth weight in kg.
 */
export function calculateLunarWeight(earthWeightKg) {
  if (!earthWeightKg || isNaN(earthWeightKg) || earthWeightKg <= 0) return 0;
  return Number((earthWeightKg * (1.62 / 9.81)).toFixed(1));
}

/**
 * Computes jump height multiplier in lunar gravity.
 */
export function calculateLunarJumpHeight(earthJumpCm) {
  if (!earthJumpCm || isNaN(earthJumpCm) || earthJumpCm <= 0) return 0;
  return Number((earthJumpCm * (9.81 / 1.62)).toFixed(1));
}

/**
 * Filters location pairs by category and case-insensitive search term.
 */
export function filterLocationPairs(pairs, category, searchQuery) {
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();
  return pairs.filter((pair) => {
    const matchesCategory = category === 'all' || pair.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      pair.title.toLowerCase().includes(normalizedQuery) ||
      pair.thematicParallels.toLowerCase().includes(normalizedQuery) ||
      pair.earth.name.toLowerCase().includes(normalizedQuery) ||
      pair.earth.region.toLowerCase().includes(normalizedQuery) ||
      pair.moon.name.toLowerCase().includes(normalizedQuery) ||
      pair.moon.region.toLowerCase().includes(normalizedQuery) ||
      pair.earth.terrainType.toLowerCase().includes(normalizedQuery) ||
      pair.moon.terrainType.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Sorts location pairs according to the chosen criterion and direction.
 */
export function sortLocationPairs(pairs, criterion, direction = 'desc') {
  const sorted = [...pairs].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    switch (criterion) {
      case 'elevation':
        valA = Math.abs(a.earth.metrics.elevationMeters - a.moon.metrics.elevationMeters);
        valB = Math.abs(b.earth.metrics.elevationMeters - b.moon.metrics.elevationMeters);
        break;
      case 'temperature-swing':
        valA = getTempSwing(a.moon.metrics.tempMinCelsius, a.moon.metrics.tempMaxCelsius);
        valB = getTempSwing(b.moon.metrics.tempMinCelsius, b.moon.metrics.tempMaxCelsius);
        break;
      case 'latitude':
        valA = Math.abs(a.earth.latitude);
        valB = Math.abs(b.earth.latitude);
        break;
      case 'gravity-ratio':
        valA = a.earth.metrics.gravityMps2 / a.moon.metrics.gravityMps2;
        valB = b.earth.metrics.gravityMps2 / b.moon.metrics.gravityMps2;
        break;
      case 'name':
        return direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      default:
        valA = 0;
        valB = 0;
    }
    if (direction === 'asc') {
      return valA - valB;
    }
    return valB - valA;
  });
  return sorted;
}

/**
 * Format coordinates for clean astronomical display.
 */
export function formatCoordinates(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
}
