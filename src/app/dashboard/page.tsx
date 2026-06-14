import type { Metadata } from "next";
import { Activity, ArrowUpRight, CircleDollarSign } from "lucide-react";
import {
  dashboardMetrics,
  providerHealth,
  quickActions,
  recentTransactions,
  usageBars
} from "@/data/platform";

export const metadata: Metadata = {
  title: "Tenant Dashboard",
  description: "Tenant operations dashboard for Sohanur Cloud."
};

export default function DashboardPage() {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Tenant operations</span>
          <h1 style={{ fontSize: "3.2rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "16px 0 8px" }}>
            Real-time reseller command center.
          </h1>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Monitor transactions, API health, reseller wallets, usage, support
            load, and risk signals for the active tenant.
          </p>
        </div>
        <a className="button" href="/dashboard/api-keys">
          Issue API key
          <ArrowUpRight size={18} />
        </a>
      </div>

      <section className="grid dashboard-grid">
        {dashboardMetrics.map((metric) => (
          <article className="card service-card" key={metric.label}>
            <Activity color="var(--primary)" />
            <p style={{ color: "var(--muted)" }}>{metric.label}</p>
            <strong style={{ display: "block", fontSize: "2rem", letterSpacing: "-0.05em" }}>
              {metric.value}
            </strong>
            <span className="status-pill">{metric.trend}</span>
          </article>
        ))}
      </section>

      <section className="grid data-grid section" style={{ paddingBottom: 0 }}>
        <article className="card table-card">
          <div className="service-card">
            <span className="eyebrow">Recent workflow events</span>
          </div>
          <div className="table-row">
            <span>Event</span>
            <span>Channel</span>
            <span>Status</span>
          </div>
          {recentTransactions.map((transaction) => (
            <div className="table-row" key={transaction.name}>
              <span>{transaction.name}</span>
              <span>{transaction.channel}</span>
              <span className="status-pill">{transaction.status}</span>
            </div>
          ))}
        </article>

        <aside className="grid">
          <article className="card service-card">
            <span className="eyebrow">Plan utilization</span>
            {usageBars.map((usage) => (
              <div key={usage.metric} style={{ marginTop: 18 }}>
                <strong>{usage.metric}</strong>
                <div
                  aria-label={`${usage.metric} usage ${usage.value}`}
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(255, 255, 255, 0.08)",
                    marginTop: 8,
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: usage.value,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, var(--primary), var(--accent))"
                    }}
                  />
                </div>
              </div>
            ))}
          </article>

          <article className="card service-card">
            <span className="eyebrow">Provider health</span>
            <ul className="feature-list">
              {providerHealth.map((provider) => (
                <li key={provider.name}>
                  {provider.name} · {provider.status} · {provider.latency}
                </li>
              ))}
            </ul>
          </article>

          <article className="card service-card">
            <span className="eyebrow">Quick actions</span>
            <div className="grid" style={{ gap: 12, marginTop: 18 }}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button className="button secondary" key={action.label} type="button">
                    <Icon size={18} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="card service-card">
            <CircleDollarSign color="var(--warning)" />
            <h3>Settlement window</h3>
            <p>
              Next automated settlement closes at 18:00 UTC. Pending exceptions
              require owner or admin approval.
            </p>
          </article>
        </aside>
      </section>
    </>
  );
}
