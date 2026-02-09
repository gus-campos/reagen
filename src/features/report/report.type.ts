import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { Vial } from '@/features/vial/vial.type';

export type CompleteReagent = Reagent & {
  controlAgency: ControlAgency | null;
};

export type CompleteVial = Vial & {
  pkg: Package;
  reagent: CompleteReagent;
  supplier: Supplier | null;
  laboratory: Laboratory;
  fundingSource: FundingSource | null;
};

// Tipo destinado à exportação em planilha
export type ReadableVial = {
  reagent: string;
  reagentControlAgency: string;

  size: string;
  purity: string;
  expireDate: string;
  inDate: string;
  outDate: string;

  supplier: string;
  laboratory: string;
  fundingSource: string;
};
