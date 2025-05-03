
/**
 * Frontend module exports
 * 
 * This file serves as the main entry point for all frontend-related functionality.
 * Import and export components, hooks, and utilities that need to be shared across the frontend.
 */

// Re-export mobile utilities
export * from './utils/mobile';

// Re-export hooks
export * from './hooks/use-mobile';

// Re-export components
export { default as MobileNavbar } from './components/MobileNavbar';
export { default as MobileNavigation } from './components/MobileNavigation';
