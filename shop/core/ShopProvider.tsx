import React, { createContext, useContext, useMemo } from 'react';
import { ShopConfig, ShopConfigFromExisting } from './config/ShopConfig';

interface ShopContextValue {
  config: ShopConfig;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

export interface ShopProviderProps {
  config?: ShopConfig;
  children: React.ReactNode;
}

export function ShopProvider({ config, children }: ShopProviderProps) {
  const value = useMemo<ShopContextValue>(() => ({ config: config ?? ShopConfigFromExisting() }), [config]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShopConfig(): ShopConfig {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShopConfig must be used within ShopProvider');
  return ctx.config;
}
