import { Autocomplete, Box, TextInput } from '@mantine/core';
import { Definition } from '@/src/models/definition';
import { useData } from '@/src/providers/DataProvider';

type SearchBarProps = {
  search: string;
  onChangeSearch: (search: string) => void;
  onChangeDefinition: (definition: Definition | null) => void;
};

export function SearchBar(props: SearchBarProps) {
  const { definitions } = useData();

  return (
    <Box style={{ padding: '0 0 10px 0' }}>
      <Autocomplete
        placeholder={'Busque por nome de reagentes...'}
        data={definitions?.map((def) => ({ value: def.id, label: def.name })) ?? []}
        onChange={(value) => {
          const definition = definitions?.find((def) => def.name === value) ?? null;
          props.onChangeSearch(value);
          props.onChangeDefinition(definition);
        }}
        radius="md"
      />
    </Box>
  );
}
