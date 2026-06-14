import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold",
  {
    variants: {
      variant: {
        default: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
        secondary: "border-sky-300/25 bg-sky-300/10 text-sky-200",
        warning: "border-amber-300/25 bg-amber-300/10 text-amber-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
