import { stringify } from 'csv-stringify/sync';
import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { CompleteReagent, CompleteVial, ReadableVial } from '@/features/report/report.type';
import { formattedSize } from '@/features/size/size.util';
import { Vial } from '@/features/vial/vial.type';

export type CompleteVialGetters = {
  getReagentById: (id: string) => Reagent;
  getSupplierById: (id: string) => Supplier;
  getLaboratoryById: (id: string) => Laboratory;
  getFundingSourceById: (id: string) => FundingSource;
  getPackageById: (id: string) => Package;
  getControlAgencyById: (id: string) => ControlAgency;
};

export function getCompleteVial(vial: Vial, getters: CompleteVialGetters): CompleteVial {
  const pkg = getters.getPackageById(vial.packageId);
  const supplier = pkg.supplierId ? getters.getSupplierById(pkg.supplierId) : null;
  const laboratory = getters.getLaboratoryById(vial.laboratoryId);
  const fundingSource = pkg.fundingSourceId
    ? getters.getFundingSourceById(pkg.fundingSourceId)
    : null;

  // Hidratando reeagente
  const reagent = getters.getReagentById(pkg.reagentId);
  const controlAgency = reagent.controlAgencyId
    ? getters.getControlAgencyById(reagent.controlAgencyId)
    : null;
  const completeReagent: CompleteReagent = { ...reagent, controlAgency };

  return { reagent: completeReagent, supplier, pkg, laboratory, fundingSource, ...vial };
}

function toReadableVial(vial: CompleteVial): ReadableVial {
  return {
    expireDate: formatDateForSheets(vial.pkg.expireDate),
    inDate: formatDateForSheets(vial.pkg.inDate),
    outDate: formatDateForSheets(vial.outDate),
    fundingSource: vial.fundingSource?.name ?? '',
    laboratory: vial.laboratory.name,
    reagent: vial.reagent.name,
    reagentControlAgency: vial.reagent.controlAgency?.name ?? '',
    purity: vial.pkg.purity.toString(),
    size: formattedSize(vial.pkg.size),
    supplier: vial.supplier?.name ?? '',
  };
}

function formatDateForSheets(date: Date | null) {
  if (!date) return '';
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export function toReadableVialCsvRow(vial: ReadableVial): Record<string, string> {
  const row: Record<string, string> = {};

  for (const [key, label] of Object.entries(COLUMNS_LABELS))
    row[label] = vial[key as keyof ReadableVial];

  return row;
}

export function convertVialsToCsvData(vials: CompleteVial[]): Record<string, string>[] {
  return vials.map((vial) => toReadableVial(vial)).map(toReadableVialCsvRow);
}

export function downloadDataAsCsv(data: Record<string, string>[], filename: string) {
  const csv = stringify(data, {
    header: true,
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// Obs: Se as labels não forem únicas, dados serão sobrescritos e não constaram no resultado final
const COLUMNS_LABELS: Record<keyof ReadableVial, string> = {
  reagent: 'Reagente',
  size: 'Tamanho',
  purity: 'Pureza',
  inDate: 'Entrada',

  expireDate: 'Vencimento',
  outDate: 'Saída',

  reagentControlAgency: 'Controle',
  fundingSource: 'Adquirente',
  laboratory: 'Laboratório',
  supplier: 'Fornecedor',
};
