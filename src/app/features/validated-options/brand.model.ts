import { BrandedId } from '@core/models/branded-id';
import { ValidatedOption } from './shared/validated-options.model';

export type BrandId = BrandedId<'BrandId'>;

export interface Brand extends ValidatedOption {
  id: BrandId;
}
