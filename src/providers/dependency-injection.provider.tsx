'use client';

import { createContext, ReactNode, useContext } from 'react';
import { auth } from '@/core/config/firebase';
import { FundingSourceService } from '@/features/named-option/brand/brand.service';
import { ControlAgencyService } from '@/features/named-option/control-agency/control-agency.service';
import { LaboratoryService } from '@/features/named-option/laboratory/laboratory.service';
import { SupplierService } from '@/features/named-option/supplier/supplier.service';
import { PackageService } from '@/features/package/package.service';
import { ReagentService } from '@/features/reagent/reagent.service';
import { VialService } from '@/features/vial/vial.service';
import { FirebaseAuthService, IAuthService } from '@/shared/services/auth.service';
import { IDatabase } from '@/shared/services/base-repository.service';
import { FirebaseBaseDatabase } from '@/shared/services/firebase-base.service';

export function useDependencyInjection() {
  const context = useContext(DependencyInjection);
  if (!context) {
    throw new Error('useDependencyInjection must be used within DependencyInjectionProvider');
  }
  return context;
}

type ServicesSet = {
  authService: IAuthService;
  vialService: VialService;
  laboratoryService: LaboratoryService;
  controlAgencyService: ControlAgencyService;
  reagentService: ReagentService;
  fundingSourceService: FundingSourceService;
  supplierService: SupplierService;
  packageService: PackageService;
};

const DependencyInjection = createContext<ServicesSet | null>(null);

type DependencyInjectionProviderProps = {
  children: ReactNode;
};

export function DependencyInjectionProvider(props: DependencyInjectionProviderProps) {
  /// AUTH
  // Firebase
  const authService = new FirebaseAuthService(auth);

  // DATABASE
  // const db: IDatabase = new DexieDatabase();
  const db: IDatabase = new FirebaseBaseDatabase();

  // Repositories
  const vialService = new VialService(db);
  const laboratoryService = new LaboratoryService(db);
  const controlAgencyService = new ControlAgencyService(db);
  const reagentService = new ReagentService(db);
  const fundingSourceService = new FundingSourceService(db);
  const supplierService = new SupplierService(db);
  const packageService = new PackageService(db);

  // Late Injection
  laboratoryService.injectLate(vialService);
  controlAgencyService.injectLate(reagentService);
  reagentService.injectLate(packageService);
  fundingSourceService.injectLate(packageService);
  supplierService.injectLate(packageService);
  packageService.injectLate(reagentService, vialService);

  const servicesSet: ServicesSet = {
    authService,
    vialService,
    laboratoryService,
    controlAgencyService,
    reagentService,
    fundingSourceService,
    supplierService,
    packageService,
  };

  return (
    <DependencyInjection.Provider value={servicesSet}>
      {props.children}
    </DependencyInjection.Provider>
  );
}
