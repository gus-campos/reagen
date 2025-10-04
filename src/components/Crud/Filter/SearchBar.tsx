import { Autocomplete, Box } from '@mantine/core';
import { Reagent } from '@/src/models/reagent';
import { useData } from '@/src/providers/DataProvider';

type SearchBarProps = {
  search: string;
  onChangeSearch: (search: string) => void;
  onChangeReagent: (reagent: Reagent | null) => void;
};

export function SearchBar(props: SearchBarProps) {
  const { reagents } = useData();

  return (
    <Box style={{ padding: '0 0 10px 0' }}>
      <Autocomplete
        placeholder="Busque por nome de itens..."
        data={reagents?.map((reag) => ({ value: reag.id, label: reag.name })) ?? []}
        onChange={(value) => {
          const reagent = reagents?.find((reag) => reag.name === value) ?? null;
          props.onChangeSearch(value);
          props.onChangeReagent(reagent);
        }}
        radius="md"
      />
    </Box>
  );
}
