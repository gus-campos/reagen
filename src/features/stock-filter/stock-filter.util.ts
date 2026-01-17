import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { Vial } from '@/features/vial/vial.type';

export function filteredPackage(
  pkg: Package,
  filter: StockFilter,
  getReagentById: (reagentId: string) => Reagent
): boolean {
  // Observação: dentro da package view, está implementado que
  // o package além de retornar true desta função, deve também
  // conter pelo menos um vial que retorna true em filteredVial

  const matchesExpiredFilter =
    // Filtro não ativado
    filter.expired === 'all' ||
    // Deve estar vencido e está vencido
    (filter.expired === 'expired' && isExpired(pkg)) ||
    // Não deve estar vencido e não está vencido
    (filter.expired === 'not-expired' && !isExpired(pkg));

  const macthesExpireRangeFilter = isInsideDateRange(
    pkg.expireDate,
    filter.minExpire,
    filter.maxExpire
  );

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

export function isInsideDateRange(
  date: Date | null,
  minExpire: Date | null,
  maxExpire: Date | null
): boolean {
  if (!date) return false;
  if (minExpire && date < minExpire) return false;
  if (maxExpire && date > maxExpire) return false;

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
