import React from 'react';
import { Button, Group, InputWrapper, Paper, Select, Stack, Text } from '@mantine/core';
import {
  LabGroup,
  usePackageEditVialsAdd,
} from '@/features/package/components/package-edit-vials-add.viewmodel';
import { PackageVialsTable } from '@/features/package/components/package-vials-table.view';
import { Vial } from '@/features/vial/vial.type';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

export type PackageEditVialsAddProps = {
  vials: Vial[];
  onChangeVials: (labgroups: LabGroup[]) => void;
  labGroupsError: string | null;
  disabled: boolean;
};

export function PackageEditVialsEdit(props: PackageEditVialsAddProps) {
  // Tem que editar vials
  // Tabela de vials resumida permite excluir agrupado
  // Precisa ser tabela para mostrar out date
  // Como adicionar?
  // Adicionar um a um?
  // Colocar setas que mudam a quantidade e X
  // Para isso mudar a tabela para ser mais genérica??

  const vials: Vial[] = props.labGroups.flatMap((group, groupIndex) =>
    Array.from({ length: group.amount }).map((_, vialIndex) => ({
      id: `${groupIndex}-${vialIndex}`,
      laboratoryId: group.laboratoryId,
      packageId: 'id',
      outDate: null,
    }))
  );

  return (
    <InputWrapper label="Frascos por laboratório" mt="md" error={props.labGroupsError}>
      <Paper py="md" px="md" withBorder>
        <Stack gap="xl" justify="space-between">
          <PackageVialsTable vials={vials} />

          {/* Adição frasco ao novo laboratório */}
          <Group justify="space-between" align="end">
            <Select
              searchable
              disabled={props.disabled}
              filter={portugueseSearchFilter}
              style={{ flex: 1 }}
              label="Adicionar frascos a um laboratório"
              data={availableLaboratories}
              value={labIdToAdd}
              onChange={(value) => setLabIdToAdd(value)}
              placeholder="Selecione um laboratório de destino"
            />
            <Button disabled={props.disabled} variant="filled" onClick={handleAddLabGroup}>
              +
            </Button>
          </Group>

          {/* Soma total de frascos a todos os laboratórios */}
          <Group justify="center" align="center" w="100%" my="xs">
            <Text>Total de frascos: {totalVials}</Text>
          </Group>
        </Stack>
      </Paper>
    </InputWrapper>
  );
}
