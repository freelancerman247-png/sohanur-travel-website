import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your RoboticAPI Cloud tenant workspace."
};

export default function LoginPage() {
  return (
    <main className="auth-shell container">
      <section className="card auth-card">
        <span className="eyebrow">Tenant sign in</span>
        <h1 style={{ fontSize: "2.7rem", letterSpacing: "-0.06em", lineHeight: 1, margin: "18px 0 10px" }}>
          Welcome back to your operations control plane.
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          This starter includes the UI and server-side primitives for secure
          sessions. Connect the form to your preferred Auth.js or identity
          provider flow before production launch.
        </p>
        <form className="form">
          <label className="field">
            Email address
            <input autoComplete="email" name="email" placeholder="ops@example.com" type="email" />
          </label>
          <label className="field">
            Password
            <input autoComplete="current-password" name="password" placeholder="••••••••" type="password" />
          </label>
          <label style={{ display: "flex", gap: 10, color: "var(--muted)", alignItems: "center" }}>
            <input name="remember" type="checkbox" />
            Keep me logged in on this device
          </label>
          <button className="button" type="button">
            Sign in securely
          </button>
        </form>
        <p style={{ color: "var(--muted)", marginTop: 20 }}>
          New workspace? <Link href="/register">Start a tenant trial</Link>
        </p>
      </section>
    </main>
  );
}
