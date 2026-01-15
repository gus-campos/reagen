import { useState } from 'react';
import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { NamedOption } from '@/features/named-option/named-option.type';
import { BaseRepository } from '@/shared/services/base-repository.service';

type NameDataViewProps<T extends NamedOption> = {
  datas?: T[];
  dataName: string;
  repositoryService: BaseRepository<T>;
  getDeleteWarning: (data: T) => string | null;
  loadingData: boolean;
};

export function useNamedOptionView<T extends NamedOption>(props: NameDataViewProps<T>) {
  const initialCollumns = [
    {
      name: 'Nome',
      accessor: (data: T) => data.name,
      fixed: true,
      sorter: (a: T, b: T) => a.name.trim().localeCompare(b.name.trim()),
    },
  ];

  const [mode, setMode] = useState<'edit' | 'table'>('table');
  const [selectedDataId, setSelectedDataId] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const selectedData =
    selectedDataId && !props.loadingData
      ? props.datas!.find((data) => data.id === selectedDataId)!
      : null;

  const isEditModalOpen = mode === 'edit';
  const isConfirmModalOpen = warning !== null;
  const modalTitle = selectedDataId ? `Editar ${props.dataName}` : `Adicionar ${props.dataName}`;
  const shouldShowLoading = props.loadingData;
  const shouldShowContent = !props.loadingData;

  const handleBeginDataAdd = () => {
    setSelectedDataId(null);
    setMode('edit');
  };

  const handleBeginDataEdit = (data: T) => {
    setSelectedDataId(data.id);
    setMode('edit');
  };

  const handleAddData = (data: T) => {
    props.repositoryService.create(data);
    setSelectedDataId(null);
    setMode('table');
  };

  const handleEditData = (data: T) => {
    props.repositoryService.update(data.id, data);
    setSelectedDataId(null);
    setMode('table');
  };

  const handleDeleteData = (data: T) => {
    const message = props.getDeleteWarning(data);

    if (message !== null) {
      setWarning(message);
      setSelectedDataId(data.id);
    } else {
      props.repositoryService.delete(data.id!);
    }
  };

  const handleConfirmDataDelete = () => {
    props.repositoryService.delete(selectedDataId!);
    handleExitConfirmation();
    setWarning(null);
  };

  const handleExitConfirmation = () => {
    setSelectedDataId(null);
    setWarning(null);
  };

  const handleExitEdit = () => {
    setSelectedDataId(null);
    setMode('table');
  };

  const crudOperations: TableCrudOperations<T> = {
    handleBeginDataEdit,
    handleDeleteData,
  };

  return {
    mode,
    selectedData,
    warning,
    initialCollumns,
    isEditModalOpen,
    isConfirmModalOpen,
    modalTitle,
    shouldShowLoading,
    shouldShowContent,
    datas: props.datas,
    dataName: props.dataName,
    handleBeginDataAdd,
    handleAddData,
    handleEditData,
    handleConfirmDataDelete,
    handleExitConfirmation,
    handleExitEdit,
    crudOperations,
    setWarning,
  };
}
