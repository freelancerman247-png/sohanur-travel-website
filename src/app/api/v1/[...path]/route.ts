import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readBearerToken } from "@/lib/api-keys";
import { resolveTenantContext } from "@/lib/tenant";

export const runtime = "nodejs";

const requestSchema = z.object({
  path: z.array(z.string()).default([]),
  tenant: z.string().min(1),
  body: z.unknown().optional()
});

async function handleTenantApi(request: NextRequest, path: string[]) {
  const tenant = await resolveTenantContext();
  const token = readBearerToken(request.headers.get("authorization"));

  if (!token) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Provide a tenant-scoped bearer API key."
      },
      { status: 401 }
    );
  }

  const payload = requestSchema.parse({
    path,
    tenant: tenant.slug,
    body:
      request.method === "GET" || request.method === "DELETE"
        ? undefined
        : await request.json().catch(() => undefined)
  });

  return NextResponse.json({
    ok: true,
    tenant: payload.tenant,
    tenantSource: tenant.source,
    path: payload.path,
    message:
      "Tenant context resolved. Connect this route to scoped service adapters and hashed API-key verification."
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await params;

  return handleTenantApi(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await params;

  return handleTenantApi(request, path);
}
