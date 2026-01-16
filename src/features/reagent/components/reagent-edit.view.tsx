import { Box, Button, Grid, Group, InputBase, Pill, Select, TextInput } from '@mantine/core';
import { useReagentEdit } from '@/features/reagent/components/reagent-edit.viewmodel';
import { SizeAddForm } from '@/features/reagent/components/size-add-form.view';
import { Reagent } from '@/features/reagent/reagent.type';
import { formattedSize } from '@/features/size/size.util';
import { Dimension } from '@/features/size/unit.type';
import { ConfirmModal } from '@/shared/components/confirm-modal.view';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

type VialModalProps = {
  selectedReagent: Reagent | null;
  vialModalOpened: boolean;
  onClose: () => void;
  onAddReagent: (vial: Reagent) => void;
  onEditReagent: (selectedVial: Reagent) => void;
};

export function ReagentEdit(props: VialModalProps) {
  const {
    reagentForm,
    sizeAddMode,
    unsavedSizes,
    warning,
    isDisabled,
    submitButtonText,
    shouldShowDimensionSelect,
    shouldShowConfirmModal,
    controlAgenciesData,
    handleAddSize,
    handleRemoveSize,
    handleClose,
    handleToggleSizeMode,
    handleCloseSizeMode,
    handleSubmit,
    handleConfirmEdit,
    setWarning,
  } = useReagentEdit(props);

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                label="Nome"
                {...reagentForm.getInputProps('name')}
                disabled={isDisabled}
                placeholder="Digite o nome do reagente"
              />
            </Grid.Col>

            {shouldShowDimensionSelect && (
              <Grid.Col span={{ base: 12 }}>
                <Select
                  filter={portugueseSearchFilter}
                  label="Dimensão"
                  allowDeselect={false}
                  data={Object.values(Dimension)}
                  {...reagentForm.getInputProps('dimension')}
                  disabled={isDisabled}
                  placeholder="Escolha a dimensão"
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
                  disabled={isDisabled}
                >
                  <Pill.Group>
                    {unsavedSizes.map((size, index) => (
                      <Pill key={index} withRemoveButton onRemove={() => handleRemoveSize(size)}>
                        {formattedSize(size)}
                      </Pill>
                    ))}
                  </Pill.Group>
                </InputBase>
                <Button disabled={isDisabled} variant="outline" onClick={handleToggleSizeMode}>
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
                onCancel={handleCloseSizeMode}
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
                disabled={isDisabled}
                data={controlAgenciesData}
                {...reagentForm.getInputProps('controlAgencyId')}
              />
            </Grid.Col>
          </Grid>
        </form>

        <form onSubmit={handleSubmit}>
          <Box>
            <Group mt="xl" justify="right">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button disabled={isDisabled} type="submit">
                {submitButtonText}
              </Button>
            </Group>
          </Box>
        </form>
      </Box>

      <ConfirmModal
        opened={shouldShowConfirmModal}
        onClose={() => setWarning(null)}
        onConfirm={handleConfirmEdit}
      >
        {warning}
      </ConfirmModal>
    </>
  );
}
