import { useState, useRef, useCallback, useEffect } from "react";

const PIXEL = 4;

// ─── Color Palettes ───
const PAL = {
  bg: "#fff0f5",
  panel: "#ffe4f0",
  panelLight: "#ffd6e8",
  accent: "#ff6eb4",
  accentSoft: "#ff9dcf",
  gold: "#ffdd57",
  green: "#5edc8a",
  blue: "#5bc8f5",
  purple: "#c77dff",
  wood: "#cd8d5e",
  woodDark: "#a0724a",
  cream: "#fff9c4",
  white: "#ffffff",
  gray: "#c9a0c9",
  darkGray: "#7a5c7a",
  text: "#5c3d5c",
  textDim: "#a07898",
};

// ─── Room Definitions ───
const ROOMS = {
  living: {
    name: "Living Room",
    emoji: "🛋️",
    floorColor: "#f5d08a",
    wallColor: "#FFF0A0",
    wallAccent: "#FFE066",
    width: 14,
    height: 10,
  },
  bedroom1: {
    name: "Dani's Bedroom",
    emoji: "🛏️",
    floorColor: "#f0a8c8",
    wallColor: "#FFB3D9",
    wallAccent: "#FF85C0",
    width: 12,
    height: 10,
  },
  bedroom2: {
    name: "Guest Room",
    emoji: "🌙",
    floorColor: "#90cce8",
    wallColor: "#B3E5FC",
    wallAccent: "#7DCEF5",
    width: 10,
    height: 9,
  },
  kitchen: {
    name: "Kitchen",
    emoji: "🍳",
    floorColor: "#90d8a0",
    wallColor: "#C8F5C8",
    wallAccent: "#8EE89E",
    width: 12,
    height: 9,
  },
  bathroom: {
    name: "Bathroom",
    emoji: "🚿",
    floorColor: "#c8a8f0",
    wallColor: "#E0C8FF",
    wallAccent: "#C89EFF",
    width: 8,
    height: 8,
  },
};

// ─── Item Catalog ───
const ITEMS = [
  // Seating
  { id: "sofa_red", name: "Red Sofa", category: "seating", w: 3, h: 2, pixels: (x, y) => drawSofa(x, y, "#e74c3c", "#c0392b") },
  { id: "sofa_blue", name: "Blue Sofa", category: "seating", w: 3, h: 2, pixels: (x, y) => drawSofa(x, y, "#3498db", "#2980b9") },
  { id: "chair_wood", name: "Wood Chair", category: "seating", w: 1, h: 1, pixels: (x, y) => drawChair(x, y, "#cd8d5e", "#a0724a") },
  { id: "chair_pink", name: "Pink Chair", category: "seating", w: 1, h: 1, pixels: (x, y) => drawChair(x, y, "#fd79a8", "#e84393") },
  { id: "armchair", name: "Armchair", category: "seating", w: 2, h: 2, pixels: (x, y) => drawArmchair(x, y, "#6c5ce7", "#5a4bd1") },
  { id: "stool", name: "Stool", category: "seating", w: 1, h: 1, pixels: (x, y) => drawStool(x, y) },

  // Tables
  { id: "table_wood", name: "Wood Table", category: "tables", w: 2, h: 2, pixels: (x, y) => drawTable(x, y, "#cd8d5e", "#a0724a") },
  { id: "table_round", name: "Round Table", category: "tables", w: 2, h: 2, pixels: (x, y) => drawRoundTable(x, y) },
  { id: "desk", name: "Study Desk", category: "tables", w: 3, h: 2, pixels: (x, y) => drawDesk(x, y) },
  { id: "coffee_table", name: "Coffee Table", category: "tables", w: 2, h: 1, pixels: (x, y) => drawCoffeeTable(x, y) },
  { id: "nightstand", name: "Nightstand", category: "tables", w: 1, h: 1, pixels: (x, y) => drawNightstand(x, y) },

  // Beds
  { id: "bed_single", name: "Single Bed", category: "beds", w: 2, h: 3, pixels: (x, y) => drawBed(x, y, 2, "#ff7979", "#eb4d4b") },
  { id: "bed_double", name: "Double Bed", category: "beds", w: 3, h: 3, pixels: (x, y) => drawBed(x, y, 3, "#686de0", "#4834d4") },
  { id: "bed_green", name: "Green Bed", category: "beds", w: 2, h: 3, pixels: (x, y) => drawBed(x, y, 2, "#78e08f", "#38ada9") },

  // Decor
  { id: "plant_big", name: "Big Plant", category: "decor", w: 1, h: 1, pixels: (x, y) => drawPlant(x, y, true) },
  { id: "plant_small", name: "Small Plant", category: "decor", w: 1, h: 1, pixels: (x, y) => drawPlant(x, y, false) },
  { id: "bookshelf", name: "Bookshelf", category: "decor", w: 2, h: 3, pixels: (x, y) => drawBookshelf(x, y) },
  { id: "lamp_floor", name: "Floor Lamp", category: "decor", w: 1, h: 2, pixels: (x, y) => drawFloorLamp(x, y) },
  { id: "lamp_table", name: "Table Lamp", category: "decor", w: 1, h: 1, pixels: (x, y) => drawTableLamp(x, y) },
  { id: "rug_red", name: "Red Rug", category: "decor", w: 3, h: 2, pixels: (x, y) => drawRug(x, y, "#e74c3c", "#c0392b") },
  { id: "rug_blue", name: "Blue Rug", category: "decor", w: 3, h: 2, pixels: (x, y) => drawRug(x, y, "#3498db", "#2980b9") },
  { id: "picture_landscape", name: "Landscape Art", category: "decor", w: 2, h: 1, pixels: (x, y) => drawPicture(x, y, "landscape") },
  { id: "picture_abstract", name: "Abstract Art", category: "decor", w: 1, h: 1, pixels: (x, y) => drawPicture(x, y, "abstract") },
  { id: "picture_portrait", name: "Portrait Art", category: "decor", w: 1, h: 2, pixels: (x, y) => drawPicture(x, y, "portrait") },
  { id: "tv", name: "TV", category: "decor", w: 2, h: 1, pixels: (x, y) => drawTV(x, y) },
  { id: "clock", name: "Wall Clock", category: "decor", w: 1, h: 1, pixels: (x, y) => drawClock(x, y) },
  { id: "books_stack", name: "Book Stack", category: "decor", w: 1, h: 1, pixels: (x, y) => drawBookStack(x, y) },
  { id: "vase", name: "Flower Vase", category: "decor", w: 1, h: 1, pixels: (x, y) => drawVase(x, y) },

  // Kitchen
  { id: "fridge", name: "Fridge", category: "kitchen", w: 1, h: 2, pixels: (x, y) => drawFridge(x, y) },
  { id: "stove", name: "Stove", category: "kitchen", w: 2, h: 1, pixels: (x, y) => drawStove(x, y) },
  { id: "sink_k", name: "Kitchen Sink", category: "kitchen", w: 2, h: 1, pixels: (x, y) => drawKitchenSink(x, y) },
  { id: "cabinet", name: "Cabinet", category: "kitchen", w: 2, h: 2, pixels: (x, y) => drawCabinet(x, y) },

  // Bathroom
  { id: "toilet", name: "Toilet", category: "bathroom", w: 1, h: 1, pixels: (x, y) => drawToilet(x, y) },
  { id: "bathtub", name: "Bathtub", category: "bathroom", w: 3, h: 2, pixels: (x, y) => drawBathtub(x, y) },
  { id: "sink_b", name: "Sink", category: "bathroom", w: 1, h: 1, pixels: (x, y) => drawSinkB(x, y) },
  { id: "mirror", name: "Mirror", category: "bathroom", w: 1, h: 2, pixels: (x, y) => drawMirror(x, y) },

  // Pool / Special
  { id: "pool", name: "Mini Pool", category: "special", w: 3, h: 2, pixels: (x, y) => drawPool(x, y) },
  { id: "piano", name: "Piano", category: "special", w: 2, h: 2, pixels: (x, y) => drawPiano(x, y) },
  { id: "fireplace", name: "Fireplace", category: "special", w: 2, h: 2, pixels: (x, y) => drawFireplace(x, y) },
  { id: "aquarium", name: "Aquarium", category: "special", w: 2, h: 1, pixels: (x, y) => drawAquarium(x, y) },
  { id: "globe", name: "Globe", category: "special", w: 1, h: 1, pixels: (x, y) => drawGlobe(x, y) },
];

const CATEGORIES = [
  { id: "all", name: "All", emoji: "✨" },
  { id: "seating", name: "Seats", emoji: "🪑" },
  { id: "tables", name: "Tables", emoji: "🪵" },
  { id: "beds", name: "Beds", emoji: "🛏️" },
  { id: "decor", name: "Decor", emoji: "🖼️" },
  { id: "kitchen", name: "Kitchen", emoji: "🍳" },
  { id: "bathroom", name: "Bath", emoji: "🚿" },
  { id: "special", name: "Special", emoji: "⭐" },
];

// ─── Pixel Drawing Helpers ───
const P = PIXEL;
// CELL is now computed dynamically per room in the component; this module-level
// constant is kept only for draw functions that reference it at render time via
// the closure supplied by the component (see useDynamicCell).
let CELL = P * 8;

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawSofa(x, y, c1, c2) {
  return (ctx) => {
    rect(ctx, x + P, y + P * 2, CELL * 3 - P * 2, CELL * 2 - P * 3, c2);
    rect(ctx, x + P * 2, y + P * 3, CELL * 3 - P * 4, CELL * 2 - P * 5, c1);
    rect(ctx, x, y, P * 3, CELL * 2, c2);
    rect(ctx, x + CELL * 3 - P * 3, y, P * 3, CELL * 2, c2);
    rect(ctx, x + P, y + P, P * 2, CELL - P * 2, c1);
    rect(ctx, x + CELL * 3 - P * 3, y + P, P * 2, CELL - P * 2, c1);
    // cushions
    rect(ctx, x + P * 5, y + P * 4, CELL - P * 2, CELL - P * 6, "#fff3");
    rect(ctx, x + CELL + P * 3, y + P * 4, CELL - P * 2, CELL - P * 6, "#fff3");
  };
}

function drawChair(x, y, c1, c2) {
  return (ctx) => {
    rect(ctx, x + P, y, CELL - P * 2, P * 3, c2);
    rect(ctx, x + P * 2, y + P, CELL - P * 4, P * 2, c1);
    rect(ctx, x, y + P * 3, CELL, CELL - P * 3, c2);
    rect(ctx, x + P, y + P * 4, CELL - P * 2, CELL - P * 5, c1);
    rect(ctx, x, y + CELL - P, P * 2, P);
    rect(ctx, x + CELL - P * 2, y + CELL - P, P * 2, P);
  };
}

function drawArmchair(x, y, c1, c2) {
  return (ctx) => {
    rect(ctx, x + P, y, CELL * 2 - P * 2, P * 4, c2);
    rect(ctx, x + P * 2, y + P, CELL * 2 - P * 4, P * 3, c1);
    rect(ctx, x, y + P * 4, CELL * 2, CELL * 2 - P * 4, c2);
    rect(ctx, x + P * 3, y + P * 5, CELL * 2 - P * 6, CELL * 2 - P * 7, c1);
    rect(ctx, x, y + P * 4, P * 3, CELL - P, c2);
    rect(ctx, x + CELL * 2 - P * 3, y + P * 4, P * 3, CELL - P, c2);
    rect(ctx, x + P * 4, y + P * 6, CELL - P * 2, CELL - P * 8, "#fff2");
  };
}

function drawStool(x, y) {
  return (ctx) => {
    rect(ctx, x + P, y + P, CELL - P * 2, P * 2, "#a0724a");
    rect(ctx, x + P * 2, y + P * 3, P * 2, CELL - P * 4, "#8B7355");
    rect(ctx, x + CELL - P * 4, y + P * 3, P * 2, CELL - P * 4, "#8B7355");
    rect(ctx, x + P * 2, y + P * 2, CELL - P * 4, P, "#cd8d5e");
  };
}

function drawTable(x, y, c1, c2) {
  return (ctx) => {
    rect(ctx, x, y + P, CELL * 2, P * 3, c2);
    rect(ctx, x + P, y, CELL * 2 - P * 2, P * 2, c1);
    rect(ctx, x + P, y + P * 4, P * 2, CELL * 2 - P * 5, c2);
    rect(ctx, x + CELL * 2 - P * 3, y + P * 4, P * 2, CELL * 2 - P * 5, c2);
    rect(ctx, x + P * 2, y + P * 2, CELL * 2 - P * 4, P, "#fff2");
  };
}

function drawRoundTable(x, y) {
  return (ctx) => {
    const cx = x + CELL, cy = y + P * 3;
    ctx.fillStyle = "#cd8d5e";
    ctx.beginPath();
    ctx.ellipse(cx, cy, CELL - P * 2, P * 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8c07a";
    ctx.beginPath();
    ctx.ellipse(cx, cy - P, CELL - P * 3, P * 3, 0, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + CELL - P, cy, P * 2, CELL * 2 - P * 6, "#a0724a");
    rect(ctx, x + P * 3, y + CELL * 2 - P * 2, CELL * 2 - P * 6, P * 2, "#a0724a");
  };
}

function drawDesk(x, y) {
  return (ctx) => {
    rect(ctx, x, y + P * 2, CELL * 3, P * 3, "#a0724a");
    rect(ctx, x + P, y + P, CELL * 3 - P * 2, P * 2, "#cd8d5e");
    rect(ctx, x + P, y + P * 5, P * 2, CELL * 2 - P * 6, "#8B7355");
    rect(ctx, x + CELL * 3 - P * 3, y + P * 5, P * 2, CELL * 2 - P * 6, "#8B7355");
    // drawer
    rect(ctx, x + CELL * 2, y + P * 5, CELL - P * 2, CELL - P * 2, "#a0724a");
    rect(ctx, x + CELL * 2 + P * 2, y + P * 7, P * 3, P, "#cd8d5e");
    // items on desk
    rect(ctx, x + P * 3, y, P * 4, P * 2, "#636e72");
    rect(ctx, x + P * 9, y, P * 2, P * 2, "#e74c3c");
  };
}

function drawCoffeeTable(x, y) {
  return (ctx) => {
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, CELL - P * 2, "#a0724a");
    rect(ctx, x + P * 2, y, CELL * 2 - P * 4, P * 2, "#cd8d5e");
    rect(ctx, x + P * 3, y + P, CELL * 2 - P * 6, P, "#e8c07a");
    rect(ctx, x + P, y + CELL - P, P * 2, P);
    rect(ctx, x + CELL * 2 - P * 3, y + CELL - P, P * 2, P);
  };
}

function drawNightstand(x, y) {
  return (ctx) => {
    rect(ctx, x + P, y + P, CELL - P * 2, CELL - P * 2, "#a0724a");
    rect(ctx, x + P * 2, y, CELL - P * 4, P * 2, "#cd8d5e");
    rect(ctx, x + P * 2, y + P * 3, CELL - P * 4, P * 2, "#8B7355");
    rect(ctx, x + P * 3, y + P * 4, P * 2, P, "#cd8d5e");
  };
}

function drawBed(x, y, w, c1, c2) {
  return (ctx) => {
    const bw = CELL * w;
    rect(ctx, x, y, bw, P * 4, "#8B7355");
    rect(ctx, x + P, y + P, bw - P * 2, P * 2, "#a0724a");
    rect(ctx, x + P, y + P * 4, bw - P * 2, CELL * 3 - P * 5, "#f5f0e8");
    rect(ctx, x + P * 2, y + P * 5, bw - P * 4, CELL * 2 - P * 2, c1);
    rect(ctx, x + P * 3, y + P * 6, bw - P * 6, CELL - P * 2, c2);
    // pillow
    rect(ctx, x + P * 3, y + P * 5, (bw - P * 6) / 2 - P, P * 3, "#fff");
    rect(ctx, x + P * 3 + (bw - P * 6) / 2 + P, y + P * 5, (bw - P * 6) / 2 - P, P * 3, "#fff");
    // frame
    rect(ctx, x, y + CELL * 3 - P, bw, P, "#8B7355");
  };
}

function drawPlant(x, y, big) {
  return (ctx) => {
    rect(ctx, x + P * 2, y + CELL - P * 3, P * 4, P * 3, "#a0724a");
    rect(ctx, x + P * 3, y + CELL - P * 2, P * 2, P, "#cd8d5e");
    if (big) {
      ctx.fillStyle = "#27ae60";
      const cx = x + CELL / 2, cy = y + P * 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, P * 4, P * 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.ellipse(cx - P, cy - P, P * 3, P * 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#78e08f";
      ctx.beginPath();
      ctx.ellipse(cx + P, cy - P * 2, P * 2, P * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      rect(ctx, x + P * 3, y + P * 3, P * 2, P * 3, "#27ae60");
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.ellipse(x + CELL / 2, y + P * 2, P * 3, P * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}

function drawBookshelf(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL * 3, "#8B7355");
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, CELL - P * 2, "#a0724a");
    rect(ctx, x + P, y + CELL, CELL * 2 - P * 2, CELL - P * 2, "#a0724a");
    rect(ctx, x + P, y + CELL * 2, CELL * 2 - P * 2, CELL - P * 2, "#a0724a");
    const colors = ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c", "#e84393", "#6c5ce7"];
    for (let row = 0; row < 3; row++) {
      let bx = x + P * 2;
      for (let i = 0; i < 5; i++) {
        const bw = P + Math.floor(Math.random() * P);
        const bh = CELL - P * 4 - Math.floor(Math.random() * P * 2);
        rect(ctx, bx, y + row * CELL + CELL - P - bh, bw, bh, colors[(row * 5 + i) % colors.length]);
        bx += bw + 1;
        if (bx > x + CELL * 2 - P * 3) break;
      }
    }
  };
}

function drawFloorLamp(x, y) {
  return (ctx) => {
    rect(ctx, x + P * 3, y + P * 5, P * 2, CELL * 2 - P * 6, "#636e72");
    rect(ctx, x + P, y, CELL - P * 2, P * 5, "#f7d794");
    rect(ctx, x + P * 2, y + P, CELL - P * 4, P * 3, "#f9e4b7");
    rect(ctx, x + P * 2, y + CELL * 2 - P * 2, P * 4, P * 2, "#636e72");
    // glow
    ctx.fillStyle = "#f7d79422";
    ctx.beginPath();
    ctx.ellipse(x + CELL / 2, y + P * 3, CELL / 2, P * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  };
}

function drawTableLamp(x, y) {
  return (ctx) => {
    rect(ctx, x + P * 2, y + P * 4, P * 4, P * 3, "#636e72");
    rect(ctx, x + P, y, CELL - P * 2, P * 4, "#f7d794");
    rect(ctx, x + P * 2, y + P, CELL - P * 4, P * 2, "#f9e4b7");
    rect(ctx, x + P * 2, y + CELL - P, P * 4, P, "#636e72");
    ctx.fillStyle = "#f7d79418";
    ctx.beginPath();
    ctx.ellipse(x + CELL / 2, y + P * 2, P * 4, P * 4, 0, 0, Math.PI * 2);
    ctx.fill();
  };
}

function drawRug(x, y, c1, c2) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 3, CELL * 2, c2);
    rect(ctx, x + P * 2, y + P * 2, CELL * 3 - P * 4, CELL * 2 - P * 4, c1);
    rect(ctx, x + P * 4, y + P * 4, CELL * 3 - P * 8, CELL * 2 - P * 8, c2 + "88");
    // pattern
    for (let i = 0; i < 4; i++) {
      rect(ctx, x + P * 5 + i * P * 4, y + P * 3, P * 2, P, "#fff3");
      rect(ctx, x + P * 5 + i * P * 4, y + CELL * 2 - P * 4, P * 2, P, "#fff3");
    }
  };
}

function drawPicture(x, y, type) {
  return (ctx) => {
    const w = type === "landscape" ? CELL * 2 : CELL;
    const h = type === "portrait" ? CELL * 2 : CELL;
    rect(ctx, x, y, w, h, "#8B7355");
    rect(ctx, x + P, y + P, w - P * 2, h - P * 2, "#fff");
    if (type === "landscape") {
      rect(ctx, x + P * 2, y + P * 4, w - P * 4, P * 2, "#82ccdd");
      rect(ctx, x + P * 2, y + P * 2, w - P * 4, P * 2, "#74b9ff");
      rect(ctx, x + P * 3, y + P * 3, P * 3, P * 3, "#27ae60");
      rect(ctx, x + P * 8, y + P * 3, P * 4, P * 2, "#2ecc71");
      ctx.fillStyle = "#f1c40f";
      ctx.beginPath();
      ctx.arc(x + w - P * 4, y + P * 3, P * 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "abstract") {
      rect(ctx, x + P * 2, y + P * 2, P * 3, P * 3, "#e74c3c");
      ctx.fillStyle = "#3498db";
      ctx.beginPath();
      ctx.arc(x + P * 5, y + P * 4, P * 2, 0, Math.PI * 2);
      ctx.fill();
      rect(ctx, x + P * 2, y + P * 5, P * 4, P, "#f1c40f");
    } else {
      ctx.fillStyle = "#f0c4a0";
      ctx.beginPath();
      ctx.arc(x + CELL / 2, y + P * 4, P * 2, 0, Math.PI * 2);
      ctx.fill();
      rect(ctx, x + P * 2, y + P * 6, P * 4, P * 5, "#6c5ce7");
      rect(ctx, x + P * 3, y + P * 3, P * 2, P, "#4a3520");
    }
  };
}

function drawTV(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL, "#2d3436");
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, CELL - P * 3, "#0c2233");
    rect(ctx, x + P * 2, y + P * 2, CELL - P, P * 2, "#1e90ff");
    rect(ctx, x + CELL, y + P * 2, CELL - P * 3, P * 2, "#00cec9");
    rect(ctx, x + P * 2, y + P * 4, P * 3, P, "#fd79a8");
    rect(ctx, x + CELL - P, y + CELL - P, P * 2, P, "#636e72");
  };
}

function drawClock(x, y) {
  return (ctx) => {
    ctx.fillStyle = "#dfe6e9";
    ctx.beginPath();
    ctx.arc(x + CELL / 2, y + CELL / 2, P * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x + CELL / 2, y + CELL / 2, P * 3, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + CELL / 2 - 1, y + P * 2, 2, P * 3, "#2d3436");
    rect(ctx, x + CELL / 2, y + CELL / 2 - 1, P * 2, 2, "#e74c3c");
  };
}

function drawBookStack(x, y) {
  return (ctx) => {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];
    for (let i = 0; i < 4; i++) {
      rect(ctx, x + P, y + P * (i * 2), CELL - P * 2, P * 2, colors[i]);
      rect(ctx, x + P + 1, y + P * (i * 2) + 1, CELL - P * 2 - 2, P, colors[i] + "88");
    }
  };
}

function drawVase(x, y) {
  return (ctx) => {
    ctx.fillStyle = "#a29bfe";
    ctx.beginPath();
    ctx.ellipse(x + CELL / 2, y + CELL - P * 3, P * 3, P * 3, 0, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + P * 2, y + P * 2, P * 4, P * 2, "#a29bfe");
    // flowers
    ctx.fillStyle = "#fd79a8";
    ctx.beginPath();
    ctx.arc(x + CELL / 2, y + P, P * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(x + P * 2, y + P * 2, P, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff7979";
    ctx.beginPath();
    ctx.arc(x + CELL - P * 2, y + P * 2, P, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + CELL / 2 - 1, y + P * 2, 2, P * 3, "#27ae60");
  };
}

function drawFridge(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL, CELL * 2, "#dfe6e9");
    rect(ctx, x + P, y + P, CELL - P * 2, CELL - P * 2, "#f0f3f5");
    rect(ctx, x + P, y + CELL + P, CELL - P * 2, CELL - P * 3, "#e8ecef");
    rect(ctx, x + CELL - P * 2, y + P * 2, P, P * 4, "#636e72");
    rect(ctx, x + CELL - P * 2, y + CELL + P * 2, P, P * 3, "#636e72");
    rect(ctx, x, y + CELL, CELL, P, "#b2bec3");
  };
}

function drawStove(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL, "#636e72");
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, CELL - P * 2, "#2d3436");
    // burners
    ctx.fillStyle = "#e74c3c44";
    ctx.beginPath(); ctx.arc(x + P * 4, y + P * 4, P * 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + CELL + P * 4, y + P * 4, P * 2, 0, Math.PI * 2); ctx.fill();
    // knobs
    rect(ctx, x + P * 2, y + CELL - P * 2, P, P, "#dfe6e9");
    rect(ctx, x + P * 5, y + CELL - P * 2, P, P, "#dfe6e9");
    rect(ctx, x + CELL + P * 2, y + CELL - P * 2, P, P, "#dfe6e9");
  };
}

function drawKitchenSink(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL, "#b2bec3");
    rect(ctx, x + P * 2, y + P * 2, CELL * 2 - P * 4, CELL - P * 4, "#dfe6e9");
    rect(ctx, x + P * 3, y + P * 3, CELL - P * 2, CELL - P * 6, "#74b9ff44");
    rect(ctx, x + CELL, y + P, P * 2, P * 2, "#636e72");
  };
}

function drawCabinet(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL * 2, "#a0724a");
    rect(ctx, x + P, y + P, CELL - P * 2, CELL * 2 - P * 2, "#cd8d5e");
    rect(ctx, x + CELL + P, y + P, CELL - P * 2, CELL * 2 - P * 2, "#cd8d5e");
    rect(ctx, x + CELL - P, y + P * 3, P * 2, P, "#8B7355");
    rect(ctx, x + CELL - P, y + CELL + P * 3, P * 2, P, "#8B7355");
    rect(ctx, x, y + CELL, CELL * 2, P, "#8B7355");
  };
}

function drawToilet(x, y) {
  return (ctx) => {
    rect(ctx, x + P, y, P * 6, P * 3, "#f0f3f5");
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(x + CELL / 2, y + P * 5, P * 3, P * 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dfe6e9";
    ctx.beginPath();
    ctx.ellipse(x + CELL / 2, y + P * 5, P * 2, P * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + P * 3, y + P, P * 2, P, "#b2bec3");
  };
}

function drawBathtub(x, y) {
  return (ctx) => {
    rect(ctx, x, y + P * 2, CELL * 3, CELL * 2 - P * 2, "#f0f3f5");
    rect(ctx, x + P * 2, y + P * 4, CELL * 3 - P * 4, CELL * 2 - P * 7, "#74b9ff44");
    rect(ctx, x, y + P, P * 3, P * 2, "#dfe6e9");
    rect(ctx, x + P, y + CELL * 2 - P, CELL * 3 - P * 2, P * 2, "#dfe6e9");
    // faucet
    rect(ctx, x + CELL * 3 - P * 3, y, P * 2, P * 3, "#636e72");
    rect(ctx, x + CELL * 3 - P * 4, y, P, P, "#b2bec3");
  };
}

function drawSinkB(x, y) {
  return (ctx) => {
    rect(ctx, x + P, y + P, CELL - P * 2, CELL - P * 2, "#f0f3f5");
    ctx.fillStyle = "#dfe6e9";
    ctx.beginPath();
    ctx.ellipse(x + CELL / 2, y + P * 4, P * 2, P * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + P * 3, y, P * 2, P * 2, "#636e72");
    rect(ctx, x + P * 2, y + CELL - P, P * 4, P, "#b2bec3");
  };
}

function drawMirror(x, y) {
  return (ctx) => {
    rect(ctx, x + P, y, CELL - P * 2, CELL * 2, "#b2bec3");
    rect(ctx, x + P * 2, y + P, CELL - P * 4, CELL * 2 - P * 2, "#74b9ff55");
    rect(ctx, x + P * 3, y + P * 2, P * 2, CELL - P, "#fff3");
  };
}

function drawPool(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 3, CELL * 2, "#74b9ff");
    rect(ctx, x + P, y + P, CELL * 3 - P * 2, CELL * 2 - P * 2, "#0984e3");
    // water ripples
    ctx.strokeStyle = "#74b9ff55";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + P * 3, y + P * 3 + i * P * 3);
      ctx.quadraticCurveTo(x + CELL * 1.5, y + P * 5 + i * P * 3, x + CELL * 3 - P * 3, y + P * 3 + i * P * 3);
      ctx.stroke();
    }
    // edge tiles
    for (let i = 0; i < 6; i++) {
      rect(ctx, x + i * P * 4, y, P * 3, P, "#dfe6e9");
      rect(ctx, x + i * P * 4, y + CELL * 2 - P, P * 3, P, "#dfe6e9");
    }
  };
}

function drawPiano(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL * 2, "#2d3436");
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, P * 4, "#1a1a2e");
    // white keys
    for (let i = 0; i < 7; i++) {
      rect(ctx, x + P * 2 + i * P * 2, y + P * 5, P * 2 - 1, P * 4, "#fff");
    }
    // black keys
    for (let i = 0; i < 5; i++) {
      if (i !== 2) rect(ctx, x + P * 3 + i * P * 2, y + P * 5, P, P * 2, "#2d3436");
    }
    rect(ctx, x + P, y + CELL + P * 2, P * 2, CELL - P * 3, "#2d3436");
    rect(ctx, x + CELL * 2 - P * 3, y + CELL + P * 2, P * 2, CELL - P * 3, "#2d3436");
  };
}

function drawFireplace(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL * 2, "#636e72");
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, P * 2, "#8B7355");
    rect(ctx, x + P * 3, y + P * 4, CELL * 2 - P * 6, CELL * 2 - P * 5, "#2d3436");
    // fire
    ctx.fillStyle = "#f39c12";
    ctx.beginPath();
    ctx.ellipse(x + CELL, y + CELL + P * 2, P * 3, P * 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.ellipse(x + CELL, y + CELL + P * 3, P * 2, P * 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.ellipse(x + CELL, y + CELL + P * 3, P, P * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // mantle
    rect(ctx, x - P, y, CELL * 2 + P * 2, P * 2, "#a0724a");
  };
}

function drawAquarium(x, y) {
  return (ctx) => {
    rect(ctx, x, y, CELL * 2, CELL, "#74b9ff33");
    rect(ctx, x + P, y + P, CELL * 2 - P * 2, CELL - P * 2, "#0984e333");
    // fish
    ctx.fillStyle = "#f39c12";
    ctx.beginPath();
    ctx.ellipse(x + P * 4, y + P * 3, P * 2, P, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.ellipse(x + CELL + P * 2, y + P * 5, P * 2, P, 0, 0, Math.PI * 2);
    ctx.fill();
    // plants
    rect(ctx, x + P * 2, y + CELL - P * 3, P, P * 2, "#2ecc71");
    rect(ctx, x + P * 4, y + CELL - P * 4, P, P * 3, "#27ae60");
    rect(ctx, x + CELL + P * 3, y + CELL - P * 3, P, P * 2, "#2ecc71");
    // frame
    rect(ctx, x, y, CELL * 2, P, "#636e72");
    rect(ctx, x, y + CELL - P, CELL * 2, P, "#636e72");
    rect(ctx, x, y, P, CELL, "#636e72");
    rect(ctx, x + CELL * 2 - P, y, P, CELL, "#636e72");
  };
}

function drawGlobe(x, y) {
  return (ctx) => {
    ctx.fillStyle = "#74b9ff";
    ctx.beginPath();
    ctx.arc(x + CELL / 2, y + P * 3, P * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.arc(x + P * 3, y + P * 2, P * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.arc(x + P * 5, y + P * 4, P, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x + P * 3, y + P * 6, P * 2, P, "#636e72");
    rect(ctx, x + P * 2, y + P * 7, P * 4, P, "#636e72");
  };
}

// ─── Daniela character ───
function drawDaniela(ctx, x, y, frame) {
  const f = frame % 4;
  const bounce = f < 2 ? 0 : -P;
  const dy = y + bounce;
  // Hair
  ctx.fillStyle = "#4a3520";
  ctx.beginPath();
  ctx.ellipse(x + P * 4, dy + P, P * 4, P * 3, 0, 0, Math.PI * 2);
  ctx.fill();
  rect(ctx, x + P, dy + P * 2, P * 2, P * 5, "#4a3520");
  rect(ctx, x + P * 6, dy + P * 2, P * 2, P * 5, "#4a3520");
  // Face
  ctx.fillStyle = "#f0c4a0";
  ctx.beginPath();
  ctx.ellipse(x + P * 4, dy + P * 3, P * 3, P * 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  rect(ctx, x + P * 3, dy + P * 2, P, P, "#2d3436");
  rect(ctx, x + P * 5, dy + P * 2, P, P, "#2d3436");
  // Smile
  rect(ctx, x + P * 3, dy + P * 4, P * 3, P, "#e17055");
  // Dress
  rect(ctx, x + P * 2, dy + P * 6, P * 5, P * 5, "#fd79a8");
  rect(ctx, x + P * 3, dy + P * 7, P * 3, P * 3, "#e84393");
  // Arms
  rect(ctx, x + P, dy + P * 6, P, P * 3, "#f0c4a0");
  rect(ctx, x + P * 7, dy + P * 6, P, P * 3, "#f0c4a0");
  // Legs
  rect(ctx, x + P * 3, dy + P * 11, P, P * 2, "#f0c4a0");
  rect(ctx, x + P * 5, dy + P * 11, P, P * 2, "#f0c4a0");
  // Shoes
  rect(ctx, x + P * 2, dy + P * 13, P * 2, P, "#e74c3c");
  rect(ctx, x + P * 5, dy + P * 13, P * 2, P, "#e74c3c");
}

// ─── Main Component ───
export default function DanielasHome() {
  const canvasRef = useRef(null);
  const [currentRoom, setCurrentRoom] = useState("living");
  const [placedItems, setPlacedItems] = useState({
    living: [],
    bedroom1: [],
    bedroom2: [],
    kitchen: [],
    bathroom: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [category, setCategory] = useState("all");
  const [hoverCell, setHoverCell] = useState(null);
  const [daniPos, setDaniPos] = useState({ x: 5, y: 5 });
  const [frame, setFrame] = useState(0);
  const [showHelp, setShowHelp] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(430);

  // Initialise showHelp from localStorage (avoids SSR issues)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowHelp(localStorage.getItem("dani_help_dismissed") !== "1");
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const room = ROOMS[currentRoom];

  // Dynamic CELL size: fill ~95 % of screen width, clamped to [20, 40]
  const dynamicCell = Math.max(20, Math.min(40, Math.floor((windowWidth * 0.95) / room.width)));
  // Update the module-level CELL so all draw functions pick up the new size
  CELL = dynamicCell;

  const canvasW = room.width * CELL;
  const canvasH = room.height * CELL;

  // Animation frame
  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => f + 1), 300);
    return () => clearInterval(interval);
  }, []);

  // Count items
  useEffect(() => {
    let count = 0;
    Object.values(placedItems).forEach((arr) => (count += arr.length));
    setItemCount(count);
  }, [placedItems]);

  // Move Dani to room center on room change
  useEffect(() => {
    setDaniPos({ x: Math.floor(room.width / 2), y: Math.floor(room.height / 2) });
  }, [currentRoom]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // Clear
    ctx.fillStyle = room.wallColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Wall (top 3 rows)
    const wallH = 3 * CELL;
    ctx.fillStyle = room.wallColor;
    ctx.fillRect(0, 0, canvasW, wallH);
    // Wall accent stripes
    ctx.fillStyle = room.wallAccent;
    ctx.fillRect(0, wallH - P * 2, canvasW, P * 2);
    ctx.fillStyle = room.wallAccent + "88";
    for (let wx = 0; wx < room.width; wx++) {
      if (wx % 3 === 0) {
        ctx.fillRect(wx * CELL + CELL / 2 - 1, P, 2, wallH - P * 3);
      }
    }
    // Baseboard
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, wallH, canvasW, P * 2);

    // Floor
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(0, wallH + P * 2, canvasW, canvasH - wallH - P * 2);
    // Floor pattern
    for (let fy = 3; fy < room.height; fy++) {
      for (let fx = 0; fx < room.width; fx++) {
        const isAlt = (fx + fy) % 2 === 0;
        if (isAlt) {
          ctx.fillStyle = "#00000008";
          ctx.fillRect(fx * CELL, fy * CELL, CELL, CELL);
        }
        // tile borders
        ctx.fillStyle = "#00000010";
        ctx.fillRect(fx * CELL, fy * CELL, CELL, 1);
        ctx.fillRect(fx * CELL, fy * CELL, 1, CELL);
      }
    }

    // Draw placed items (rugs first, then others)
    const items = placedItems[currentRoom] || [];
    const rugs = items.filter((i) => i.itemId.includes("rug"));
    const nonRugs = items.filter((i) => !i.itemId.includes("rug"));
    [...rugs, ...nonRugs].forEach((placed) => {
      const itemDef = ITEMS.find((i) => i.id === placed.itemId);
      if (itemDef) {
        const drawFn = itemDef.pixels(placed.x * CELL, placed.y * CELL);
        drawFn(ctx);
      }
    });

    // Hover preview
    if (selectedItem && hoverCell) {
      const itemDef = ITEMS.find((i) => i.id === selectedItem);
      if (itemDef) {
        ctx.globalAlpha = 0.5;
        const drawFn = itemDef.pixels(hoverCell.x * CELL, hoverCell.y * CELL);
        drawFn(ctx);
        ctx.globalAlpha = 1;
        // Grid highlight
        ctx.strokeStyle = canPlace(hoverCell.x, hoverCell.y, itemDef) ? "#2ecc71" : "#e74c3c";
        ctx.lineWidth = 2;
        ctx.strokeRect(hoverCell.x * CELL, hoverCell.y * CELL, itemDef.w * CELL, itemDef.h * CELL);
      }
    }

    // Draw Daniela
    drawDaniela(ctx, daniPos.x * CELL + P, daniPos.y * CELL - P * 6, frame);

    // Room label
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${P * 3}px monospace`;
    ctx.fillText(`${room.emoji} ${room.name}`, P * 2, P * 4);
  }, [currentRoom, placedItems, selectedItem, hoverCell, daniPos, frame, room, canvasW, canvasH]);

  useEffect(() => {
    draw();
  }, [draw]);

  function canPlace(cx, cy, itemDef) {
    if (cx < 0 || cy < 0 || cx + itemDef.w > room.width || cy + itemDef.h > room.height) return false;
    const items = placedItems[currentRoom] || [];
    for (const placed of items) {
      const pd = ITEMS.find((i) => i.id === placed.itemId);
      if (!pd) continue;
      if (
        cx < placed.x + pd.w &&
        cx + itemDef.w > placed.x &&
        cy < placed.y + pd.h &&
        cy + itemDef.h > placed.y
      )
        return false;
    }
    return true;
  }

  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasW / rect.width;
    const scaleY = canvasH / rect.height;
    const cx = Math.floor(((e.clientX - rect.left) * scaleX) / CELL);
    const cy = Math.floor(((e.clientY - rect.top) * scaleY) / CELL);

    if (selectedItem) {
      const itemDef = ITEMS.find((i) => i.id === selectedItem);
      if (itemDef && canPlace(cx, cy, itemDef)) {
        setPlacedItems((prev) => ({
          ...prev,
          [currentRoom]: [
            ...prev[currentRoom],
            { itemId: selectedItem, x: cx, y: cy, id: Date.now() },
          ],
        }));
        setShowHelp(false);
      }
    } else {
      // Check if clicking on existing item to remove
      const items = [...(placedItems[currentRoom] || [])].reverse();
      for (const placed of items) {
        const pd = ITEMS.find((i) => i.id === placed.itemId);
        if (pd && cx >= placed.x && cx < placed.x + pd.w && cy >= placed.y && cy < placed.y + pd.h) {
          setPlacedItems((prev) => ({
            ...prev,
            [currentRoom]: prev[currentRoom].filter((i) => i.id !== placed.id),
          }));
          return;
        }
      }
      // Move Dani
      setDaniPos({ x: cx, y: cy });
    }
  }

  function handleCanvasMove(e) {
    if (!selectedItem) {
      setHoverCell(null);
      return;
    }
    const r = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasW / r.width;
    const scaleY = canvasH / r.height;
    const cx = Math.floor(((e.clientX - r.left) * scaleX) / CELL);
    const cy = Math.floor(((e.clientY - r.top) * scaleY) / CELL);
    setHoverCell({ x: cx, y: cy });
  }

  function clearRoom() {
    setPlacedItems((prev) => ({ ...prev, [currentRoom]: [] }));
  }

  // Touch event helpers
  function getTouchCell(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    const r = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasW / r.width;
    const scaleY = canvasH / r.height;
    const cx = Math.floor(((touch.clientX - r.left) * scaleX) / CELL);
    const cy = Math.floor(((touch.clientY - r.top) * scaleY) / CELL);
    return { cx, cy };
  }

  function handleTouchStart(e) {
    e.preventDefault();
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (!selectedItem) {
      setHoverCell(null);
      return;
    }
    const { cx, cy } = getTouchCell(e);
    setHoverCell({ x: cx, y: cy });
  }

  function handleTouchEnd(e) {
    e.preventDefault();
    // Reuse handleCanvasClick logic with synthetic coords derived from touch
    const touch = e.changedTouches[0] || e.touches[0];
    const syntheticEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
    handleCanvasClick(syntheticEvent);
  }

  const filteredItems = category === "all" ? ITEMS : ITEMS.filter((i) => i.category === category);

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${PAL.bg} 0%, #0f0f23 100%)`,
        minHeight: "100vh",
        fontFamily: "'Courier New', monospace",
        color: PAL.text,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(90deg, ${PAL.panel}, ${PAL.panelLight})`,
          borderBottom: `3px solid ${PAL.accent}`,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏠</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: PAL.accentSoft, letterSpacing: 1 }}>
              Daniela Suh's Home
            </div>
            <div style={{ fontSize: 10, color: PAL.textDim }}>Pixel Decorator</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              background: PAL.accent + "33",
              color: PAL.gold,
              padding: "4px 10px",
              borderRadius: 12,
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            🪑 {itemCount} items
          </span>
          <button
            onClick={() => setShowHelp((h) => !h)}
            style={{
              background: PAL.purple + "44",
              border: "1px solid " + PAL.purple,
              color: PAL.purple,
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ?
          </button>
        </div>
      </div>

      {/* Help Banner */}
      {showHelp && (
        <div
          style={{
            background: PAL.purple + "22",
            borderBottom: "1px solid " + PAL.purple + "44",
            padding: "8px 16px",
            fontSize: 11,
            color: PAL.purple,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span>💡</span>
          <span>
            Select an item below, then click the room to place it. Click placed items to remove.
            Click empty space to move Dani!
          </span>
          <button
            onClick={() => {
              setShowHelp(false);
              if (typeof window !== "undefined") {
                localStorage.setItem("dani_help_dismissed", "1");
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: PAL.purple,
              cursor: "pointer",
              marginLeft: "auto",
              fontSize: 14,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Room Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "8px 8px 0",
          flexShrink: 0,
        }}
      >
        {Object.entries(ROOMS).map(([key, r]) => (
          <button
            key={key}
            onClick={() => {
              setCurrentRoom(key);
              setSelectedItem(null);
              setHoverCell(null);
            }}
            style={{
              flex: 1,
              background: currentRoom === key ? PAL.accent : PAL.panel,
              border: "none",
              color: currentRoom === key ? "#fff" : PAL.textDim,
              padding: "6px 4px",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontSize: currentRoom === key ? 11 : 16,
              fontWeight: currentRoom === key ? "bold" : "normal",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              minHeight: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{r.emoji}</span>
            {currentRoom === key && (
              <span style={{ fontSize: 9 }}>{r.name}</span>
            )}
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 8,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoverCell(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            imageRendering: "pixelated",
            cursor: selectedItem ? "crosshair" : "pointer",
            borderRadius: 4,
            boxShadow: `0 0 20px ${PAL.accent}33, 0 4px 12px #0008`,
            border: `2px solid ${PAL.accent}44`,
            touchAction: "none",
          }}
        />
      </div>

      {/* Bottom Panel */}
      <div
        style={{
          background: PAL.panel,
          borderTop: `2px solid ${PAL.accent}44`,
          flexShrink: 0,
          maxHeight: "45vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Category Filter + Actions */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "6px 8px",
            overflowX: "auto",
            alignItems: "center",
            borderBottom: "1px solid #ffffff10",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                background: category === cat.id ? PAL.gold + "33" : "transparent",
                border: category === cat.id ? `1px solid ${PAL.gold}66` : "1px solid transparent",
                color: category === cat.id ? PAL.gold : PAL.textDim,
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 10,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                minHeight: 44,
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          {selectedItem && (
            <button
              onClick={() => {
                setSelectedItem(null);
                setHoverCell(null);
              }}
              style={{
                background: PAL.accent + "44",
                border: "1px solid " + PAL.accent,
                color: PAL.accent,
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 10,
                fontFamily: "inherit",
                minHeight: 44,
              }}
            >
              ✕ Deselect
            </button>
          )}
          <button
            onClick={clearRoom}
            style={{
              background: "#e74c3c22",
              border: "1px solid #e74c3c44",
              color: "#e74c3c",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "inherit",
              minHeight: 44,
            }}
          >
            🗑 Clear
          </button>
        </div>

        {/* Items Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
            gap: 6,
            padding: "8px",
            overflowY: "auto",
            maxHeight: 160,
            flex: 1,
          }}
        >
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedItem(selectedItem === item.id ? null : item.id);
                setHoverCell(null);
              }}
              style={{
                background:
                  selectedItem === item.id
                    ? PAL.accent + "44"
                    : PAL.panelLight,
                border:
                  selectedItem === item.id
                    ? `2px solid ${PAL.accent}`
                    : "2px solid transparent",
                borderRadius: 8,
                cursor: "pointer",
                padding: "6px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                transition: "all 0.15s",
                minHeight: 44,
              }}
            >
              <ItemPreview item={item} />
              <span
                style={{
                  fontSize: 9,
                  color: selectedItem === item.id ? PAL.accentSoft : PAL.textDim,
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {item.name}
              </span>
              <span style={{ fontSize: 8, color: PAL.textDim + "88" }}>
                {item.w}×{item.h}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Item Preview Component ───
function ItemPreview({ item }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const w = item.w * CELL;
    const h = item.h * CELL;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    const drawFn = item.pixels(0, 0);
    drawFn(ctx);
  }, [item]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: Math.min(50, item.w * 18),
        height: Math.min(40, item.h * 14),
        imageRendering: "pixelated",
      }}
    />
  );
}
