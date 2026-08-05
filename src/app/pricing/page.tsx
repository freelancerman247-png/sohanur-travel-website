import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { plans } from "@/data/platform";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Pricing plans for RoboticAPI Cloud multi-tenant reseller automation SaaS."
};

export default function PricingPage() {
  return (
    <main>
      <section className="container section">
        <span className="eyebrow">Transparent SaaS pricing</span>
        <h1 className="page-title">Plans that scale with API volume and operational complexity.</h1>
        <p className="lead">
          Start with a managed reseller portal, then add white-label domains,
          provider integrations, custom limits, and enterprise controls when your
          network expands.
        </p>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="grid pricing-grid">
          {plans.map((plan) => (
            <article
              className={`card pricing-card${plan.highlighted ? " highlight" : ""}`}
              key={plan.name}
            >
              <span className="eyebrow">{plan.name}</span>
              <div className="price">{plan.price}</div>
              <p>{plan.description}</p>
              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link className="button" href={plan.name === "Enterprise" ? "/login" : "/register"}>
                {plan.cta}
                <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="card cta">
          <div>
            <span className="eyebrow">Usage governance</span>
            <h2 style={{ fontSize: "3rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "16px 0" }}>
              Every plan includes tenant isolation, audit logs, and API controls.
            </h2>
            <p className="lead" style={{ fontSize: "1rem" }}>
              Billing tiers are designed around real SaaS operating constraints:
              users, API calls, domains, provider integrations, support level, and
              compliance expectations.
            </p>
          </div>
          <div className="grid">
            <div className="metric">
              <strong>Plan limits</strong>
              <span>Centralized limits helper for API calls, users, and domains.</span>
            </div>
            <div className="metric">
              <strong>Stripe-ready</strong>
              <span>Schema fields are ready for customer, subscription, and webhook mapping.</span>
            </div>
            <div className="metric">
              <strong>Enterprise path</strong>
              <span>Custom domains and dedicated deployment options are represented in the model.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
