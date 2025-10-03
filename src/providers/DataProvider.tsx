'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { FirebaseError } from 'firebase/app';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Definition } from '../models/definition';
import { Item } from '../models/item';
import { definitionConverter } from '../services/definitionsDB';
import { itemConverter } from '../services/itemsDB';
import { db } from '../utils/firebase';
import { sortKeys } from '../utils/sortKeys';

const DataContext = createContext<{
  items?: Item[];
  loadingItems: boolean;
  itemsError?: FirebaseError;
  definitions?: Definition[];
  loadingDefinitions: boolean;
  definitionsError?: FirebaseError;
  getDefinitionById: (id: string) => Definition | null;
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
  const [definitions, loadingDefinitions, definitionsError] = useCollectionData<Definition>(
    collection(db, 'definitions').withConverter(definitionConverter)
  );
  const [items, loadingItems, itemsError] = useCollectionData<Item>(
    collection(db, 'reagents').withConverter(itemConverter)
  );

  const getDefinitionById = (id: string) => {
    return definitions?.find((op) => op.id === id) ?? null;
  };
  const getItemById = (id: string) => {
    return items?.find((op) => op.id === id) ?? null;
  };

  console.log(
    'items: ',
    items?.map((r) => sortKeys(r))
  );

  console.log(
    'definitions: ',
    definitions?.map((op) => sortKeys(op))
  );

  return (
    <DataContext.Provider
      value={{
        definitions,
        loadingDefinitions,
        definitionsError,
        loadingItems,
        itemsError,
        items,
        getDefinitionById,
        getItemById,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
