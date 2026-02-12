import { StandardIdentity, SymbolSet } from "@/generated/base";

/* ─────────────────────────────────────────────────────────────────────────
 * UNIFIED COLOR SYSTEM - HEX-FIRST APPROACH
 *
 * Single source of truth for all colors across:
 * - Canvas icon rendering (hex values)
 * - UI components (Tailwind static class strings)
 * - Consistent theming throughout the app
 *
 * Philosophy: Define colors as hex values alongside their corresponding
 * full Tailwind class strings. Classes must NEVER be constructed via
 * string interpolation — Tailwind's scanner requires complete class names
 * to exist as literals at build time or they will be purged.
 * ────────────────────────────────────────────────────────────────────────*/

/* ─────────────────────────────────────────────────────────────────────────
 * IDENTITY COLOR DEFINITIONS
 * ────────────────────────────────────────────────────────────────────────*/

interface IdentityColors {
  /** Primary color - darker shade for fills */
  primary: string;
  /** Accent color - lighter shade for borders/strokes */
  accent: string;
  /** Text color for dark backgrounds */
  text: string;
  /** UI element color (borders, dots, etc.) */
  ui: string;
  /** Badge: bg + text + border — must be a complete static string */
  badge: string;
  /** Left border accent */
  border: string;
  /** Dot indicator background */
  dot: string;
  /** Header / label text */
  headerText: string;
  /** Ring for selected state */
  ring: string;
}

const IDENTITY_COLORS: Record<StandardIdentity, IdentityColors> = {
  [StandardIdentity.STANDARD_IDENTITY_HOSTILE]: {
    primary: "#b91c1c", // red-700
    accent: "#ef4444", // red-500
    text: "#fca5a5", // red-300
    ui: "#ef4444", // red-500
    badge: "bg-red-600/20 text-red-300 border-red-600/40",
    border: "border-l-red-500",
    dot: "bg-red-500",
    headerText: "text-red-400",
    ring: "ring-red-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_FRIEND]: {
    primary: "#1d4ed8", // blue-700
    accent: "#3b82f6", // blue-500
    text: "#93c5fd", // blue-300
    ui: "#3b82f6", // blue-500
    badge: "bg-blue-600/20 text-blue-300 border-blue-600/40",
    border: "border-l-blue-500",
    dot: "bg-blue-500",
    headerText: "text-blue-400",
    ring: "ring-blue-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_NEUTRAL]: {
    primary: "#15803d", // green-700
    accent: "#22c55e", // green-500
    text: "#86efac", // green-300
    ui: "#22c55e", // green-500
    badge: "bg-green-600/20 text-green-300 border-green-600/40",
    border: "border-l-green-500",
    dot: "bg-green-500",
    headerText: "text-green-400",
    ring: "ring-green-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND]: {
    primary: "#0369a1", // sky-700
    accent: "#38bdf8", // sky-400
    text: "#7dd3fc", // sky-300
    ui: "#38bdf8", // sky-400
    badge: "bg-sky-600/20 text-sky-300 border-sky-600/40",
    border: "border-l-sky-500",
    dot: "bg-sky-500",
    headerText: "text-sky-400",
    ring: "ring-sky-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_SUSPECT]: {
    primary: "#c2410c", // orange-700
    accent: "#f97316", // orange-500
    text: "#fdba74", // orange-300
    ui: "#fb923c", // orange-400
    badge: "bg-orange-600/20 text-orange-300 border-orange-600/40",
    border: "border-l-orange-500",
    dot: "bg-orange-500",
    headerText: "text-orange-400",
    ring: "ring-orange-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_PENDING]: {
    primary: "#b45309", // amber-700
    accent: "#f59e0b", // amber-500
    text: "#fcd34d", // amber-300
    ui: "#fbbf24", // amber-400
    badge: "bg-amber-600/20 text-amber-300 border-amber-600/40",
    border: "border-l-amber-500",
    dot: "bg-amber-500",
    headerText: "text-amber-400",
    ring: "ring-amber-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED]: {
    primary: "#334155", // slate-700
    accent: "#94a3b8", // slate-400
    text: "#cbd5e1", // slate-300
    ui: "#64748b", // slate-500
    badge: "bg-slate-600/20 text-slate-300 border-slate-600/40",
    border: "border-l-slate-500",
    dot: "bg-slate-500",
    headerText: "text-slate-400",
    ring: "ring-slate-500",
  },
  [StandardIdentity.UNRECOGNIZED]: {
    primary: "#334155", // slate-700
    accent: "#94a3b8", // slate-400
    text: "#cbd5e1", // slate-300
    ui: "#64748b", // slate-500
    badge: "bg-slate-600/20 text-slate-300 border-slate-600/40",
    border: "border-l-slate-500",
    dot: "bg-slate-500",
    headerText: "text-slate-400",
    ring: "ring-slate-500",
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * SYMBOL SET COLOR DEFINITIONS
 * ────────────────────────────────────────────────────────────────────────*/

interface SymbolSetColors {
  /** Background color for canvas badges */
  background: string;
  /** Text color */
  text: string;
  /** Border color */
  border: string;
  /** Badge: bg + text + border — must be a complete static string */
  badge: string;
}

const SYMBOL_SET_COLORS: Record<SymbolSet, SymbolSetColors> = {
  [SymbolSet.SYMBOL_SET_AIR]: {
    background: "#0c4a6e", // sky-900
    text: "#38bdf8", // sky-400
    border: "#0369a1", // sky-700
    badge: "bg-sky-900/40 text-sky-400 border-sky-700/40",
  },
  [SymbolSet.SYMBOL_SET_AIR_MISSILE]: {
    background: "#7f1d1d", // red-900
    text: "#60a5fa", // blue-400 (for visibility on red bg)
    border: "#b91c1c", // red-700
    badge: "bg-red-900/40 text-red-400 border-red-700/40",
  },
  [SymbolSet.SYMBOL_SET_SPACE]: {
    background: "#581c87", // purple-900
    text: "#c084fc", // purple-400
    border: "#7e22ce", // purple-700
    badge: "bg-purple-900/40 text-purple-400 border-purple-700/40",
  },
  [SymbolSet.SYMBOL_SET_LAND_UNIT]: {
    background: "#14532d", // green-900
    text: "#4ade80", // green-400
    border: "#15803d", // green-700
    badge: "bg-green-900/40 text-green-400 border-green-700/40",
  },
  [SymbolSet.SYMBOL_SET_LAND_CIVILIAN]: {
    background: "#1e293b", // slate-800
    text: "#94a3b8", // slate-400
    border: "#475569", // slate-600
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.SYMBOL_SET_LAND_EQUIPMENT]: {
    background: "#78350f", // amber-900
    text: "#fbbf24", // amber-400
    border: "#b45309", // amber-700
    badge: "bg-amber-900/40 text-amber-400 border-amber-700/40",
  },
  [SymbolSet.SYMBOL_SET_SEA_SURFACE]: {
    background: "#1e3a8a", // blue-900
    text: "#60a5fa", // blue-400
    border: "#1d4ed8", // blue-700
    badge: "bg-blue-900/40 text-blue-400 border-blue-700/40",
  },
  [SymbolSet.SYMBOL_SET_SEA_SUBSURFACE]: {
    background: "#312e81", // indigo-900
    text: "#818cf8", // indigo-400
    border: "#4338ca", // indigo-700
    badge: "bg-indigo-900/40 text-indigo-400 border-indigo-700/40",
  },
  [SymbolSet.SYMBOL_SET_ACTIVITIES]: {
    background: "#1e293b", // slate-800
    text: "#94a3b8", // slate-400
    border: "#475569", // slate-600
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.SYMBOL_SET_INSTALLATIONS]: {
    background: "#1e293b", // slate-800
    text: "#94a3b8", // slate-400
    border: "#475569", // slate-600
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.SYMBOL_SET_UNSPECIFIED]: {
    background: "#1e293b", // slate-800
    text: "#94a3b8", // slate-400
    border: "#475569", // slate-600
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.UNRECOGNIZED]: {
    background: "#1e293b", // slate-800
    text: "#94a3b8", // slate-400
    border: "#475569", // slate-600
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * IDENTITY API
 * ────────────────────────────────────────────────────────────────────────*/

/**
 * Get hex colors for canvas rendering (icons)
 */
export function getIdentityCanvasColors(identity: StandardIdentity) {
  const colors =
    IDENTITY_COLORS[identity] ??
    IDENTITY_COLORS[StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED];

  return {
    fill: colors.primary,
    stroke: colors.accent,
  };
}

/**
 * Get all hex colors for an identity
 */
export function getIdentityHexColors(identity: StandardIdentity) {
  const colors =
    IDENTITY_COLORS[identity] ??
    IDENTITY_COLORS[StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED];

  return {
    primary: colors.primary,
    accent: colors.accent,
    text: colors.text,
    ui: colors.ui,
  };
}

/**
 * Get Tailwind class strings for UI components
 */
export function getIdentityTailwindClasses(identity: StandardIdentity) {
  const colors =
    IDENTITY_COLORS[identity] ??
    IDENTITY_COLORS[StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED];

  return {
    badge: colors.badge,
    border: colors.border,
    dot: colors.dot,
    headerText: colors.headerText,
    ring: colors.ring,
  };
}

/**
 * Get human-readable label for identity
 */
export function getIdentityLabel(identity: StandardIdentity): string {
  switch (identity) {
    case StandardIdentity.STANDARD_IDENTITY_FRIEND:
      return "Friend";
    case StandardIdentity.STANDARD_IDENTITY_HOSTILE:
      return "Hostile";
    case StandardIdentity.STANDARD_IDENTITY_NEUTRAL:
      return "Neutral";
    case StandardIdentity.STANDARD_IDENTITY_PENDING:
      return "Pending";
    case StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND:
      return "Assumed";
    case StandardIdentity.STANDARD_IDENTITY_SUSPECT:
      return "Suspect";
    default:
      return "Unknown";
  }
}

/**
 * Get all styling data for a given identity
 */
export function getIdentityStyles(identity: StandardIdentity) {
  return {
    label: getIdentityLabel(identity),
    canvas: getIdentityCanvasColors(identity),
    tailwind: getIdentityTailwindClasses(identity),
    hex: getIdentityHexColors(identity),
  };
}

/**
 * Backward-compatible IDENTITY_CONFIG export
 */
export const IDENTITY_CONFIG = Object.fromEntries(
  Object.values(StandardIdentity)
    .filter((val): val is StandardIdentity => typeof val === "number")
    .map((identity) => {
      const tailwind = getIdentityTailwindClasses(identity);
      return [
        identity,
        {
          label: getIdentityLabel(identity),
          badge: tailwind.badge,
          border: tailwind.border,
          dot: tailwind.dot,
          headerText: tailwind.headerText,
          variant: "outline" as const,
          ring: tailwind.ring,
        },
      ];
    }),
) as Record<
  StandardIdentity,
  {
    label: string;
    badge: string;
    border: string;
    dot: string;
    headerText: string;
    variant: "outline";
    ring: string;
  }
>;

/* ─────────────────────────────────────────────────────────────────────────
 * SYMBOL SET API
 * ────────────────────────────────────────────────────────────────────────*/

/**
 * Get hex colors for symbol set canvas rendering
 */
export function getSymbolSetCanvasColors(symbolSet: SymbolSet) {
  const colors =
    SYMBOL_SET_COLORS[symbolSet] ??
    SYMBOL_SET_COLORS[SymbolSet.SYMBOL_SET_UNSPECIFIED];

  return {
    background: colors.background,
    text: colors.text,
    border: colors.border,
  };
}

/**
 * Get all hex colors for a symbol set
 */
export function getSymbolSetHexColors(symbolSet: SymbolSet) {
  const colors =
    SYMBOL_SET_COLORS[symbolSet] ??
    SYMBOL_SET_COLORS[SymbolSet.SYMBOL_SET_UNSPECIFIED];

  return {
    background: colors.background,
    text: colors.text,
    border: colors.border,
  };
}

/**
 * Get Tailwind badge class for symbol set
 */
export function getSymbolSetBadgeClass(symbolSet: SymbolSet): string {
  const colors =
    SYMBOL_SET_COLORS[symbolSet] ??
    SYMBOL_SET_COLORS[SymbolSet.SYMBOL_SET_UNSPECIFIED];

  return colors.badge;
}

/**
 * Get human-readable labels for symbol set
 */
export function getSymbolSetLabels(symbolSet: SymbolSet): {
  label: string;
  shortLabel: string;
} {
  const labelMap: Record<SymbolSet, { label: string; shortLabel: string }> = {
    [SymbolSet.SYMBOL_SET_AIR]: { label: "Air", shortLabel: "AIR" },
    [SymbolSet.SYMBOL_SET_AIR_MISSILE]: {
      label: "Air Missile",
      shortLabel: "MSL",
    },
    [SymbolSet.SYMBOL_SET_SPACE]: { label: "Space", shortLabel: "SPC" },
    [SymbolSet.SYMBOL_SET_LAND_UNIT]: {
      label: "Land Unit",
      shortLabel: "UNIT",
    },
    [SymbolSet.SYMBOL_SET_LAND_CIVILIAN]: {
      label: "Civilian",
      shortLabel: "CIV",
    },
    [SymbolSet.SYMBOL_SET_LAND_EQUIPMENT]: {
      label: "Land Equip.",
      shortLabel: "EQP",
    },
    [SymbolSet.SYMBOL_SET_SEA_SURFACE]: {
      label: "Sea Surface",
      shortLabel: "SEA",
    },
    [SymbolSet.SYMBOL_SET_SEA_SUBSURFACE]: {
      label: "Subsurface",
      shortLabel: "SUB",
    },
    [SymbolSet.SYMBOL_SET_ACTIVITIES]: {
      label: "Activities",
      shortLabel: "ACT",
    },
    [SymbolSet.SYMBOL_SET_INSTALLATIONS]: {
      label: "Installations",
      shortLabel: "INS",
    },
    [SymbolSet.SYMBOL_SET_UNSPECIFIED]: { label: "Unknown", shortLabel: "UNK" },
    [SymbolSet.UNRECOGNIZED]: { label: "Unknown", shortLabel: "UNK" },
  };

  return labelMap[symbolSet] ?? { label: "Unknown", shortLabel: "UNK" };
}

/**
 * Get all styling data for a symbol set
 */
export function getSymbolSetStyles(symbolSet: SymbolSet) {
  return {
    ...getSymbolSetLabels(symbolSet),
    badge: getSymbolSetBadgeClass(symbolSet),
    canvas: getSymbolSetCanvasColors(symbolSet),
    hex: getSymbolSetHexColors(symbolSet),
  };
}

/**
 * Backward-compatible SYMBOL_SET_CONFIG export
 */
export const SYMBOL_SET_CONFIG = Object.fromEntries(
  Object.values(SymbolSet)
    .filter((val): val is SymbolSet => typeof val === "number")
    .map((symbolSet) => {
      const labels = getSymbolSetLabels(symbolSet);
      return [
        symbolSet,
        {
          label: labels.label,
          shortLabel: labels.shortLabel,
          badge: getSymbolSetBadgeClass(symbolSet),
        },
      ];
    }),
) as Record<
  SymbolSet,
  {
    label: string;
    badge: string;
    shortLabel: string;
  }
>;
