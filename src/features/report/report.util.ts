import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { CompleteVial } from '@/features/report/report.type';
import { Vial } from '@/features/vial/vial.type';

export type CompleteVialGetters = {
  getReagentById: (id: string) => Reagent;
  getSupplierById: (id: string) => Supplier;
  getLaboratoryById: (id: string) => Laboratory;
  getFundingSourcesById: (id: string) => FundingSource;
  getPackageById: (id: string) => Package;
};

export function getCompleteVial(vial: Vial, getters: CompleteVialGetters): CompleteVial {
  const pkg = getters.getPackageById(vial.packageId);
  const reagent = getters.getReagentById(pkg.reagentId);
  const supplier = pkg.supplierId ? getters.getSupplierById(pkg.supplierId) : null;
  const laboratory = getters.getLaboratoryById(vial.laboratoryId);
  const fundingSource = pkg.fundingSourceId
    ? getters.getFundingSourcesById(pkg.fundingSourceId)
    : null;
  return { reagent, supplier, pkg, laboratory, fundingSource, ...vial };
}
