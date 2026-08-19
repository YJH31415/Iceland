export class ConcentrationGrid {
  constructor({ minLat, maxLat, minLon, maxLon, cellDeg = 0.5 }) {
    this.minLat = minLat;
    this.maxLat = maxLat;
    this.minLon = minLon;
    this.maxLon = maxLon;
    this.cellDeg = cellDeg;
    this.cells = new Map();
  }

  clear() {
    this.cells.clear();
  }

  add(particle) {
    if (!particle.active) return;
    const i = Math.floor((particle.lat - this.minLat) / this.cellDeg);
    const j = Math.floor((particle.lon - this.minLon) / this.cellDeg);
    const key = `${i}:${j}`;
    this.cells.set(key, (this.cells.get(key) || 0) + particle.massKg);
  }

  massAt(lat, lon) {
    const i = Math.floor((lat - this.minLat) / this.cellDeg);
    const j = Math.floor((lon - this.minLon) / this.cellDeg);
    return this.cells.get(`${i}:${j}`) || 0;
  }
}
