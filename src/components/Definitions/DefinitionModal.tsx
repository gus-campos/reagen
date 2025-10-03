import { Box, Grid, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Definition } from '../../models/definition';
import { Dimension } from '../../models/unit';
import { DataEdit } from '../Crud/Table/Modal/DataShowEdit';

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
      itemsId: [],
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'O nome não pode estar vazio'),
    },
  });

  return (
    <DataEdit<Definition>
      dataName="definição"
      form={form}
      onAddData={props.onAddDefinition}
      onCloseModal={props.onCloseDefinitionModal}
      onEditData={props.onEditDefinition}
      onBeginShownDataEdit={props.onBeginShownDefinitionEdit}
      showMode={props.showMode}
      selectedData={props.selectedDefinition}
    >
      {/* </DataEdit>
        <Box
          style={{
            padding: "10px",
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
