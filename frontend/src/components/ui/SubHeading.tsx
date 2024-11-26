import React from "react";

interface SubHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SubHeading({ children, className = "" }: SubHeadingProps) {
  return (
    <h3
      className={`text-xs font-medium text-sidebar-text-secondary ${className}`}
    >
      {children}
    </h3>
  );
}
