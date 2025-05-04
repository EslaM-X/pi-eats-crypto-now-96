
import React from 'react';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';

interface AdSpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  variant?: 'horizontal' | 'vertical' | 'square';
  placeholder?: boolean;
  containerClass?: string;
  adContent?: React.ReactNode;
}

export function AdSpace({
  width,
  height,
  variant = 'horizontal',
  placeholder = true,
  containerClass,
  adContent,
  className,
  ...props
}: AdSpaceProps) {
  const { language } = useLanguage();
  const adText = language === 'ar' ? 'مساحة إعلانية' : 'Advertisement';
  
  return (
    <div className={cn("ad-space-container", containerClass)}>
      {placeholder ? (
        <div 
          className={cn(
            "ad-space",
            `${variant}`,
            className
          )}
          style={{ width, height }}
          {...props}
        >
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 via-muted/10 to-muted/30 overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-30"></div>
              <p className="text-muted-foreground/70 font-medium relative">
                {adText}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={cn(
            "ad-space",
            `${variant}`,
            className
          )}
          style={{ width, height }}
          {...props}
        >
          {adContent || (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground/70 font-medium">
                {adText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdSpace;
