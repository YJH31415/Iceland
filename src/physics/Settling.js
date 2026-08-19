// Terminal settling velocity.
// Uses Stokes law for very small particles and a drag iteration otherwise.
// Cunningham slip correction is included for fine particles.

const G = 9.80665;
const R_AIR = 287.05;

export function airDensity(pressurePa, temperatureK) {
  return pressurePa / (R_AIR * temperatureK);
}

export function dynamicViscosity(temperatureK) {
  // Sutherland approximation for dry air.
  const T0 = 273.15;
  const mu0 = 1.716e-5;
  const S = 110.4;
  return mu0 * Math.pow(temperatureK / T0, 1.5) * (T0 + S) / (temperatureK + S);
}

export function settlingVelocity(diameterM, particleDensity, pressurePa, temperatureK) {
  const rhoA = airDensity(pressurePa, temperatureK);
  const mu = dynamicViscosity(temperatureK);
  const meanFreePath = 6.6e-8 * (101325 / Math.max(1, pressurePa)) * (temperatureK / 273.15);
  const Kn = 2 * meanFreePath / diameterM;
  const Cc = 1 + Kn * (1.257 + 0.4 * Math.exp(-1.1 / Math.max(Kn, 1e-12)));

  // Stokes estimate.
  let vt = particleDensity * G * diameterM * diameterM * Cc / (18 * mu);

  // Iterate with a spherical drag coefficient correlation.
  for (let n = 0; n < 12; n++) {
    const Re = rhoA * Math.abs(vt) * diameterM / mu;
    let Cd;
    if (Re < 1000) Cd = 24 / Math.max(Re, 1e-9) * (1 + 0.15 * Math.pow(Math.max(Re, 1e-9), 0.687));
    else Cd = 0.44;

    const forceFactor = 4 * particleDensity * G * diameterM / (3 * rhoA * Cd);
    vt = Math.sqrt(Math.max(0, forceFactor));
    vt *= Math.sqrt(Cc);
  }

  return Math.max(0, vt);
}
