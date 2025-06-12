import { Box, TextInput } from '@mantine/core';

type SearchBarProps = {
  search: string;
  setSearch: (search: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    // TODO: Tirar da table, colocar ícone de busca à direita
    <Box style={{ padding: '0 0 10px 0' }}>
      <TextInput
        placeholder={'Busque por nome de reagentes...'}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        radius="md"
      />
    </Box>
  );
}
