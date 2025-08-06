'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Definition } from '../models/definition';
import { Operation } from '../models/operation';
import { Reagent } from '../models/reagent';
import { definitionConverter } from '../services/definitionsDB';
import { operationConverter } from '../services/operationsDB';
import { reagentConverter } from '../services/reagentsDB';
import { db } from '../utils/firebase';
import { sortKeys } from '../utils/sortKeys';

const DataContext = createContext<{
  reagents: Reagent[] | undefined;
  definitions: Definition[] | undefined;
  operations: Operation[] | undefined;
  getDefinitionById: (id: string) => Definition | null;
  getReagentById: (id: string) => Reagent | null;
  getOperationById: (id: string) => Operation | null;
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
  const [definitions] = useCollectionData<Definition>(
    collection(db, 'definitions').withConverter(definitionConverter)
  );
  const [reagents] = useCollectionData<Reagent>(
    collection(db, 'reagents').withConverter(reagentConverter)
  );
  const [operations] = useCollectionData<Operation>(
    collection(db, 'operations').withConverter(operationConverter)
  );

  const getDefinitionById = (id: string) => {
    return definitions?.find((op) => op.id === id) ?? null;
  };
  const getReagentById = (id: string) => {
    return reagents?.find((op) => op.id === id) ?? null;
  };
  const getOperationById = (id: string) => operations?.find((op) => op.id === id) ?? null;

  console.log(
    'reagents: ',
    reagents?.map((r) => sortKeys(r))
  );

  console.log(
    'operations: ',
    operations?.map((op) => sortKeys(op))
  );

  console.log(
    'definitions: ',
    definitions?.map((op) => sortKeys(op))
  );

  return (
    <DataContext.Provider
      value={{
        definitions,
        reagents,
        operations,
        getDefinitionById,
        getReagentById,
        getOperationById,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
