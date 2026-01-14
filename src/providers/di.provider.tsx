import { createContext, ReactNode, useContext } from 'react';
import { BrandService } from '@/features/named-option/brand/brand.service';
import { ControlAgencyService } from '@/features/named-option/control-agency/control-agency.service';
import { LaboratoryService } from '@/features/named-option/laboratory/laboratory.service';
import { SupplierService } from '@/features/named-option/supplier/supplier.service';
import { PackageService } from '@/features/package/package.service';
import { ReagentService } from '@/features/reagent/reagent.service';
import { VialService } from '@/features/vial/vial.service';
import { IDatabase } from '@/shared/services/base-repository.service';
import { LocalStorageDatabase } from '@/shared/services/local-storage.service';

export function useDependencyInjection() {
  const context = useContext(DependencyInjection);
  if (!context) {
    throw new Error('useDependencyInjection must be used within DependencyInjectionProvider');
  }
  return context;
}

type ServicesSet = {
  vialService: VialService;
  laboratoryService: LaboratoryService;
  controlAgencyService: ControlAgencyService;
  reagentService: ReagentService;
  brandService: BrandService;
  supplierService: SupplierService;
  packageService: PackageService;
};

const DependencyInjection = createContext<ServicesSet | null>(null);

type DiProviderProps = {
  children: ReactNode;
};

export function DependencyInjectionProvider(props: DiProviderProps) {
  const db: IDatabase = new LocalStorageDatabase();

  const vialService = new VialService(db);
  const laboratoryService = new LaboratoryService(db);
  const controlAgencyService = new ControlAgencyService(db);
  const reagentService = new ReagentService(db);
  const brandService = new BrandService(db);
  const supplierService = new SupplierService(db);
  const packageService = new PackageService(db);

  laboratoryService.injectLate(vialService);
  controlAgencyService.injectLate(reagentService);
  reagentService.injectLate(packageService);
  brandService.injectLate(packageService);
  supplierService.injectLate(packageService);
  packageService.injectLate(reagentService, vialService);

  const servicesSet: ServicesSet = {
    vialService,
    laboratoryService,
    controlAgencyService,
    reagentService,
    brandService,
    supplierService,
    packageService,
  };

  return (
    <DependencyInjection.Provider value={servicesSet}>
      {props.children}
    </DependencyInjection.Provider>
  );
}
