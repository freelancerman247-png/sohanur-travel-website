export type Role = "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER";
export type Plan = "STARTER" | "GROWTH" | "SCALE" | "ENTERPRISE";

export type Permission =
  | "tenant:read"
  | "tenant:update"
  | "billing:manage"
  | "api-key:read"
  | "api-key:write"
  | "workflow:run"
  | "usage:read"
  | "audit:read";

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    "tenant:read",
    "tenant:update",
    "billing:manage",
    "api-key:read",
    "api-key:write",
    "workflow:run",
    "usage:read",
    "audit:read"
  ],
  ADMIN: [
    "tenant:read",
    "tenant:update",
    "api-key:read",
    "api-key:write",
    "workflow:run",
    "usage:read",
    "audit:read"
  ],
  OPERATOR: ["tenant:read", "workflow:run", "usage:read"],
  VIEWER: ["tenant:read", "usage:read", "audit:read"]
};

export const planLimits: Record<
  Plan,
  {
    users: number;
    apiCallsPerMonth: number;
    customDomains: number;
    webhookRetries: number;
  }
> = {
  STARTER: {
    users: 3,
    apiCallsPerMonth: 25_000,
    customDomains: 0,
    webhookRetries: 2
  },
  GROWTH: {
    users: 50,
    apiCallsPerMonth: 250_000,
    customDomains: 1,
    webhookRetries: 5
  },
  SCALE: {
    users: 250,
    apiCallsPerMonth: 2_000_000,
    customDomains: 3,
    webhookRetries: 10
  },
  ENTERPRISE: {
    users: 10_000,
    apiCallsPerMonth: 50_000_000,
    customDomains: 25,
    webhookRetries: 20
  }
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Missing permission: ${permission}`);
  }
}

export function getPlanLimit(plan: Plan, limit: keyof (typeof planLimits)[Plan]) {
  return planLimits[plan][limit];
}
