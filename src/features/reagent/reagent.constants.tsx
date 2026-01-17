import { Pill } from '@mantine/core';
import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { formattedSize } from '@/features/size/size.util';

export const getReagentTableInitialColumns = (
  getControlAgencyById: (id: string) => ControlAgency
) => {
  const getAgencyName = (reagent: Reagent) => {
    return reagent.controlAgencyId ? getControlAgencyById(reagent.controlAgencyId).name : '--';
  };

  return [
    {
      name: 'Nome',
      accessor: (reagent: Reagent) => reagent.name,
      fixed: true,
      sorter: (a: Reagent, b: Reagent) => a.name.trim().localeCompare(b.name.trim()),
    },
    {
      name: 'Dimensão',
      accessor: (reagent: Reagent) => reagent.dimension,
      fixed: false,
      sorter: (a: Reagent, b: Reagent) => a.dimension.trim().localeCompare(b.dimension.trim()),
    },
    {
      name: 'Tamanhos',
      accessor: (reagent: Reagent) =>
        reagent.sizes.map((size, index) => <Pill key={index}>{formattedSize(size)}</Pill>),
      fixed: false,
    },
    {
      name: 'Orgão de Controle',
      accessor: (reagent: Reagent) => getAgencyName(reagent),
      fixed: false,
      sorter: (a: Reagent, b: Reagent) =>
        getAgencyName(a).trim().localeCompare(getAgencyName(b).trim()),
    },
  ];
};
