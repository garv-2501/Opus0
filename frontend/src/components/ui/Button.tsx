import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function Button({
  children,
  onClick,
  icon: Icon,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 hover:bg-sidebar-hover rounded-lg text-sidebar-text-secondary hover:text-sidebar-text-primary ${className}`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
