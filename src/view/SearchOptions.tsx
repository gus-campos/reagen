import { Box, Divider, Paper } from '@mantine/core';
import FilterOptions from '../components/Filter/FilterOptions';
import SearchBar from '../components/Filter/SearchBar';
import ReagentsFilter from '../models/reagents-filter';

type SearchOptionsProps = {
  search: string;
  handleChangeSearch: (search: string) => void;
  filter: ReagentsFilter;
  handleChangeFilter: (filter: ReagentsFilter) => void;
};

export default function SearchOptions({
  search,
  handleChangeSearch,
  filter,
  handleChangeFilter,
}: SearchOptionsProps) {
  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        <h3>Busca</h3>
        <SearchBar search={search} setSearch={handleChangeSearch} />
        <FilterOptions filter={filter} handleChangeFilter={handleChangeFilter} />
      </Paper>
    </Box>
  );
}
