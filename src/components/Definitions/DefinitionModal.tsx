import { Box, Grid, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Definition } from '../../models/definition';
import { Dimension } from '../../models/unit';
import { DataModal } from '../Crud/Table/Modal/DataModal';

type DefinitionModalProps = {
  showMode: boolean;
  selectedDefinition: Definition | null;
  definitionModalOpened: boolean;
  onCloseDefinitionModal: () => void;
  onAddDefinition: (definition: Definition) => void;
  onEditDefinition: (selectedDefinition: Definition) => void;
  onBeginShownDefinitionEdit: () => void;
};

export function DefinitionModal(props: DefinitionModalProps) {
  const form = useForm<Definition>({
    initialValues: {
      id: '[NULL]',
      name: '',
      dimension: Dimension.MASS,
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'O nome não pode estar vazio'),
    },
  });

  return (
    <DataModal
      dataName="definição"
      form={form}
      modalOpened={props.definitionModalOpened}
      onAddData={props.onAddDefinition}
      onCloseModal={props.onCloseDefinitionModal}
      onEditData={props.onEditDefinition}
      onBeginShownDataEdit={props.onBeginShownDefinitionEdit}
      showMode={props.showMode}
      selectedData={props.selectedDefinition}
      showModeChildren={
        <Box
          style={{
            padding: '10px',
          }}
        >
          {props.selectedDefinition && (
            <Grid>
              <Grid.Col span={{ base: 12 }}>
                <strong>Nome:</strong> {props.selectedDefinition.name}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Dimensão:</strong> {props.selectedDefinition.dimension}
              </Grid.Col>
            </Grid>
          )}
        </Box>
      }
      editModeChildren={
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
      }
    />
  );
}
