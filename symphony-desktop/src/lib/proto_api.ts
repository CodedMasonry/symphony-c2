import {
  Object as ProtoObject,
  ObjectList,
  ObjectDesignation,
} from "@/lib/generated/base";
import { invoke } from "@tauri-apps/api/core";
import { bytesToUlid, ulidToTimestamp } from "@/lib/ulid";

// Extended ProtoObject interface with ULID string
export interface ObjectWithUlid extends ProtoObject {
  ulidString: string;
  createdAt: Date;
}

export async function fetchObjects(): Promise<ObjectWithUlid[]> {
  try {
    const binaryData: number[] = await invoke<number[]>("get_objects");
    const uint8Array = new Uint8Array(binaryData);
    const objectList = ObjectList.decode(uint8Array);

    // Convert objectIds to ULID strings
    return objectList.objects.map((obj) => {
      const ulidString = bytesToUlid(obj.objectId);
      return {
        ...obj,
        ulidString,
        createdAt: ulidToTimestamp(ulidString),
      };
    });
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw error;
  }
}

// Helper to get designation name
export function getDesignationName(designation: ObjectDesignation): string {
  switch (designation) {
    case ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED:
      return "Unspecified";
    case ObjectDesignation.OBJECT_DESIGNATION_HOSTILE:
      return "Hostile";
    case ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN:
      return "Civilian";
    case ObjectDesignation.OBJECT_DESIGNATION_ALLY:
      return "Ally";
    case ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY:
      return "Friendly";
    default:
      return "Unrecognized";
  }
}
