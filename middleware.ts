import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/api/v1"];
const RESERVED_SUBDOMAINS = new Set(["app", "www", "api", "admin", "localhost"]);

function resolveTenantSlug(request: NextRequest) {
  const headerTenant = request.headers.get("x-tenant-id");

  if (headerTenant) {
    return headerTenant.toLowerCase();
  }

  const [, prefix, slug] = request.nextUrl.pathname.split("/");

  if (prefix === "t" && slug) {
    return slug.toLowerCase();
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  const rootDomain = process.env.ROOT_DOMAIN?.split(":")[0]?.toLowerCase();

  if (host && rootDomain && host !== rootDomain && host.endsWith(`.${rootDomain}`)) {
    const subdomain = host.replace(`.${rootDomain}`, "");

    if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain)) {
      return subdomain;
    }
  }

  return "demo";
}

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-resolved-tenant", resolveTenantSlug(request));

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  response.headers.set("x-resolved-tenant", requestHeaders.get("x-resolved-tenant") ?? "demo");

  if (isProtected(request.nextUrl.pathname)) {
    const session = request.cookies.get("sc_session")?.value;
    const apiToken = request.headers.get("authorization");

    if (!session && !apiToken) {
      if (request.nextUrl.pathname.startsWith("/api/v1")) {
        return NextResponse.json(
          {
            error: "unauthorized",
            message: "A bearer API key is required for tenant API requests."
          },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);

      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
