import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { CompleteVial } from '@/features/report/report.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { Vial } from '@/features/vial/vial.type';

export function filteredPackage(
  pkg: Package,
  filter: StockFilter,
  vials: Vial[],
  getReagentById: (reagentId: string) => Reagent
): boolean {
  // Possuir filtros

  const packageVials = vials?.filter((vial) => vial.packageId === pkg.id) ?? [];
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

  const matchesInDateRangeFilter = isInsideDateRange(
    pkg.inDate,
    filter.minInDate,
    filter.maxInDate
  );
  if (!matchesInDateRangeFilter) return false;

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
    // Exige interno e é interno (sem adquirinte)
    (filter.fundingScope === 'internal' && pkg.fundingSourceId === null) ||
    // Exige não interno e tem adquirinte (é externo)
    (filter.fundingScope === 'external' && pkg.fundingSourceId !== null);

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

export function filteredCompleteVial(
  completeVial: CompleteVial,
  filter: StockFilter,
  vials: Vial[]
): boolean {
  const getReagentById = () => completeVial.reagent;

  return (
    filteredVial(completeVial, filter) &&
    filteredPackage(completeVial.pkg, filter, vials, getReagentById)
  );
}

export function isInsideDateRange(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const addDays = (d: Date, days: number): Date =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

  const flooredMinDate = minDate ? startOfDay(minDate) : null;
  const inclusiveMaxDate = maxDate ? addDays(startOfDay(maxDate), 1) : null;

  if (!date) return false;
  if (flooredMinDate && date < flooredMinDate) return false;
  if (inclusiveMaxDate && date > inclusiveMaxDate) return false;

  return true;
}

function isPackageExpired(pkg: Package): boolean {
  return pkg.expireDate < new Date();
}
