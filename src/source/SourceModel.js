import { Particle } from "../physics/Particle.js";

export const VOLCANO = {
  lat: 63.6333,
  lon: -19.6167,
  ventElevationM: 1666
};

export function createParticles({
  count,
  eruptionHeightKm,
  diameterUm = 8,
  densityKgM3 = 2750,
  totalMassKg = 1e9
}) {
  const particles = [];
  const altitudeM = VOLCANO.ventElevationM + eruptionHeightKm * 1000;
  const massEach = totalMassKg / count;

  for (let i = 0; i < count; i++) {
    // Small Gaussian-ish horizontal source footprint.
    const angle = Math.random() * Math.PI * 2;
    const radiusM = Math.sqrt(Math.random()) * 250;
    const latOffset = (radiusM * Math.cos(angle)) / 111320;
    const lonOffset = (radiusM * Math.sin(angle)) / (111320 * Math.cos(VOLCANO.lat * Math.PI / 180));

    particles.push(new Particle({
      lat: VOLCANO.lat + latOffset,
      lon: VOLCANO.lon + lonOffset,
      altitudeM,
      diameterM: diameterUm * 1e-6,
      densityKgM3,
      massKg: massEach
    }));
  }
  return particles;
}
