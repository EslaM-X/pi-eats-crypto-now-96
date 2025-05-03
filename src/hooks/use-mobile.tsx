
import { useState, useEffect } from 'react';
// Re-export from frontend for backwards compatibility
import { useIsMobile as useIsMobileFrontend } from '../frontend/hooks/use-mobile';

export const useIsMobile = (): boolean => {
  return useIsMobileFrontend();
};
