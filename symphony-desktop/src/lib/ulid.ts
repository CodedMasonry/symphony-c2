const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function bytesToUlid(bytes: Uint8Array): string {
  if (bytes.length !== 16) {
    throw new Error("ULID must be exactly 16 bytes");
  }

  const result = new Array(26);

  // Convert 16 bytes (128 bits) to BigInt
  let bits = 0n;
  for (let i = 0; i < 16; i++) {
    bits = (bits << 8n) | BigInt(bytes[i]);
  }

  // Extract 5 bits at a time (base32)
  for (let i = 25; i >= 0; i--) {
    result[i] = ENCODING[Number(bits & 31n)];
    bits >>= 5n;
  }

  return result.join("");
}

// Extract timestamp from ULID (first 48 bits = milliseconds since epoch)
export function ulidToTimestamp(ulidString: string): Date {
  let timestamp = 0n;

  // Decode first 10 characters (48 bits of timestamp)
  for (let i = 0; i < 10; i++) {
    const char = ulidString[i];
    const value = ENCODING.indexOf(char);
    if (value === -1) throw new Error("Invalid ULID character");
    timestamp = (timestamp << 5n) | BigInt(value);
  }

  return new Date(Number(timestamp));
}

// Generate a new ULID string
export function generateUlid(): string {
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  const bytes = new Uint8Array(16);

  // First 6 bytes are timestamp (48 bits)
  for (let i = 5; i >= 0; i--) {
    bytes[5 - i] = Number((BigInt(timestamp) >> BigInt(i * 8)) & 0xffn);
  }

  // Last 10 bytes are random
  bytes.set(randomBytes, 6);

  return bytesToUlid(bytes);
}
