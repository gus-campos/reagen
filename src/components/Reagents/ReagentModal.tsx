import { Box, Grid, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Reagent } from '../../models/reagent';
import { Dimension } from '../../models/unit';
import { DataEdit } from '../Crud/Table/Modal/DataShowEdit';

type ReagentModalProps = {
  showMode: boolean;
  selectedReagent: Reagent | null;
  reagentModalOpened: boolean;
  onCloseReagentModal: () => void;
  onAddReagent: (reagent: Reagent) => void;
  onEditReagent: (selectedReagent: Reagent) => void;
  onBeginShownReagentEdit: () => void;
};

export function ReagentModal(props: ReagentModalProps) {
  const form = useForm<Reagent>({
    initialValues: {
      id: '[NULL]',
      name: '',
      dimension: Dimension.MASS,
      itemsId: [],
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'O nome não pode estar vazio'),
    },
  });

  return (
    <DataEdit<Reagent>
      dataName="reagente"
      form={form}
      onAddData={props.onAddReagent}
      onCloseModal={props.onCloseReagentModal}
      onEditData={props.onEditReagent}
      onBeginShownDataEdit={props.onBeginShownReagentEdit}
      showMode={props.showMode}
      selectedData={props.selectedReagent}
    >
      {/* </DataEdit>
        <Box
          style={{
            padding: "10px",
          }}
        >
          {props.selectedReagent && (
            <Grid>
              <Grid.Col span={{ base: 12 }}>
                <strong>Nome:</strong> {props.selectedReagent.name}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Dimensão:</strong> {props.selectedReagent.dimension}
              </Grid.Col>
            </Grid>
          )}
        </Box>
      } */}

      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <TextInput label="Nome" {...form.getInputProps('name')}></TextInput>
        </Grid.Col>

        <Grid.Col span={{ base: 12 }}>
          <Select
            allowDeselect={false}
            label="Dimensão"
            {...form.getInputProps('dimension')}
            data={Object.values(Dimension)}
          ></Select>
        </Grid.Col>
      </Grid>
    </DataEdit>
  );
}
