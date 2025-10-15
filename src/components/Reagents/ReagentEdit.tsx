import { useEffect, useState } from 'react';
import { Box, Button, Grid, Group, InputBase, Pill, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Reagent } from '@/src/models/reagent';
import { Size } from '@/src/models/size';
import { uploadEditReagent } from '@/src/services/reagentsDB';
import { formattedSize } from '@/src/utils/formatted-amount';
import { Dimension } from '../../models/unit';
import { SizeAddForm } from '../Item/SizeAddForm';

type ItemModalProps = {
  selectedReagent: Reagent | null;
  itemModalOpened: boolean;
  onExit: () => void;
  onAddReagent: (item: Reagent) => void;
  onEditReagent: (selectedItem: Reagent) => void;
};

export function ReagentEdit(props: ItemModalProps) {
  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [loadingAddSize, setLoadingAddedSize] = useState(false);

  const handleAddSize = (size: Size) => {
    uploadEditReagent({
      ...props.selectedReagent!,
      sizes: [...props.selectedReagent!.sizes, size],
    });
    setLoadingAddedSize(true);
  };

  const handleDeleteSize = (size: Size) => {
    uploadEditReagent({
      ...props.selectedReagent!,
      sizes: props.selectedReagent!.sizes.filter((s) => formattedSize(s) !== formattedSize(size)),
    });
  };

  const handleExit = () => {
    props.onExit();
    setSizeAddMode(false);
  };

  const reagentForm = useForm<Reagent>({
    initialValues: props.selectedReagent ?? {
      id: '[NULL]',
      name: '',
      dimension: Dimension.MASS,
      itemsId: [],
      sizes: [],
    },
  });

  // Conclui a adição do tamanho
  useEffect(() => {
    if (sizeAddMode && loadingAddSize) {
      setSizeAddMode(false);
      setLoadingAddedSize(false);
    }
  }, [props.selectedReagent]);

  console.log('sizes', props.selectedReagent?.sizes);

  // HANDLES

  return (
    <Box>
      <form
        onSubmit={reagentForm.onSubmit((values) => {
          if (props.selectedReagent) props.onEditReagent(values);
          else props.onAddReagent(values);
          handleExit();
        })}
      >
        <Grid>
          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Nome" {...reagentForm.getInputProps('name')} disabled={sizeAddMode} />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Select
              label="Dimensão"
              data={Object.values(Dimension)}
              {...reagentForm.getInputProps('dimension')}
              disabled={sizeAddMode}
            />
          </Grid.Col>

          {props.selectedReagent && (
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <InputBase
                  label="Tamanhos"
                  component="div"
                  multiline
                  flex={1}
                  disabled={sizeAddMode}
                >
                  <Pill.Group>
                    {props.selectedReagent?.sizes.map((size, index) => (
                      <Pill key={index} withRemoveButton onRemove={() => handleDeleteSize(size)}>
                        {formattedSize(size)}
                      </Pill>
                    ))}
                  </Pill.Group>
                </InputBase>
                <Button
                  disabled={sizeAddMode}
                  variant="outline"
                  onClick={() => {
                    setSizeAddMode(true);
                  }}
                >
                  +
                </Button>
              </Group>
            </Grid.Col>
          )}
        </Grid>
      </form>

      {sizeAddMode && (
        <Grid>
          <Grid.Col span={{ base: 12 }}>
            <SizeAddForm
              selectedReagent={props.selectedReagent!}
              loadingAddSize={loadingAddSize}
              onAddSize={handleAddSize}
              onCancel={() => setSizeAddMode(false)}
            />
          </Grid.Col>
        </Grid>
      )}

      <form>
        <Box>
          <Group mt="xl" justify="right">
            <Button
              variant="outline"
              onClick={() => {
                handleExit();
              }}
            >
              Cancelar
            </Button>
            <Button disabled={sizeAddMode} type="submit">
              {props.selectedReagent ? 'Salvar' : 'Adicionar'}
            </Button>
          </Group>
        </Box>
      </form>
    </Box>
  );
}
