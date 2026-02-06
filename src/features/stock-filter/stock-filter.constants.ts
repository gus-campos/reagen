import { StockFilter } from '@/features/stock-filter/stock-filter.type';

export const CLEAN_STOCK_FILTER: StockFilter = {
  expired: 'all',
  maxExpire: null,
  minExpire: null,

  minInDate: null,
  maxInDate: null,

  outStatus: 'all',
  minOutDate: null,
  maxOutDate: null,

  controlled: 'all',
  controlAgencyId: null,

  fundingScope: 'all',
  fundingSourceId: null,

  supplierId: null,

  laboratoryId: null,
};
