
/**
 * Utility functions for responsive design
 */

/**
 * Media query breakpoints (matching Tailwind defaults)
 */
export const breakpoints = {
  sm: 640,   // Small screens (mobile landscape, etc)
  md: 768,   // Medium screens (tablets)
  lg: 1024,  // Large screens (laptops)
  xl: 1280,  // Extra large screens (desktops)
  '2xl': 1536 // 2x extra large screens (large desktops)
};

/**
 * Check if the current width is less than a breakpoint
 * For use in hooks like useEffect, not directly in render functions
 */
export function isLessThan(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints[breakpoint];
}

/**
 * Check if the current width is greater than or equal to a breakpoint
 * For use in hooks like useEffect, not directly in render functions
 */
export function isGreaterThan(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
}

/**
 * Check if the current width is between two breakpoints
 * For use in hooks like useEffect, not directly in render functions
 */
export function isBetween(
  minBreakpoint: keyof typeof breakpoints, 
  maxBreakpoint: keyof typeof breakpoints
): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[minBreakpoint] && 
         window.innerWidth < breakpoints[maxBreakpoint];
}

/**
 * Get a media query string for CSS-in-JS libraries
 * @example const styles = css`
 *   color: red;
 *   ${getMediaQuery('md')} {
 *     color: blue;
 *   }
 * `;
 */
export function getMediaQuery(breakpoint: keyof typeof breakpoints): string {
  return `@media (min-width: ${breakpoints[breakpoint]}px)`;
}

/**
 * Get a media query string for max-width
 */
export function getMaxWidthMediaQuery(breakpoint: keyof typeof breakpoints): string {
  return `@media (max-width: ${breakpoints[breakpoint] - 1}px)`;
}

/**
 * Get a media query string for a range between breakpoints
 */
export function getRangeMediaQuery(
  minBreakpoint: keyof typeof breakpoints, 
  maxBreakpoint: keyof typeof breakpoints
): string {
  return `@media (min-width: ${breakpoints[minBreakpoint]}px) and (max-width: ${breakpoints[maxBreakpoint] - 1}px)`;
}
