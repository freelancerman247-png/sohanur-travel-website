import type { Metadata } from "next";
import { BarChart3, Gauge, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Usage",
  description: "Tenant usage metering and plan utilization."
};

const usageRows = [
  { metric: "recharge.api.calls", period: "Current month", quantity: "184,902" },
  { metric: "whatsapp.messages.sent", period: "Current month", quantity: "71,448" },
  { metric: "wallet.ledger.entries", period: "Current month", quantity: "38,021" },
  { metric: "travel.booking.requests", period: "Current month", quantity: "6,918" }
];

export default function UsagePage() {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Usage metering</span>
          <h1 style={{ fontSize: "3.2rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "16px 0 8px" }}>
            Plan limits and billing-ready events.
          </h1>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Usage events are tenant-scoped and idempotent so billing, throttling,
            and support teams work from the same trusted record.
          </p>
        </div>
        <button className="button" type="button">
          <BarChart3 size={18} />
          Export report
        </button>
      </div>

      <section className="grid dashboard-grid">
        <article className="card service-card">
          <Gauge color="var(--primary)" />
          <h3>API quota</h3>
          <strong style={{ fontSize: "2rem" }}>74%</strong>
          <p>Growth plan monthly allowance consumed.</p>
        </article>
        <article className="card service-card">
          <TrendingUp color="var(--primary)" />
          <h3>Projected overage</h3>
          <strong style={{ fontSize: "2rem" }}>$216</strong>
          <p>Based on the current seven-day usage trend.</p>
        </article>
        <article className="card service-card">
          <BarChart3 color="var(--primary)" />
          <h3>Webhook retries</h3>
          <strong style={{ fontSize: "2rem" }}>1.2%</strong>
          <p>Retry volume across active provider integrations.</p>
        </article>
        <article className="card service-card">
          <Gauge color="var(--primary)" />
          <h3>Rate limit events</h3>
          <strong style={{ fontSize: "2rem" }}>48</strong>
          <p>Blocked requests in the last 24 hours.</p>
        </article>
      </section>

      <section className="card table-card" style={{ marginTop: 28 }}>
        <div className="table-row">
          <span>Metric</span>
          <span>Period</span>
          <span>Quantity</span>
        </div>
        {usageRows.map((row) => (
          <div className="table-row" key={row.metric}>
            <span>{row.metric}</span>
            <span>{row.period}</span>
            <span className="status-pill">{row.quantity}</span>
          </div>
        ))}
      </section>
    </>
  );
}
