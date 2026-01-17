import { useMemo, useState } from 'react';
import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { Package } from '@/features/package/package.type';
import { getReagentTableInitialColumns } from '@/features/reagent/reagent.constants';
import { ReagentService } from '@/features/reagent/reagent.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { useData } from '@/providers/data.provider';
import { findPackagesOfReagent } from '@/shared/utils/misc';

type UseReagentsViewProps = {
  reagentService: ReagentService;
};

export function useReagentsView(props: UseReagentsViewProps) {
  const {
    reagents,
    loadingReagents,
    reagentsError,
    packages,
    getReagentById,
    getControlAgencyById,
  } = useData();

  const [mode, setMode] = useState<'show' | 'edit' | 'table'>('table');
  const [selectedReagentId, setSelectedReagentId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [warning, setWarning] = useState<string | null>(null);

  const initialCollumns = getReagentTableInitialColumns(getControlAgencyById);

  const selectedReagent = useMemo(() => {
    return selectedReagentId ? getReagentById(selectedReagentId) : null;
  }, [reagents, selectedReagentId]);

  const isEditModalOpen = mode === 'edit';
  const isConfirmModalOpen = warning !== null;
  const modalTitle = selectedReagentId ? 'Editar Reagente' : 'Adicionar Reagente';

  const shouldShowTable = !reagentsError && !loadingReagents;
  const shouldShowError = reagentsError;
  const shouldShowLoading = loadingReagents;

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleBeginReagentAddition = () => {
    setSelectedReagentId(null);
    setMode('edit');
  };

  const handleShowReagent = (reagent: Reagent) => {
    setSelectedReagentId(reagent.id);
    setMode('show');
  };

  const handleBeginReagentEdit = (reagent: Reagent) => {
    setSelectedReagentId(reagent.id);
    setMode('edit');
  };

  const handleAddReagent = (reagent: Reagent) => {
    props.reagentService.create(reagent);
    setSelectedReagentId(null);
  };

  const handleEditReagent = (reagent: Reagent) => {
    props.reagentService.update(reagent.id, reagent);
    setSelectedReagentId(null);
  };

  const getConfirmationMessage = (reagent: Reagent, relatedPackages: Package[]) => {
    return `Excluir o reagente: ${reagent.name}
      Causará a exclusão dos seguintes pacotes:
      ${relatedPackages.map((vial) => `* ${vial.id}`).join('\n')}
      `;
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    const relatedPackages = findPackagesOfReagent(reagent, packages!);

    if (relatedPackages.length > 0) {
      setSelectedReagentId(reagent.id);
      setWarning(getConfirmationMessage(reagent, relatedPackages));
    } else {
      props.reagentService.delete(reagent.id);
    }
  };

  const handleConfirmReagentDelete = () => {
    props.reagentService.delete(selectedReagentId!);
    setSelectedReagentId(null);
    setWarning(null);
  };

  const handleExitConfirmation = () => {
    setWarning(null);
    setSelectedReagentId(null);
  };

  const handleExitEdit = () => {
    setSelectedReagentId(null);
    setMode('table');
  };

  const crudOperations: TableCrudOperations<Reagent> = {
    handleClickRow: handleShowReagent,
    handleBeginDataEdit: handleBeginReagentEdit,
    handleDeleteData: handleDeleteReagent,
  };

  return {
    reagents,
    mode,
    selectedReagent,
    search,
    warning,
    initialCollumns,
    isEditModalOpen,
    isConfirmModalOpen,
    modalTitle,
    shouldShowTable,
    shouldShowError,
    shouldShowLoading,
    handleSearchChange,
    handleBeginReagentAddition,
    handleAddReagent,
    handleEditReagent,
    handleConfirmReagentDelete,
    handleExitConfirmation,
    handleExitEdit,
    crudOperations,
  };
}
