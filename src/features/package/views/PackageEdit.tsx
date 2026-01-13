import React, { useEffect, useState } from 'react';
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
import { useForm } from '@mantine/form';
import { ReagentService } from '@/src/features/reagent/reagent.service';
import { Reagent } from '@/src/features/reagent/reagent.type';
import { Size } from '@/src/features/size/size.type';
import Unit from '@/src/features/size/unit.type';
import { useData } from '@/src/providers/data.provider';
import { toNullableLocalDate, validateDate } from '@/src/shared/utils/date';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';
import { SizeAddForm } from '../../reagent/views/SizeAddForm';
import { formattedSize } from '../../size/size.util';
import { VialService } from '../../vial/vial.service';
import { Package } from '../package.type';
import { PackageSubReagentAddForm } from './PackageSubReagentAddForm';

type PackageEditProps = {
  selectedPackage: Package | null;
  packageModalOpened: boolean;
  onClosePackageModal: () => void;
  onAddPackage: (pkg: Package) => Promise<string>;
  onEditPackage: (selectedPackage: Package) => void;
  onBeginShownPackageEdit?: () => void;
  onAddReagent: (reagent: Reagent) => void;
  preFilledPackageData?: Partial<Package>;
};

// FIXME: Melhorar, reduzir

const nullSize = { amount: 0, unit: Unit.Units };

// FIXME: Ao editar, tamanho é exibido, mas não aceita salvar, pois não está setado no estado

type LabGroup = { laboratoryId: string; amount: number };

export function PackageEdit(props: PackageEditProps) {
  const {
    reagents,
    suppliers,
    brands,
    laboratories,
    getReagentById,
    getBrandById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  // Adição de reagente

  const [reagentAddMode, setReagentAddMode] = useState(false);
  const [createdReagentName, setCreatedReagentName] = useState('');
  const [loadingAddReagent, setLoadingAddReagent] = useState(false);

  // Adição de tamanho

  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [addedSize, setAddedSize] = useState<Size | null>(null);
  const [loadingAddSize, setLoadingAddedSize] = useState(false);

  // Adição de frascos

  const [labGroups, setLabGroups] = useState<LabGroup[]>([]);
  const [labIdToAdd, setLabIdToAdd] = useState<string | null>(null);

  // ================= Forms e validação

  const packageForm = useForm<Package>({
    initialValues: props.selectedPackage ?? {
      inDate: new Date(),
      expireDate: new Date(),
      size: nullSize,
      purity: 0,
      id: '',
      reagentId: '',
      brandId: '',
      supplierId: '',

      // Sobrescrevendo campos pré definidos
      ...props.preFilledPackageData,
    },

    // FIXME: tipagem
    transformValues: (values: Package) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate)!,
      inDate: toNullableLocalDate(values.inDate)!,
      // Começa como string vazia indicadora de null, e converte pra null se necessário
      brandId: values.brandId !== '' ? values.brandId : null,
    }),

    validate: {
      reagentId: (id) => (id !== '' || reagentAddMode ? null : 'Inserir um reagente'),
      purity: (value) => (value >= 1 && value <= 100 ? null : 'Insira uma pureza entre 1 e 100 %'),
      // Se já tiver selecionado reagente, e
      size: (value: Size, values: Package) =>
        values.reagentId !== '' && (value === ('' as any) || value.amount === 0)
          ? 'Selecione um tamanho válido'
          : null,
      expireDate: (date: Date | null) => validateDate(date, false),
      inDate: (date: Date | null) => validateDate(date, false),
    },
  });

  const selectedReagent: Reagent | null =
    packageForm.values.reagentId !== '' ? getReagentById(packageForm.values.reagentId) : null;

  // ================= Define e atualiza as opções de unidade

  // EFFECTS

  // Conclui a adição do reagente
  useEffect(() => {
    if (reagentAddMode && loadingAddReagent) {
      setReagentAddMode(false);
      setLoadingAddReagent(false);
    }
  }, [reagents]);

  // Conclui a adição do tamanho
  useEffect(() => {
    if (sizeAddMode && loadingAddSize) {
      setSizeAddMode(false);
      setLoadingAddedSize(false);
    }
  }, [reagents]);

  // Seleciona o reagente recém criado e reseta o tamanho
  useEffect(() => {
    if (!reagentAddMode && !loadingAddReagent && createdReagentName !== '') {
      const reagent = reagents?.find((reag) => createdReagentName.trim() === reag.name.trim());
      if (!reagent) {
        return;
      }
      packageForm.setValues({ reagentId: reagent.id });
      setCreatedReagentName('');
    }

    packageForm.setFieldValue('size', '' as any);
  }, [loadingAddReagent]);

  // Seleciona o tamanho recém-criado
  useEffect(() => {
    if (!sizeAddMode && !loadingAddSize && addedSize !== null) {
      const selectedSize = selectedReagent?.sizes.find(
        (size: Size) => formattedSize(size) === formattedSize(addedSize)
      );
      if (!sizeAddMode && !loadingAddSize && addedSize) {
        packageForm.setValues({ size: selectedSize });
        setAddedSize(null);
      }
    }
  }, [loadingAddSize]);

  // HANDLES

  const handleAddSize = (size: Size) => {
    const newReagent = { ...selectedReagent!, sizes: [...selectedReagent!.sizes, size] };
    ReagentService.instance.update(selectedReagent!.id, newReagent);
    setAddedSize(size);
    setLoadingAddedSize(true);
  };

  const handleSubmitPackage = async (pkg: Package) => {
    props.onClosePackageModal();
    if (props.selectedPackage) {
      props.onEditPackage(pkg);
    } else {
      const pkgId = await props.onAddPackage(pkg);

      // Adicionar todos os frascos
      labGroups.flatMap((group) =>
        Array.from({ length: group.amount }).map(() =>
          VialService.instance.add({
            laboratoryId: group.laboratoryId,
            packageId: pkgId,
            outDate: null,
          })
        )
      );
    }
  };

  const handleChangeSize = (value: string | null) => {
    if (value === null || value === '') {
      packageForm.setFieldValue('size', '' as any);
      packageForm.setTouched({ ...packageForm.isTouched, size: false });
    } else {
      const sizeObj = selectedReagent?.sizes.find((s) => formattedSize(s) === value);
      packageForm.setFieldValue('size', sizeObj ?? ('' as any));
    }
  };
  // FIXME: ERRO AO DESMARCAR MARCA!!!

  const handleChangeReagent = (value: string | null) => {
    const validReagent = reagents?.find((r) => r.id === value);
    packageForm.setValues({
      reagentId: validReagent?.id ?? undefined,
    });

    packageForm.setFieldValue('size', validReagent?.sizes[0] ?? ('' as any));
  };

  // Buscar todos os laboratórios inclusos
  // Contar quantidade de cada

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
