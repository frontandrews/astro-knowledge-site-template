import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({
  type = "text",
  placeholder = "Enter text",
  className = "",
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`px-4 py-2 w-full rounded border-2 border-border bg-background text-foreground shadow-md transition placeholder:text-muted-foreground focus:outline-hidden focus:shadow-xs ${
        props["aria-invalid"]
          ? "border-destructive text-destructive shadow-xs shadow-destructive"
          : ""
      } ${className}`}
      {...props}
    />
  );
};
