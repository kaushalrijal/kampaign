import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm tracking-wide border border-foreground hover:opacity-90 transition-opacity",

        destructive:
          "inline-flex items-center gap-2 px-6 py-3 bg-destructive text-white font-black text-sm tracking-wide hover:opacity-90 transition-opacity border border-destructive",

        secondary:
          "px-6 py-3 border border-border bg-background text-foreground font-semibold text-sm tracking-wide hover:bg-muted transition-colors",

        small:
          "px-6 py-2 border border-border bg-background text-foreground font-semibold text-xs tracking-wide hover:bg-muted transition-colors",

        ghost: "px-4 py-[6px] text-foreground hover:bg-muted transition-colors border border-foreground/60", // simple brutalist ghost

        link: "font-medium underline-offset-4 text-foreground hover:underline",

        outline:
          "px-6 py-3 border border-foreground bg-transparent text-foreground font-semibold hover:bg-muted transition-colors", // brutalist outline, consistent with everything else
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
