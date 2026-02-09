'use client';

import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Group, Paper, Stack, Title } from '@mantine/core';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { DataTable } from '@/features/data-table/data-table.view';
import {
  ConfigReportModal,
  useConfigReportModal,
} from '@/features/report/components/report-options.view';
import { CompleteVial } from '@/features/report/report.type';
import { getCompleteVial } from '@/features/report/report.util';
import { formattedSize } from '@/features/size/size.util';
import { filteredCompleteVial } from '@/features/stock-filter/stock-filter.util';
import { useData } from '@/providers/data.provider';
import { useNavigationData } from '@/providers/navigation-data.provider';
import { formattedDate } from '@/shared/utils/formatted-date';

export function ReportPage() {
  const {
    vials,
    getReagentById,
    getSupplierById,
    getLaboratoryById,
    getFundingSourceById,
    getPackageById,
  } = useData();

  // Só usar na primeira renderização
  const { filter, handleSetFilter } = useNavigationData();

  useEffect(() => {
    if (filter) handleSetFilter(null);
  }, [filter]);

  const { reportFilter, modalOpened, closeModal, openModal, onSubmit } = useConfigReportModal(
    filter ?? undefined
  );

  // Sobrescrever o reportFilter se algo for passado na página

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const collumns: TableCollumn<CompleteVial>[] = [
    {
      name: 'Data de Entrada',
      accessor: (vial) => formattedDate(vial.pkg.inDate),
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
      accessor: (vial) => formattedSize(vial.pkg.size),
    },
    {
      name: 'Pureza',
      accessor: (vial) => `${vial.pkg.purity} %`,
    },
    {
      name: 'Adquirente',
      accessor: (vial) => vial.fundingSource?.name ?? '--',
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

  const getters = {
    getReagentById,
    getSupplierById,
    getLaboratoryById,
    getFundingSourceById,
    getPackageById,
  };

  const completeVials: CompleteVial[] = vials!.map((vial) => getCompleteVial(vial, getters));

  const filteredVials = completeVials.filter((vial) =>
    filteredCompleteVial(vial, reportFilter, completeVials)
  );

  return (
    <>
      {/* Janela para impressão */}
      <Paper
        ref={contentRef}
        p="xl"
        m="lg"
        style={{
          boxShadow: '0 0 20px rgba(0,0,0,0.40)',
        }}
      >
        <Group justify="center" my="lg  ">
          <Title order={1} my="lg">
            {/* Relatório de Reagentes - {formatDate(reportOptions.startDate, 'MM/YY')} a{' '}
            {formatDate(reportOptions.endDate, 'MM/YY')} */}
          </Title>
        </Group>
        <Stack my="lg">
          <DataTable datas={filteredVials} collumns={collumns} smallHeading />
        </Stack>
      </Paper>

      {/* Modal de opções */}
      <ConfigReportModal
        onClose={closeModal}
        opened={modalOpened}
        onSubmit={onSubmit}
        initialValues={reportFilter}
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
