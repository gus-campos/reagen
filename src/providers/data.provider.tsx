'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { BrandService } from '@/features/named-option/brand/brand.service';
import { Brand } from '@/features/named-option/brand/brand.type';
import { ControlAgencyService } from '@/features/named-option/control-agency/control-agency.service';
import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { LaboratoryService } from '@/features/named-option/laboratory/laboratory.service';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { SupplierService } from '@/features/named-option/supplier/supplier.service';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { PackageService } from '@/features/package/package.service';
import { Package } from '@/features/package/package.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { useCollectionData } from '@/providers/useCollectionData';

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

const DataContext = createContext<{
  packages: Package[];
  vials?: Vial[];
  reagents?: Reagent[];
  brands?: Brand[];
  controlAgencies?: ControlAgency[];
  laboratories?: Laboratory[];
  suppliers?: Supplier[];
  //
  loadingPackages: boolean;
  loadingReagents: boolean;
  loadingVials: boolean;
  loadingBrands: boolean;
  loadingControlAgencies: boolean;
  loadingLaboratories: boolean;
  loadingSuppliers: boolean;
  //
  packagesError: Error | null;
  vialsError?: Error | null;
  reagentsError?: Error | null;
  brandsError?: Error | null;
  controlAgenciesError?: Error | null;
  laboratoriesError?: Error | null;
  suppliersError?: Error | null;
  //
  getPackageById: (id: string) => Package;
  getReagentById: (id: string) => Reagent;
  getVialById: (id: string) => Vial;
  getBrandById: (id: string) => Brand;
  getControlAgencyById: (id: string) => ControlAgency;
  getLaboratoryById: (id: string) => Laboratory;
  getSupplierById: (id: string) => Supplier;
} | null>(null);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = (props: DataProviderProps) => {
  const {
    packageService,
    vialService,
    reagentService,
    brandService,
    laboratoryService,
    controlAgencyService,
    supplierService,
  } = useDependencyInjection();

  const [packages, loadingPackages, packagesError, getPackageById] = useCollectionData<
    Package,
    PackageService
  >(packageService);

  const [vials, loadingVials, vialsError, getVialById] = useCollectionData<Vial, VialService>(
    vialService
  );

  const [reagents, loadingReagents, reagentsError, getReagentById] = useCollectionData<
    Reagent,
    ReagentService
  >(reagentService);

  const [brands, loadingBrands, brandsError, getBrandById] = useCollectionData<Brand, BrandService>(
    brandService
  );

  const [laboratories, loadingLaboratories, laboratoriesError, getLaboratoryById] =
    useCollectionData<Laboratory, LaboratoryService>(laboratoryService);

  const [controlAgencies, loadingControlAgencies, controlAgenciesError, getControlAgencyById] =
    useCollectionData<ControlAgency, ControlAgencyService>(controlAgencyService);

  const [suppliers, loadingSuppliers, suppliersError, getSupplierById] = useCollectionData<
    Supplier,
    SupplierService
  >(supplierService);

  //   console.log('useData', {
  //     packages: packages?.map((r) => sortKeys(r)),
  //     vials: vials?.map((r) => sortKeys(r)),
  //     reagents: reagents?.map((op) => sortKeys(op)),
  //     brands: brands?.map((b) => sortKeys(b)),
  //     controlAgency: controlAgencies?.map((c) => sortKeys(c)),
  //     laboratories: laboratories?.map((l) => sortKeys(l)),
  //   });
  //   console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

  return (
    <DataContext.Provider
      value={{
        packages,
        vials,
        reagents,
        brands,
        controlAgencies,
        laboratories,
        suppliers,
        //
        loadingPackages,
        loadingReagents,
        loadingVials,
        loadingBrands,
        loadingControlAgencies,
        loadingLaboratories,
        loadingSuppliers,
        //
        packagesError,
        reagentsError,
        vialsError,
        brandsError,
        controlAgenciesError,
        laboratoriesError,
        suppliersError,
        //
        getPackageById,
        getReagentById,
        getVialById,
        getBrandById,
        getControlAgencyById,
        getLaboratoryById,
        getSupplierById,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
