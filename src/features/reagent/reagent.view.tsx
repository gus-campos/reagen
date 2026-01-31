'use client';

import React from 'react';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';
import { DataTable } from '@/features/data-table/data-table.view';
import { ReagentEdit } from '@/features/reagent/components/reagent-edit.view';
import { Reagent } from '@/features/reagent/reagent.type';
import { useReagentsView } from '@/features/reagent/reagent.viewmodel';
import { SearchReagent } from '@/features/stock-filter/components/search-reagent.view';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { ConfirmModal } from '@/shared/components/confirm-modal.view';

// Deveria ter um componente "ancestral" em comum com named-option.view
// Para evitar duplicação. Cuidado ao editar qualquer um dos dois
export function ReagentsView() {
  const { reagentService } = useDependencyInjection();
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
  } = useReagentsView({ reagentService });

  return (
    <>
      <span style={{ position: 'relative' }}>
        <h1>Reagente</h1>

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

        {/* Duplicado em named-option.view */}
        <Button
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '30px',
            height: '40px',
            borderRadius: '50px',
          }}
          onClick={handleBeginReagentAddition}
        >
          + Cadastrar Reagente
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
