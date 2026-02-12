import {
  Object as ProtoObject,
  ObjectList,
  StandardIdentity, // Replacement for ObjectDesignation
  SymbolSet, // Added for grouping
} from "@/generated/base";
import { invoke } from "@tauri-apps/api/core";
import { bytesToUlid } from "@/lib/ulid";

// Extended ProtoObject interface with ULID string
export interface ObjectWithUlid extends ProtoObject {
  ulidString: string;
}

export async function fetchObjects(): Promise<ObjectWithUlid[]> {
  try {
    const binaryData: number[] = await invoke<number[]>("get_objects");
    const uint8Array = new Uint8Array(binaryData);
    const objectList = ObjectList.decode(uint8Array);

    return objectList.objects.map((obj) => {
      // Note: Depending on your TS generator, objectId might be camelCase
      // even if the proto is snake_case.
      const ulidString = bytesToUlid(obj.objectId as Uint8Array);

      return {
        ...obj,
        ulidString,
      } as ObjectWithUlid;
    });
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw error;
  }
}

/**
 * Maps StandardIdentity to human-readable strings
 * Aligned with MIL-STD-2525E Affiliation
 */
export function getIdentityName(identity: StandardIdentity): string {
  switch (identity) {
    case StandardIdentity.STANDARD_IDENTITY_FRIEND:
      return "Friend";
    case StandardIdentity.STANDARD_IDENTITY_HOSTILE:
      return "Hostile";
    case StandardIdentity.STANDARD_IDENTITY_NEUTRAL:
      return "Neutral";
    case StandardIdentity.STANDARD_IDENTITY_PENDING:
      return "Pending/Unknown";
    case StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND:
      return "Assumed Friend";
    case StandardIdentity.STANDARD_IDENTITY_SUSPECT:
      return "Suspect";
    default:
      return "Unspecified";
  }
}

/**
 * Maps SymbolSet to human-readable strings
 * Useful for the grouping logic in your sidebar
 */
export function getSymbolSetName(set: SymbolSet): string {
  switch (set) {
    case SymbolSet.SYMBOL_SET_AIR:
      return "Air Tracks";
    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      return "Land Equipment";
    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      return "Sea Surface";
    case SymbolSet.SYMBOL_SET_SEA_SUBSURFACE:
      return "Subsurface";
    case SymbolSet.SYMBOL_SET_AIR_MISSILE:
      return "Missiles";
    case SymbolSet.SYMBOL_SET_INSTALLATIONS:
      return "Installations";
    default:
      return "Other Tracks";
  }
}
