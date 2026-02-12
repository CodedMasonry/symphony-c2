import {
  StandardIdentity,
  SymbolSet,
  AirEntity,
  LandEquipmentEntity,
  SeaEntity,
} from "@/generated/base";
import { ObjectWithUlid } from "@/lib/proto_api";
import { getIdentityCanvasColors } from "@/lib/colors";

/* ─────────────────────────────────────────────────────────────────────────
 * DESIGN SYSTEM
 *
 * Affiliation → outer shape + color
 *   HOSTILE        → sharp octagon,  red
 *   FRIEND         → rounded hexagon, blue
 *   NEUTRAL        → circle,          green
 *   ASSUMED FRIEND → rounded hexagon, sky   (dashed border)
 *   SUSPECT        → octagon,         orange (dashed border)
 *   PENDING        → circle,          amber  (dashed border)
 *   UNKNOWN        → diamond,         slate
 *
 * Domain → inner SVG path silhouette drawn in white at ~50% of icon size
 *
 * NOTE: Colors are now managed in @/lib/unified-colors.ts
 * Update Tailwind shades there to change colors across the entire app.
 * ────────────────────────────────────────────────────────────────────────*/

interface IdentityStyle {
  fill: string; // shape fill color
  stroke: string; // border color (slightly lighter)
  shape: ShapeType;
  dashed: boolean; // dashed border = unconfirmed
}

type ShapeType = "octagon" | "hexagon" | "circle" | "diamond" | "square";

/**
 * Generate complete identity style from unified color system
 */
function getIdentityStyle(identity: StandardIdentity): IdentityStyle {
  const colors = getIdentityCanvasColors(identity);

  // Shape and dashed pattern per identity
  const shapeConfig: Record<
    StandardIdentity,
    { shape: ShapeType; dashed: boolean }
  > = {
    [StandardIdentity.STANDARD_IDENTITY_HOSTILE]: {
      shape: "octagon",
      dashed: false,
    },
    [StandardIdentity.STANDARD_IDENTITY_FRIEND]: {
      shape: "hexagon",
      dashed: false,
    },
    [StandardIdentity.STANDARD_IDENTITY_NEUTRAL]: {
      shape: "circle",
      dashed: false,
    },
    [StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND]: {
      shape: "hexagon",
      dashed: true,
    },
    [StandardIdentity.STANDARD_IDENTITY_SUSPECT]: {
      shape: "octagon",
      dashed: true,
    },
    [StandardIdentity.STANDARD_IDENTITY_PENDING]: {
      shape: "circle",
      dashed: true,
    },
    [StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED]: {
      shape: "diamond",
      dashed: false,
    },
    [StandardIdentity.UNRECOGNIZED]: {
      shape: "diamond",
      dashed: false,
    },
  };

  const config =
    shapeConfig[identity] ??
    shapeConfig[StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED];

  return {
    fill: colors.fill,
    stroke: colors.stroke,
    shape: config.shape,
    dashed: config.dashed,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * SHAPE PATHS  (all normalized to a 1x1 unit square, centered at 0.5,0.5)
 * ────────────────────────────────────────────────────────────────────────*/

function octagonPoints(cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: 8 }, (_, i) => {
    const angle = Math.PI / 8 + (i * Math.PI) / 4;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as [
      number,
      number,
    ];
  });
}

function hexagonPoints(cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 6 + (i * Math.PI) / 3; // flat-top
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as [
      number,
      number,
    ];
  });
}

function diamondPoints(cx: number, cy: number, r: number): [number, number][] {
  return [
    [cx, cy - r],
    [cx + r * 0.75, cy],
    [cx, cy + r],
    [cx - r * 0.75, cy],
  ];
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++)
    ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

/* ─────────────────────────────────────────────────────────────────────────
 * DOMAIN ICON PATHS
 * Each function draws a centered SVG-style path onto the canvas.
 * The canvas is SIZE×SIZE; icons are drawn in a sub-region of ~SIZE*0.45.
 * ────────────────────────────────────────────────────────────────────────*/

const SIZE = 64; // logical icon size in px
const PAD = 20; // extra space on each side so glow never clips
const TOTAL = SIZE + PAD * 2; // actual canvas dimensions
const C = TOTAL / 2; // center of canvas (== SIZE/2 + PAD)
const ICON = SIZE * 0.22; // half-size of inner icon area

/** Exported so Cesium can compensate for the transparent padding around the icon */
export const ICON_PAD = PAD;

type DrawFn = (ctx: CanvasRenderingContext2D) => void;

// ── Air ──────────────────────────────────────────────────────────────────
const drawAircraft: DrawFn = (ctx) => {
  // Simple top-down fixed-wing silhouette
  ctx.beginPath();
  // Fuselage
  ctx.moveTo(C, C - ICON * 1.1);
  ctx.lineTo(C + ICON * 0.18, C + ICON * 0.9);
  ctx.lineTo(C, C + ICON * 0.6);
  ctx.lineTo(C - ICON * 0.18, C + ICON * 0.9);
  ctx.closePath();
  ctx.fill();
  // Left wing
  ctx.beginPath();
  ctx.moveTo(C - ICON * 0.12, C - ICON * 0.1);
  ctx.lineTo(C - ICON * 1.1, C + ICON * 0.35);
  ctx.lineTo(C - ICON * 0.8, C + ICON * 0.45);
  ctx.lineTo(C - ICON * 0.1, C + ICON * 0.1);
  ctx.closePath();
  ctx.fill();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(C + ICON * 0.12, C - ICON * 0.1);
  ctx.lineTo(C + ICON * 1.1, C + ICON * 0.35);
  ctx.lineTo(C + ICON * 0.8, C + ICON * 0.45);
  ctx.lineTo(C + ICON * 0.1, C + ICON * 0.1);
  ctx.closePath();
  ctx.fill();
  // Tail
  ctx.beginPath();
  ctx.moveTo(C - ICON * 0.08, C + ICON * 0.55);
  ctx.lineTo(C - ICON * 0.45, C + ICON * 0.9);
  ctx.lineTo(C - ICON * 0.3, C + ICON * 0.95);
  ctx.lineTo(C, C + ICON * 0.7);
  ctx.lineTo(C + ICON * 0.3, C + ICON * 0.95);
  ctx.lineTo(C + ICON * 0.45, C + ICON * 0.9);
  ctx.lineTo(C + ICON * 0.08, C + ICON * 0.55);
  ctx.closePath();
  ctx.fill();
};

const drawHelicopter: DrawFn = (ctx) => {
  // Body oval
  ctx.beginPath();
  ctx.ellipse(C, C + ICON * 0.1, ICON * 0.55, ICON * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tail boom
  ctx.beginPath();
  ctx.moveTo(C + ICON * 0.5, C + ICON * 0.08);
  ctx.lineTo(C + ICON * 1.1, C - ICON * 0.1);
  ctx.lineWidth = SIZE * 0.05;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.stroke();
  // Main rotor disc (thin ellipse outline)
  ctx.beginPath();
  ctx.ellipse(C, C - ICON * 0.3, ICON * 1.05, ICON * 0.12, 0, 0, Math.PI * 2);
  ctx.lineWidth = SIZE * 0.04;
  ctx.stroke();
  // Tail rotor
  ctx.beginPath();
  ctx.ellipse(
    C + ICON * 1.1,
    C - ICON * 0.1,
    ICON * 0.06,
    ICON * 0.28,
    0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
};

const drawUAV: DrawFn = (ctx) => {
  // Delta / flying-wing silhouette
  ctx.beginPath();
  ctx.moveTo(C, C - ICON * 0.9);
  ctx.lineTo(C + ICON * 1.1, C + ICON * 0.7);
  ctx.lineTo(C + ICON * 0.15, C + ICON * 0.3);
  ctx.lineTo(C, C + ICON * 0.5);
  ctx.lineTo(C - ICON * 0.15, C + ICON * 0.3);
  ctx.lineTo(C - ICON * 1.1, C + ICON * 0.7);
  ctx.closePath();
  ctx.fill();
};

const drawMissile: DrawFn = (ctx) => {
  // Vertical missile
  ctx.beginPath();
  // Body
  ctx.roundRect(C - ICON * 0.18, C - ICON * 0.7, ICON * 0.36, ICON * 1.2, 4);
  ctx.fill();
  // Nose cone
  ctx.beginPath();
  ctx.moveTo(C, C - ICON * 1.1);
  ctx.lineTo(C + ICON * 0.18, C - ICON * 0.7);
  ctx.lineTo(C - ICON * 0.18, C - ICON * 0.7);
  ctx.closePath();
  ctx.fill();
  // Fins
  ctx.beginPath();
  ctx.moveTo(C - ICON * 0.18, C + ICON * 0.4);
  ctx.lineTo(C - ICON * 0.55, C + ICON * 0.8);
  ctx.lineTo(C - ICON * 0.18, C + ICON * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(C + ICON * 0.18, C + ICON * 0.4);
  ctx.lineTo(C + ICON * 0.55, C + ICON * 0.8);
  ctx.lineTo(C + ICON * 0.18, C + ICON * 0.6);
  ctx.closePath();
  ctx.fill();
};

// ── Land ─────────────────────────────────────────────────────────────────
const drawTank: DrawFn = (ctx) => {
  // Hull (top-down)
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.75, C - ICON * 0.45, ICON * 1.5, ICON * 0.9, 6);
  ctx.fill();
  // Turret circle
  ctx.beginPath();
  ctx.arc(C, C - ICON * 0.05, ICON * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  // Gun barrel
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.06, C - ICON * 1.05, ICON * 0.12, ICON * 0.72, 3);
  ctx.fill();
  // Tracks
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.85, C - ICON * 0.58, ICON * 0.18, ICON * 1.16, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(C + ICON * 0.67, C - ICON * 0.58, ICON * 0.18, ICON * 1.16, 4);
  ctx.fill();
};

const drawAPC: DrawFn = (ctx) => {
  // Wider, boxier hull than tank
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.82, C - ICON * 0.55, ICON * 1.64, ICON * 1.0, 8);
  ctx.fill();
  // Small roof hatch
  ctx.beginPath();
  ctx.arc(C, C - ICON * 0.1, ICON * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  // Tracks
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.9, C - ICON * 0.65, ICON * 0.16, ICON * 1.2, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(C + ICON * 0.74, C - ICON * 0.65, ICON * 0.16, ICON * 1.2, 3);
  ctx.fill();
};

const drawTruck: DrawFn = (ctx) => {
  // Side-profile truck (simple)
  // Cargo box
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.75, C - ICON * 0.55, ICON * 1.1, ICON * 0.85, 4);
  ctx.fill();
  // Cab
  ctx.beginPath();
  ctx.roundRect(C + ICON * 0.3, C - ICON * 0.35, ICON * 0.52, ICON * 0.65, 6);
  ctx.fill();
  // Wheels
  ctx.beginPath();
  ctx.arc(C - ICON * 0.35, C + ICON * 0.42, ICON * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(C + ICON * 0.6, C + ICON * 0.42, ICON * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
};

const drawLauncher: DrawFn = (ctx) => {
  // Vehicle base
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.75, C + ICON * 0.1, ICON * 1.5, ICON * 0.6, 5);
  ctx.fill();
  // Launch tubes (3 angled lines)
  ctx.lineWidth = SIZE * 0.06;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineCap = "round";
  [
    [-0.35, 0],
    [0, 0],
    [0.35, 0],
  ].forEach(([ox]) => {
    ctx.beginPath();
    ctx.moveTo(C + ox * ICON * 1.2, C + ICON * 0.1);
    ctx.lineTo(C + ox * ICON * 0.6, C - ICON * 0.9);
    ctx.stroke();
  });
};

const drawGroundStation: DrawFn = (ctx) => {
  // Dish base
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.2, C + ICON * 0.2, ICON * 0.4, ICON * 0.6, 3);
  ctx.fill();
  // Dish arc
  ctx.beginPath();
  ctx.arc(
    C - ICON * 0.3,
    C + ICON * 0.1,
    ICON * 0.75,
    Math.PI * 1.1,
    Math.PI * 1.9,
  );
  ctx.lineWidth = SIZE * 0.07;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.stroke();
  // Signal lines
  [0.3, 0.55, 0.8].forEach((r) => {
    ctx.beginPath();
    ctx.arc(
      C - ICON * 0.3,
      C + ICON * 0.1,
      ICON * r,
      Math.PI * 1.15,
      Math.PI * 1.85,
    );
    ctx.lineWidth = SIZE * 0.025;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
};

// ── Sea ──────────────────────────────────────────────────────────────────
const drawShip: DrawFn = (ctx) => {
  // Top-down hull (elongated teardrop)
  ctx.beginPath();
  ctx.moveTo(C, C - ICON * 1.05);
  ctx.bezierCurveTo(
    C + ICON * 0.55,
    C - ICON * 0.6,
    C + ICON * 0.55,
    C + ICON * 0.5,
    C,
    C + ICON * 0.85,
  );
  ctx.bezierCurveTo(
    C - ICON * 0.55,
    C + ICON * 0.5,
    C - ICON * 0.55,
    C - ICON * 0.6,
    C,
    C - ICON * 1.05,
  );
  ctx.closePath();
  ctx.fill();
  // Superstructure centerline
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.1, C - ICON * 0.5, ICON * 0.2, ICON * 0.7, 3);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
};

const drawCarrier: DrawFn = (ctx) => {
  // Wide flat deck
  ctx.beginPath();
  ctx.roundRect(C - ICON * 1.05, C - ICON * 0.38, ICON * 2.1, ICON * 0.72, 5);
  ctx.fill();
  // Island superstructure (offset to starboard)
  ctx.beginPath();
  ctx.roundRect(C + ICON * 0.45, C - ICON * 0.75, ICON * 0.38, ICON * 0.42, 3);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  // Flight deck centerline
  ctx.beginPath();
  ctx.roundRect(C - ICON * 0.95, C - ICON * 0.05, ICON * 1.8, ICON * 0.06, 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
};

const drawUSV: DrawFn = (ctx) => {
  // Sleek narrow hull
  ctx.beginPath();
  ctx.moveTo(C, C - ICON * 1.05);
  ctx.bezierCurveTo(
    C + ICON * 0.28,
    C - ICON * 0.4,
    C + ICON * 0.28,
    C + ICON * 0.6,
    C,
    C + ICON * 0.9,
  );
  ctx.bezierCurveTo(
    C - ICON * 0.28,
    C + ICON * 0.6,
    C - ICON * 0.28,
    C - ICON * 0.4,
    C,
    C - ICON * 1.05,
  );
  ctx.fill();
  // Sensor mast dot
  ctx.beginPath();
  ctx.arc(C, C - ICON * 0.2, ICON * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
};

// ── Fallback ─────────────────────────────────────────────────────────────
const drawUnknown: DrawFn = (ctx) => {
  ctx.beginPath();
  ctx.arc(C, C, ICON * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  // Question-mark-ish cross
  ctx.font = `bold ${Math.round(ICON * 1.2)}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", C, C + ICON * 0.08);
};

/* ─────────────────────────────────────────────────────────────────────────
 * DOMAIN → DRAW FUNCTION LOOKUP
 * ────────────────────────────────────────────────────────────────────────*/

function getDomainDraw(obj: ObjectWithUlid): DrawFn {
  switch (obj.symbolSet) {
    case SymbolSet.SYMBOL_SET_AIR:
    case SymbolSet.SYMBOL_SET_AIR_MISSILE:
      switch (obj.airEntity) {
        case AirEntity.AIR_ENTITY_MILITARY_HELICOPTER:
        case AirEntity.AIR_ENTITY_CIVILIAN_HELICOPTER:
          return drawHelicopter;
        case AirEntity.AIR_ENTITY_UAV_FIXED_WING:
        case AirEntity.AIR_ENTITY_UAV_ROTARY_WING:
          return drawUAV;
        case AirEntity.AIR_ENTITY_MISSILE:
        case AirEntity.AIR_ENTITY_MISSILE_DECOY:
          return drawMissile;
        default:
          return drawAircraft;
      }

    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
    case SymbolSet.SYMBOL_SET_LAND_UNIT:
      switch (obj.landEquipmentEntity) {
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_TANK:
          return drawTank;
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_APC:
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_ARMORED_VEHICLE:
          return drawAPC;
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_TRUCK:
          return drawTruck;
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_LAUNCHER:
          return drawLauncher;
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_GROUND_STATION:
          return drawGroundStation;
        default:
          return drawTruck;
      }

    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      switch (obj.seaEntity) {
        case SeaEntity.SEA_ENTITY_CARRIER:
          return drawCarrier;
        case SeaEntity.SEA_ENTITY_USV:
          return drawUSV;
        default:
          return drawShip;
      }

    case SymbolSet.SYMBOL_SET_SPACE:
      return drawMissile; // reuse for now

    default:
      return drawUnknown;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * SHAPE RENDERER
 * ────────────────────────────────────────────────────────────────────────*/

function drawShape(
  ctx: CanvasRenderingContext2D,
  style: IdentityStyle,
  selected: boolean,
) {
  const r = SIZE * 0.42;
  ctx.save();

  // Glow / drop-shadow for selected state
  if (selected) {
    ctx.shadowColor = style.stroke;
    ctx.shadowBlur = SIZE * 0.35;
  } else {
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = SIZE * 0.12;
  }

  if (style.dashed) {
    ctx.setLineDash([SIZE * 0.07, SIZE * 0.05]);
  }

  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = selected ? SIZE * 0.075 : SIZE * 0.055;
  ctx.fillStyle = style.fill;

  switch (style.shape) {
    case "octagon":
      drawPolygon(ctx, octagonPoints(C, C, r));
      break;
    case "hexagon":
      drawPolygon(ctx, hexagonPoints(C, C, r));
      break;
    case "circle":
      ctx.beginPath();
      ctx.arc(C, C, r, 0, Math.PI * 2);
      break;
    case "diamond":
      drawPolygon(ctx, diamondPoints(C, C, r));
      break;
    case "square":
      ctx.beginPath();
      ctx.roundRect(C - r * 0.88, C - r * 0.88, r * 1.76, r * 1.76, 6);
      break;
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────
 * MAIN ICON BUILDER
 * ────────────────────────────────────────────────────────────────────────*/

const iconCache = new Map<string, HTMLCanvasElement>();

function iconKey(obj: ObjectWithUlid, selected: boolean): string {
  return [
    obj.standardIdentity,
    obj.symbolSet,
    obj.airEntity ?? "",
    obj.landEquipmentEntity ?? "",
    obj.seaEntity ?? "",
    obj.status,
    selected,
  ].join("|");
}

export function buildIcon(
  obj: ObjectWithUlid,
  selected: boolean,
): HTMLCanvasElement {
  const key = iconKey(obj, selected);
  if (iconCache.has(key)) return iconCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = TOTAL;
  canvas.height = TOTAL;
  const ctx = canvas.getContext("2d")!;

  const style = getIdentityStyle(obj.standardIdentity);

  // 1. Background shape (affiliation)
  drawShape(ctx, style, selected);

  // 2. Domain icon (white, on top)
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.strokeStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth = SIZE * 0.045;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([]);

  const drawDomain = getDomainDraw(obj);
  drawDomain(ctx);

  iconCache.set(key, canvas);
  return canvas;
}

export function clearIconCache() {
  iconCache.clear();
}
