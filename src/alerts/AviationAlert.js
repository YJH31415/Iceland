/*
  Research/education alert layer.
  These are configurable simulation thresholds, NOT operational aviation rules.
*/

export const LEVELS = [
  { name: "LOW", min: 0, className: "alert-low" },
  { name: "MODERATE", min: 0.5, className: "alert-moderate" },
  { name: "HIGH", min: 2.0, className: "alert-high" },
  { name: "EXTREME", min: 4.0, className: "alert-extreme" }
];

export function classifyConcentration(mgM3) {
  let selected = LEVELS[0];
  for (const level of LEVELS) {
    if (mgM3 >= level.min) selected = level;
  }
  return selected;
}

export const AIRPORT_REGIONS = {
  London: { lat: 51.5074, lon: -0.1278 },
  Paris: { lat: 48.8566, lon: 2.3522 },
  Frankfurt: { lat: 50.1109, lon: 8.6821 }
};
