import { Package } from '../package/package.type';
import { Reagent } from '../reagent/reagent.type';
import { Vial } from '../vial/vial.type';
import { StockFilter } from './stock-filter';

export function filteredPackage(
  pkg: Package,
  filter: StockFilter,
  getReagentById: (reagentId: string) => Reagent
): boolean {
  const matchesExpiredFilter =
    // Filtro não ativado
    filter.expired === 'all' ||
    // Deve estar vencido e está vencido
    (filter.expired === 'expired' && isExpired(pkg)) ||
    // Não deve estar vencido e não está vencido
    (filter.expired === 'not-expired' && !isExpired(pkg));

  const macthesExpireRangeFilter = isInsideDateRange(pkg, filter.minExpire, filter.maxExpire);

  const pkgControlAgencyId = getReagentById(pkg.reagentId).controlAgencyId;
  const pkgIsControlled = pkgControlAgencyId !== null;
  const matchesControlledFilter =
    // Filtro não ativado
    filter.controlled === 'all' ||
    // Deve ser controlado e é controlaod
    (filter.controlled === 'controlled' && pkgIsControlled) ||
    // Não deve ser controlado e não é controlado
    (filter.controlled === 'not-controlled' && !pkgIsControlled);

  const matchesControlAgencyFilter =
    filter.controlAgencyId === null || filter.controlAgencyId === pkgControlAgencyId;

  const matchesBrandFilter = filter.brandId === null || filter.brandId === pkg.brandId;

  const macthesSupplierFilter = filter.supplierId === null || filter.supplierId === pkg.supplierId;

  return (
    matchesExpiredFilter &&
    macthesExpireRangeFilter &&
    matchesControlledFilter &&
    matchesControlAgencyFilter &&
    matchesBrandFilter &&
    macthesSupplierFilter
  );
}

function isInsideDateRange(pkg: Package, minExpire: Date | null, maxExpire: Date | null): boolean {
  if (!pkg.expireDate) {
    return false;
  }

  if (minExpire && pkg.expireDate < minExpire) {
    return false;
  }
  if (maxExpire && pkg.expireDate > maxExpire) {
    return false;
  }

  return true;
}

function isExpired(pkg: Package): boolean {
  return pkg.expireDate < new Date();
}

export function filteredVial(vial: Vial, filter: StockFilter): boolean {
  const matchesLaboratoryFilter =
    filter.laboratoryId === null || filter.laboratoryId === vial.laboratoryId;

  return matchesLaboratoryFilter;
}
