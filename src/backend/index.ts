
/**
 * Backend module exports
 * 
 * This file serves as the main entry point for all backend-related functionality.
 * Import and export components, hooks, and utilities that need to be shared across the frontend.
 */

// Export services
export { default as apiService } from './services/apiService';

// Export Supabase client
export { default as supabase } from './integrations/supabase/client';
export { supabaseUrl, supabaseKey, createClientComponentClient } from './integrations/supabase/client';
