import { headers } from "next/headers";
import { env } from "@/lib/env";

export type TenantContext = {
  slug: string;
  source: "subdomain" | "custom-domain" | "header" | "path" | "fallback";
};

const RESERVED_SUBDOMAINS = new Set(["app", "www", "api", "admin", "localhost"]);

export function getTenantFromHost(hostHeader: string | null): TenantContext | null {
  if (!hostHeader) {
    return null;
  }

  const host = hostHeader.split(":")[0]?.toLowerCase();
  const rootDomain = env.ROOT_DOMAIN.split(":")[0]?.toLowerCase();

  if (!host || !rootDomain) {
    return null;
  }

  if (host === rootDomain) {
    return null;
  }

  if (host.endsWith(`.${rootDomain}`)) {
    const slug = host.replace(`.${rootDomain}`, "");
    if (slug && !RESERVED_SUBDOMAINS.has(slug)) {
      return { slug, source: "subdomain" };
    }
  }

  return { slug: host, source: "custom-domain" };
}

export function getTenantFromPath(pathname: string): TenantContext | null {
  const [, prefix, slug] = pathname.split("/");

  if (prefix === "t" && slug) {
    return { slug: slug.toLowerCase(), source: "path" };
  }

  return null;
}

export function getTenantFromHeader(value: string | null): TenantContext | null {
  if (!value) {
    return null;
  }

  return {
    slug: value.toLowerCase(),
    source: "header"
  };
}

export async function resolveTenantContext(): Promise<TenantContext> {
  const requestHeaders = await headers();

  return (
    getTenantFromHeader(requestHeaders.get("x-tenant-id")) ??
    getTenantFromHeader(requestHeaders.get("x-resolved-tenant")) ??
    getTenantFromHost(requestHeaders.get("host")) ?? {
      slug: "demo",
      source: "fallback"
    }
  );
}
