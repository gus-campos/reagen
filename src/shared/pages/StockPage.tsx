import React, { useState } from 'react';
import { Box, Grid, LoadingOverlay } from '@mantine/core';
import { PackageView } from '@/features/package/package.view';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { FilterOptions } from '@/features/stock-filter/views/FilterOptions';
import { SearchReagent } from '@/features/stock-filter/views/SearchReagent';
import { useData } from '@/providers/data.provider';

// PRecisa ser inicializado aqui
const initialFilter: StockFilter = {
  controlled: 'all',
  expired: 'all',
  maxExpire: null,
  minExpire: null,
  controlAgencyId: null,
  brandId: null,
  supplierId: null,
  laboratoryId: null,
};

export default function StockPage() {
  const { loadingVials, vialsError, controlAgenciesError, loadingControlAgencies } = useData();

  // STATES

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>(initialFilter);

  // HANDLERS

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: StockFilter) => {
    setFilter(filter);
  };

  return (
    <>
      <h1>Estoque</h1>

      {vialsError || controlAgenciesError ? (
        <p>ERRO</p>
      ) : loadingVials || loadingControlAgencies ? (
        // TODO: Inserir skeletons
        <LoadingOverlay visible />
      ) : (
        <>
          <Grid>
            <Grid.Col span={{ base: 3 }}>
              <FilterOptions filter={filter} onFilterChange={handleFilterChange} />
            </Grid.Col>

            <Grid.Col span={{ base: 9 }}>
              <SearchReagent
                search={search}
                placeholder="Busque por nome de reagentes..."
                onChangeSearch={handleSearchChange}
              />
              <Box>
                {/* Tabela de itens */}
                <PackageView filter={filter} search={search} />
              </Box>
            </Grid.Col>
          </Grid>
        </>
      )}
    </>
  );
}
