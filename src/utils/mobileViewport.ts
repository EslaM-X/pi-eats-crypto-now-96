
/**
 * Fixes the viewport height issue on mobile browsers
 * where 100vh is taller than the visible area
 */
export function fixViewportHeight() {
  // First, get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Update the height on resize and orientation change
  const events = ['resize', 'orientationchange'];
  
  events.forEach(event => {
    window.addEventListener(event, () => {
      // We execute the same script as before
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  });
}

/**
 * Prevents pull-to-refresh on mobile
 */
export function preventPullToRefresh() {
  document.body.style.overscrollBehavior = 'contain';
}

/**
 * Set up all mobile viewport fixes
 */
export function setupMobileViewport() {
  fixViewportHeight();
  preventPullToRefresh();
  
  // Fix iOS Safari 100vh issue
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (isIOS) {
    document.documentElement.classList.add('ios');
  }
}
