import { moveByENU } from "../geo/Geo.js";
import { settlingVelocity } from "./Settling.js";
import { randomWalkMeters } from "./Turbulence.js";
import { shouldDeposit } from "./Deposition.js";

export class Simulator {
  constructor({ weather, terrain, particles, config }) {
    this.weather = weather;
    this.terrain = terrain;
    this.particles = particles;
    this.config = structuredClone(config);
    this.timeSeconds = 0;
    this.running = false;
    this.locked = false;
  }

  start() {
    this.locked = true;
    this.running = true;
  }

  pause() {
    this.running = false;
  }

  reset(particles) {
    this.running = false;
    this.locked = false;
    this.timeSeconds = 0;
    this.particles = particles;
  }

  step(dtSeconds) {
    if (!this.running) return;
    const cfg = this.config;

    for (const p of this.particles) {
      if (!p.active) continue;

      const a = this.weather.sample(p.lat, p.lon, p.altitudeM, this.timeSeconds);

      // Horizontal advection.
      const east = a.u * dtSeconds;
      const north = a.v * dtSeconds;

      // Vertical atmospheric motion + gravitational settling.
      const settling = settlingVelocity(
        p.diameterM,
        p.densityKgM3,
        a.pressure,
        a.temperature
      );
      const vertical = (a.w - settling) * dtSeconds;

      // Turbulent random walk.
      const rw = randomWalkMeters(cfg.horizontalDiffusivity, dtSeconds);

      const pos = moveByENU(
        p.lat,
        p.lon,
        east + rw.east,
        north + rw.north
      );

      p.lat = pos.lat;
      p.lon = pos.lon;
      p.altitudeM += vertical + rw.vertical;

      const terrainM = this.terrain.elevation(p.lat, p.lon);
      if (shouldDeposit(p.altitudeM, terrainM)) {
        p.altitudeM = terrainM;
        p.active = false;
      }
    }

    this.timeSeconds += dtSeconds;
  }
}
