import {
  Box,
  Button,
  ComboboxItemGroup,
  Flex,
  Grid,
  Group,
  Loader,
  NumberInput,
  Select,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Reagent } from '@/src/features/reagents/types/reagent';
import { Size } from '@/src/features/reagents/types/size';
import Unit, {
  Dimension,
  DimensionDefaultUnit,
  UnitDimension,
} from '@/src/features/reagents/types/unit';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';

type SizeAddForm = {
  selectedReagent: Reagent;
  loadingAddSize: boolean;
  onAddSize: (size: Size) => void;
  onCancel: () => void;
};

export function SizeAddForm(props: SizeAddForm) {
  const validateAmount = (value: number): string | null => {
    const countUnits =
      unitSelectOptions.find((group) => group.group == Dimension.COUNT)?.items ?? [];

    return value > 0
      ? !countUnits.includes(sizeForm.values.unit) || value % 1 == 0
        ? null
        : 'Precisa ser inteiro'
      : 'Só é possível adicionar quantidade maior que 0';
  };

  const sizeForm = useForm<Size>({
    initialValues: {
      amount: 0,
      unit: props.selectedReagent
        ? // FIXME: tipagem
          DimensionDefaultUnit[props.selectedReagent.dimension]
        : Unit.GRAM,
    },
    validate: {
      amount: (value) => {
        const valid = validateAmount(value);
        if (valid !== null) {
          return valid;
        }

        const size: Size = { amount: value, unit: sizeForm.values.unit };
        const found = props.selectedReagent?.sizes.find(
          (s) => s.amount === size.amount && s.unit === size.unit
        );
        if (found) {
          return 'Combinação já existente.';
        }

        return null;
      },
      unit: (value) => {
        const size: Size = { amount: sizeForm.values.amount, unit: value };
        const found = props.selectedReagent?.sizes.find(
          (s) => s.amount === size.amount && s.unit === size.unit
        );
        if (found) {
          return 'Combinação já existente.';
        }

        return null;
      },
    },
  });

  const dimension = props.selectedReagent.dimension;

  const unitSelectOptions: ComboboxItemGroup[] = dimension
    ? [
        {
          group: dimension,
          items: dimension
            ? Object.values(Unit).filter((unit) => UnitDimension[unit] === dimension)
            : [],
        },
      ]
    : [];

  return (
    <form
      onSubmit={sizeForm.onSubmit((size) => {
        props.onAddSize(size);
      })}
    >
      <Box
        pt="md"
        px="sm"
        my="xl"
        style={{
          border: '1px solid var(--mantine-color-default-border)',
          borderRadius: 'var(--mantine-radius-sm)',
        }}
      >
        <Text fw="bold" mb="md">
          Novo tamanho de {props.selectedReagent.name}
        </Text>

        {props.loadingAddSize ? (
          <Flex justify="center" align="center">
            <Loader />
          </Flex>
        ) : (
          <Grid>
            <Grid.Col span={{ base: 6 }}>
              <NumberInput
                label="Quantidade"
                placeholder="Quantidade"
                hideControls
                {...sizeForm.getInputProps('amount')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <Select
                filter={portugueseSearchFilter}
                allowDeselect={false}
                label="Unidade"
                data={unitSelectOptions}
                {...sizeForm.getInputProps('unit')}
              />
            </Grid.Col>
          </Grid>
        )}

        <Group my="lg" justify="right">
          <Button variant="outline" onClick={props.onCancel} disabled={props.loadingAddSize}>
            Cancelar
          </Button>
          <Button type="submit" disabled={props.loadingAddSize}>
            Adicionar
          </Button>
        </Group>
      </Box>
    </form>
  );
}
