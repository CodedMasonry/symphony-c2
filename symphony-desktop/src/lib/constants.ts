import { SymbolSet, StandardIdentity } from "@/generated/base";
import { IDENTITY_CONFIG, SYMBOL_SET_CONFIG } from "@/lib/colors";

/* ─────────────────────────────────────────────────────────────────────────
 * DISPLAY ORDERS AND DEFAULTS
 * ────────────────────────────────────────────────────────────────────────*/

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
 * COLOR CONFIGURATIONS
 *
 * These are now imported directly from @/lib/unified-colors.ts
 * All color definitions (both identity and symbol set) live in one place.
 *
 * To update colors across the entire app:
 * 1. Open @/lib/unified-colors.ts
 * 2. Change the Tailwind shade numbers in the color schemes
 * 3. Colors automatically update in both canvas icons and UI components
 * ────────────────────────────────────────────────────────────────────────*/

export { IDENTITY_CONFIG, SYMBOL_SET_CONFIG };
