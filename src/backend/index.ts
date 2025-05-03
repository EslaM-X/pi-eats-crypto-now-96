
/**
 * Backend module exports
 * 
 * This file serves as the main entry point for all backend-related functionality.
 * Import all services, utilities, and types that need to be exposed to the frontend here.
 */

// Export services
export { default as apiService } from './services/apiService';

// Export Supabase client
export { default as supabase } from './integrations/supabase/client';
