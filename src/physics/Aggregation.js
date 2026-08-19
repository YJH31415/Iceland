/*
  Population aggregation skeleton.

  n_i is number concentration of size class i.
  dn_i/dt = gain from smaller collisions - loss from collisions.

  This prototype only exposes the collision kernel API.
  A production implementation should add Brownian, shear and
  differential-settling kernels and a literature-derived sticking
  efficiency alpha_ij.
*/

export function collisionKernel(i, j, particles, settlingI, settlingJ, shearRate = 0) {
  const d1 = particles[i].diameterM;
  const d2 = particles[j].diameterM;
  const relativeSettling = Math.abs(settlingI - settlingJ);
  const geometric = Math.PI * Math.pow((d1 + d2) / 2, 2);
  return geometric * (relativeSettling + shearRate * (d1 + d2));
}

export function aggregationRate(Kij, ni, nj, stickingEfficiency = 1) {
  return stickingEfficiency * Kij * ni * nj;
}
