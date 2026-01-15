'use client';

import React from 'react';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';
import { DataTable } from '@/features/data-table/data-table.view';
import { Reagent } from '@/features/reagent/reagent.type';
import { useReagentsView } from '@/features/reagent/reagent.viewmodel';
import { ReagentEdit } from '@/features/reagent/views/reagent-edit.view';
import { SearchReagent } from '@/features/stock-filter/views/search-reagent.view';
import { ConfirmModal } from '@/shared/components/confirm-modal.view';

export function ReagentsView() {
  const {
    reagents,
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
  } = useReagentsView();

  return (
    <>
      <span style={{ position: 'relative' }}>
        <h1>Reagentes</h1>

        <SearchReagent
          search={search}
          placeholder="Busque por nome de reagentes..."
          onChangeSearch={handleSearchChange}
        />

        <Box pb="80px">
          {shouldShowError && <p>ERRO</p>}
          {shouldShowLoading && <LoadingOverlay visible />}
          {shouldShowTable && (
            <DataTable<Reagent>
              datas={reagents!}
              collumns={initialCollumns}
              search={search}
              searched={(reagent: Reagent) => reagent.name}
              crudOperations={crudOperations}
            />
          )}
        </Box>

        <Button
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '30px',
            height: '40px',
            borderRadius: '50px',
          }}
          onClick={handleBeginReagentAddition}
        >
          + Adicionar reagente
        </Button>

        <Modal
          title={<strong>{modalTitle}</strong>}
          opened={isEditModalOpen}
          onClose={handleExitEdit}
        >
          <ReagentEdit
            selectedReagent={selectedReagent}
            onAddReagent={handleAddReagent}
            vialModalOpened={isEditModalOpen}
            onEditReagent={handleEditReagent}
            onClose={handleExitEdit}
          />
        </Modal>
      </span>
      <ConfirmModal
        opened={isConfirmModalOpen}
        onClose={handleExitConfirmation}
        onConfirm={handleConfirmReagentDelete}
      >
        {warning}
      </ConfirmModal>
    </>
  );
}
