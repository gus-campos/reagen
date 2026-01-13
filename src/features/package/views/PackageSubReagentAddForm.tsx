import { Box, Button, Flex, Grid, Group, Loader, Select, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Reagent } from '@/src/features/reagent/reagent.type';
import { Dimension } from '@/src/features/size/unit.type';
import { useData } from '@/src/providers/data.provider';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';

type PackageSubReagentAddFormProps = {
  loadingAddReagent: boolean;
  onAddReagent: (reagent: Reagent) => void;
  setReagentAddMode: (active: boolean) => void;
  setCreatedReagentName: (name: string) => void;
  setLoadingAddReagent: (loading: boolean) => void;
};

export function PackageSubReagentAddForm(props: PackageSubReagentAddFormProps) {
  const { reagents, controlAgencies } = useData();

  const reagentForm = useForm<Reagent>({
    initialValues: {
      name: '',
      id: '',
      dimension: Dimension.Mass,
      sizes: [],
      controlAgencyId: null,
    },
    validate: {
      // FIXME: tipagem
      name: (value) =>
        value === ''
          ? 'Dê um nome pro reagente'
          : reagents?.some((reag) => value.toLowerCase() === reag.name.toLocaleLowerCase())
            ? 'Este reagente já existe'
            : null,
    },
  });

  return (
    <form
      onSubmit={reagentForm.onSubmit((values) => {
        props.onAddReagent(values);
        props.setCreatedReagentName(values.name);
        props.setLoadingAddReagent(true);
        reagentForm.reset();
      })}
    >
      <Box
        pt="md"
        px="sm"
        mb="xl"
        style={{
          border: '1px solid var(--mantine-color-default-border)',
          borderRadius: 'var(--mantine-radius-sm)',
        }}
      >
        <Text fw="bold" mb="md">
          Novo reagente
        </Text>

        {props.loadingAddReagent ? (
          <Flex justify="center" align="center">
            <Loader />
          </Flex>
        ) : (
          <Grid>
            <Grid.Col span={{ base: 6 }}>
              <TextInput
                label="Nome"
                placeholder="Insira o nome do reagente"
                {...reagentForm.getInputProps('name')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <Select
                filter={portugueseSearchFilter}
                placeholder="Insira a dimensão"
                allowDeselect={false}
                label="Dimensão"
                {...reagentForm.getInputProps('dimension')}
                data={Object.values(Dimension)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <Select
                filter={portugueseSearchFilter}
                clearable
                label="Orgão de controle"
                placeholder="Escolha o orgão de controle"
                data={controlAgencies!.map((c) => {
                  return { value: c.id, label: c.name };
                })}
                {...reagentForm.getInputProps('controlAgencyId')}
              />
            </Grid.Col>
          </Grid>
        )}
        <Group my="lg" justify="right">
          <Button
            variant="outline"
            disabled={props.loadingAddReagent}
            onClick={() => {
              props.setReagentAddMode(false);
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={props.loadingAddReagent}>
            Adicionar
          </Button>
        </Group>
      </Box>
    </form>
  );
}
