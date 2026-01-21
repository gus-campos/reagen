'use client';

import React from 'react';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';
import { DataTable } from '@/features/data-table/data-table.view';
import { NamedOption } from '@/features/named-option/named-option.type';
import { useNamedOptionView } from '@/features/named-option/named-option.viewmodel';
import { ConfirmModal } from '@/shared/components/confirm-modal.view';
import { NameDataEdit } from '@/shared/components/name-data-edit.view';
import { BaseRepository } from '@/shared/services/base-repository.service';

type NameDataViewProps<T extends NamedOption> = {
  datas?: T[];
  dataName: string;
  repositoryService: BaseRepository<T>;
  getDeleteWarning: (data: T) => string | null;
  loadingData: boolean;
};

export function NamedOptionView<T extends NamedOption>(props: NameDataViewProps<T>) {
  const {
    selectedData,
    warning,
    initialCollumns,
    isEditModalOpen,
    isConfirmModalOpen,
    modalTitle,
    shouldShowLoading,
    shouldShowContent,
    datas,
    dataName,
    handleBeginDataAdd,
    handleAddData,
    handleEditData,
    handleConfirmDataDelete,
    handleExitConfirmation,
    handleExitEdit,
    crudOperations,
  } = useNamedOptionView(props);

  return (
    <>
      {shouldShowLoading && <LoadingOverlay visible />}
      {shouldShowContent && (
        <>
          <span style={{ position: 'relative' }}>
            <h1>{dataName}</h1>

            <Box pb="80px">
              <DataTable<T>
                datas={datas!}
                collumns={initialCollumns}
                crudOperations={crudOperations}
              />
            </Box>

            <Button
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '30px',
                height: '40px',
                borderRadius: '50px',
              }}
              onClick={handleBeginDataAdd}
            >
              + Adicionar {props.dataName}
            </Button>

            <Modal
              title={<strong>{modalTitle}</strong>}
              opened={isEditModalOpen}
              onClose={handleExitEdit}
            >
              <NameDataEdit
                selectedData={selectedData!}
                onCancel={handleExitEdit}
                onAddData={handleAddData}
                onEditData={handleEditData}
              />
            </Modal>
          </span>
          <ConfirmModal
            opened={isConfirmModalOpen}
            onClose={handleExitConfirmation}
            onConfirm={handleConfirmDataDelete}
          >
            {warning}
          </ConfirmModal>
        </>
      )}
    </>
  );
}
