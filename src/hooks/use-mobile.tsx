
import * as React from "react";

// Higher threshold for better detection including tablets in portrait mode
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Function to check if device is mobile based on viewport width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add listener for resize events
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkIfMobile);
    
    // Initial check
    checkIfMobile();
    
    // Clean up
    return () => mql.removeEventListener("change", checkIfMobile);
  }, []);

  // Detect touch capability as additional indicator
  React.useEffect(() => {
    if (typeof navigator !== 'undefined' && 'maxTouchPoints' in navigator) {
      if (navigator.maxTouchPoints > 0) {
        setIsMobile(true);
      }
    }
  }, []);

  return !!isMobile;
}

// Hook to detect screen orientation
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth 
      ? 'portrait' 
      : 'landscape'
  );

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', handleOrientationChange);
    
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
}
