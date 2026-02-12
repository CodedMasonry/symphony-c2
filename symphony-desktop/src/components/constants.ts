import { SymbolSet, StandardIdentity } from "@/generated/base";

export const SYMBOL_SET_ORDER: SymbolSet[] = [
  SymbolSet.SYMBOL_SET_AIR,
  SymbolSet.SYMBOL_SET_AIR_MISSILE,
  SymbolSet.SYMBOL_SET_SPACE,
  SymbolSet.SYMBOL_SET_LAND_UNIT,
  SymbolSet.SYMBOL_SET_LAND_CIVILIAN,
  SymbolSet.SYMBOL_SET_LAND_EQUIPMENT,
  SymbolSet.SYMBOL_SET_SEA_SURFACE,
  SymbolSet.SYMBOL_SET_SEA_SUBSURFACE,
  SymbolSet.SYMBOL_SET_ACTIVITIES,
  SymbolSet.SYMBOL_SET_INSTALLATIONS,
  SymbolSet.SYMBOL_SET_UNSPECIFIED,
];

export const DEFAULT_SELECTED_SYMBOL_SETS: SymbolSet[] = [
  SymbolSet.SYMBOL_SET_AIR,
  SymbolSet.SYMBOL_SET_LAND_UNIT,
  SymbolSet.SYMBOL_SET_LAND_EQUIPMENT,
  SymbolSet.SYMBOL_SET_SEA_SURFACE,
];

export const IDENTITY_ORDER: StandardIdentity[] = [
  StandardIdentity.STANDARD_IDENTITY_FRIEND,
  StandardIdentity.STANDARD_IDENTITY_HOSTILE,
  StandardIdentity.STANDARD_IDENTITY_NEUTRAL,
  StandardIdentity.STANDARD_IDENTITY_PENDING,
  StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND,
  StandardIdentity.STANDARD_IDENTITY_SUSPECT,
];

export const DEFAULT_SELECTED_IDENTITIES: StandardIdentity[] = [
  StandardIdentity.STANDARD_IDENTITY_FRIEND,
  StandardIdentity.STANDARD_IDENTITY_HOSTILE,
  StandardIdentity.STANDARD_IDENTITY_NEUTRAL,
  StandardIdentity.STANDARD_IDENTITY_PENDING,
];

/* ─────────────────────────────────────────────────────────────────────────
 * IDENTITY CONFIG  — single source of truth for all affiliation styling.
 *
 * Design intent:
 *   - HOSTILE  → red    (immediate threat)
 *   - FRIEND   → blue   (2525E standard)
 *   - NEUTRAL  → green  (2525E standard)
 *   - PENDING  → amber  (needs classification)
 *   - SUSPECT  → orange (elevated threat, not yet confirmed hostile)
 *   - ASSUMED  → sky    (friendly but unverified)
 *   - UNKNOWN  → slate
 * ────────────────────────────────────────────────────────────────────────*/
export const IDENTITY_CONFIG: Record<
  StandardIdentity,
  {
    label: string;
    /** Full pill badge: bg + text, used as className on <Badge> */
    badge: string;
    /** Thin left-border color on cards / sections */
    border: string;
    /** Dot / indicator color for compact displays */
    dot: string;
    /** Section header accent text */
    headerText: string;
    /** shadcn Badge variant — keep "outline" for all so custom bg wins */
    variant: "outline" | "secondary" | "destructive";
    /** Tailwind ring for selected state */
    ring: string;
  }
> = {
  [StandardIdentity.STANDARD_IDENTITY_FRIEND]: {
    label: "Friend",
    badge: "bg-blue-600/20 text-blue-300 border-blue-600/40",
    border: "border-l-blue-500",
    dot: "bg-blue-500",
    headerText: "text-blue-400",
    variant: "outline",
    ring: "ring-blue-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_HOSTILE]: {
    label: "Hostile",
    badge: "bg-red-600/20 text-red-300 border-red-600/40",
    border: "border-l-red-500",
    dot: "bg-red-500",
    headerText: "text-red-400",
    variant: "outline",
    ring: "ring-red-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_NEUTRAL]: {
    label: "Neutral",
    badge: "bg-green-600/20 text-green-300 border-green-600/40",
    border: "border-l-green-500",
    dot: "bg-green-500",
    headerText: "text-green-400",
    variant: "outline",
    ring: "ring-green-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_PENDING]: {
    label: "Pending",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    border: "border-l-amber-400",
    dot: "bg-amber-400",
    headerText: "text-amber-400",
    variant: "outline",
    ring: "ring-amber-400",
  },
  [StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND]: {
    label: "Assumed",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    border: "border-l-sky-400",
    dot: "bg-sky-400",
    headerText: "text-sky-400",
    variant: "outline",
    ring: "ring-sky-400",
  },
  [StandardIdentity.STANDARD_IDENTITY_SUSPECT]: {
    label: "Suspect",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    border: "border-l-orange-400",
    dot: "bg-orange-400",
    headerText: "text-orange-400",
    variant: "outline",
    ring: "ring-orange-400",
  },
  [StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED]: {
    label: "Unknown",
    badge: "bg-slate-600/20 text-slate-400 border-slate-600/40",
    border: "border-l-slate-500",
    dot: "bg-slate-500",
    headerText: "text-slate-400",
    variant: "outline",
    ring: "ring-slate-500",
  },
  [StandardIdentity.UNRECOGNIZED]: {
    label: "Unknown",
    badge: "bg-slate-600/20 text-slate-400 border-slate-600/40",
    border: "border-l-slate-500",
    dot: "bg-slate-500",
    headerText: "text-slate-400",
    variant: "outline",
    ring: "ring-slate-500",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * SYMBOL SET CONFIG  — domain/type labels and accent colors.
 * These are secondary to identity in the visual hierarchy.
 * ────────────────────────────────────────────────────────────────────────*/
export const SYMBOL_SET_CONFIG: Record<
  SymbolSet,
  {
    label: string;
    badge: string;
    shortLabel: string;
  }
> = {
  [SymbolSet.SYMBOL_SET_AIR]: {
    label: "Air",
    shortLabel: "AIR",
    badge: "bg-sky-900/40 text-sky-400 border-sky-700/40",
  },
  [SymbolSet.SYMBOL_SET_AIR_MISSILE]: {
    label: "Air Missile",
    shortLabel: "MSL",
    badge: "bg-red-900/30 text-red-400 border-red-700/40",
  },
  [SymbolSet.SYMBOL_SET_SPACE]: {
    label: "Space",
    shortLabel: "SPC",
    badge: "bg-purple-900/30 text-purple-400 border-purple-700/40",
  },
  [SymbolSet.SYMBOL_SET_LAND_UNIT]: {
    label: "Land Unit",
    shortLabel: "UNIT",
    badge: "bg-green-900/30 text-green-400 border-green-700/40",
  },
  [SymbolSet.SYMBOL_SET_LAND_CIVILIAN]: {
    label: "Civilian",
    shortLabel: "CIV",
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.SYMBOL_SET_LAND_EQUIPMENT]: {
    label: "Land Equip.",
    shortLabel: "EQP",
    badge: "bg-amber-900/30 text-amber-400 border-amber-700/40",
  },
  [SymbolSet.SYMBOL_SET_SEA_SURFACE]: {
    label: "Sea Surface",
    shortLabel: "SEA",
    badge: "bg-blue-900/30 text-blue-400 border-blue-700/40",
  },
  [SymbolSet.SYMBOL_SET_SEA_SUBSURFACE]: {
    label: "Subsurface",
    shortLabel: "SUB",
    badge: "bg-indigo-900/30 text-indigo-400 border-indigo-700/40",
  },
  [SymbolSet.SYMBOL_SET_ACTIVITIES]: {
    label: "Activities",
    shortLabel: "ACT",
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.SYMBOL_SET_INSTALLATIONS]: {
    label: "Installations",
    shortLabel: "INS",
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
  [SymbolSet.SYMBOL_SET_UNSPECIFIED]: {
    label: "Unknown",
    shortLabel: "UNK",
    badge: "bg-slate-800/60 text-slate-400 border-slate-600/40",
  },
} as const;
