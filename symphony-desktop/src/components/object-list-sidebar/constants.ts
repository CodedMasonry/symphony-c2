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

// These are the categories visible by default in the sidebar sections
export const DEFAULT_SELECTED_SYMBOL_SETS: SymbolSet[] = [
  SymbolSet.SYMBOL_SET_AIR,
  SymbolSet.SYMBOL_SET_LAND_UNIT,
  SymbolSet.SYMBOL_SET_LAND_EQUIPMENT,
  SymbolSet.SYMBOL_SET_SEA_SURFACE,
];

// Identity Constants (For the Filter Checkboxes in the Header)
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

// Your existing Symbol Set Config
export const SYMBOL_SET_CONFIG = {
  [SymbolSet.SYMBOL_SET_AIR]: {
    badge: "AIR",
    variant: "secondary" as const,
    color: "bg-sky-500/20 text-sky-400",
    indicatorColor: "text-sky-400",
  },
  [SymbolSet.SYMBOL_SET_AIR_MISSILE]: {
    badge: "MSL",
    variant: "destructive" as const,
    color: "",
    indicatorColor: "text-destructive",
  },
  [SymbolSet.SYMBOL_SET_SPACE]: {
    badge: "SPC",
    variant: "secondary" as const,
    color: "bg-purple-500/20 text-purple-400",
    indicatorColor: "text-purple-400",
  },
  [SymbolSet.SYMBOL_SET_LAND_UNIT]: {
    badge: "LND",
    variant: "secondary" as const,
    color: "bg-green-500/20 text-green-400",
    indicatorColor: "text-green-400",
  },
  [SymbolSet.SYMBOL_SET_LAND_CIVILIAN]: {
    badge: "CIV",
    variant: "outline" as const,
    color: "bg-gray-500/20 text-gray-400",
    indicatorColor: "text-gray-400",
  },
  [SymbolSet.SYMBOL_SET_LAND_EQUIPMENT]: {
    badge: "EQP",
    variant: "secondary" as const,
    color: "bg-amber-500/20 text-amber-400",
    indicatorColor: "text-amber-400",
  },
  [SymbolSet.SYMBOL_SET_SEA_SURFACE]: {
    badge: "SEA",
    variant: "secondary" as const,
    color: "bg-blue-500/20 text-blue-400",
    indicatorColor: "text-blue-400",
  },
  [SymbolSet.SYMBOL_SET_SEA_SUBSURFACE]: {
    badge: "SUB",
    variant: "secondary" as const,
    color: "bg-indigo-500/20 text-indigo-400",
    indicatorColor: "text-indigo-400",
  },
  [SymbolSet.SYMBOL_SET_ACTIVITIES]: {
    badge: "ACT",
    variant: "outline" as const,
    color: "",
    indicatorColor: "text-muted-foreground",
  },
  [SymbolSet.SYMBOL_SET_INSTALLATIONS]: {
    badge: "INS",
    variant: "outline" as const,
    color: "",
    indicatorColor: "text-muted-foreground",
  },
  [SymbolSet.SYMBOL_SET_UNSPECIFIED]: {
    badge: "UNK",
    variant: "outline" as const,
    color: "",
    indicatorColor: "text-muted-foreground",
  },
} as const;

export const IDENTITY_CONFIG = {
  [StandardIdentity.STANDARD_IDENTITY_FRIEND]: {
    label: "Friend",
    color: "bg-blue-600 border-blue-400 text-white",
    ring: "ring-blue-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_HOSTILE]: {
    label: "Hostile",
    color: "bg-red-600 border-red-400 text-white",
    ring: "ring-red-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_NEUTRAL]: {
    label: "Neutral",
    color: "bg-green-600 border-green-400 text-white",
    ring: "ring-green-500",
  },
  [StandardIdentity.STANDARD_IDENTITY_PENDING]: {
    label: "Pending",
    color: "bg-yellow-500 border-yellow-300 text-black",
    ring: "ring-yellow-400",
  },
  [StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND]: {
    label: "Assumed Friend",
    color: "bg-blue-400 border-blue-200 text-white",
    ring: "ring-blue-300",
  },
  [StandardIdentity.STANDARD_IDENTITY_SUSPECT]: {
    label: "Suspect",
    color: "bg-red-400 border-red-200 text-white",
    ring: "ring-red-300",
  },
  [StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED]: {
    label: "Unknown",
    color: "bg-gray-600 border-gray-400 text-white",
    ring: "ring-gray-500",
  },
  // Add this to satisfy the Protobuf generated types
  [StandardIdentity.UNRECOGNIZED]: {
    label: "Unknown",
    color: "bg-gray-600 border-gray-400 text-white",
    ring: "ring-gray-500",
  },
} as const;
