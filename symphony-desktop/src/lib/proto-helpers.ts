import { simulation } from "../proto/generated";

/**
 * Converts Protobuf bytes (Uint8Array) to a standard ULID string.
 * @param bytes The 16-byte array from the Protobuf message
 */
export function bytesToUlid(bytes: Uint8Array): string {
  // Simple hex conversion or use a library like 'ulid'
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * Example usage in a Tauri component
 */
export async function loadObject() {
  const { invoke } = await import("@tauri-apps/api/core");

  // Receive raw binary from Rust
  const binary: Uint8Array = await invoke("get_active_object");

  // Decode using the generated Protobuf modules
  const obj = simulation.Object.decode(binary);

  console.log(`Object ID: ${bytesToUlid(obj.objectId)}`);
  console.log(`Lat: ${obj.latitude}, Lng: ${obj.longitude}`);
}
