'use client';

import React, { useState } from 'react';
import { Box, Grid, LoadingOverlay } from '@mantine/core';
import { ItemGroupView } from '../features/grouped-stock/views/GroupedItemView';
import { ItemFilter } from '../features/item-filter/types/items-filter';
import { FilterOptions } from '../features/item-filter/views/FilterOptions';
import { SearchBar } from '../features/item-filter/views/SearchBar';
import { ItemView } from '../features/items/views/ItemView';
import { useData } from '../providers/DataProvider';

// PRecisa ser inicializado aqui
const initialFilter: ItemFilter = {
  controlled: 'all',
  expired: 'all',
  maxExpire: null,
  minExpire: null,
  controlAgencyId: null,
  brandId: null,
  supplierId: null,
  laboratoryId: null,
};

export type ViewMode = 'simple' | 'grouped';

export function StockPage() {
  const { loadingItems, itemsError, controlAgenciesError, loadingControlAgencies, getReagentById } =
    useData();

  // STATES

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ItemFilter>(initialFilter);
  const [viewMode, setViewMode] = useState<ViewMode>('simple');

  // HANDLERS

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: ItemFilter) => {
    setFilter(filter);
  };

  // CONSTS

  return (
    <>
      <h1>Estoque</h1>

      {itemsError || controlAgenciesError ? (
        <p>ERRO</p>
      ) : loadingItems || loadingControlAgencies ? (
        // TODO: Inserir skeletons
        <LoadingOverlay visible />
      ) : (
        <>
          <Grid>
            <Grid.Col span={{ base: 3 }}>
              <FilterOptions
                filter={filter}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 9 }}>
              <SearchBar
                search={search}
                placeholder="Busque por nome de reagentes..."
                onChangeSearch={handleSearchChange}
              />
              <Box>
                {/* Tabela de itens */}
                {viewMode === 'simple' ? (
                  <ItemView filter={filter} search={search} />
                ) : (
                  <ItemGroupView search={search} filter={filter} />
                )}
              </Box>
            </Grid.Col>
          </Grid>
        </>
      )}
    </>
  );
}
