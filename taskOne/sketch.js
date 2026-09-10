// ===================================================
// Real-Time Aquarium Data Dashboard - p5.js
// ===================================================

const PROXY_URL = "https://seneye-proxy.ezankov.workers.dev/";
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";
let isConnected = false;

function preload() {
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(PROXY_URL, onDataLoaded, onError);
    }, 300000);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function onDataLoaded(data) {
  aquariumData = data;
  lastUpdated = new Date().toLocaleTimeString();
  isConnected = true;
  console.log("Data refreshed successfully:", data);
}

function onError(err) {
  isConnected = false;
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

function draw() {
  background(20, 30, 45);

  const isMobile = width < 768;
  const padding = isMobile ? 16 : 32;
  const gap = isMobile ? 12 : 20;

  // Header Section
  textAlign(LEFT, TOP);
  fill(255);
  textSize(isMobile ? 20 : 26);
  text("Silver Perch Environment Dashboard", padding, padding);

  noStroke();
  fill(isConnected ? color(0, 230, 118) : color(255, 77, 77));
  ellipse(padding + 6, padding + 42, isMobile ? 8 : 10, isMobile ? 8 : 10);

  textSize(isMobile ? 12 : 14);
  fill(180, 200, 220);
  text((isConnected ? "Connected" : "Disconnected") + " | Last updated: " + (lastUpdated || "Loading..."), padding + 20, padding + 37);

  if (aquariumData && aquariumData[0] && aquariumData[0].exps) {
    const exps = aquariumData[0].exps;
    const temp = parseFloat(exps.temperature?.curr || 0);
    const ph = parseFloat(exps.ph?.curr || 0);
    const nh3 = parseFloat(exps.nh3?.curr || 0);
    const nh4 = parseFloat(exps.nh4?.curr || 0);

    const tempStatus = Number(exps.temperature?.status) === 1 || temp < 20.0 || temp > 28.0;
    const phStatus = Number(exps.ph?.status) === 1 || ph < 6.8 || ph > 7.8;
    const nh3Status = Number(exps.nh3?.status) === 1 || nh3 > 0.05;

    // Define Grid Items
    const items = [
      { label: "Temperature", val: temp.toFixed(1) + " °C", safe: "Safe: 22-26°C", warn: tempStatus },
      { label: "pH Level", val: ph.toFixed(2), safe: "Safe: 6.8-7.8", warn: phStatus },
      { label: "Ammonia (NH3)", val: nh3.toFixed(3) + " mg/L", safe: "Safe: < 0.02", warn: nh3Status },
      { label: "Ammonia Ion (NH4)", val: nh4.toFixed(3) + " mg/L", safe: "Safe: < 0.05", warn: false }
    ];

    // Responsive Grid Layout Calculation
    const cols = isMobile ? 1 : 2;
    const startY = padding + (isMobile ? 70 : 85);
    
    const availableWidth = width - (padding * 2);
    const cardWidth = (availableWidth - (gap * (cols - 1))) / cols;
    const cardHeight = isMobile ? 130 : 160;

    for (let i = 0; i < items.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);

      let x = padding + col * (cardWidth + gap);
      let y = startY + row * (cardHeight + gap);

      drawWidget(x, y, cardWidth, cardHeight, items[i].label, items[i].val, items[i].safe, items[i].warn, isMobile);
    }
  } else {
    fill(255, 100, 100);
    textSize(16);
    text("Connecting to sensor stream...", padding, padding + 80);
  }
}

function drawWidget(x, y, w, h, label, valueStr, safeRangeStr, isWarning, isMobile) {
  push();
  fill(35, 48, 68);
  stroke(isWarning ? color(255, 77, 77) : color(60, 80, 110));
  strokeWeight(isWarning ? 2 : 1);
  rect(x, y, w, h, 12);

  noStroke();
  textAlign(LEFT, TOP);
  fill(180, 200, 220);
  textSize(isMobile ? 12 : 14);
  text(label, x + 16, y + 16);

  fill(isWarning ? color(255, 77, 77) : color(100, 220, 255));
  textSize(isMobile ? 22 : 28);
  text(valueStr, x + 16, y + (isMobile ? 38 : 44));

  fill(140, 160, 180);
  textSize(isMobile ? 11 : 12);
  text("Target: " + safeRangeStr, x + 16, y + (isMobile ? 70 : 82));

  textSize(isMobile ? 11 : 12);
  fill(isWarning ? color(255, 77, 77) : color(0, 230, 118));
  text(isWarning ? "⚠️ ALERT LEVEL" : "✓ OPTIMAL", x + 16, y + h - 28);

  if (isWarning) {
    drawWarningIcon(x + w - 24, y + 24);
  }
  pop();
}

function drawWarningIcon(cx, cy) {
  push();
  fill(255, 77, 77);
  noStroke();
  triangle(cx, cy - 10, cx - 10, cy + 8, cx + 10, cy + 8);
  fill(20, 30, 45);
  textSize(10);
  textAlign(CENTER, CENTER);
  text("!", cx, cy + 1);
  pop();
}