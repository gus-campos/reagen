'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { Item } from '@/src/models/item';
import { Reagent } from '@/src/models/reagent';
import { sortKeys } from '@/src/utils/sortKeys';
import { useCollectionData } from '../hooks/useCollectionData';
import { Brand } from '../models/brand';
import { ControlAgency } from '../models/control-agency';
import { BrandService } from '../services/BrandService';
import { ControlAgencyService } from '../services/ControlAgencyService';
import { ItemService } from '../services/ItemService';
import { ReagentService } from '../services/ReagentService';

const DataContext = createContext<{
  items?: Item[];
  reagents?: Reagent[];
  brands?: Brand[];
  controlAgencies?: ControlAgency[];
  //
  loadingReagents: boolean;
  loadingItems: boolean;
  loadingBrands: boolean;
  loadingControlAgencies: boolean;
  //
  itemsError?: Error | null;
  reagentsError?: Error | null;
  brandsError?: Error | null;
  controlAgenciesError?: Error | null;
  //
  getReagentById: (id: string) => Reagent;
  getItemById: (id: string) => Item;
  getBrandById: (id: string) => Brand;
  getControlAgencyById: (id: string) => ControlAgency;
} | null>(null);

export function useAppData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = (props: DataProviderProps) => {
  const [brands, loadingBrands, brandsError, getBrandById] = useCollectionData<Brand, BrandService>(
    BrandService.instance
  );

  const [controlAgencies, loadingControlAgencies, controlAgenciesError, getControlAgencyById] =
    useCollectionData<ControlAgency, ControlAgencyService>(ControlAgencyService.instance);

  const [items, loadingItems, itemsError, getItemById] = useCollectionData<Item, ItemService>(
    ItemService.instance
  );

  const [reagents, loadingReagents, reagentsError, getReagentById] = useCollectionData<
    Reagent,
    ReagentService
  >(ReagentService.instance);

  console.log('useData', {
    items: items?.map((r) => sortKeys(r)),
    reagents: reagents?.map((op) => sortKeys(op)),
    brands: brands?.map((b) => sortKeys(b)),
    controlAgency: controlAgencies?.map((c) => sortKeys(c)),
  });
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

  return (
    <DataContext.Provider
      value={{
        items,
        reagents,
        brands,
        controlAgencies,
        //
        loadingReagents,
        loadingItems,
        loadingBrands,
        loadingControlAgencies,
        //
        reagentsError,
        itemsError,
        brandsError,
        controlAgenciesError,
        //
        getReagentById,
        getItemById,
        getBrandById,
        getControlAgencyById,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
