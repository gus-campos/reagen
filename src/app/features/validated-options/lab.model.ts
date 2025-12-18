import { BrandedId } from '@core/models/branded-id';
import { ValidatedOption } from './shared/validated-options.model';

export type LabId = BrandedId<'LabId'>;

export interface Lab extends ValidatedOption {
  id: LabId;
}
