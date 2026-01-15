import { Box, Button, Flex, Grid, Group, Loader, NumberInput, Select, Text } from '@mantine/core';
import { Reagent } from '@/features/reagent/reagent.type';
import { useSizeAddForm } from '@/features/reagent/views/size-add-form.viewmodel';
import { Size } from '@/features/size/size.type';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

type SizeAddForm = {
  selectedReagent: Reagent;
  loadingAddSize: boolean;
  onAddSize: (size: Size) => void;
  onCancel: () => void;
};

export function SizeAddForm(props: SizeAddForm) {
  const { sizeForm, shouldShowLoader, formTitle, unitSelectOptions, handleSubmit } =
    useSizeAddForm(props);

  return (
    <form onSubmit={sizeForm.onSubmit(handleSubmit)}>
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
          {formTitle}
        </Text>

        {shouldShowLoader ? (
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
                allowLeadingZeros={false}
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
          <Button variant="outline" onClick={props.onCancel} disabled={shouldShowLoader}>
            Cancelar
          </Button>
          <Button type="submit" disabled={shouldShowLoader}>
            Adicionar
          </Button>
        </Group>
      </Box>
    </form>
  );
}
