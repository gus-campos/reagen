import { WithId } from '@core/models/base.interface';
import { BrandedId } from '@core/models/branded-id';
import { ReagentId } from '@features/reagent/reagent.model';
import { Size } from '@features/reagent/size.model';
import { BrandId } from '@features/validated-options/brand.model';
import { SupplierId } from '@features/validated-options/supplier.model';

export type BoxId = BrandedId<'BoxId'>;

export interface Box extends WithId {
  id: BoxId;
  size: Size;
  purity: number;

  // Dates
  inDate: Date;
  expireDate: Date;

  // Associações
  reagentId: ReagentId;
  brandId: BrandId | null;
  supplierId: SupplierId | null;
}
