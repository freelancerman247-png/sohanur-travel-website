import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  LockKeyhole,
  ServerCog
} from "lucide-react";
import {
  platformStats,
  securityCapabilities,
  serviceCatalog,
  workflowSteps
} from "@/data/platform";

export default function HomePage() {
  return (
    <main>
      <section className="container hero">
        <div>
          <span className="eyebrow">Enterprise reseller automation</span>
          <h1>Multi-tenant SaaS for APIs, wallets, and field operations.</h1>
          <p>
            Inspired by MRobotics-style B2B automation, Sohanur Cloud gives
            telecom, travel, and utility resellers a secure portal, scoped APIs,
            tenant dashboards, and auditable workflows from day one.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/register">
              Build your workspace
              <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" href="/dashboard">
              View platform demo
            </Link>
          </div>
        </div>

        <div className="card hero-panel" aria-label="Platform overview">
          <span className="eyebrow">Live operations command center</span>
          <h2 style={{ fontSize: "2rem", letterSpacing: "-0.04em", margin: "22px 0 10px" }}>
            One control plane for every tenant, reseller, branch, and API client.
          </h2>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Route provider traffic, monitor webhook delivery, enforce wallet
            limits, and keep tenant data isolated through a single SaaS control
            plane.
          </p>
          <div className="metric-row">
            {platformStats.map((stat) => (
              <div className="metric" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" id="services">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Service catalog</span>
            <h2>Launch high-margin reseller services without rebuilding core SaaS plumbing.</h2>
          </div>
          <p>
            Each service is tenant-aware, API-first, and designed for operational
            controls that finance, support, and compliance teams can trust.
          </p>
        </div>
        <div className="grid service-grid">
          {serviceCatalog.map((service) => {
            const Icon = service.icon;
            return (
              <article className="card service-card" key={service.slug}>
                <div className="icon-badge">
                  <Icon size={25} />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <ul className="feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container section" id="platform">
        <div className="split">
          <div className="card service-card">
            <span className="eyebrow">Platform architecture</span>
            <h2 style={{ fontSize: "3rem", letterSpacing: "-0.06em", lineHeight: 1 }}>
              Tenant isolation built into the request lifecycle.
            </h2>
            <p>
              The application resolves tenant context before protected dashboard
              and API traffic reaches business logic. That keeps auth, billing,
              API limits, and audit logs aligned across every customer workspace.
            </p>
            <ul className="feature-list">
              <li>Subdomain, custom domain, and API header tenant resolution</li>
              <li>Role-based memberships for owners, admins, operators, and viewers</li>
              <li>Plan limits ready for Stripe billing and usage metering</li>
            </ul>
          </div>
          <div className="workflow">
            {workflowSteps.map((step, index) => (
              <article className="card workflow-step" key={step.title}>
                <span className="step-number">{index + 1}</span>
                <div>
                  <h3 style={{ margin: "0 0 8px" }}>{step.title}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" id="security">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Security and operations</span>
            <h2>Enterprise-grade controls for API businesses.</h2>
          </div>
          <p>
            Production SaaS needs more than a landing page. This foundation
            includes the operational primitives needed to scale safely.
          </p>
        </div>
        <div className="grid service-grid">
          {securityCapabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <article className="card service-card" key={capability.title}>
                <div className="icon-badge">
                  <Icon size={25} />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container section">
        <div className="card cta">
          <div>
            <span className="eyebrow">24/7 support-ready</span>
            <h2 style={{ fontSize: "3rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "16px 0" }}>
              Bring resellers, support agents, and API clients onto one platform.
            </h2>
            <p className="lead" style={{ fontSize: "1rem" }}>
              Start with the included dashboard, then connect provider adapters,
              billing webhooks, and tenant-specific domains as your network grows.
            </p>
          </div>
          <div className="grid">
            <div className="metric">
              <CheckCircle2 color="var(--primary)" />
              <strong>Audit-ready</strong>
              <span>Every critical action can be traced by tenant and actor.</span>
            </div>
            <div className="metric">
              <LockKeyhole color="var(--primary)" />
              <strong>Secure by default</strong>
              <span>Headers, scoped APIs, and hashed keys are part of the starter.</span>
            </div>
            <div className="metric">
              <ServerCog color="var(--primary)" />
              <strong>Integration-ready</strong>
              <span>Provider adapters can be attached behind tenant-safe APIs.</span>
            </div>
          </div>
          <div className="inline-actions">
            <Link className="button" href="/pricing">
              Compare plans
            </Link>
            <a className="button secondary" href="mailto:support@sohanur.cloud">
              <Headphones size={18} />
              Contact support
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="brand">
          <span className="brand-mark">SC</span>
          <span>Sohanur Cloud</span>
        </div>
        <span>Secure multi-tenant SaaS for reseller automation.</span>
      </div>
    </footer>
  );
}
