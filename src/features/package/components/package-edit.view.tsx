import React from 'react';
import {
  Box,
  Button,
  Grid,
  Group,
  InputWrapper,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { usePackageEdit } from '@/features/package/components/package-edit.viewmodel';
import { PackageSubReagentAddForm } from '@/features/package/components/package-sub-reagent-add-form.view';
import { Package } from '@/features/package/package.type';
import { SizeAddForm } from '@/features/reagent/components/size-add-form.view';
import { Reagent } from '@/features/reagent/reagent.type';
import { formattedSize } from '@/features/size/size.util';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

export type PackageEditProps = {
  selectedPackage: Package | null;
  packageModalOpened: boolean;
  onClosePackageModal: () => void;
  onAddPackage: (pkg: Package) => Promise<Package>;
  onEditPackage: (selectedPackage: Package) => void;
  onBeginShownPackageEdit?: () => void;
  onAddReagent: (reagent: Reagent) => void;
  preFilledPackageData?: Partial<Package>;
};

export function PackageEdit(props: PackageEditProps) {
  const { reagentService, vialService } = useDependencyInjection();
  const {
    reagentAddMode,
    loadingAddReagent,
    sizeAddMode,
    loadingAddSize,
    labGroupsWithNames,
    labIdToAdd,
    packageForm,
    selectedReagent,
    setReagentAddMode,
    setCreatedReagentName,
    setLoadingAddReagent,
    setSizeAddMode,
    setLabIdToAdd,
    handleAddSize,
    handleSubmitPackage,
    handleChangeSize,
    handleChangeReagent,
    reagentSelectData,
    sizeSelectData,
    fundingSourceSelectData,
    supplierSelectData,
    availableLaboratories,
    totalVials,
    vialError,
    handleLabGroupAmountChange,
    handleAddLabGroup,
    handleFundingSourceChange,
    handleSupplierChange,
  } = usePackageEdit({ ...props, reagentService, vialService });

  return (
    <Box>
      {/* Adição de reagente */}
      {reagentAddMode && (
        <PackageSubReagentAddForm
          onAddReagent={props.onAddReagent}
          loadingAddReagent={loadingAddReagent}
          setCreatedReagentName={setCreatedReagentName}
          setLoadingAddReagent={setLoadingAddReagent}
          setReagentAddMode={setReagentAddMode}
        />
      )}

      <form
        onSubmit={packageForm.onSubmit((values) => {
          handleSubmitPackage(values);
          packageForm.reset();
        })}
      >
        {/* Seleção de reagente */}
        {!reagentAddMode && (
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  filter={portugueseSearchFilter}
                  placeholder="Selecione ou adicione o reagente"
                  disabled={sizeAddMode || !!props.selectedPackage}
                  style={{ flex: 1 }}
                  label="Reagente"
                  data={reagentSelectData}
                  searchable
                  allowDeselect={false}
                  onChange={handleChangeReagent}
                  value={packageForm.values.reagentId}
                  error={packageForm.errors.reagentId}
                />
                {!props.selectedPackage && (
                  <Button
                    disabled={sizeAddMode}
                    variant="outline"
                    onClick={() => {
                      setReagentAddMode(true);
                    }}
                  >
                    +
                  </Button>
                )}
              </Group>
            </Grid.Col>
          </Grid>
        )}
      </form>

      {/* Adição de tamanho */}
      {sizeAddMode && (
        <SizeAddForm
          onCancel={() => setSizeAddMode(false)}
          loadingAddSize={loadingAddSize}
          selectedReagent={selectedReagent!}
          onAddSize={handleAddSize}
        />
      )}

      <form
        onSubmit={packageForm.onSubmit((values) => {
          handleSubmitPackage(values);
          packageForm.reset();
        })}
      >
        {/* Seleção de tamanho */}
        {!sizeAddMode && (
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  filter={portugueseSearchFilter}
                  placeholder="Selecione ou adicione o tamanho"
                  style={{ flex: 1 }}
                  allowDeselect={false}
                  data={sizeSelectData}
                  label="Tamanho"
                  disabled={!selectedReagent || reagentAddMode}
                  // Sinceramente não faço ideia de por que é assim
                  // TODO: Trocar de biblioteca de form
                  onChange={handleChangeSize}
                  value={packageForm.values.size ? formattedSize(packageForm.values.size) : ''}
                  error={packageForm.errors.size}
                />
                <Button
                  disabled={!selectedReagent || reagentAddMode}
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
        )}

        <Grid>
          <Grid.Col span={{ base: 6 }}>
            {/* Pureza */}
            <NumberInput
              disabled={reagentAddMode || sizeAddMode}
              label="Pureza"
              placeholder="Pureza em %"
              hideControls
              suffix=" %"
              allowLeadingZeros={false}
              {...packageForm.getInputProps('purity')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            {/* Adquirente */}
            <Select
              filter={portugueseSearchFilter}
              label="Adquirente"
              placeholder="Nome do adquirente"
              allowDeselect
              data={fundingSourceSelectData}
              onChange={handleFundingSourceChange}
              value={packageForm.values.fundingSourceId}
              error={packageForm.errors.fundingSourceId}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            {/* Fornecedor */}
            <Select
              filter={portugueseSearchFilter}
              label="Fornecedor"
              placeholder="Nome do fornecedor"
              data={supplierSelectData}
              onChange={handleSupplierChange}
              value={packageForm.values.supplierId}
              error={packageForm.errors.supplierId}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            {/* Entrada */}
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Entrada"
              placeholder="Selecione data"
              {...packageForm.getInputProps('inDate')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            {/* Vencimento */}
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Vencimento"
              placeholder="Selecione data"
              {...packageForm.getInputProps('expireDate')}
            />
          </Grid.Col>
        </Grid>

        {!props.selectedPackage && (
          <InputWrapper label="Frascos por laboratório" mt="md" error={vialError}>
            <Paper py="md" px="md" withBorder>
              <Stack gap="xl" justify="space-between">
                <Grid>
                  {labGroupsWithNames.map((group, index) => (
                    <React.Fragment key={index}>
                      <Grid.Col
                        span={{ base: 6 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {group.laboratoryName}
                      </Grid.Col>
                      <Grid.Col span={{ base: 6 }}>
                        <NumberInput
                          allowDecimal={false}
                          allowLeadingZeros={false}
                          allowNegative={false}
                          value={group.amount}
                          prefix="x "
                          onChange={(value) =>
                            handleLabGroupAmountChange(group.laboratoryId, Number(value))
                          }
                        />
                      </Grid.Col>
                    </React.Fragment>
                  ))}
                </Grid>

                {/* Adição frasco ao novo laboratório */}
                <Group justify="space-between" align="end">
                  <Select
                    searchable
                    filter={portugueseSearchFilter}
                    style={{ flex: 1 }}
                    label="Adicionar frascos a um laboratório"
                    data={availableLaboratories}
                    value={labIdToAdd}
                    onChange={(value) => setLabIdToAdd(value)}
                    placeholder="Selecione um laboratório de destino"
                  />
                  <Button disabled={sizeAddMode} variant="filled" onClick={handleAddLabGroup}>
                    +
                  </Button>
                </Group>

                {/* Soma total de frascos a todos os laboratórios */}
                <Group justify="center" align="center" w="100%" my="xs">
                  <Text>Total de frascos: {totalVials}</Text>
                </Group>
              </Stack>
            </Paper>
          </InputWrapper>
        )}

        <Box>
          <Group mt="xl" justify="right">
            <Button
              variant="outline"
              onClick={() => {
                props.onClosePackageModal();
              }}
            >
              Cancelar
            </Button>
            <Button disabled={reagentAddMode || sizeAddMode} type="submit">
              {props.selectedPackage ? 'Salvar' : 'Adicionar'}
            </Button>
          </Group>
        </Box>
      </form>
    </Box>
  );
}
