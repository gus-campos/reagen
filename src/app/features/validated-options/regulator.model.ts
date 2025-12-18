import { BrandedId } from '@core/models/branded-id';
import { ValidatedOption } from './shared/validated-options.model';

export type RegulatorId = BrandedId<'RegulatorId'>;

export interface Regulator extends ValidatedOption {
  id: RegulatorId;
}
