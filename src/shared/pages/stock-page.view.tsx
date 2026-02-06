import React, { useState } from 'react';
import { Box, Grid, LoadingOverlay } from '@mantine/core';
import { PackageView } from '@/features/package/package.view';
import { FilterOptions } from '@/features/stock-filter/components/filter-options.view';
import { SearchReagent } from '@/features/stock-filter/components/search-reagent.view';
import { CLEAN_STOCK_FILTER } from '@/features/stock-filter/stock-filter.constants';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { useData } from '@/providers/data.provider';

// Precisa ser inicializado aqui

export default function StockPage() {
  const { loadingVials, vialsError, controlAgenciesError, loadingControlAgencies } = useData();

  // STATES

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>(CLEAN_STOCK_FILTER);

  // HANDLERS

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: StockFilter) => {
    setFilter(filter);
  };

  const loading = loadingVials || loadingControlAgencies;
  const error = vialsError || controlAgenciesError;

  return (
    <>
      <h1>Estoque</h1>

      {error ? (
        <p>ERRO</p>
      ) : loading ? (
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
