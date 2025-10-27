'use client';

import React, { createContext, ReactNode, useCallback, useContext } from 'react';
import { FirebaseError } from 'firebase/app';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Item } from '@/src/models/item';
import { Reagent } from '@/src/models/reagent';
import { itemConverter, itemsDocName } from '@/src/services/itemsDB';
import { reagentConverter, reagentsDocName } from '@/src/services/reagentsDB';
import { db } from '@/src/utils/firebase';
import { sortKeys } from '@/src/utils/sortKeys';
import { Brand } from '../models/brand';
import { ControlAgency } from '../models/control-agency';
import { brandConverter, brandsDocName } from '../services/brandsDB';
import { controlAgenciesDocName, controlAgencyConverter } from '../services/controlAgenciesDB';

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
  itemsError?: FirebaseError;
  reagentsError?: FirebaseError;
  brandsError?: FirebaseError;
  controlAgenciesError?: FirebaseError;
  //
  getReagentById: (id: string) => Reagent | null;
  getItemById: (id: string) => Item | null;
  getBrandById: (id: string) => Brand | null;
  getControlAgencyById: (id: string) => ControlAgency | null;
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
  // Única ocorrência de nomes antigos, pois são o nome dos arquivos do firebase
  const [reagents, loadingReagents, reagentsError] = useCollectionData<Reagent>(
    collection(db, reagentsDocName).withConverter(reagentConverter)
  );

  const [items, loadingItems, itemsError] = useCollectionData<Item>(
    collection(db, itemsDocName).withConverter(itemConverter)
  );

  const [brands, loadingBrands, brandsError] = useCollectionData<Brand>(
    collection(db, brandsDocName).withConverter(brandConverter)
  );

  const [controlAgencies, loadingControlAgencies, controlAgenciesError] =
    useCollectionData<ControlAgency>(
      collection(db, controlAgenciesDocName).withConverter(controlAgencyConverter)
    );

  const getReagentById = (id: string) => {
    return reagents?.find((op) => op.id === id) ?? null;
  };

  const getItemById = (id: string) => {
    return items?.find((op) => op.id === id) ?? null;
  };

  const getBrandById = (id: string) => {
    return brands?.find((op) => op.id === id) ?? null;
  };

  const getControlAgencyById = (id: string) => {
    return controlAgencies?.find((op) => op.id === id) ?? null;
  };

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
