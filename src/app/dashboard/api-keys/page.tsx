import type { Metadata } from "next";
import { KeyRound, RotateCw, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "API Keys",
  description: "Manage tenant-scoped API keys and scopes."
};

const apiKeys = [
  {
    name: "Production reseller API",
    prefix: "sk_live_prod_7V4N",
    scopes: "recharge:write, wallet:read, webhook:write",
    lastUsed: "2 minutes ago"
  },
  {
    name: "WhatsApp notification worker",
    prefix: "sk_live_msg_GH2K",
    scopes: "whatsapp:send, template:read",
    lastUsed: "11 minutes ago"
  },
  {
    name: "Finance reporting",
    prefix: "sk_live_fin_ZD9P",
    scopes: "usage:read, audit:read",
    lastUsed: "3 hours ago"
  }
];

export default function ApiKeysPage() {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Tenant API access</span>
          <h1 style={{ fontSize: "3.2rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "16px 0 8px" }}>
            Scoped keys for secure reseller integrations.
          </h1>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Store only hashed key material, rotate secrets regularly, and grant
            the smallest set of scopes needed for each integration.
          </p>
        </div>
        <button className="button" type="button">
          <KeyRound size={18} />
          Create key
        </button>
      </div>

      <section className="grid data-grid">
        <article className="card table-card">
          <div className="table-row">
            <span>Name</span>
            <span>Scopes</span>
            <span>Last used</span>
          </div>
          {apiKeys.map((apiKey) => (
            <div className="table-row" key={apiKey.prefix}>
              <span>
                <strong style={{ color: "var(--foreground)" }}>{apiKey.name}</strong>
                <br />
                {apiKey.prefix}...
              </span>
              <span>{apiKey.scopes}</span>
              <span>{apiKey.lastUsed}</span>
            </div>
          ))}
        </article>

        <aside className="grid">
          <article className="card service-card">
            <ShieldAlert color="var(--warning)" />
            <h3>Security policy</h3>
            <ul className="feature-list">
              <li>Keys are displayed once and hashed before persistence.</li>
              <li>Scopes are checked at the API route boundary.</li>
              <li>Revoked tenants cannot authenticate API requests.</li>
            </ul>
          </article>
          <article className="card service-card">
            <RotateCw color="var(--primary)" />
            <h3>Rotation guidance</h3>
            <p>
              Create a replacement key, deploy it to your worker, confirm
              traffic, then revoke the old credential from this workspace.
            </p>
          </article>
        </aside>
      </section>
    </>
  );
}
