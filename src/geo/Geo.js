// Spherical Earth utilities.
// We keep physical coordinates in lon/lat/radians and only use MapLibre for display.

export const EARTH_RADIUS_M = 6371008.8;

export function metersPerDegreeLat() {
  return Math.PI * EARTH_RADIUS_M / 180;
}

export function metersPerDegreeLon(latDeg) {
  return Math.PI * EARTH_RADIUS_M * Math.cos(latDeg * Math.PI / 180) / 180;
}

export function moveByENU(latDeg, lonDeg, eastM, northM) {
  const lat = latDeg * Math.PI / 180;
  let newLat = latDeg + northM / metersPerDegreeLat();
  let newLon = lonDeg + eastM / Math.max(1e-9, metersPerDegreeLon(latDeg));
  if (newLat > 90) newLat = 180 - newLat;
  if (newLat < -90) newLat = -180 - newLat;
  newLon = ((newLon + 180) % 360 + 360) % 360 - 180;
  return { lat: newLat, lon: newLon };
}
