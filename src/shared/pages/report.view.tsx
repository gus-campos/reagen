'use client';

import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Grid, Group, Modal, Paper, Stack, Title } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { DataTable } from '@/features/data-table/data-table.view';
import { Brand } from '@/features/named-option/brand/brand.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { formattedSize } from '@/features/size/size.util';
import { isInsideDateRange } from '@/features/stock-filter/stock-filter.util';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { firstDayOffsettedMonth, firstDayOfMonth, formatDate } from '@/shared/utils/date';
import { formattedDate } from '@/shared/utils/formatted-date';
import { findVialsOfPackage } from '@/shared/utils/misc';

type CompleteVial = Vial & {
  package: Package;
  reagent: Reagent;
  supplier: Supplier | null;
  laboratory: Laboratory;
  brand: Brand | null;
};

export function ReportPage() {
  const { packages, vials, getReagentById, getSupplierById, getLaboratoryById, getBrandById } =
    useData();

  const { onSubmit, openModal, closeModal, modalOpened, reportOptions } = useConfigReportModal();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const collumns: TableCollumn<CompleteVial>[] = [
    {
      name: 'Data de Entrada',
      accessor: (vial) => formattedDate(vial.package.inDate),
    },
    {
      name: 'Data de Saída',
      accessor: (vial) => (vial.outDate ? formattedDate(vial.outDate) : '--'),
    },
    {
      name: 'Reagente',
      accessor: (vial) => vial.reagent.name,
    },
    {
      name: 'Tamanho',
      accessor: (vial) => formattedSize(vial.package.size),
    },
    {
      name: 'Pureza',
      accessor: (vial) => `${vial.package.purity} %`,
    },
    {
      name: 'Marca',
      accessor: (vial) => vial.brand?.name ?? '--',
    },
    {
      name: 'Laboratório',
      accessor: (vial) => vial.laboratory.name,
    },
    {
      name: 'Fornecedor',
      accessor: (vial) => vial.supplier?.name ?? '--',
    },
  ];

  const data: CompleteVial[] = packages.flatMap((pkg) => {
    const packageVials = packages.flatMap((pkg) => findVialsOfPackage(pkg, vials!));

    const inRangePackageVials = packageVials.filter((vial) => {
      // Se entrada ou saída estiver fora do range, desconsiderar
      // Obs: para verificar pertencimento ao intervalo, é preciso considerar até o início do prox mês
      const minDate = firstDayOfMonth(reportOptions.startDate);
      const maxDate = firstDayOffsettedMonth(reportOptions.endDate, 1);
      return [pkg.inDate, vial.outDate].some((date) => isInsideDateRange(date, minDate, maxDate));
    });

    // Complete package vials
    return inRangePackageVials.map((vial) => {
      const reagent = getReagentById(pkg.reagentId);
      const supplier = pkg.supplierId ? getSupplierById(pkg.supplierId) : null;
      const laboratory = getLaboratoryById(vial.laboratoryId);
      const brand = pkg.brandId ? getBrandById(pkg.brandId) : null;
      return { reagent, supplier, package: pkg, laboratory, brand, ...vial };
    });
  });

  return (
    <>
      {/* Janela para impressão */}
      <Paper
        ref={contentRef}
        px="xl"
        m="lg"
        style={{
          boxShadow: '0 0 20px rgba(0,0,0,0.40)',
        }}
      >
        <Group justify="center" my="lg  ">
          <Title order={1} my="lg">
            Relatório de Reagentes - {formatDate(reportOptions.startDate, 'MM/YY')} a{' '}
            {formatDate(reportOptions.endDate, 'MM/YY')}
          </Title>
        </Group>
        <Stack my="lg">
          <DataTable datas={data} collumns={collumns} smallHeading />
        </Stack>
      </Paper>

      {/* Modal de opções */}
      <ConfigReportModal
        onClose={closeModal}
        opened={modalOpened}
        onSubmit={onSubmit}
        initialValues={reportOptions}
      />

      {/* Botões de acesso */}
      <Group
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          height: '40px',
        }}
      >
        <Button variant="light" radius="50px" onClick={openModal}>
          Editar opções
        </Button>
        <Button radius="50px" onClick={reactToPrintFn}>
          Imprimir
        </Button>
      </Group>
    </>
  );
}

export type ReportOptions = {
  startDate: Date;
  endDate: Date;
};

export function useConfigReportModal() {
  const [modalOpened, setModalOpened] = useState(false);
  const today = new Date();
  // Obs: O mês é guardado como o primeiro dia daquele mês
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    startDate: firstDayOfMonth(today),
    endDate: firstDayOffsettedMonth(today, 1),
  });

  const closeModal = () => setModalOpened(false);
  const openModal = () => setModalOpened(true);
  const onSubmit = (reportOptions: ReportOptions) => setReportOptions(reportOptions);

  return { reportOptions, modalOpened, closeModal, openModal, onSubmit };
}

type ConfigReportProps = {
  onSubmit: (values: ReportOptions) => void;
  onClose: () => void;
  opened: boolean;
  initialValues: ReportOptions;
};

export function ConfigReportModal(props: ConfigReportProps) {
  const form = useForm<ReportOptions>({
    initialValues: props.initialValues,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        props.onSubmit({
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
        });
        props.onClose;
      })}
    >
      <Modal title="Opções do relatório" opened={props.opened} onClose={props.onClose}>
        <Grid>
          <Grid.Col span={{ base: 6 }}>
            <MonthPickerInput
              label="Primeiro mês"
              valueFormat="MM/YY"
              {...form.getInputProps('startDate')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6 }}>
            <MonthPickerInput
              label="Último mês"
              valueFormat="MM/YY"
              {...form.getInputProps('endDate')}
            />
          </Grid.Col>
        </Grid>
        <Button fullWidth mt="sm" type="submit">
          Confirmar
        </Button>
      </Modal>
    </form>
  );
}
