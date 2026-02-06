import { createContext, ReactNode, useContext, useState } from 'react';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';

type NavigationDataContextType = {
  filter: StockFilter | null;
  handleSetFilter: (value: StockFilter | null) => void;
};

const NavigationDataContext = createContext<NavigationDataContextType | null>(null);

export function NavigationDataProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<StockFilter | null>(null);

  const handleSetFilter = (filter: StockFilter | null) => setFilter(filter);

  return (
    <NavigationDataContext.Provider value={{ filter, handleSetFilter }}>
      {children}
    </NavigationDataContext.Provider>
  );
}

export function useNavigationData() {
  const ctx = useContext(NavigationDataContext);
  if (!ctx) throw new Error('useNavigationData fora do provider');
  return ctx;
}
