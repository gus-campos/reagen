'use client';

import { useState } from 'react';
import { FaCalendar, FaSignOutAlt } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Button, LoadingOverlay, Modal, Paper, Stack, Tooltip } from '@mantine/core';
import { DateInput, DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { TableCrudOperations } from '@/src/features/data-table/types/TableCrudOperations';
import { useData } from '@/src/providers/DataProvider';
import { formattedDate } from '@/src/shared/utils/formatted-date';
import { CrudAction, DataTable } from '../../data-table/components/DataTable';
import { TableCollumn } from '../../data-table/types/TableCollumn';
import { PackageFilter } from '../../package-filter/types/package-filter';
import { filteredPackage } from '../../package-filter/utils/filtered-package';
import { VialService } from '../../vial/services/VialService';
import { Vial } from '../../vial/types/vial';
import { getInitialCollumns, PackageCollumGetters } from '../constants/getInitialCollumns';
import { PackageService } from '../services/PackageService';
import { Package } from '../types/package';

export type PackageTableProps = {
  filter?: PackageFilter;
  search?: string;
  crudOperations?: TableCrudOperations<Package>;
};

export function stringToLocalDate(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    return new Date(dateString.getFullYear(), dateString.getMonth(), dateString.getDate());
  } else {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}

function ExpandedComponent({ data }: { data: Package }) {
  const { vials, getLaboratoryById } = useData();
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVialId, setSelectedVialId] = useState<string | null>(null);

  const form = useForm<{ outDate: Date }>({
    validate: {
      outDate: (value) => (value ? null : 'Insira um data'),
    },
  });

  const packageVials = vials?.filter((v) => v.packageId === data.id) ?? [];

  const collumns = [
    {
      name: 'Laboratório',
      accessor: (v: Vial) => getLaboratoryById(v.laboratoryId).name,
      sorter: (a: Vial, b: Vial) =>
        getLaboratoryById(a.laboratoryId).name.localeCompare(
          getLaboratoryById(b.laboratoryId).name
        ),
    },
    {
      name: 'Saída',
      accessor: (v: Vial) => (v.outDate ? formattedDate(v.outDate) : '--'),
      sorter: (a: Vial, b: Vial) =>
        (a.outDate?.getTime() ?? Infinity) - (b.outDate?.getTime() ?? Infinity),
    },
  ] as TableCollumn<Vial>[];

  const extraActions = [
    // Anular data de saída
    {
      icon: (
        <Tooltip label="Cancelar saída">
          <MdCancel />
        </Tooltip>
      ),
      action: (vial: Vial) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        VialService.instance.update(vial.id, { outDate: null });
      },
    },
    // Saída no dia de hoje
    {
      icon: (
        <Tooltip label="Dar saída hoje">
          <FaSignOutAlt />
        </Tooltip>
      ),
      action: (vial: Vial) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        VialService.instance.update(vial.id, { outDate: startOfDay });
      },
    },
    // Saída em data específica
    {
      icon: (
        <Tooltip label="Dar saída em...">
          <FaCalendar />
        </Tooltip>
      ),
      action: (data) => {
        setSelectedVialId(data.id);
        setModalOpened(true);
      },
    },
  ] as CrudAction<Vial>[];

  const handleSubmit = (values: { outDate: Date }) => {
    if (!selectedVialId || !values.outDate) return;

    VialService.instance.update(selectedVialId, {
      outDate: stringToLocalDate(values.outDate),
    });
    setSelectedVialId(null);
    setModalOpened(false);
  };

  return (
    <>
      <Paper p="lg">
        <DataTable
          datas={packageVials}
          collumns={collumns}
          smallHeading={true}
          extraActions={extraActions}
        />
      </Paper>

      {/* Modal de seleção de data de saída */}
      <Modal title="Data de saída" opened={modalOpened} onClose={() => setModalOpened(false)}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {/* Seletor de data */}
            <DatePickerInput
              label="Data de saída"
              placeholder="Selecione uma data de saída..."
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('outDate')}
            />
            {/* Confirmação */}
            <Button style={{ width: '100%' }} type="submit">
              Declarar saída nesta data
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export function PackageTable(props: PackageTableProps) {
  const {
    packages,
    loadingPackages,
    packagesError,
    getPackageById,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  const getters: PackageCollumGetters = {
    getPackageById,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  };

  const initialCollumns = getInitialCollumns(getters);

  // HANDLERS

  const handleDeletePackage = (pkg: Package) => {
    PackageService.instance.delete(pkg.id);
  };

  const crudOperations: TableCrudOperations<Package> = {
    handleDeleteData: handleDeletePackage,
  };

  const mergedCrudOperations = { ...crudOperations, ...props.crudOperations };

  const allowedPkgs = packages ?? [];

  const dataFilter = props.filter
    ? (pkg: Package) => filteredPackage(pkg, getReagentById, props.filter!)
    : undefined;

  return (
    <>
      {packagesError ? (
        <p>ERRO</p>
      ) : loadingPackages ? (
        // TODO: Inserir skeletons
        <LoadingOverlay visible />
      ) : (
        <DataTable<Package>
          datas={allowedPkgs}
          collumns={initialCollumns}
          search={props.search}
          searched={(pkg: Package) => getReagentById(pkg.reagentId).name}
          dataFilter={dataFilter}
          crudOperations={mergedCrudOperations}
          getExpandedComponent={(data) => <ExpandedComponent data={data} />}
        />
      )}
    </>
  );
}
