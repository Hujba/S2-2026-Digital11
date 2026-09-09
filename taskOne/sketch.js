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
  createCanvas(800, 500);
  
  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(PROXY_URL, onDataLoaded, onError);
    }, 300000); // 5-minute refresh interval
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
  background(20, 30, 45); // Dark aquarium background

  // 1. Header & System Connection Status
  textAlign(LEFT, TOP);
  fill(255);
  textSize(22);
  text("Silver Perch Environment Dashboard", 30, 25);

  // Connection Indicator Light
  noStroke();
  fill(isConnected ? color(0, 230, 118) : color(255, 77, 77));
  ellipse(35, 65, 10, 10);

  // Status & Timestamp Text
  textSize(12);
  fill(180, 200, 220);
  text((isConnected ? "Connected" : "Disconnected") + " | Last updated: " + (lastUpdated || "Loading..."), 50, 60);

  // 2. Render Widgets
  if (aquariumData && aquariumData[0] && aquariumData[0].exps) {
    let exps = aquariumData[0].exps;

    // Extract numerical readings
    let temp = parseFloat(exps.temperature?.curr || 0);
    let ph = parseFloat(exps.ph?.curr || 0);
    let nh3 = parseFloat(exps.nh3?.curr || 0);
    let nh4 = parseFloat(exps.nh4?.curr || 0);

    // Parse API Status flags (converting string indicators to numbers)
    let tempStatus = Number(exps.temperature?.status) === 1 || temp < 20.0 || temp > 28.0;
    let phStatus = Number(exps.ph?.status) === 1 || ph < 6.8 || ph > 7.8;
    let nh3Status = Number(exps.nh3?.status) === 1 || nh3 > 0.05;

    // Render Modular Cards
    drawWidget(30, 100, "Temperature", temp.toFixed(1) + " °C", "Safe: 22-26°C", tempStatus);
    drawWidget(280, 100, "pH Level", ph.toFixed(2), "Safe: 6.8-7.8", phStatus);
    drawWidget(530, 100, "Ammonia (NH3)", nh3.toFixed(3) + " mg/L", "Safe: < 0.02", nh3Status);
    drawWidget(30, 280, "Ammonia Ion (NH4)", nh4.toFixed(3) + " mg/L", "Safe: < 0.05", false);

  } else {
    // Loading State Fallback
    fill(255, 100, 100);
    textSize(16);
    text("Connecting to sensor stream...", 30, 120);
  }
}

// Custom Graphic Widget: Modular Visual Card
function drawWidget(x, y, label, valueStr, safeRangeStr, isWarning) {
  push();
  // Card Container
  fill(35, 48, 68);
  stroke(isWarning ? color(255, 77, 77) : color(60, 80, 110));
  strokeWeight(isWarning ? 2 : 1);
  rect(x, y, 230, 150, 10);

  // Metric Label
  noStroke();
  textAlign(LEFT, TOP);
  fill(180, 200, 220);
  textSize(14);
  text(label, x + 15, y + 15);

  // Parameter Value Display
  fill(isWarning ? color(255, 77, 77) : color(100, 220, 255));
  textSize(28);
  text(valueStr, x + 15, y + 45);

  // Safe Operational Target Range
  fill(140, 160, 180);
  textSize(11);
  text("Target: " + safeRangeStr, x + 15, y + 85);

  // Alert Status Footer
  textSize(12);
  fill(isWarning ? color(255, 77, 77) : color(0, 230, 118));
  text(isWarning ? "⚠️ ALERT LEVEL" : "✓ OPTIMAL", x + 15, y + 118);

  // Warning Icon Callout
  if (isWarning) {
    drawWarningIcon(x + 200, y + 25);
  }
  pop();
}

// Helper Function: Warning Icon Callout
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