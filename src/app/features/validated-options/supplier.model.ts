import { BrandedId } from '@core/models/branded-id';
import { ValidatedOption } from './shared/validated-options.model';

export type SupplierId = BrandedId<'SupplierId'>;

export interface Supplier extends ValidatedOption {
  id: SupplierId;
}
