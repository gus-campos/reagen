import { useEffect, useState } from 'react';
import { Box, Button, Grid, Group, InputBase, Pill, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Item } from '@/src/features/items/types/item';
import { Reagent } from '@/src/features/reagents/types/reagent';
import { Size } from '@/src/features/reagents/types/size';
import { Dimension } from '@/src/features/reagents/types/unit';
import { formattedSize } from '@/src/features/reagents/utils/formatted-amount';
import { useData } from '@/src/providers/DataProvider';
import { findItemsOfReagentSizes, findRemovedSizes } from '@/src/shared/utils/misc';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { SizeAddForm } from './SizeAddForm';

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

  const { items, controlAgencies } = useData();

  const reagentForm = useForm<Reagent>({
    initialValues: props.selectedReagent ?? {
      id: '',
      name: '',
      dimension: Dimension.MASS,
      sizes: [],
      controlAgencyId: null,
    },
    validate: {
      name: (value) => (!value.trim() ? 'Inserir nome' : null),
    },
  });

  // Alerta: Excluir tamanho
  // Alerta: Excluir reagente
  // Exibir mensagem, retornar confirmação

  const reagentWithSizes = { ...reagentForm.values, sizes: unsavedSizes };

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
      const removedSizes = findRemovedSizes(values.sizes, reagentWithSizes.sizes);
      const relatedItems = findItemsOfReagentSizes(props.selectedReagent!, removedSizes, items!);

      if (relatedItems.length > 0) {
        const message = getConfirmationMessage(removedSizes, relatedItems);
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

  // Reseta tamanho quando muda dimensão
  useEffect(() => {
    setUnsavedSizes([]);
  }, [reagentForm.values.dimension]);

  useEffect(() => {
    if (props.selectedReagent) setUnsavedSizes(props.selectedReagent?.sizes);
  }, [props.selectedReagent]);

  // AUX

  const getConfirmationMessage = (removedSizes: Size[], relatedItems: Item[]) => {
    return `Excluir os tamanhos: ${removedSizes.map((size) => formattedSize(size)).join(', ')}
    Causará a exclusão dos seguintes itens:
    ${relatedItems.map((item) => `* ${item.id}`).join('\n')}
    `;
  };

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
                  filter={portugueseSearchFilter}
                  label="Dimensão"
                  allowDeselect={false}
                  data={Object.values(Dimension)}
                  {...reagentForm.getInputProps('dimension')}
                  disabled={sizeAddMode}
                />
              </Grid.Col>
            )}

            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                {/* FIXME: Resetar tamanho quando mudar dimensão */}
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
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Select
                filter={portugueseSearchFilter}
                clearable
                label="Orgão de controle"
                placeholder="Escolha o orgão de controle"
                disabled={sizeAddMode}
                data={controlAgencies!.map((c) => {
                  return { value: c.id, label: c.name };
                })}
                {...reagentForm.getInputProps('controlAgencyId')}
              />
            </Grid.Col>
          </Grid>
        </form>

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
