import Link from "next/link";
import {
  BarChart3,
  Gauge,
  KeyRound,
  Settings,
  ShieldCheck,
  WalletCards
} from "lucide-react";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/dashboard/api-keys", label: "API keys", icon: KeyRound },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="platform-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">SC</span>
          <span>Sohanur Cloud</span>
        </Link>
        <div className="metric" style={{ marginTop: 24 }}>
          <ShieldCheck color="var(--primary)" />
          <strong>Demo tenant</strong>
          <span>Growth plan · active</span>
        </div>
        <nav className="sidebar-nav" aria-label="Tenant dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.href}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="metric" style={{ marginTop: 24 }}>
          <WalletCards color="var(--accent)" />
          <strong>$128,420</strong>
          <span>Available reseller wallet balance</span>
        </div>
      </aside>
      <section className="platform-main">{children}</section>
    </main>
  );
}
