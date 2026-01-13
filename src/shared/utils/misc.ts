import { Brand } from '@/src/features/brand/brand.type';
import { ControlAgency as Laboratory } from '@/src/features/control-agency/control-agency.type';
import { Package } from '@/src/features/package/package.type';
import { Reagent } from '@/src/features/reagent/reagent.type';
import { Size } from '@/src/features/size/size.type';
import { formattedSize } from '@/src/features/size/size.util';
import { Supplier } from '@/src/features/validated-name/supplier/supplier.type';
import { Vial } from '@/src/features/vial/vial.type';

export function findRemovedSizes(before: Size[], after: Size[]) {
  return before.filter(
    (prevSize) =>
      !after.some((newSize) => prevSize.unit === newSize.unit && prevSize.amount === newSize.amount)
  );
}

export function findPackagesOfReagentSizes(reagent: Reagent, sizes: Size[], pkgs: Package[]) {
  // Assume que já carregou
  return pkgs.filter(
    (pkg) =>
      pkg.reagentId === reagent.id &&
      sizes.some((size) => formattedSize(size) === formattedSize(pkg.size))
  );
}

export function findPackagesOfReagent(reagent: Reagent, pkgs: Package[]) {
  return pkgs.filter((pkg) => pkg.reagentId === reagent.id);
}

export function findPackagesOfControlAgency(
  controlAgency: Laboratory,
  reagents: Reagent[],
  pkgs: Package[]
) {
  const relatedReagents = findReagentsOfControlAgency(controlAgency, reagents);
  return relatedReagents.flatMap((reag) => findPackagesOfReagent(reag, pkgs));
}

export function findVialsOfLaboratory(laboratory: Laboratory, vials: Vial[]) {
  return vials.filter((vial) => vial.laboratoryId === laboratory.id);
}

export function findReagentsOfControlAgency(controlAgency: Laboratory, reagents: Reagent[]) {
  return reagents.filter((reag) => reag.controlAgencyId === controlAgency.id);
}

export function findPackagesOfBrand(brand: Brand, pkgs: Package[]) {
  return pkgs.filter((pkg) => pkg.brandId === brand.id);
}

export function findPackagesOfSupplier(supplier: Supplier, pkgs: Package[]) {
  return pkgs.filter((pkg) => pkg.supplierId === supplier.id);
}
