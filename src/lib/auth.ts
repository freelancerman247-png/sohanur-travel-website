import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";
import type { Role } from "@/lib/rbac";

export type SessionClaims = {
  sub: string;
  email: string;
  tenantId: string;
  tenantSlug: string;
  role: Role;
};

const encoder = new TextEncoder();

function getJwtSecret() {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured before issuing sessions.");
  }

  return encoder.encode(env.JWT_SECRET);
}

export async function createSessionToken(
  claims: SessionClaims,
  rememberDevice = false
): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(rememberDevice ? "30d" : "8h")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, getJwtSecret());

  return {
    sub: String(payload.sub),
    email: String(payload.email),
    tenantId: String(payload.tenantId),
    tenantSlug: String(payload.tenantSlug),
    role: payload.role as Role
  };
}
