'use client';

import React, { useState } from 'react';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';
import { BrandEditForm } from '../components/Brand/BrandEditForm';
import { CrudOperations, TableView } from '../components/Crud/Table/TableView';
import { Brand } from '../models/brand';
import { useData } from '../providers/DataProvider';
import { uploadAddBrand, uploadDeleteBrand, uploadEditBrand } from '../services/brandsDB';

// FIXME: Quando acaba de adicionar, aparece ND no reagente, dependendo

export function BrandsView() {
  const { brands, loadingReagents, reagentsError, getBrandById } = useData();

  const initialCollumns = [
    {
      name: 'Marca',
      accessor: (brand: Brand) => brand.name,
      fixed: true,
      sorter: (a: Brand, b: Brand) => a.name.trim().localeCompare(b.name.trim()),
    },
  ];

  // STATES

  const [mode, setMode] = useState<'edit' | 'table'>('table');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const selectedBrand = selectedBrandId ? getBrandById(selectedBrandId) : null;

  // HANDLERS

  const handleBeginBrandAddition = () => {
    setSelectedBrandId(null);
    setMode('edit');
  };

  const handleBeginBrandEdit = (brand: Brand) => {
    setSelectedBrandId(brand.id);
    setMode('edit');
  };

  const handleAddBrand = (brand: Brand) => {
    uploadAddBrand(brand);
    setSelectedBrandId(null);
    setMode('table');
  };

  const handleEditBrand = (brand: Brand) => {
    uploadEditBrand(brand);
    setSelectedBrandId(null);
    setMode('table');
  };

  const handleDeleteReagent = (brand: Brand) => {
    uploadDeleteBrand(brand);
  };

  const handleExitEdit = () => {
    setSelectedBrandId(null);
    setMode('table');
  };

  const crudOperations: CrudOperations<Brand> = {
    handleShowData: () => {},
    handleBeginDataEdit: handleBeginBrandEdit,
    handleDeleteData: handleDeleteReagent,
  };

  // EFFECTS

  return (
    <span style={{ position: 'relative' }}>
      <h1>Marcas</h1>

      <Box pb="80px">
        {reagentsError ? (
          <p>ERRO</p>
        ) : loadingReagents ? (
          <LoadingOverlay visible />
        ) : (
          <TableView
            datas={brands!}
            initialCollumns={initialCollumns}
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
        onClick={handleBeginBrandAddition}
      >
        + Adicionar reagente
      </Button>

      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      <Modal
        title={<strong>{selectedBrandId ? `Editar reagente` : `Adicionar reagente`}</strong>}
        opened={mode === 'edit'}
        onClose={handleExitEdit}
      >
        <BrandEditForm
          selectedBrand={selectedBrand!}
          onCancel={handleExitEdit}
          onAddBrand={handleAddBrand}
          onEditBrand={handleEditBrand}
        />
      </Modal>
    </span>
  );
}
