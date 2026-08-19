import { WeatherGrid } from "./weather/WeatherGrid.js";
import { Simulator } from "./physics/Simulator.js";
import { ConcentrationGrid } from "./physics/Concentration.js";
import { createParticles, VOLCANO } from "./source/SourceModel.js";
import { AIRPORT_REGIONS, classifyConcentration } from "./alerts/AviationAlert.js";

const $ = id => document.getElementById(id);

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors"
      }
    },
    layers: [{ id: "osm", type: "raster", source: "osm" }]
  },
  center: [-5, 54],
  zoom: 3.2
});

map.addControl(new maplibregl.NavigationControl());

const weather = new WeatherGrid(await fetch("./data/atmosphere/sample.json").then(r => r.json()));

const terrain = {
  elevation: () => 0
};

let config = {
  eruptionHeightKm: Number($("eruption-height").value),
  horizontalDiffusivity: 1500
};

let particles = createParticles({
  count: Number($("particle-count").value),
  eruptionHeightKm: config.eruptionHeightKm,
  diameterUm: Number($("particle-size").value)
});

const simulator = new Simulator({ weather, terrain, particles, config });

const concentration = new ConcentrationGrid({
  minLat: 40, maxLat: 70, minLon: -30, maxLon: 20, cellDeg: 0.5
});

$("eruption-height").addEventListener("input", e => {
  if (simulator.locked) return;
  config.eruptionHeightKm = Number(e.target.value);
  $("eruption-height-value").textContent = `${config.eruptionHeightKm.toFixed(1)} km`;
});

$("particle-count").addEventListener("change", reset);
$("particle-size").addEventListener("change", reset);

$("start").addEventListener("click", () => {
  simulator.start();
  $("eruption-height").disabled = true;
  $("particle-count").disabled = true;
  $("particle-size").disabled = true;
  $("height-lock").textContent = "시뮬레이션 시작됨 — 분출 고도 잠금";
});

$("pause").addEventListener("click", () => simulator.pause());

$("reset").addEventListener("click", () => {
  reset();
  $("eruption-height").disabled = false;
  $("particle-count").disabled = false;
  $("particle-size").disabled = false;
  $("height-lock").textContent = "시뮬레이션 시작 전 변경 가능";
});

function reset() {
  config.eruptionHeightKm = Number($("eruption-height").value);
  particles = createParticles({
    count: Number($("particle-count").value),
    eruptionHeightKm: config.eruptionHeightKm,
    diameterUm: Number($("particle-size").value)
  });
  simulator.config = structuredClone(config);
  simulator.reset(particles);
  $("sim-time").textContent = "0 h";
}

function updateUI() {
  $("sim-time").textContent = `${(simulator.timeSeconds / 3600).toFixed(1)} h`;
  $("active-particles").textContent = particles.filter(p => p.active).length;

  concentration.clear();
  for (const p of particles) concentration.add(p);

  for (const [name, loc] of Object.entries(AIRPORT_REGIONS)) {
    // Prototype concentration proxy:
    // production version must vertically integrate/interpolate actual kg/m3.
    const mass = concentration.massAt(loc.lat, loc.lon);
    const mgM3 = mass * 1e6;
    const level = classifyConcentration(mgM3);
    const card = $(`${name.toLowerCase()}-alert`);
    card.className = `alert-card ${level.className}`;
    card.querySelector("span").textContent = `${level.name} (${mgM3.toExponential(2)} mg/m³)`;
  }
}

let last = performance.now();
function frame(now) {
  const elapsed = Math.min(0.25, (now - last) / 1000);
  last = now;

  // 60 real-time frames -> up to 15 simulated seconds/frame.
  if (simulator.running) {
    simulator.step(elapsed * 60);
    updateUI();
  }

  requestAnimationFrame(frame);
}

$("weather-readout").textContent =
  "대기장: sample prototype | 실제 버전에서는 ERA5 pressure-level 전처리 데이터를 사용";

updateUI();
requestAnimationFrame(frame);
