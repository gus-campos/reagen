import { ID_FUNDING_SOURCE_EMBRAPA } from '@/features/named-option/funding-source/funding-source.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { Vial } from '@/features/vial/vial.type';

export function filteredPackage(
  pkg: Package,
  filter: StockFilter,
  getPackageVials: (pkg: Package) => Vial[],
  getReagentById: (reagentId: string) => Reagent
): boolean {
  // Possuir filtros

  const packageVials = getPackageVials(pkg);
  const hasAnyVialMatchingFilter =
    packageVials.length === 0 || packageVials.some((vial) => filteredVial(vial, filter!));
  if (!hasAnyVialMatchingFilter) return false;

  // Expiration

  const isPkgExpired = isPackageExpired(pkg);
  const matchesExpiredFilter =
    // Filtro não ativado
    filter.expired === 'all' ||
    // Deve estar vencido e está vencido
    (filter.expired === 'expired' && isPkgExpired) ||
    // Não deve estar vencido e não está vencido
    (filter.expired === 'not-expired' && !isPkgExpired);
  if (!matchesExpiredFilter) return false;

  const macthesExpireRangeFilter = isInsideDateRange(
    pkg.expireDate,
    filter.minExpire,
    filter.maxExpire
  );
  if (!macthesExpireRangeFilter) return false;

  // In Date

  const macthesInDateRangeFilter = isInsideDateRange(
    pkg.inDate,
    filter.minInDate,
    filter.maxInDate
  );
  if (!macthesInDateRangeFilter) return false;

  // Control

  const pkgControlAgencyId = getReagentById(pkg.reagentId).controlAgencyId;
  const pkgIsControlled = pkgControlAgencyId !== null;
  const matchesControlledFilter =
    // Filtro não ativado
    filter.controlled === 'all' ||
    // Deve ser controlado e é controlaod
    (filter.controlled === 'controlled' && pkgIsControlled) ||
    // Não deve ser controlado e não é controlado
    (filter.controlled === 'not-controlled' && !pkgIsControlled);
  if (!matchesControlledFilter) return false;

  const matchesControlAgencyFilter =
    filter.controlAgencyId === null || filter.controlAgencyId === pkgControlAgencyId;
  if (!matchesControlAgencyFilter) return false;

  // Funding

  const matchesFundingScopeFilter =
    // Filtro não ativado
    filter.fundingScope === 'all' ||
    // Exige interno e vem da embrapa
    (filter.fundingScope === 'internal' && pkg.fundingSourceId === ID_FUNDING_SOURCE_EMBRAPA) ||
    // Exige não interno e não é da embrapa
    (filter.fundingScope === 'external' && pkg.fundingSourceId !== ID_FUNDING_SOURCE_EMBRAPA);

  if (!matchesFundingScopeFilter) return false;

  const matchesFundingSourceFilter =
    filter.fundingSourceId === null || filter.fundingSourceId === pkg.fundingSourceId;
  if (!matchesFundingSourceFilter) return false;

  // Supplier

  const macthesSupplierFilter = filter.supplierId === null || filter.supplierId === pkg.supplierId;
  if (!macthesSupplierFilter) return false;

  return true;
}

export function filteredVial(vial: Vial, filter: StockFilter): boolean {
  // out Date

  const matchesIsOutFilter =
    // Filtro não ativado
    filter.outStatus === 'all' ||
    // Deve estar fora e está fora
    (filter.outStatus === 'is-out' && vial.outDate) ||
    // Não deve estar fora e não está fora
    (filter.outStatus === 'not-out' && !vial.outDate);
  if (!matchesIsOutFilter) return false;

  const rangeFilterDisabled = filter.minOutDate === null && filter.maxOutDate === null;
  const macthesOutDateRangeFilter =
    rangeFilterDisabled ||
    (vial.outDate && isInsideDateRange(vial.outDate, filter.minOutDate, filter.maxOutDate));
  if (!macthesOutDateRangeFilter) return false;

  // Laboratory

  const matchesLaboratoryFilter =
    filter.laboratoryId === null || vial.laboratoryId === filter.laboratoryId;

  if (!matchesLaboratoryFilter) return false;
  return true;
}

export function isInsideDateRange(
  date: Date,
  minExpire: Date | null,
  maxExpire: Date | null
): boolean {
  if (!date) return false;
  if (minExpire && date < minExpire) return false;
  if (maxExpire && date > maxExpire) return false;

  return true;
}

function isPackageExpired(pkg: Package): boolean {
  return pkg.expireDate < new Date();
}
