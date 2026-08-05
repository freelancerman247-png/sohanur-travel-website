import {
  BarChart3,
  Bot,
  CreditCard,
  Globe2,
  KeyRound,
  MessageCircle,
  Plane,
  ShieldCheck,
  Smartphone,
  UsersRound,
  WalletCards,
  Zap
} from "lucide-react";

export const serviceCatalog = [
  {
    slug: "recharge-automation",
    name: "Recharge Automation",
    category: "Telecom",
    description:
      "Run mobile, DTH, data-card, and utility recharge workflows through monitored APIs with provider failover.",
    icon: Smartphone,
    features: ["Operator routing", "Live status callbacks", "Commission ledger"]
  },
  {
    slug: "whatsapp-api",
    name: "WhatsApp Business API",
    category: "Messaging",
    description:
      "Automate customer notifications, KYC flows, and support conversations with tenant-safe templates.",
    icon: MessageCircle,
    features: ["Template governance", "Webhook delivery", "Agent handoff"]
  },
  {
    slug: "reseller-api",
    name: "Reseller API Gateway",
    category: "Platform",
    description:
      "Provision API keys, scopes, rate limits, and usage reporting for each reseller or branch.",
    icon: KeyRound,
    features: ["Scoped API keys", "Audit logging", "Usage throttles"]
  },
  {
    slug: "travel-ledger",
    name: "Travel & Booking Ledger",
    category: "Travel",
    description:
      "Unify booking requests, wallet balances, settlements, and partner reconciliation for travel resellers.",
    icon: Plane,
    features: ["Wallet accounting", "Branch approvals", "Settlement exports"]
  },
  {
    slug: "payments-wallet",
    name: "Payments & Wallets",
    category: "Finance",
    description:
      "Maintain customer, reseller, and operator balances with immutable usage events and audit-ready exports.",
    icon: WalletCards,
    features: ["Balance controls", "Payout tracking", "Fraud review"]
  },
  {
    slug: "white-label",
    name: "White-label SaaS",
    category: "Enterprise",
    description:
      "Launch branded portals on subdomains or custom domains while keeping tenants isolated end to end.",
    icon: Globe2,
    features: ["Custom domains", "Role-based access", "Tenant analytics"]
  }
];

export const platformStats = [
  { label: "API uptime target", value: "99.95%" },
  { label: "Tenant isolation", value: "RBAC" },
  { label: "Launch surface", value: "Web + API" }
];

export const workflowSteps = [
  {
    title: "Resolve tenant context",
    description:
      "Subdomain, custom domain, or API header maps every request to one tenant before business logic runs."
  },
  {
    title: "Authenticate and authorize",
    description:
      "Sessions and API keys are validated against memberships, roles, scopes, plan limits, and account status."
  },
  {
    title: "Execute provider workflow",
    description:
      "Recharge, WhatsApp, travel, and utility adapters emit usage events, callbacks, and audit logs."
  },
  {
    title: "Meter, bill, and observe",
    description:
      "Usage, invoices, support events, and risk signals roll into dashboards for operators and enterprise admins."
  }
];

export const securityCapabilities = [
  {
    title: "Tenant-first data model",
    description:
      "All operational records carry tenant ownership and are indexed for fast, isolated access.",
    icon: UsersRound
  },
  {
    title: "API key hardening",
    description:
      "Secrets are hashed with a server-side pepper, scoped per tenant, and designed for rotation/revocation.",
    icon: ShieldCheck
  },
  {
    title: "Operational audit trail",
    description:
      "Admin actions, API access, billing events, and provider callbacks are captured for investigation.",
    icon: BarChart3
  }
];

export const plans = [
  {
    name: "Starter",
    price: "$149",
    description: "For small reseller teams validating automated recharge and messaging workflows.",
    cta: "Start trial",
    highlighted: false,
    features: ["1 tenant workspace", "3 operators", "25k API calls/month", "Email support"]
  },
  {
    name: "Growth",
    price: "$499",
    description: "For regional operators that need white-label portals, webhooks, and higher limits.",
    cta: "Launch Growth",
    highlighted: true,
    features: [
      "Unlimited branch users",
      "250k API calls/month",
      "Custom domain mapping",
      "Webhook retries",
      "Priority support"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For banks, telecom networks, and large aggregators with strict compliance requirements.",
    cta: "Talk to sales",
    highlighted: false,
    features: [
      "Dedicated environments",
      "SAML/OIDC SSO roadmap",
      "Custom rate limits",
      "Data retention controls",
      "Solution architecture review"
    ]
  }
];

export const dashboardMetrics = [
  { label: "Gross transaction volume", value: "$2.84M", trend: "+18.7%" },
  { label: "API success rate", value: "99.92%", trend: "+0.4%" },
  { label: "Active resellers", value: "342", trend: "+27" },
  { label: "Open risk reviews", value: "11", trend: "-5" }
];

export const recentTransactions = [
  { name: "Airtel prepaid recharge", channel: "API Gateway", status: "Settled" },
  { name: "WhatsApp KYC template", channel: "Messaging", status: "Delivered" },
  { name: "Hotel booking wallet debit", channel: "Travel Ledger", status: "Review" },
  { name: "DTH top-up callback", channel: "Webhook", status: "Settled" }
];

export const usageBars = [
  { metric: "Recharge API", value: "78%" },
  { metric: "WhatsApp API", value: "54%" },
  { metric: "Travel ledger", value: "31%" }
];

export const providerHealth = [
  { name: "Telecom Route A", status: "Healthy", latency: "184ms" },
  { name: "WhatsApp Cloud", status: "Healthy", latency: "219ms" },
  { name: "Travel GDS", status: "Degraded", latency: "680ms" }
];

export const quickActions = [
  { label: "Issue API key", icon: KeyRound },
  { label: "Fund reseller wallet", icon: CreditCard },
  { label: "Review automation rules", icon: Bot },
  { label: "Open incident runbook", icon: Zap }
];
