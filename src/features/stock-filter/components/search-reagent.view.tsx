import { FaMagnifyingGlass } from 'react-icons/fa6';
import { Autocomplete, Box } from '@mantine/core';
import { Reagent } from '@/features/reagent/reagent.type';
import { useData } from '@/providers/data.provider';

type SearchBarProps = {
  search: string;
  placeholder?: string;
  onChangeSearch: (search: string) => void;
  onChangeReagent?: (reagent: Reagent | null) => void;
};

export function SearchReagent(props: SearchBarProps) {
  const { reagents } = useData();

  const sortedReagents = reagents?.sort((a, b) => a.name.trim().localeCompare(b.name.trim())) ?? [];
  const options = sortedReagents.map((reag) => ({ value: reag.id, label: reag.name }));

  const handleChangeSearch = (value: string) => {
    const reagent = reagents?.find((reag) => reag.name === value) ?? null;
    props.onChangeSearch(value);
    if (props.onChangeReagent) props.onChangeReagent(reagent);
  };

  return (
    <Box style={{ padding: '0 0 10px 0' }}>
      <Autocomplete
        rightSection={<FaMagnifyingGlass />}
        placeholder={props.placeholder}
        data={options}
        onChange={handleChangeSearch}
        radius="sm"
      />
    </Box>
  );
}
