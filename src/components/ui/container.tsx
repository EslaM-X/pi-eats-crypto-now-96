
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
}

export const Container = ({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "container mx-auto px-4 md:px-6",
        {
          "max-w-7xl": size === "default",
          "max-w-5xl": size === "small",
          "max-w-screen-2xl": size === "large"
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
