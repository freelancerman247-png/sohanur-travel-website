import type { Metadata } from "next";
import Link from "next/link";
import { TenantRegistrationForm } from "@/components/forms/tenant-registration-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a RoboticAPI Cloud tenant workspace."
};

export default function RegisterPage() {
  return (
    <main className="auth-shell container">
      <Card className="w-full max-w-[520px]">
        <CardHeader>
        <span className="eyebrow">Create tenant</span>
          <CardTitle className="text-4xl leading-none tracking-[-0.06em]">
          Launch a secure reseller workspace.
          </CardTitle>
          <CardDescription className="text-base">
          Capture the tenant, owner, and billing contact in one flow. The backend
          schema is ready to create owner memberships and trial subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantRegistrationForm />
        <p style={{ color: "var(--muted)", marginTop: 20 }}>
          Already have a tenant? <Link href="/login">Sign in</Link>
        </p>
        </CardContent>
      </Card>
    </main>
  );
}
