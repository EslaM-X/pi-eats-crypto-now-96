
/**
 * Core API service for handling backend requests
 */

import { createClient } from '../integrations/supabase/client';

const supabase = createClient();

/**
 * Generic API wrapper for making database requests
 */
export const apiService = {
  /**
   * Fetch data from a table with optional filters
   */
  async getData(tableName: string, options?: { 
    filters?: Record<string, any>,
    limit?: number,
    order?: { column: string, ascending?: boolean }
  }) {
    try {
      let query = supabase.from(tableName).select();
      
      // Apply filters if provided
      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          query = query.eq(key, value);
        }
      }
      
      // Apply ordering if provided
      if (options?.order) {
        const { column, ascending = true } = options.order;
        query = query.order(column, { ascending });
      }
      
      // Apply limit if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('API Service Error:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('API Service Exception:', error);
      throw error;
    }
  },
  
  /**
   * Insert data into a table
   */
  async insertData(tableName: string, data: Record<string, any>) {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select();
      
      if (error) {
        console.error('API Insert Error:', error);
        throw error;
      }
      
      return result;
    } catch (error) {
      console.error('API Insert Exception:', error);
      throw error;
    }
  },
  
  /**
   * Update data in a table
   */
  async updateData(tableName: string, id: string | number, data: Record<string, any>) {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('API Update Error:', error);
        throw error;
      }
      
      return result;
    } catch (error) {
      console.error('API Update Exception:', error);
      throw error;
    }
  },
  
  /**
   * Delete data from a table
   */
  async deleteData(tableName: string, id: string | number) {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('API Delete Error:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('API Delete Exception:', error);
      throw error;
    }
  }
};

export default apiService;
