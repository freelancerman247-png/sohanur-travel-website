"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cloneElement, useMemo } from "react";
import type { InputHTMLAttributes, ReactElement } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tenantRegistrationSchema = z.object({
  company: z.string().min(2, "Company name is required."),
  slug: z
    .string()
    .min(3, "Workspace slug must be at least 3 characters.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  email: z.string().email("Enter a valid owner email."),
  phone: z.string().min(8, "Enter a support phone number.")
});

type TenantRegistrationInput = z.infer<typeof tenantRegistrationSchema>;

export function TenantRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<TenantRegistrationInput>({
    resolver: zodResolver(tenantRegistrationSchema),
    defaultValues: {
      company: "",
      slug: "",
      email: "",
      phone: ""
    }
  });

  const statusMessage = useMemo(() => {
    if (isSubmitSuccessful) {
      return "Demo submitted. Connect this form to the tenant creation API when auth is enabled.";
    }

    return "This is wired with React Hook Form and Zod validation.";
  }, [isSubmitSuccessful]);

  function onSubmit(data: TenantRegistrationInput) {
    // Replace with a server action or API route once account creation is enabled.
    console.info("Tenant registration request", data);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        error={errors.company?.message}
        label="Company name"
        registration={register("company")}
      >
        <Input autoComplete="organization" placeholder="Robotic API Services" />
      </FormField>
      <FormField
        error={errors.slug?.message}
        label="Workspace slug"
        registration={register("slug")}
      >
        <Input placeholder="roboticapi" />
      </FormField>
      <FormField
        error={errors.email?.message}
        label="Owner email"
        registration={register("email")}
      >
        <Input autoComplete="email" placeholder="owner@roboticapi.in" type="email" />
      </FormField>
      <FormField
        error={errors.phone?.message}
        label="Support phone"
        registration={register("phone")}
      >
        <Input autoComplete="tel" placeholder="+91 90000 00000" />
      </FormField>
      <Button className="mt-2" type="submit">
        Create trial workspace
        <ArrowRight size={18} />
      </Button>
      <p className="flex items-center gap-2 text-sm text-slate-400">
        <CheckCircle2 className="text-emerald-300" size={16} />
        {statusMessage}
      </p>
    </form>
  );
}

function FormField({
  children,
  error,
  label,
  registration
}: {
  children: ReactElement<InputHTMLAttributes<HTMLInputElement>>;
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {cloneElement(children, {
        ...registration,
        "aria-invalid": Boolean(error)
      })}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
