import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RoboticAPI Cloud | Multi-tenant automation SaaS",
    template: "%s | RoboticAPI Cloud"
  },
  description:
    "Enterprise-grade multi-tenant SaaS for recharge, travel, WhatsApp, utility, and reseller API automation.",
  applicationName: "RoboticAPI Cloud",
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000")
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061018"
};

const navItems = [
  { href: "/#services", label: "Services" },
  { href: "/#platform", label: "Platform" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#security", label: "Security" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <Link className="brand" href="/">
              <span className="brand-mark">SC</span>
              <span>RoboticAPI Cloud</span>
            </Link>
            <nav className="nav-links" aria-label="Primary navigation">
              {navItems.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="nav-actions">
              <Link className="button secondary" href="/login">
                Login
              </Link>
              <Link className="button" href="/register">
                <ShieldCheck size={18} />
                Start trial
              </Link>
            </div>
          </div>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
