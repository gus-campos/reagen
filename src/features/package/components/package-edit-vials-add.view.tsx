import React from 'react';
import {
  Button,
  Grid,
  Group,
  InputWrapper,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import {
  LabGroup,
  usePackageEditVialsAdd,
} from '@/features/package/components/package-edit-vials-add.viewmodel';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

export type PackageEditVialsAddProps = {
  labGroups: LabGroup[];
  labGroupsError: string | null;
  onChangeLabGroups: (labgroups: LabGroup[]) => void;
  disabled: boolean;
};

export function PackageEditVialsAdd(props: PackageEditVialsAddProps) {
  const {
    labGroupsWithNames,
    labIdToAdd,
    setLabIdToAdd,
    availableLaboratories,
    totalVials,
    handleLabGroupAmountChange,
    handleAddLabGroup,
  } = usePackageEditVialsAdd({...props});

  return (
    <InputWrapper label="Frascos por laboratório" mt="md" error={props.labGroupsError}>
      <Paper py="md" px="md" withBorder>
        <Stack gap="xl" justify="space-between">
          <Grid>
            {labGroupsWithNames.map((group, index) => (
              <React.Fragment key={index}>
                <Grid.Col span={{ base: 6 }} style={{ display: 'flex', alignItems: 'center' }}>
                  {group.laboratoryName}
                </Grid.Col>
                <Grid.Col span={{ base: 6 }}>
                  <NumberInput
                    allowDecimal={false}
                    allowLeadingZeros={false}
                    allowNegative={false}
                    value={group.amount}
                    prefix="x "
                    onChange={(value) =>
                      handleLabGroupAmountChange(group.laboratoryId, Number(value))
                    }
                  />
                </Grid.Col>
              </React.Fragment>
            ))}
          </Grid>

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
            <Button
              disabled={props.disabled}
              variant="filled"
              onClick={handleAddLabGroup}
            >
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
