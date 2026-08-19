// Random-walk prototype.
// Production model should derive K_h/K_v from an explicit turbulence
// parameterization rather than treating this as a fitted visual effect.

export function randomWalkMeters(diffusivityM2S, dtS) {
  const sigma = Math.sqrt(Math.max(0, 2 * diffusivityM2S * dtS));
  return {
    east: gaussian() * sigma,
    north: gaussian() * sigma,
    vertical: gaussian() * sigma
  };
}

function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
