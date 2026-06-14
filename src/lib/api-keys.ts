import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

const API_KEY_PREFIX = "sk_live";

export type IssuedApiKey = {
  key: string;
  prefix: string;
  hash: string;
};

function getPepper() {
  if (!env.API_KEY_PEPPER) {
    throw new Error("API_KEY_PEPPER must be configured before issuing API keys.");
  }

  return env.API_KEY_PEPPER;
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(`${key}:${getPepper()}`).digest("hex");
}

export function issueApiKey(): IssuedApiKey {
  const secret = randomBytes(32).toString("base64url");
  const key = `${API_KEY_PREFIX}_${secret}`;

  return {
    key,
    prefix: key.slice(0, 16),
    hash: hashApiKey(key)
  };
}

export function verifyApiKey(candidate: string, expectedHash: string): boolean {
  const candidateHash = hashApiKey(candidate);
  const candidateBuffer = Buffer.from(candidateHash, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export function readBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
}
