import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
  type: "button" | "submit";
  variant?: "danger" | "primary";
};

export const Button = ({
  children,
  disabled = false,
  label,
  onClick,
  type,
  variant = "primary",
}: Props) => (
  <button
    aria-label={label}
    className={`button button--${variant}`}
    disabled={disabled}
    onClick={onClick}
    type={type === "submit" ? "submit" : "button"}
  >
    {children}
  </button>
);
