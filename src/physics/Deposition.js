export function shouldDeposit(altitudeM, terrainElevationM) {
  return altitudeM <= terrainElevationM;
}

export function wetRemovalFraction(precipitationMmH, dtSeconds, scavengingCoefficient = 0.02) {
  // Placeholder parameterization. Replace with a literature-selected
  // scavenging law before scientific validation.
  const rate = scavengingCoefficient * Math.max(0, precipitationMmH);
  return 1 - Math.exp(-rate * dtSeconds / 3600);
}
