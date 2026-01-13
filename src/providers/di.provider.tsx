import { createContext, ReactNode, useContext } from 'react';
import { BrandService } from '@/features/named-option/brand/brand.service';
import { ControlAgencyService } from '@/features/named-option/control-agency/control-agency.service';
import { LaboratoryService } from '@/features/named-option/laboratory/laboratory.service';
import { SupplierService } from '@/features/named-option/supplier/supplier.service';
import { PackageService } from '@/features/package/package.service';
import { ReagentService } from '@/features/reagent/reagent.service';
import { VialService } from '@/features/vial/vial.service';

export function useDi() {
  const context = useContext(DiContext);
  if (!context) {
    throw new Error('useDI must be used within DataProvider');
  }
  return context;
}

type ServicesSet = {
  package: PackageService;
  vial: VialService;
  reagent: ReagentService;
  brand: BrandService;
  controlAgency: ControlAgencyService;
  laboratory: LaboratoryService;
  supplier: SupplierService;
};

const DiContext = createContext<ServicesSet | null>(null);

type DiProviderProps = {
  children: ReactNode;
};

export function DiProvider(props: DiProviderProps) {
  const servicesSet: ServicesSet = {};

  return <DiContext.Provider value={servicesSet}>{props.children}</DiContext.Provider>;
}
