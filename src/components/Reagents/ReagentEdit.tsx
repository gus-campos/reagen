import { useState } from 'react';
import { Box, Button, Grid, Group, InputBase, Modal, Pill, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Reagent } from '@/src/models/reagent';
import { Size } from '@/src/models/size';
import { useData } from '@/src/providers/DataProvider';
import { formattedSize } from '@/src/utils/formatted-amount';
import { findItemsOfReagentSizes, findRemovedSizes } from '@/src/utils/misc';
import { Dimension } from '../../models/unit';
import { SizeAddForm } from '../Item/SizeAddForm';
import { ConfirmModal } from '../Util/ConfirmModal';

type ItemModalProps = {
  selectedReagent: Reagent | null;
  itemModalOpened: boolean;
  onClose: () => void;
  onAddReagent: (item: Reagent) => void;
  onEditReagent: (selectedItem: Reagent) => void;
};

export function ReagentEdit(props: ItemModalProps) {
  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [unsavedSizes, setUnsavedSizes] = useState<Size[]>(props.selectedReagent?.sizes ?? []);
  const [warning, setWarning] = useState<string | null>(null);

  const { items } = useData();

  const reagentForm = useForm<Reagent>({
    initialValues: props.selectedReagent ?? {
      id: '[NULL]',
      name: '',
      dimension: Dimension.MASS,
      itemsId: [],
      sizes: [],
    },
    validate: {
      name: (value) => (!value.trim() ? 'Inserir nome' : null),
    },
  });

  // Alerta: Excluir tamanho
  // Alerta: Excluir reagente
  // Exibir mensagem, retornar confirmação

  const reagentWithSizes = props.selectedReagent
    ? { ...props.selectedReagent, sizes: unsavedSizes }
    : { ...reagentForm.values, sizes: unsavedSizes };

  const handleAddSize = (size: Size) => {
    setUnsavedSizes([...unsavedSizes, size]);
    setSizeAddMode(false);
  };

  const handleRemoveSize = (size: Size) => {
    setUnsavedSizes(unsavedSizes.filter((s) => formattedSize(s) !== formattedSize(size)));
  };

  const handleClose = () => {
    setSizeAddMode(false);
    props.onClose();
  };

  const handleConfirmEdit = () => {
    props.onEditReagent(reagentWithSizes);
    setWarning(null);
    handleClose();
  };

  const handleSubmit = reagentForm.onSubmit((values) => {
    if (props.selectedReagent) {
      // Gerando mensagem de confirmação e chamando confirmação

      const removedSizes = findRemovedSizes(reagentWithSizes.sizes, values.sizes);

      const relatedItems = findItemsOfReagentSizes(props.selectedReagent, removedSizes, items!);

      if (relatedItems.length > 0) {
        // Criar warning (modal de confirmação reage)
        const message = `Excluir o(s) tamanhos: ${removedSizes.map((size) => formattedSize(size)).join(', ')}
          \nCausará a exclusão dos seguintes itens:
          \n${relatedItems.map((item) => item.id).join('\n')}
          `;

        setWarning(message);
      } else {
        handleConfirmEdit();
      }
    } else {
      // Fazendo adição
      props.onAddReagent(reagentWithSizes);
      handleClose();
    }
  });

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                label="Nome"
                {...reagentForm.getInputProps('name')}
                disabled={sizeAddMode}
              />
            </Grid.Col>

            {!props.selectedReagent && (
              <Grid.Col span={{ base: 12 }}>
                <Select
                  label="Dimensão"
                  data={Object.values(Dimension)}
                  {...reagentForm.getInputProps('dimension')}
                  disabled={sizeAddMode}
                />
              </Grid.Col>
            )}

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
                    {unsavedSizes.map((size, index) => (
                      <Pill key={index} withRemoveButton onRemove={() => handleRemoveSize(size)}>
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
          </Grid>
        </form>

        {sizeAddMode && (
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <SizeAddForm
                selectedReagent={props.selectedReagent ?? reagentForm.values}
                loadingAddSize={false}
                onAddSize={handleAddSize}
                onCancel={() => setSizeAddMode(false)}
              />
            </Grid.Col>
          </Grid>
        )}

        <form onSubmit={handleSubmit}>
          <Box>
            <Group mt="xl" justify="right">
              <Button
                variant="outline"
                onClick={() => {
                  handleClose();
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

      <ConfirmModal
        opened={warning !== null}
        onClose={() => setWarning(null)}
        onConfirm={handleConfirmEdit}
      >
        {warning}
      </ConfirmModal>
    </>
  );
}
