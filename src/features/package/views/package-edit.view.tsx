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
import { Package } from '@/features/package/package.type';
import { PackageSubReagentAddForm } from '@/features/package/views/package-sub-reagent-add-form.view';
import { Reagent } from '@/features/reagent/reagent.type';
import { SizeAddForm } from '@/features/reagent/views/size-add-form.view';
import { formattedSize } from '@/features/size/size.util';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';
import { usePackageEdit } from '@/features/package/views/package-edit.viewmodel';

type PackageEditProps = {
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
  const {
    reagentAddMode,
    loadingAddReagent,
    sizeAddMode,
    loadingAddSize,
    labGroups,
    labIdToAdd,
    packageForm,
    selectedReagent,
    reagents,
    suppliers,
    brands,
    laboratories,
    setReagentAddMode,
    setCreatedReagentName,
    setLoadingAddReagent,
    setSizeAddMode,
    setLoadingAddedSize,
    setLabIdToAdd,
    setLabGroups,
    handleAddSize,
    handleSubmitPackage,
    handleChangeSize,
    handleChangeReagent,
    getBrandById,
    getSupplierById,
  } = usePackageEdit(props);

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
                  data={
                    reagents?.map((opt) => ({
                      value: opt.id,
                      label: opt.name,
                    })) ?? []
                  }
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
                  data={
                    selectedReagent ? selectedReagent.sizes.map((s) => formattedSize(s)) : undefined
                  }
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
            {/* Marca */}
            <Select
              filter={portugueseSearchFilter}
              label="Marca"
              placeholder="Nome da marca"
              data={brands!.map((b) => {
                return { value: b.id, label: b.name };
              })}
              onChange={(value) => {
                const brand = value ? getBrandById(value) : null;
                packageForm.setValues({ brandId: brand?.id ?? '' });
              }}
              value={packageForm.values.brandId}
              error={packageForm.errors.brandId}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            {/* Fornecedor */}
            <Select
              filter={portugueseSearchFilter}
              label="Fornecedor"
              placeholder="Nome do fornecedor"
              data={suppliers!.map((s) => {
                return { value: s.id, label: s.name };
              })}
              onChange={(value) => {
                const supplier = value ? getSupplierById(value) : null;
                packageForm.setValues({ supplierId: supplier?.id ?? '' });
              }}
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
          <InputWrapper label="Frascos por laboratório" mt="md">
            <Paper py="md" px="md" withBorder>
              <Stack gap="xl" justify="space-between">
                {/* Lista de laboratório e quantidades de fracos */}
                {labGroups.length > 0 && (
                  <Grid>
                    {labGroups.map((group, index) => (
                      <React.Fragment key={index}>
                        <Grid.Col
                          span={{ base: 6 }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          {getLaboratoryById(group.laboratoryId).name}
                        </Grid.Col>
                        <Grid.Col span={{ base: 6 }}>
                          <NumberInput
                            allowDecimal={false}
                            allowLeadingZeros={false}
                            allowNegative={false}
                            value={group.amount}
                            prefix="x "
                            onChange={(value) => {
                              if (Number(value) === 0) {
                                setLabGroups(
                                  labGroups.filter((g) => g.laboratoryId !== group.laboratoryId)
                                );
                              } else {
                                setLabGroups(
                                  labGroups.map((g) =>
                                    g.laboratoryId === group.laboratoryId
                                      ? { ...g, amount: Number(value) }
                                      : g
                                  )
                                );
                              }
                            }}
                          />
                        </Grid.Col>
                      </React.Fragment>
                    ))}
                  </Grid>
                )}

                {/* Adição frasco ao novo laboratório */}
                <Group justify="space-between" align="end">
                  <Select
                    style={{ flex: 1 }}
                    label="Adicionar frascos a a um laboratório"
                    data={
                      laboratories
                        // laboratórios não incluídos
                        ?.filter((lab) => !labGroups.map((g) => g.laboratoryId).includes(lab.id))
                        .map((lab) => {
                          return { value: lab.id, label: lab.name };
                        }) ?? []
                    }
                    value={labIdToAdd}
                    onChange={(value) => setLabIdToAdd(value)}
                  />
                  <Button
                    disabled={sizeAddMode}
                    variant="filled"
                    onClick={() => {
                      if (labIdToAdd) {
                        setLabGroups([...labGroups, { laboratoryId: labIdToAdd, amount: 1 }]);
                        setLabIdToAdd(null);
                      }
                    }}
                  >
                    +
                  </Button>
                </Group>

                {/* Soma total de frascos a todos os laboratórios */}
                <Group justify="center" align="center" w="100%" my="xs">
                  <Text>Total de frascos: {labGroups.reduce((acc, g) => acc + g.amount, 0)}</Text>
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
