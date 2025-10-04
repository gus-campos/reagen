'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { FirebaseError } from 'firebase/app';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Item } from '@/src/models/item';
import { Reagent } from '@/src/models/reagent';
import { itemConverter, itemsDocName } from '@/src/services/itemsDB';
import { reagentConverter, reagentsDocName } from '@/src/services/reagentsDB';
import { db } from '@/src/utils/firebase';
import { sortKeys } from '@/src/utils/sortKeys';

const DataContext = createContext<{
  items?: Item[];
  loadingItems: boolean;
  itemsError?: FirebaseError;
  reagents?: Reagent[];
  loadingReagents: boolean;
  reagentsError?: FirebaseError;
  getReagentById: (id: string) => Reagent | null;
  getItemById: (id: string) => Item | null;
} | null>(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
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

  const getReagentById = (id: string) => {
    return reagents?.find((op) => op.id === id) ?? null;
  };
  const getItemById = (id: string) => {
    return items?.find((op) => op.id === id) ?? null;
  };

  console.log(
    'items: ',
    items?.map((r) => sortKeys(r))
  );

  console.log(
    'reagents: ',
    reagents?.map((op) => sortKeys(op))
  );

  return (
    <DataContext.Provider
      value={{
        reagents,
        loadingReagents,
        reagentsError,
        loadingItems,
        itemsError,
        items,
        getReagentById,
        getItemById,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
