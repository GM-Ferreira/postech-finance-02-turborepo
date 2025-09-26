'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para evitar hydration mismatch ao usar localStorage
 * Retorna isHydrated=false no servidor e primeira renderização no cliente
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};