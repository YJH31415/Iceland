/*
  Atmospheric grid interface.

  Expected production data:
    time[]           hourly UTC timestamps
    pressure[]       Pa or hPa levels
    lat[]            degrees
    lon[]            degrees
    z[time][p][lat][lon]      geopotential height, m
    u[time][p][lat][lon]      eastward wind, m/s
    v[time][p][lat][lon]      northward wind, m/s
    w[time][p][lat][lon]      vertical velocity, m/s
    temperature[...]           K
    pressureField[...]         Pa
    relativeHumidity[...]      0..1

  The simulation queries by physical altitude, not by pressure.
  z interpolation maps altitude -> neighboring pressure levels.
*/

export class WeatherGrid {
  constructor(data) {
    this.data = data;
  }

  // Development prototype: nearest cell.
  // Production version should use trilinear interpolation in lon/lat/z
  // and linear interpolation in time.
  sample(lat, lon, altitudeM, timeSeconds) {
    const d = this.data;
    const t = this._timeIndex(timeSeconds);
    const iLat = nearestIndex(d.lat, lat);
    const iLon = nearestIndex(d.lon, lon);

    const levels = d.levels;
    let k = nearestIndex(levels, altitudeM);

    // Sample fields. This sample data stores z levels directly.
    return {
      u: d.u[t][k][iLat][iLon],
      v: d.v[t][k][iLat][iLon],
      w: d.w[t][k][iLat][iLon],
      temperature: d.temperature[t][k][iLat][iLon],
      pressure: d.pressure[t][k][iLat][iLon],
      relativeHumidity: d.relativeHumidity[t][k][iLat][iLon]
    };
  }

  _timeIndex(seconds) {
    const hours = Math.floor(seconds / 3600);
    return Math.min(hours, this.data.time.length - 1);
  }
}

function nearestIndex(array, value) {
  let best = 0;
  let error = Infinity;
  for (let i = 0; i < array.length; i++) {
    const e = Math.abs(array[i] - value);
    if (e < error) { error = e; best = i; }
  }
  return best;
}
