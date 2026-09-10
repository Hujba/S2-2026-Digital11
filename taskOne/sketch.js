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

  const padding = width < 700 ? 16 : 24;
  const gap = width < 700 ? 12 : 20;
  const isMobile = width < 700;

  textAlign(LEFT, TOP);
  fill(255);
  textSize(isMobile ? 18 : 22);
  text("Silver Perch Environment Dashboard", padding, padding);

  noStroke();
  fill(isConnected ? color(0, 230, 118) : color(255, 77, 77));
  ellipse(padding + 5, padding + 40, isMobile ? 8 : 10, isMobile ? 8 : 10);

  textSize(isMobile ? 11 : 12);
  fill(180, 200, 220);
  text((isConnected ? "Connected" : "Disconnected") + " | Last updated: " + (lastUpdated || "Loading..."), padding + 18, padding + 35);

  if (aquariumData && aquariumData[0] && aquariumData[0].exps) {
    const exps = aquariumData[0].exps;
    const temp = parseFloat(exps.temperature?.curr || 0);
    const ph = parseFloat(exps.ph?.curr || 0);
    const nh3 = parseFloat(exps.nh3?.curr || 0);
    const nh4 = parseFloat(exps.nh4?.curr || 0);

    const tempStatus = Number(exps.temperature?.status) === 1 || temp < 20.0 || temp > 28.0;
    const phStatus = Number(exps.ph?.status) === 1 || ph < 6.8 || ph > 7.8;
    const nh3Status = Number(exps.nh3?.status) === 1 || nh3 > 0.05;

    let cardWidth = isMobile ? width - padding * 2 : (width - padding * 3) / 2;
    let cardHeight = isMobile ? 140 : 150;
    let cardsPerRow = isMobile ? 1 : 2;
    let totalRowWidth = cardWidth * cardsPerRow + gap * (cardsPerRow - 1);
    let startX = (width - totalRowWidth) / 2;
    let rowOneY = padding + 70;
    let rowTwoY = rowOneY + cardHeight + gap;

    drawWidget(startX, rowOneY, cardWidth, cardHeight, "Temperature", temp.toFixed(1) + " °C", "Safe: 22-26°C", tempStatus, isMobile);
    if (!isMobile) {
      drawWidget(startX + cardWidth + gap, rowOneY, cardWidth, cardHeight, "pH Level", ph.toFixed(2), "Safe: 6.8-7.8", phStatus, isMobile);
      drawWidget(startX, rowTwoY, cardWidth, cardHeight, "Ammonia (NH3)", nh3.toFixed(3) + " mg/L", "Safe: < 0.02", nh3Status, isMobile);
      drawWidget(startX + cardWidth + gap, rowTwoY, cardWidth, cardHeight, "Ammonia Ion (NH4)", nh4.toFixed(3) + " mg/L", "Safe: < 0.05", false, isMobile);
    } else {
      drawWidget(startX, rowOneY + cardHeight + gap, cardWidth, cardHeight, "pH Level", ph.toFixed(2), "Safe: 6.8-7.8", phStatus, isMobile);
      drawWidget(startX, rowOneY + (cardHeight + gap) * 2, cardWidth, cardHeight, "Ammonia (NH3)", nh3.toFixed(3) + " mg/L", "Safe: < 0.02", nh3Status, isMobile);
      drawWidget(startX, rowOneY + (cardHeight + gap) * 3, cardWidth, cardHeight, "Ammonia Ion (NH4)", nh4.toFixed(3) + " mg/L", "Safe: < 0.05", false, isMobile);
    }
  } else {
    fill(255, 100, 100);
    textSize(16);
    text("Connecting to sensor stream...", padding, padding + 70);
  }
}

function drawWidget(x, y, w, h, label, valueStr, safeRangeStr, isWarning, isMobile) {
  push();
  fill(35, 48, 68);
  stroke(isWarning ? color(255, 77, 77) : color(60, 80, 110));
  strokeWeight(isWarning ? 2 : 1);
  rect(x, y, w, h, 10);

  noStroke();
  textAlign(LEFT, TOP);
  fill(180, 200, 220);
  textSize(isMobile ? 12 : 14);
  text(label, x + 15, y + 15);

  fill(isWarning ? color(255, 77, 77) : color(100, 220, 255));
  textSize(isMobile ? 22 : 28);
  text(valueStr, x + 15, y + 40);

  fill(140, 160, 180);
  textSize(isMobile ? 10 : 11);
  text("Target: " + safeRangeStr, x + 15, y + 72);

  textSize(isMobile ? 11 : 12);
  fill(isWarning ? color(255, 77, 77) : color(0, 230, 118));
  text(isWarning ? "⚠️ ALERT LEVEL" : "✓ OPTIMAL", x + 15, y + h - 32);

  if (isWarning) {
    drawWarningIcon(x + w - 18, y + 22);
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