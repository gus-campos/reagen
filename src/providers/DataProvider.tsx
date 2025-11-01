'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { BrandService } from '../features/brands/services/BrandService';
import { Brand } from '../features/brands/types/brand';
import { ControlAgencyService } from '../features/control-agency/services/ControlAgencyService';
import { ControlAgency } from '../features/control-agency/types/control-agency';
import { ItemService } from '../features/items/services/ItemService';
import { Item } from '../features/items/types/item';
import { LaboratoryService } from '../features/laboratory/services/LaboratoryService';
import { Laboratory } from '../features/laboratory/types/laboratory';
import { ReagentService } from '../features/reagents/services/ReagentService';
import { Reagent } from '../features/reagents/types/reagent';
import { SupplierService } from '../features/supplier/services/SupplierService';
import { Supplier } from '../features/supplier/types/supplier';
import { sortKeys } from '../shared/utils/sort-keys';
import { useCollectionData } from './useData';

const DataContext = createContext<{
  items?: Item[];
  reagents?: Reagent[];
  brands?: Brand[];
  controlAgencies?: ControlAgency[];
  laboratories?: Laboratory[];
  suppliers?: Supplier[];
  //
  loadingReagents: boolean;
  loadingItems: boolean;
  loadingBrands: boolean;
  loadingControlAgencies: boolean;
  loadingLaboratories: boolean;
  loadingSuppliers: boolean;
  //
  itemsError?: Error | null;
  reagentsError?: Error | null;
  brandsError?: Error | null;
  controlAgenciesError?: Error | null;
  laboratoriesError?: Error | null;
  suppliersError?: Error | null;
  //
  getReagentById: (id: string) => Reagent;
  getItemById: (id: string) => Item;
  getBrandById: (id: string) => Brand;
  getControlAgencyById: (id: string) => ControlAgency;
  getLaboratoryById: (id: string) => Laboratory;
  getSupplierById: (id: string) => Laboratory;
} | null>(null);

export function useData() {
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

  const [laboratories, loadingLaboratories, laboratoriesError, getLaboratoryById] =
    useCollectionData<Laboratory, LaboratoryService>(LaboratoryService.instance);

  const [suppliers, loadingSuppliers, suppliersError, getSupplierById] = useCollectionData<
    Supplier,
    SupplierService
  >(SupplierService.instance);

  console.log('useData', {
    items: items?.map((r) => sortKeys(r)),
    reagents: reagents?.map((op) => sortKeys(op)),
    brands: brands?.map((b) => sortKeys(b)),
    controlAgency: controlAgencies?.map((c) => sortKeys(c)),
    laboratories: laboratories?.map((l) => sortKeys(l)),
  });
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

  return (
    <DataContext.Provider
      value={{
        items,
        reagents,
        brands,
        controlAgencies,
        laboratories,
        suppliers,
        //
        loadingReagents,
        loadingItems,
        loadingBrands,
        loadingControlAgencies,
        loadingLaboratories,
        loadingSuppliers,
        //
        reagentsError,
        itemsError,
        brandsError,
        controlAgenciesError,
        laboratoriesError,
        suppliersError,
        //
        getReagentById,
        getItemById,
        getBrandById,
        getControlAgencyById,
        getLaboratoryById,
        getSupplierById,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
