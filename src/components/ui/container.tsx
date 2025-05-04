
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  dir?: string;
}

export const Container: React.FC<ContainerProps> = ({ className, children, dir }) => {
  return (
    <div className={cn("container mx-auto px-4", className)} dir={dir}>
      {children}
    </div>
  );
};
