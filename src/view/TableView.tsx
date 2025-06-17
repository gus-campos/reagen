'use client';

import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ReagentsTable } from '@/src/components/Table/ReagentsTable';
import { reagentConverter } from '@/src/services/reagentsDB';
import { Reagent } from '@/src/typings/reagent';
import { db } from '@/src/utils/firebase';
import { ReagentsFilter } from '../typings/reagents-filter';

type TableViewProps = {
  search: string;
  filter: ReagentsFilter;
};

export function TableView({ search, filter }: TableViewProps) {
  const [reagents, loadingReagents, errorLoadingReagents] = useCollectionData<Reagent>(
    collection(db, 'reagents').withConverter(reagentConverter)
  );

  return (
    <>
      {/* Coluna dos reagentes */}

      {/* Table */}
      {errorLoadingReagents ? (
        <p>ERRO AO CARREGAR DADOS!</p>
      ) : loadingReagents ? (
        <p>CARREGANDO DADOS...</p>
      ) : !reagents ? (
        <p>NENHUM DADO ENCONTRADO</p>
      ) : (
        <ReagentsTable reagents={reagents} search={search} filter={filter} />
      )}
    </>
  );
}
