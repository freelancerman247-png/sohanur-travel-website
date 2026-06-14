import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Sohanur Cloud tenant workspace."
};

export default function RegisterPage() {
  return (
    <main className="auth-shell container">
      <section className="card auth-card">
        <span className="eyebrow">Create tenant</span>
        <h1 style={{ fontSize: "2.7rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "18px 0 10px" }}>
          Launch a secure reseller workspace.
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          Capture the tenant, owner, and billing contact in one flow. The backend
          schema is ready to create owner memberships and trial subscriptions.
        </p>
        <form className="form">
          <label className="field">
            Company name
            <input autoComplete="organization" name="company" placeholder="Sohanur Telecom Services" />
          </label>
          <label className="field">
            Workspace slug
            <input name="slug" placeholder="sohanur" />
          </label>
          <label className="field">
            Owner email
            <input autoComplete="email" name="email" placeholder="owner@example.com" type="email" />
          </label>
          <button className="button" type="button">
            Create trial workspace
          </button>
        </form>
        <p style={{ color: "var(--muted)", marginTop: 20 }}>
          Already have a tenant? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
