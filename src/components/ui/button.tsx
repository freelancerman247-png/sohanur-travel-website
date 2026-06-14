import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-emerald-300 px-5 text-slate-950 hover:bg-emerald-200",
        secondary:
          "border border-white/15 bg-white/5 px-5 text-white hover:border-sky-300/50 hover:bg-sky-300/10",
        destructive: "bg-red-400 px-5 text-slate-950 hover:bg-red-300",
        ghost: "px-4 text-slate-200 hover:bg-white/10"
      },
      size: {
        default: "h-12",
        sm: "h-9 px-4",
        lg: "h-14 px-7 text-base",
        icon: "size-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
