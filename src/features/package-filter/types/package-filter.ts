export type PackageFilter = {
  minExpire: Date | null;
  maxExpire: Date | null;

  expired: 'expired' | 'not-expired' | 'all';
  controlled: 'controlled' | 'not-controlled' | 'all';

  controlAgencyId: string | null;
  brandId: string | null;
  supplierId: string | null;
  laboratoryId: string | null;
};
