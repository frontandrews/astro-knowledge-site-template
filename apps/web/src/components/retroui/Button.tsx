import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { retroButtonVariants } from "@/components/retroui/button-variants";

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof retroButtonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      size = "md",
      className = "",
      variant = "default",
      asChild = false,
      ...props
    }: IButtonProps,
    forwardedRef,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={forwardedRef}
        className={cn(retroButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
