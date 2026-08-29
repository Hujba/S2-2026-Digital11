// ===================================================
// STUDENT TASK: Build a graphical dashboard for Seneye
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
  createCanvas(800, 500);
  
  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(PROXY_URL, onDataLoaded, onError);
    }, 300000);
  }
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
  background(20, 30, 45); // Dark blue aquarium background

  // 1. Draw Title Header & Connection Status
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Silver Perch Environment Dashboard", 30, 25);

  // Connection indicator light
  noStroke();
  fill(isConnected ? color(0, 230, 118) : color(255, 77, 77));
  ellipse(35, 65, 10, 10);

  // Display connection status text & timestamp
  textSize(12);
  fill(180, 200, 220);
  text((isConnected ? "Connected" : "Disconnected") + " | Last updated: " + (lastUpdated || "Loading..."), 50, 60);

  // 2. Render Dashboard Graphics
  if (aquariumData) {
    let rawTemp = aquariumData[0].exps.temperature.curr;
    let rawPh = aquariumData[0].exps.ph.curr;
    let rawNh3 = aquariumData[0].exps.nh3.curr;
    let rawNh4 = aquariumData[0].exps.nh4.curr;

    let temp = parseFloat(rawTemp);
    let ph = parseFloat(rawPh);
    let nh3 = parseFloat(rawNh3);
    let nh4 = parseFloat(rawNh4);

    // Render Modular Cards with Threshold Rules
    drawTempWidget(50, 100, temp);
    drawGaugeWidget(300, 100, "pH Level", ph, ph < 6.5 || ph > 8.2);
    drawGaugeWidget(550, 100, "Ammonia (NH3)", nh3, nh3 > 0.05);
    drawGaugeWidget(50, 280, "Ammonia ion (NH4)", nh4, false);

  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
}

// Custom Graphic Widget: Temperature Card
function drawTempWidget(x, y, tempVal) {
  let isWarning = tempVal < 20.0 || tempVal > 28.0;

  // Background Card
  fill(35, 48, 68);
  stroke(isWarning ? color(255, 77, 77) : color(60, 80, 110));
  strokeWeight(isWarning ? 2 : 1);
  rect(x, y, 200, 150, 10);

  // Label
  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text("Water Temp", x + 15, y + 15);

  // Value Display with dynamic color
  fill(isWarning ? color(255, 77, 77) : color(100, 220, 255));
  textSize(36);
  text(tempVal + "°C", x + 15, y + 55);

  // Status Indicator
  textSize(12);
  fill(isWarning ? color(255, 77, 77) : color(0, 230, 118));
  text(isWarning ? "⚠️ TEMP WARNING" : "✓ OPTIMAL", x + 15, y + 115);

  if (isWarning) {
    drawWarningIcon(x + 165, y + 25);
  }
}

// Custom Graphic Widget: Gauge Card
function drawGaugeWidget(x, y, label, val, isWarning) {
  fill(35, 48, 68);
  stroke(isWarning ? color(255, 77, 77) : color(60, 80, 110));
  strokeWeight(isWarning ? 2 : 1);
  rect(x, y, 200, 150, 10);

  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text(label, x + 15, y + 15);

  fill(isWarning ? color(255, 77, 77) : color(255));
  textSize(32);
  text(val, x + 15, y + 55);

  // Status Indicator
  textSize(12);
  fill(isWarning ? color(255, 77, 77) : color(0, 230, 118));
  text(isWarning ? "⚠️ ALERT LEVEL" : "✓ OPTIMAL", x + 15, y + 115);

  if (isWarning) {
    drawWarningIcon(x + 165, y + 25);
  }
}

// Helper Function: Warning Triangle Icon
function drawWarningIcon(cx, cy) {
  push();
  fill(255, 77, 77);
  noStroke();
  triangle(cx, cy - 10, cx - 10, cy + 8, cx + 10, cy + 8);
  fill(20, 30, 45);
  textSize(10);
  textAlign(CENTER, CENTER);
  text("!", cx, cy + 2);
  pop();
}