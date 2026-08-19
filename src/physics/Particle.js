export class Particle {
  constructor({ lat, lon, altitudeM, diameterM, densityKgM3, massKg }) {
    this.lat = lat;
    this.lon = lon;
    this.altitudeM = altitudeM;
    this.diameterM = diameterM;
    this.densityKgM3 = densityKgM3;
    this.massKg = massKg;
    this.active = true;
  }
}
