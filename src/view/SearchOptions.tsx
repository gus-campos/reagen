import { Box, Divider, Paper } from '@mantine/core';
import { SearchBar } from '../components/Crud/Filter/SearchBar';
import FilterOptions from '../components/Filter/FilterOptions';
import ReagentsFilter from '../models/reagents-filter';

type SearchOptionsProps = {
  search: string;
  handleChangeSearch: (search: string) => void;
  filter: ReagentsFilter;
  handleChangeFilter: (filter: ReagentsFilter) => void;
};

export default function SearchOptions(props: SearchOptionsProps) {
  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        <h3>Busca</h3>
        <SearchBar search={props.search} setSearch={props.handleChangeSearch} />
        <FilterOptions filter={props.filter} handleChangeFilter={props.handleChangeFilter} />
      </Paper>
    </Box>
  );
}
