import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { Vial } from '@/features/vial/vial.type';

export type CompleteVial = Vial & {
  pkg: Package;
  reagent: Reagent;
  supplier: Supplier | null;
  laboratory: Laboratory;
  fundingSource: FundingSource | null;
};
