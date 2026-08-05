import type { Metadata } from "next";
import { Building2, Globe2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Tenant workspace settings and governance controls."
};

export default function SettingsPage() {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Workspace governance</span>
          <h1 style={{ fontSize: "3.2rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "16px 0 8px" }}>
            Tenant settings, domains, and access policies.
          </h1>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Centralize tenant identity, billing ownership, custom domains, and
            security posture before enabling production traffic.
          </p>
        </div>
        <button className="button" type="button">
          Save changes
        </button>
      </div>

      <section className="grid data-grid">
        <article className="card service-card">
          <Building2 color="var(--primary)" />
          <h3>Tenant profile</h3>
          <form className="form">
            <label className="field">
              Workspace name
              <input defaultValue="Demo tenant" />
            </label>
            <label className="field">
              Workspace slug
              <input defaultValue="demo" />
            </label>
            <label className="field">
              Billing email
              <input defaultValue="billing@example.com" type="email" />
            </label>
          </form>
        </article>

        <aside className="grid">
          <article className="card service-card">
            <Globe2 color="var(--accent)" />
            <h3>Domain strategy</h3>
            <ul className="feature-list">
              <li>demo.yourdomain.com for subdomain tenancy.</li>
              <li>portal.customer.com for enterprise custom domains.</li>
              <li>X-Tenant-ID headers for trusted server-to-server APIs.</li>
            </ul>
          </article>
          <article className="card service-card">
            <ShieldCheck color="var(--primary)" />
            <h3>Access controls</h3>
            <ul className="feature-list">
              <li>Owner and admin roles can manage billing and keys.</li>
              <li>Operators can run workflows with scoped permissions.</li>
              <li>Viewers can inspect reports without mutating records.</li>
            </ul>
          </article>
        </aside>
      </section>
    </>
  );
}
